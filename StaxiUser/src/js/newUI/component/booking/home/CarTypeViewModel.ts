import BookingViewModel from "../../../../viewmodel/booking/BookingViewModel";
import CarTypeViewModelLib, {
  BookHomeViewType
} from "../../../../viewmodel/booking/home/CarTypeViewModel";
import { CarTypeViewPresenter } from "../../../../viewmodel/booking/home/CarTypeViewModel";
import {
  LatLng,
  MarkerOptions,
  NativeAppModule,
  Location,
  Utils,
  UserUtils
} from "../../../../../module";
import BAAddress from "../../../../model/BAAddress";
import { GeocodingError } from "../../../../http/address/GeocodingLocation";
import MapUtils from "../../../../../module/maps/MapUtils";
import strings from "../../../../../res/strings";
import OnNetworkListener from "../../../../../module/net/OnNetworkListener";
import AddressHistoryDAO from "../../../../sql/dao/AddressHistoryDAO";
import { AddressRequestType } from "../../../../viewmodel/search/SearchParams";
import ActionsManagerWrapper from "../../../../../module/utils/ActionsManagerWrapper";
import { CarNear } from "../../../../http/carnear/CarNearResponse";
import SphericalUtil from "../../../../../module/maps/SphericalUtil";
import images from "../../../res/images";

export default class CarTypeViewModel extends CarTypeViewModelLib
  implements OnNetworkListener {
  private isUnmounted: boolean = false;

  private actionsManagerWrapper: ActionsManagerWrapper;

  private isLockChangeCamera: boolean = false;

  private markerOstions:MarkerOptions[];

  constructor(
    carTypeViewPresenter: CarTypeViewPresenter,
    bookingViewModel: BookingViewModel
  ) {
    super(carTypeViewPresenter, bookingViewModel);
    this.isLockChangeCamera = false;
    this.actionsManagerWrapper = new ActionsManagerWrapper();
  }

  async componentDidMount() {
    super.componentDidMount();

    //kiểm tra để cập nhật danh sách lịch sử gần đây
    if (this.rModel.addressHistorys == undefined) {
      //gán lại danh sách để cập nhật
      this.rModel.addressHistorys = await AddressHistoryDAO.getAddressHistorys();
    }

    //cập nhật giao diện
    this.mPresenter.updateSuggestAddress(this.rModel.addressHistorys);
  }

  public componentWillUnmount() {
    this.isUnmounted = true;
    super.componentWillUnmount();
  }

  async onLocationChanged(location?: Location) {
    // Di chuyển về vị trí hiện tại
    if (!this.rModel.isTouchMoveMap && !this.onFirstLocation) {
      this.onFirstLocation = true;
      // console.log("onLocationChanged =======================================", this.rModel.isTouchMoveMap, this.onFirstLocation);

      let latLng = new LatLng(location.latitude, location.longitude);

      //move vị trí
      this.moveCenterCamera(latLng);

      //cập nhật page
      await this.updateViewPage(latLng);
    }
  }

  onRegionChangeCompleted(region) {
    // console.log("onRegionChangeCompleted this.isLockChangeCamera", this.isLockChangeCamera);

    //nếu unmout rồi thì bỏ qua
    if (this.isUnmounted) {
      return;
    }

    //nếu lock thì mở llocs
    if (this.isLockChangeCamera) {
      this.isLockChangeCamera = false;
      return false;
    }

    let newLocation: LatLng = new LatLng(region.latitude, region.longitude);
    if (
      MapUtils.isBetweenLatlng(this.rModel.srcAddress.location, newLocation)
    ) {
      // console.log("onRegionChangeCompleted vị trí quá gần");
      return;
    }

    this.actionsManagerWrapper.doAction(
      () =>
        // Gọi hàm lấy địa chỉ từ server
        this.requestGetAddressFromLocation(region),
      (error: Error, baAddress?: any) => {
        if (baAddress != undefined) {
          if (this.isUnmounted) {
            return;
          }
          this.updateSourceAddressRegionChange(baAddress);
        } else {
          // nếu component đã unmounted hoặc response khác ID thì bỏ qua
          if (this.isUnmounted || error.message == GeocodingError.DIFF_ID) {
            return;
          }
          // tạo điểm vị trí ghim nếu không request địa chỉ thành công
          let baAddress: BAAddress = new BAAddress();
          baAddress.location = new LatLng(region.latitude, region.longitude);
          baAddress.name = strings.book_search_latlng_point;
          baAddress.formattedAddress = strings.book_search_latlng_point;

          this.updateSourceAddressRegionChange(baAddress);
        }
      }
    );
  }

  /* Gọi request lấy địa chỉ */
  requestGetAddressFromLocation = region => {
    // Hiển thị text đang request địa chỉ trên view
    this.rModel.srcAddress.formattedAddress = "";
    this.mPresenter.updateViewSrcAddress(strings.address_loadding);

    return this.geocodingLocation.geocodingFromLatLng(
      new LatLng(region.latitude, region.longitude),
      NativeAppModule.KEY_MAP,
      this.rModel.landmark
        ? this.rModel.landmark.addressSource
        : AddressRequestType.GOOGLE
    );
  };

  /**
   * cập nhật địa chỉ
   * @param baAddress
   */
  public async updateSourceAddressRegionChange(baAddress: BAAddress) {
    // Cập nhật địa chỉ
    await this.updateSourceAddress(baAddress);

    // Cập nhật lại giao diện vùng tuyến
    await this.updateViewPage(baAddress.location);
  }

  // Cập nhật lại giao diện vùng tuyến, loại xe
  protected async updateViewPage(latLng: LatLng): Promise<boolean> {
    //lấy danh sách loại xe
    let vehicleData = await this.getVehicleTypes(latLng);

    let ret = vehicleData != null && vehicleData.length > 0;

    if (ret) {
      this.mPresenter.showView(BookHomeViewType.CAR_TYPE_VIEW_ONLY);
      //request lại xe xung quanh
      this.requestNearCar(latLng, estimateCarnear =>
        this.updateEstimateTimeMarker(estimateCarnear)
      );
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

  /**
   * marker ở màn hình này có thêm thông tin về thời gian và action đặt xe
   * @param srcMarkerOptions
   */
  public appendStartMarker(srcMarkerOptions: MarkerOptions) {}

  /**
   * cập nhật lại các thông tin khi vị trí thay đổi
   * @param latLng
   */
  protected async updateSrcByLocationChange(latLng: LatLng) {
    // Vẽ marker mới
    this.drawStartMarker(latLng);

    // Cập nhật lại giao diện vùng tuyến
    let ret = await this.updateViewPage(latLng);
    return ret;
  }

  public drawStartCustomMarker(srcLatLng: LatLng) {}

  /* Vẽ điểm đi */
  public drawStartMarker(srcLatLng: LatLng) {
    //ở màn hình home thì ko vẽ marker nào cả
  }

  /* Cập nhật thời gian ước lượng cho xe gần nhất */
  public updateEstimateTimeMarker(time: string) {
    return;
  }

  /** Cập nhật lại địa điểm B và chuyển sang màn hình confirm */
  public updateDstAddressToConfirm(baAddress: BAAddress) {
    super.updateDstAddress(baAddress);
  }

  /**
   * cập nhật khi chọn từ màn hình tìm kiếm
   * @param baAddress
   */
  public async updateSourceAddressBySearch(baAddress: BAAddress) {
    //cập nhật địa chỉ
    this.updateSourceAddress(baAddress);

    //cập nhật lại khi vị trí thay đổi
    this.isLockChangeCamera = true;
    this.getMap().moveCenterCamera(baAddress.location);

    // Cập nhật lại giao diện vùng tuyến
    await this.updateViewPage(baAddress.location);
  }

  /**
   * click vào nút my location trên màn hình home
   */
  public clickMyLocation() {
    // Refresh lại trạng thái tự động lấy vị trí hiện tại
    this.rModel.setTouchMoveMap(false);

    // Move bản đồ về vị trí hiện tại
    this.main.moveMyLocation(async location => {
      // Kiểm tra vị trí cũ và vị trí mới, nếu < 150m thì không cập nhật
      if (MapUtils.isBetweenLatlng(this.rModel.srcAddress.location, location)) {
        //move về vị trí người dung
        this.isLockChangeCamera = true;
      }

      this.moveCenterCamera(location);

      //cập nhật thông tin theo vị trí thay đổi
      await this.updateViewPage(location);
    });
  }

  // Cập nhật lại địa điểm B
  public updateDstAddress(baAddress: BAAddress) {
    // khóa tự động cập nhật vị trí mới
    this.rModel.setTouchMoveMap(true);

    this.rModel.dstAddress = baAddress;

    //cập nhật địa chỉ
    this.mPresenter.updateViewDstAddress(baAddress.formattedAddress);

    //vẽ marker mới
    this.drawEndMarker();
  }

  /**
   * tính thời gian nhỏ nhất từ vị trí đặt xe đến xe gần nhất
   */
  public calcMinTimeNearCar(
    carNears: Array<CarNear>,
    callback: (n?: string) => any
  ) {
    // Nếu có xe xung quanh thì vẽ xe lên bản đồ
    if (carNears.length > 0 && this.getMap() != null) {

     

      this.markerOstions = new Array<MarkerOptions>();
      carNears.forEach(vehicle => {
        if (!Utils.isOriginLocation(vehicle.coordinate.value)) {
          this.markerOstions.push(this.createVehicleMarker(vehicle));
        }
      });
      //vẽ marker
      this.getMap().setMarkers(this.markerOstions);

      // console.log('calcMinTimeNearCar', this.mapManager.getMarkers().length);
      // console.log('calcMinTimeNearCar new ', carNears.length);

    } else {
      // Xóa marker xe xung quanh cũ
      this.getMap().removeAllMarkers();
    }
  }

  /* Vẽ xe xung quanh */
  public createVehicleMarker(vehicle: CarNear): MarkerOptions {
    let markerOption = new MarkerOptions(vehicle.vehiclePlate.value);
    markerOption.icon(images.ic_car_traking);
    markerOption.position(vehicle.coordinate.value);
    markerOption.setRotation(vehicle.direction.value);

    //tính góc quay nếu có
    // if (this.getMap() != null) {
      
    //   let markers = this.markerOstions;
    //   console.log("markers %%%%", markers);
    //   if (markers != undefined && markers.length > 0) {
    //     for (let i = 0; i <= markers.length; i++) {
    //       let item = markers[i];
    //       if (item.getKey() == vehicle.vehiclePlate.value) {
    //         let angle = SphericalUtil.computeAngleBetween(
    //           vehicle.coordinate.value,
    //           item.getPosition()
    //         );
    //         // console.log("createVehicleMarker angle===", angle, vehicle.coordinate.value, item.getPosition());
    //         markerOption.setRotation(angle);
    //         break;
    //       }
    //     }
    //   }
    // }
    return markerOption;
  }
}
