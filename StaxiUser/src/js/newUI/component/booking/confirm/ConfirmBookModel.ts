import {
  LatLng,
  UserUtils,
  Utils,
} from "../../../../../module";
import BookingViewModel, { FragmentMap } from "../../../../viewmodel/booking/BookingViewModel";
import VehicleType from "../../../../sql/bo/VehicleType";
import BaseConfirmBookModel from '../../../../viewmodel/booking/confirm/ConfirmBookModel';
import BAAddress from "../../../../model/BAAddress";
import strings from "../../../../../res/strings";
import CalcPriceController from "../../../../http/estimate/CalcPriceController";
import SessionStore from "../../../../Session";
import { CalcPriceResponse, VehicleWithPrice } from "../../../../http/estimate/CalcPriceResponse";
import ConfirmBookPresenter from "./ConfirmBookPresenter";
import FocusAddress from "../../../../viewmodel/search/FocusAddress";
import SearchParams from "../../../../viewmodel/search/SearchParams";
import ScreenName from "../../../../ScreenName";
import SearchViewLib from "../../../../component/search/SearchViewLib";
import Constants from "../../../../constant/Constants";

export default class ConfirmBookModel extends BaseConfirmBookModel {

  private cmPresenter: ConfirmBookPresenter;

  constructor(confirmPresenter: ConfirmBookPresenter, bookingViewModel: BookingViewModel) {
    super(confirmPresenter, bookingViewModel);
    this.cmPresenter = confirmPresenter;
  }

  async componentDidMount() {
    await super.componentDidMount();
    //cập nhật loại xe theo vị trí và start đối tượng lấy xe xung quanh
    this.updateViewPage(this.rModel.srcAddress.location);
  }

  // return right icon.
  getDstRightIcon() {
    return null;
  }

  // Cập nhật lại giao diện vùng tuyến, loại xe
  protected async updateViewPage(latLng: LatLng): Promise<boolean> {
    //lấy danh sách loại xe
    let vehicleData = await this.getVehicleTypes(latLng);

    let ret = vehicleData != null && vehicleData.length > 0;

    if (ret) {
      //request lại xe xung quanh
      this.requestNearCar(latLng, estimateCarnear => {
        // this.updateEstimateTimeMarker(estimateCarnear)
        // BACHK_TODO: chưa xử lý hiển thị thời gian ước lượng.
      });

      // resume request nearcar
      if (this.nearCarRealtime) {
        this.nearCarRealtime.resume();
      }
    } else {

      // BACHK_TODO: chưa xử lý trường hợp vùng không hỗ trợ.
      // this.mPresenter.showView(BookHomeViewType.LANDMARKK_NOT_SUPPORT);

      // Xóa marker xe xung quanh cũ
      if (this.nearCarRealtime) {
        this.nearCarRealtime.pause();
      }
      // BACHK_TODO: chưa xử lý hiển thị thời gian ước lượng.
      // this.updateEstimateTimeMarker("");
      this.getMap().removeAllMarkers();
    }

    return ret;
  }

  /**
   * Cập nhật loại xe vào bookModel
   * @param vehicleType
   * @returns: false: nếu loại xe đã tồn tại, true: nếu loại xe chưa tồn tại thì cập nhật
   */
  public updateVehicleType(data: { priceDetail: string, vehicleType: VehicleType }) {
    //nếu chọn loại xe đang active thì bỏ qua
    if (this.rModel.getVehicleType() && this.rModel.getVehicleType().vehicleId === data.vehicleType.vehicleId) {
      this.cmPresenter.hideBottomSheet();
      return;
    }
    if (data.priceDetail) {
      this.rModel.estimates = [strings.vsd_money_unit, data.priceDetail].join('');
    }
    // Cập nhật lại loại xe được chọn
    this.rModel.setVehicleType(data.vehicleType);

    // this.updateViewPage(this.rModel.srcAddress.location);
    // Cập nhật lại loại xe được chọn
    this.requestNearCar(this.rModel.srcAddress.location, estimateCarnear => {
      // this.updateEstimateTimeMarker(estimateCarnear);
      // BACHK_TODO: chưa xử lý hiển thị thời gian ước lượng.
      // Cập nhật lại giao diện chọn loại xe.
      this.confirmPresenter.setEstimate();
    });
  }

  // Cập nhật lại đỉa diểm A
  public async updateSourceAddress(baAddress: BAAddress) {

    // khóa tự động cập nhật vị trí mới
    this.rModel.setTouchMoveMap(true);

    // gán lại địa điểm mới
    this.rModel.srcAddress = baAddress;

    //cập nhật địa chỉ
    this.confirmPresenter.updateViewSrcAddress(baAddress);

    //cập nhật lại khi vị trí thay đổi
    // await this.updateSrcByLocationChange(baAddress.location);
    this.drawStartMarker(baAddress.location);
  }

  // Cập nhật lại địa điểm B
  public updateDstAddress(baAddress: BAAddress) {
    // khóa tự động cập nhật vị trí mới
    this.rModel.setTouchMoveMap(true);

    this.rModel.dstAddress = baAddress;

    //cập nhật địa chỉ
    this.confirmPresenter.updateViewDstAddress(baAddress);

    //vẽ marker mới
    this.drawEndMarker();
  }

  /**
   * @override
   */
  /* Ước lượng lộ trình, giá cước di chuyển */
  public esstimatePrice(callback: Function) {
    CalcPriceController.estimateRequest(
      this.rModel.srcAddress.location,
      this.rModel.dstAddress.location,
      this.rModel.company.companyKey,
      Constants.VEHICLE_TYPE_ALL_ID,
      this.rModel.promotion,
      SessionStore.getUser().phone
    )
      .then(response => callback(response))
      .catch(err => callback(null));
  }

  /**
   * @override
   * @param reponseModel
   * @param dstAddress 
   */
  public updateEstimatePrice(reponseModel: CalcPriceResponse, dstAddress: BAAddress): void {
    // danh sách ước lượng.
    let childPrices: Array<VehicleWithPrice> = reponseModel.childPrices.value;
    this.rModel.childPrices = childPrices;
    // Lấy ước lượng giá của loại xe đang active.
    let withPrice = childPrices.find(item => {
      return item.carType.value === this.rModel.getVehicleType().vehicleId;
    });

    // giá cước.
    let priceDetail = strings.empty_string;
    if (withPrice) {
      if (withPrice.price.value > 0) {
        priceDetail = [strings.vsd_money_unit, UserUtils.formatMoneyToK(withPrice.price.value)].join('');
      }
    }
    // đối với loại xe tất cả
    if (this.rModel.getVehicleType().vehicleId === Constants.VEHICLE_TYPE_ALL_ID) {
      if (reponseModel.priceMax.value > 0) {
        priceDetail = [
          strings.vsd_money_unit,
          UserUtils.formatMoneyToK(reponseModel.priceMin.value) +
          " - " +
          UserUtils.formatMoneyToK(reponseModel.priceMax.value)
        ].join('')

      } else {
        if (reponseModel.priceMin.value > 0) {
          if (withPrice) {
            priceDetail = [strings.vsd_money_unit, UserUtils.formatMoneyToK(withPrice.price.value)].join('');
          }
        }
      }
    }
    this.rModel.estimates = priceDetail;

    // lưu danh sách ước lượng sử dụng cho bottom sheet chọn loại xe.
    if (this.cmPresenter.getVehicleSelect()) {
      this.cmPresenter.getVehicleSelect().setConfirmBookModel(this);
      this.cmPresenter.getVehicleSelect().setData(reponseModel);
    }
    // Cập nhật view loại xe,ước lượng.
    this.confirmPresenter.setEstimate();

  }

  /**
  * click vào tìm kiếm
  * @param focusType
  */
  public toSearch(focusType: FocusAddress) {
    let searchParams = new SearchParams();
    searchParams.focusAddress = focusType;
    searchParams.srcAddress = this.rModel.srcAddress;
    searchParams.dstAddress = this.rModel.dstAddress;
    if (this.main) {
      searchParams.gpsLatLng = this.main.getCurrentLatLng();
    }
    searchParams.requestType = this.rModel.landmark.addressSource;

    this.cmPresenter.getNavigation().navigate(ScreenName.SEARCH_ADDRESS, {
      [SearchViewLib.SEARCH_PARAMS]: searchParams,
      onNavigateResult: (srcAddress: BAAddress, dstAddress?: BAAddress) =>
        this.update(srcAddress, dstAddress)
    });
  }

  private update(srcAddress: BAAddress, dstAddress?: BAAddress) {
    // Cập nhật thông tin điểm đi
    this.updateSourceAddress(srcAddress);

    if (!Utils.isNull(dstAddress) && !Utils.isEmpty(dstAddress.formattedAddress)
      && !Utils.isOriginLocation(dstAddress.location)) {
      // Cập nhật thông tin điểm đến
      this.updateDstAddress(dstAddress);
      // Vẽ lại chỉ đường ước lượng
      this.showDirections();
    }

  }

}
