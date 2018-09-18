import User from "./sql/bo/User";
import Company from "./sql/bo/Company";
import Price from "./sql/bo/Price";
import VehicleType from "./sql/bo/VehicleType";
import BAAddress from "./model/BAAddress";
import BookedHistory from "./sql/bo/BookedHistory";
import Language from "../module/model/Language";
import Region from "./model/Region";

class Session {
	// Tài khoản người dùng
	private user: User = new User();

	// Danh sách vùng
	// private lanmarks: Array<Landmark> = [];

	// Danh sách tuyến
	// private routes: Array<Route>;

	// Danh sách công ty
	private companys: Map<number, Company>;

	// Danh sách bảng giá cước
	private prices: Array<Price> = [];

	// Danh sách loại xe
	private vehicleTypes: Array<VehicleType> = [];

	// Loại xe trong tuyến
	// private routeVehicles: Array<RouteVehicleType> = [];

	/* Lưu trữ trạng thái đang đặt xe ngay lập tức */
	private booking: boolean = false;

	/* Lưu trữ thời gian có cuốc tương lai đang đợi */
	private futureBookedTime: number;

	/* Số thông báo chưa đọc */
	private messageCount: number = -1;

	/* Lưu trữ trạng thái đã hiển thị layout giới thiệu giá của tuyến khác nội thành */
	private showsCarPromotion: boolean = false;

	/* Token key firebase */
	private tokenKeyFireBase: string = '';

	/* Vị trí trung tâm bản đồ */
	private lastBookLocation: BAAddress;

	/** book đang active */
	public activeBooked: BookedHistory;

	public language:Language;

	public updateChange:Function;

	/** Lưu thông tin vùng với key là lanmarkId*/
	public regions:Map<number, Region>;

	constructor() {}

	// Lấy thông tin user
	public getUser(): User {
		return this.user;
	}

	// Set thông tin user
	public setUser(user: User) {
		this.user = user;
	}

	// Lấy thông tin công ty
	public getCompanys(): Map<number, Company> {
		return this.companys || new Map<number, Company>();
	}

	// Set thông tin công ty
	public setCompanys(_companys: Map<number, Company>) {
		this.companys = _companys;
	}

	// Lấy thông tin công ty
  public getPrices(): Array<Price> {
		return this.prices;
	}

	// Set thông tin công ty
	public setPrices(_prices: Array<Price>) {
    this.prices = _prices;
	}

	// Lấy thông tin loại xe
	public getVehicleTypes(): Array<VehicleType> {
		return this.vehicleTypes;
	}

	public getVehicleTypeByID(id: Number): VehicleType {
		var vehicle: VehicleType = this.vehicleTypes[0];
		this.vehicleTypes.forEach(v => {
			if(v.vehicleId == id){
				vehicle = v;
			}
		});
		return vehicle;
	}

	// Set thông tin loại xe
	public setVehicleTypes(_vehicles: Array<VehicleType>) {
		this.vehicleTypes = _vehicles;
	}

	// Lấy thông tin loại xe trong tuyến
	// public getRouteVehicles(): Array<RouteVehicleType> {
	// 	return this.routeVehicles;
	// }

	// // Set thông tin loại xe trong tuyến
	// public setRouteVehicles(_routeVehicles: Array<RouteVehicleType>) {
	// 	this.routeVehicles = _routeVehicles;
	// }

	/* Kiểm tra xem có 1 cuốc đang được đặt không */
	public isAvailableBooking(): boolean {
		return this.booking;
	}

	/* Kiểm tra xem có phải trạng thái đang đặt lịch không */
	public isScheduleBooking(): boolean {
		return this.futureBookedTime > new Date().getTime();
	}

	/* Thiết lập lại thời gian đặt lịch */
	public setScheduledBookTime(time: number) {
		this.futureBookedTime = time;
	}

	/* Kiểm tra xem có phải trạng thái đang đặt lịch không */
	public getMessageCount(): number {
		return this.messageCount;
	}

	/* Thiết lập lại thời gian đặt lịch */
	public setMessageCount(count: number) {
		this.messageCount = count;
	}

	/* Thiết lập bắt đầu đặt xe */
	public setStartBooking() {
		this.booking = true;
	}

	/* Thiết lập kết thúc đặt xe */
	public setFinishBooking() {
		this.booking = false;
	}

	/* Lấy trạng thái đặt xe hay không */
	public isBooking(): boolean {
		return this.booking;
	}

	/* Kiểm tra layout giới thiệu giá đã từng được show */
	public isShowsCarPromotion(): boolean {
		return this.showsCarPromotion;
	}

	/* Thay đổi trạng thái hiển thị layout giá */
	public setShowsCarPromotion(isShows: boolean) {
		this.showsCarPromotion = isShows;
	}

	/* Lấy thông tin hiển thị giới thiệu khi mở ứng dụng */
	public getTokenKeyFireBase(): string {
		return this.tokenKeyFireBase;
	}

	/* Set thông tin hiển thị giới thiệu khi mở ứng dụng */
	public setTokenKeyFireBase(tokenKey: string) {
		this.tokenKeyFireBase = tokenKey;
	}

	/* Lấy thông tin hiển thị giới thiệu khi mở ứng dụng */
	public getLastBookAddress(): BAAddress {
		return this.lastBookLocation;
	}

	/* Set thông tin hiển thị giới thiệu khi mở ứng dụng */
	public setLastBookAddress(baAddress: BAAddress) {
		this.lastBookLocation = baAddress;
	}
}

var SessionStore: Session = SessionStore || new Session();

export default SessionStore;
