import BookingViewModel, { FragmentMap } from "../BookingViewModel";
import VehicleType from "../../../sql/bo/VehicleType";
import {
  LatLng,
  Location,
  MarkerOptions,
  Utils,
  ToastModule,
  NativeAppModule
} from "../../../../module";
import GeocodingLocation, {
  GeocodingError
} from "../../../http/address/GeocodingLocation";
import BAAddress from "../../../model/BAAddress";
import MapUtils from "../../../../module/maps/MapUtils";
import OnNetworkListener from "../../../../module/net/OnNetworkListener";
import BookTaxiMain from "./BookTaxiMain";
import StartMarker from "../../../component/booking/home/StartMarker";
import SessionStore from "../../../Session";
import strings from "../../../../res/strings";

export default class CarTypeViewModel extends BookTaxiMain
  implements OnNetworkListener {
  protected mPresenter: CarTypeViewPresenter;

  /** đối tượng start marker */
  protected startMarker: StartMarker;

  protected onFirstLocation: boolean = false;

  protected geocodingLocation:GeocodingLocation;

  constructor(
    carTypeViewPresenter: CarTypeViewPresenter,
    bookingViewModel: BookingViewModel
  ) {
    super(bookingViewModel);
    this.mPresenter = carTypeViewPresenter;
    this.onFirstLocation = false;
    this.geocodingLocation = new GeocodingLocation();
  }

  async onLocationChanged(location?: Location) {
    // Di chuyển về vị trí hiện tại
    if (!this.rModel.isTouchMoveMap && !this.onFirstLocation) {
      this.onFirstLocation = true;

      this.loadSrcForLocationChange(location);
    }
  }

  /* Thực hiện khi view hiện thị lên */
  public async componentDidMount() {
    //console.log("CarTypeViewModel componentDidMount $$$$$$$$$$$$$");

    //kiểm tra địa chỉ và load lại
    if (!this.rModel.isValidSrcAddress()) {
      await this.loadDefaultSrcLocation();
    }

    //cập nhật loại xe theo vị trí và start đối tượng lấy xe xung quanh
    await this.updateViewPage(this.rModel.srcAddress.location);

    //thiết lập đối tượng lắng nghe sau khi giao diện đã khởi tạo
    this.main.setListener(this);

    //nếu map đã load thì xử lý các tác vụ liên quan
    if (this.getMap() != null) this.onMapReady(this.getMap());

    //tạo đối tượng lắng nghe cập nhật thông tin từ lịch sử
    SessionStore.updateChange = (srcAddress, dstAddress) =>
      this.updateHistory(srcAddress, dstAddress);
  }

  public updateHistory(srcAddress: BAAddress, dstAddress: BAAddress) {
    this.rModel.srcAddress = srcAddress;
    this.rModel.dstAddress = dstAddress;
    this.toConfirmBook();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
  }

  // Cập nhật lại giao diện vùng tuyến, loại xe
  protected async updateViewPage(latLng: LatLng): Promise<boolean> {
    //lấy danh sách loại xe
    let vehicleData = await this.getVehicleTypes(latLng);

    let ret = vehicleData != null && vehicleData.length > 0;

    if (ret) {
      //request lại xe xung quanh
      this.requestNearCar(latLng, estimateCarnear =>
        this.updateEstimateTimeMarker(estimateCarnear)
      );

      //cập nhật danh sách loại xe
      this.mPresenter.setVehicleTypes(
        vehicleData,
        BookHomeViewType.CAR_TYPE_VIEW_ONLY
      );

      // resume request nearcar
      if (this.nearCarRealtime) {
        this.nearCarRealtime.resume();
      }
    } else {
      this.mPresenter.showView(BookHomeViewType.LANDMARKK_NOT_SUPPORT);

      // Xóa marker xe xung quanh cũ
      if (this.nearCarRealtime) {
        this.nearCarRealtime.pause();
      }
      this.updateEstimateTimeMarker("");
      this.getMap().removeAllMarkers();
    }

    return ret;
  }

  /* Chuyển sang màn hình confirm */
  public toConfirmBook() {
    // Nếu ngoài vùng hỗ trợ thì thông báo cho khách hàng
    if (this.getVehicleTypes(this.rModel.srcAddress.location) === null) {
      ToastModule.show(strings.book_not_support_are);
      return;
    }

    // Xóa marker xe xung quanh cũ
    if (this.nearCarRealtime) {
      this.nearCarRealtime.destroy();
    }

    this.main.showFragment(FragmentMap.CONFIRM_HOME);
  }

  /**
   * Cập nhật loại xe vào bookModel
   * @param vehicleType
   * @returns: false: nếu loại xe đã tồn tại, true: nếu loại xe chưa tồn tại thì cập nhật
   */
  public updateVehicleType(vehicleType: VehicleType): boolean {
    //nếu chọn loại xe đang active thì bỏ qua
    if (
      this.rModel.getVehicleType() &&
      this.rModel.getVehicleType().vehicleId === vehicleType.vehicleId
    ) {
      return false;
    }
    // Cập nhật lại loại xe được chọn
    this.rModel.setVehicleType(vehicleType);

    // Cập nhật lại loại xe được chọn
    this.requestNearCar(this.rModel.srcAddress.location, estimateCarnear => {
      this.updateEstimateTimeMarker(estimateCarnear);
    });

    return true;
  }

  /**
   * Kiểm tra loại xe active
   * @param carActive: loại xe
   */
  public checkActiveVehicleType(carActive: VehicleType): boolean {
    return this.updateVehicleType(carActive);
  }

  public getBookTaxiModel() {
    return this.main.getBookTaxiModel();
  }

  /**
   * click vào nút my location trên màn hình home
   */
  public clickMyLocation() {
    // Refresh lại trạng thái tự động lấy vị trí hiện tại
    this.rModel.setTouchMoveMap(false);
    // Move bản đồ về vị trí hiện tại
    this.main.moveMyLocation(location => {
      // Kiểm tra vị trí cũ và vị trí mới, nếu < 150m thì không cập nhật
      if (MapUtils.isBetweenLatlng(this.rModel.srcAddress.location, location)) {
        //move về vị trí người dung
        this.moveCenterCamera(this.rModel.srcAddress.location);
        
        return false;
      }

      this.loadSrcForLocationChange(location);
    });
  }

 

  /* Lấy địa chỉ mặc định cho marker A */
  protected async loadDefaultSrcLocation(): Promise<LatLng> {
    // Nếu gps không lấy được địa chỉ thì lấy địa chỉ từ config.
    let latLng = this.main.getCurrentLatLng();
    // console.log("loadDefaultSrcLocation latLng =====", latLng)
    if (latLng == null) {
      this.rModel.srcAddress = SessionStore.getLastBookAddress();
      latLng = this.rModel.srcAddress.location;
    } else {
      // Lấy vị trí và địa chỉ, bỏ qua nếu vị trí không thay đổi
      await this.updateSrcLocationAddress(latLng);
    }

    // Cập nhật địa chỉ
    this.mPresenter.updateViewSrcAddress(
      this.rModel.srcAddress.formattedAddress
    );

    // khóa tự động cập nhật vị trí mới
    this.rModel.setTouchMoveMap(false);

    return latLng;
  }

  /**
   * marker ở màn hình này có thêm thông tin về thời gian và action đặt xe
   * @param srcMarkerOptions
   */
  public appendStartMarker(srcMarkerOptions: MarkerOptions) {
    if (srcMarkerOptions == null) return;
    srcMarkerOptions.viewsAsMarker = StartMarker.create(
      ref => (this.startMarker = ref)
    );
    srcMarkerOptions.onPress = () => {
      if (!this.isCheckBooking()) {
        return;
      }
      this.toConfirmBook();
    };
  }

  /* Cập nhật thời gian ước lượng cho xe gần nhất */
  public updateEstimateTimeMarker(time: string) {
    if (this.startMarker != null) {
      this.startMarker.updateTime(time);
    }
  }

  /**
   * Cập nhật lại các chức năng theo vị trí người dùng thay đổi
   * @param location
   */
  protected async loadSrcForLocationChange(location: Location) {
    // console.log("loadSrcForLocationChange =======================================");

    let latLng = new LatLng(location.latitude, location.longitude);

    //cập nhật thông tin theo vị trí thay đổi
    let ret = await this.updateSrcByLocationChange(latLng);

    //cập nhật địa chỉ nếu đã cập nhật lại vị trí
    if (ret) this.updateSrcLocationAddress(latLng);
  }

  // Cập nhật lại đỉa diểm A
  public async updateSourceAddress(baAddress: BAAddress) {

    // khóa tự động cập nhật vị trí mới
    this.rModel.setTouchMoveMap(true);

    // gán lại địa điểm mới
    this.rModel.srcAddress = baAddress;

    //cập nhật địa chỉ
    this.mPresenter.updateViewSrcAddress(baAddress.formattedAddress);
  }

  /**
   * cập nhật địa chỉ từ màn hình search trả về
   * @param baAddress 
   */
  public async updateSourceAddressBySearch(baAddress: BAAddress) {
    
    //cập nhật địa chỉ
    this.updateSourceAddress(baAddress);

    //cập nhật lại khi vị trí thay đổi
    await this.updateSrcByLocationChange(baAddress.location);
  }

  /**
   * cập nhật địa chỉ start khi vị trí thay đổi
   * @param latLng
   */
  private async updateSrcLocationAddress(latLng: LatLng) {
    // Mở khóa tự động update địa chỉ
    this.rModel.srcAddress.location = latLng;
    // this.rModel.srcAddress.formattedAddress = strings.address_loadding;
    this.rModel.srcAddress.formattedAddress = "";
    this.mPresenter.updateViewSrcAddress(strings.address_loadding);

    try {
      // Lấy vị trí và địa chỉ, bỏ qua nếu vị trí không thay đổi
      let baAddress = await this.geocodingLocation.geocodingFromLatLng(
        latLng,
        NativeAppModule.KEY_MAP
      );
      this.rModel.srcAddress = baAddress;
      //cập nhật địa chỉ
      this.mPresenter.updateViewSrcAddress(
        this.rModel.srcAddress.formattedAddress
      );
    } catch (error) {
      //trả về khi tạo ra nhiều request
      if (error && error.message == GeocodingError.DIFF_ID) return;

      //cập nhật trạng thái không lấy được địa chỉ
      // this.rModel.srcAddress.formattedAddress = strings.no_address;
      this.mPresenter.updateViewSrcAddress(strings.no_address);
    }

  }

  /**
   * cập nhật lại các thông tin khi vị trí thay đổi
   * @param latLng
   */
  protected async updateSrcByLocationChange(latLng: LatLng) {
    // Vẽ marker mới
    this.drawStartCustomMarker(latLng);

    // Cập nhật lại giao diện vùng tuyến
    let ret = await this.updateViewPage(latLng);

    return ret;
  }

  /**
   * cập nhật địa chỉ đến từ màn hình tìm kiếm
   * @param baAddress 
   */
  public updateDstAddressBySearch(baAddress: BAAddress) {
    this.updateDstAddress(baAddress);
  }

  /**
   * sau khi chọn địa chỉ điểm đến thì sang màn hình confirm
   * @param baAddress
   */
  public updateDstAddress(baAddress: BAAddress) {
    // console.log("updateDstAddress >>>>>>>>>>>>>>>>>>>>>>>");

    this.rModel.dstAddress = baAddress;

    //không cập nhật điểm B mà chuyển sang màn hình con firm luôn
    this.toConfirmBook();
  }

  /* Kiểm tra điều kiện sang confirm */
  public isCheckBooking(): boolean {
    // Thông báo nếu đang đặt xe ở ngoài vùng hỗ trợ hoặc
    // trong vùng hỗ trợ nhưng không có tuyến
    if (
      this.rModel.taxiType == null ||
      this.rModel.route.routeId == -1 ||
      this.rModel.landmark == null ||
      this.rModel.landmark.landmarkId == -1
    ) {
      this.main.showToast(strings.book_not_support_are);
      return false;
    }
    if (!this.rModel.isValidSrcAddress()) {
      this.main.showToast(strings.no_address);
      return false;
    }
    // Nếu là xe hợp đồng hoặc xe máy thì yêu cầu chọn điểm đến nếu chưa có
    // if (!this.rModel.isValidDstAddress()) {
    if (
      !this.rModel.isValidDstAddress() &&
      this.rModel.taxiType.obligeEndPoint == 1
    ) {
      this.main.showToast(strings.address_confirm_empty);
      return false;
    }

    return true;
  }
}
export interface CarTypeViewPresenter {
	showView(page: BookHomeViewType);
	setVehicleTypes(vehicleTypes, page?: BookHomeViewType);
	updateViewSrcAddress(formattedAddress: string);
	updateViewDstAddress(formattedAddress: string);
  updateSuggestAddress(suggestAddress?: Array<any>);
}

export enum BookHomeViewType {
  CAR_TYPE_VIEW_ONLY = 1,
  LANDMARKK_NOT_SUPPORT = 2
}
