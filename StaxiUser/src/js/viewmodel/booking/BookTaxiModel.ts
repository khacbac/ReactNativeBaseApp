import BAAddress from "../../model/BAAddress";
import Company from "../../sql/bo/Company";
import BookedStep from "../../constant/BookedStep";
import VehicleType from "../../sql/bo/VehicleType";
import { Utils, LatLng } from "../../../module";
import VehicleInfo from "../../model/VehicleInfo";
import Landmark from "../../sql/bo/Landmark";
import Route from "../../sql/bo/Route";
import { VehicleWithPrice } from "../../http/estimate/CalcPriceResponse";
import BookedHistory from "../../sql/bo/BookedHistory";
import FocusAddress from "../search/FocusAddress";
import Constants from "../../constant/Constants";
import MapUtils from "../../../module/maps/MapUtils";
import CompanyDAO from "../../sql/dao/CompanyDAO";
import RouteDAO from "../../sql/dao/RouteDAO";

export default class BookTaxiModel extends BookedHistory{

  /* Vị trí hiện tại lấy theo gps */
  public currentLocation:LatLng;

  /* Danh sách hãng */
  public companies: Array<Company>;

  /* Vùng khả dụng */
  public landmark: Landmark;

  /* Tuyến khả dụng */
  public route: Route;

  /* Danh sách id công ty yêu thích */
  public companyIdsFavorite: Array<number> = new Array<number>();

  /* Danh sách id công ty bị chặn */
  public companyIdsDeny: Array<number> = new Array<number>();

  // 0: Không chọn hãng yêu thích, 1: Chỉ chọn hãng yêu thích
  public isOnlyFavorite: number = 0;

  /* Độ ưu tiên */
  public priority: number = 0;

  /* PRIORITIZED_NEAR(0), ONLY_FAVORITE(1); */
  public searchOption: number = 0;

  /* Khoảng cách 2 điểm A-B */
  public distanceAB: number = -1;

  // NORMAL(0), // Cuốc đặt bình thường đi ngay
  // RETURN(1), // Cuốc xe chiều về
  // LONG(2), //  Cuốc xe đường dài
  // CONTRACT(3); // Cuốc xe hợp đồng
  public bookTripType: number = 0;

  /* Danh giá ước lượng */
  public childPrices: Array<VehicleWithPrice> = new Array<VehicleWithPrice>();

  /* Vị trí marker tâm bản đồ */
  public locationCenter: LatLng;

  /* Trạng thái active địa điểm đón */
  public focusAddress:FocusAddress = FocusAddress.A_FOCUS;

  /* Trạng thái người dùng đã di chuyển bản đồ */
  public isTouchMoveMap: boolean = false;

  /* Cờ trạng thái cuốc đặt lại từ lịch sử */
  public isBookFromHistory:boolean = false;
  
  /* Danh sách địa chỉ đã đặt xe gần đây */
  public addressHistorys?: Array<any> = undefined;

  constructor(){
    super();
    this.srcAddress = new BAAddress();
    this.dstAddress = new BAAddress();
    this.company = new Company();
  }

  public appendFromSuper(history:BookedHistory){
     // Handle the 3 simple types, and null or undefined
     if (null == history || "object" != typeof history) return this;

     for (let attr in history) {
       //kiểm tra thuộc tính của đối tượng cha
       if (history.hasOwnProperty(attr)) {
           this[attr] = history[attr];
       }
     }
  }

  /* Kiểm tra xem điểm đón có hợp lệ không */
  public isValidSrcAddress(): boolean {
    return (
      this.srcAddress &&
      this.srcAddress.formattedAddress &&
      this.srcAddress.isAvailableLocation()
    );
  }

  /* Kiểm tra xem điểm trả có hợp lệ không */
  public isValidDstAddress(): boolean {
    return (
      this.dstAddress &&
      this.dstAddress.formattedAddress &&
      this.dstAddress.isAvailableLocation()
    );
  }

  /** Validate mã khuyến mại
   * @return true: nếu có mã khuyến mại
   */
  public isValidPromotion(): boolean {
    return !Utils.isEmpty(this.promotion);
  }

  /** Validate comment
   * @return true: nếu có comment
   */
  public isValidComment(): boolean {
    return !Utils.isEmpty(this.comment);
  }

  public isValidEstimates(): boolean {
    return !Utils.isEmpty(this.estimates);
  }

  public getVehicleType():VehicleType{
    return this.taxiType;
  }

  public setVehicleType(vehicleType:VehicleType){
    this.taxiType = vehicleType;;
  }

  public resetAddress() {
		this.srcAddress = new BAAddress();
		this.resetDstAddress();
	}

	public resetDstAddress() {
		this.dstAddress = new BAAddress();
  }
  
  public getVehicleInfo():VehicleInfo{
    return this.vehicleInfo;
  }

  public resetVehicleInfo(){
    return this.vehicleInfo = null;
  }

  /* Trả về trạng thái cuốc bắt đầu khởi tạo không */
	public isStart():boolean {
		return this.state == BookedStep.START;
  }

  // Gán trạng thái đã move bản đồ
  public setTouchMoveMap(isTouchMove: boolean) {
    // console.log('-----------------------------Move map: ' + isTouchMove);
    this.isTouchMoveMap = isTouchMove;
  }

  /**
   * Lấy thông tin công ty theo tuyến thay đổi.
   *
   * @des companyKey
   */
  public async getCompanyByCompanyKey(route: Route) {
    if (route == null 
            || route.companyId == -1
            || this.company != null && this.company.companyKey == route.companyId) {
        return;
    }
    let company: Company = await CompanyDAO.getCompanyByKey(route.companyId);
    if (company != null) {
        this.company = company;
    }
  }


  /**
     * Kiểm tra vùng hiện tại có cho phép request địa chỉ của Bình Anh
     *
     * @return true nếu cho phép, false nếu không cho phép request address BA.
     */
    public isRequestAddressBA(): boolean {
      return this.landmark && this.landmark.addressSource == Constants.REQUEST_SOURCE_BINH_ANH;
  }

 /*
	 * Kiểm tra có đang trong vùng hỗ trợ
	 */
	public isSupportArea(): boolean {
		return this.landmark && this.landmark.landmarkId !== -1
  }
  
  /**
   * thêm đối tượng địa chỉ gần đây
   * @param address 
   */
  public addAddressHistorys(address:BAAddress){
      // console.log("addAddressHistorys =======", address);
      if(this.addressHistorys == undefined){
        this.addressHistorys = new Array<BAAddress>();
      }

      if(Utils.isNull(address)) {
        return;
      }

      // Kiểm tra địa chỉ này đã có trong danh sách chưa, nếu có rồi thì bỏ qua.
      let temp:BAAddress;
      for (let i = 0; i < this.addressHistorys.length; i++) {
        temp = this.addressHistorys[i];
        if (Utils.isNull(temp)) continue;

        // nếu đã có địa chỉ
        if (!Utils.isEmpty(address.formattedAddress)
          && !Utils.isEmpty(temp.formattedAddress)
          && temp.formattedAddress === address.formattedAddress) {
            return;
        }
      }

      this.addressHistorys.splice(0,0,address);
      this.addressHistorys.pop();
  }

}
