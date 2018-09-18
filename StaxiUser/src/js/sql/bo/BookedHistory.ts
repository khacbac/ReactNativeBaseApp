import DoneInfo from "../../tcp/recv/DoneInfo";
import BAAddress from "../../model/BAAddress";
import VehicleType from "./VehicleType";
import Company from "./Company";
import BookedStep from "../../constant/BookedStep";
import TripStep from "../../constant/TripStep";
import BookType from "../../constant/BookType";
import VehicleInfo from "../../model/VehicleInfo";
import DriverInfo from "../../model/DriverInfo";
import { Utils } from "../../../module";

export default class BookedHistory {
	/* tableId của bảng */
	public id: number = -1;

	/* Địa chỉ đón */
	public srcAddress: BAAddress;

	/* Địa chỉ đến */
	public dstAddress: BAAddress;

	/* Loại xe */
	public taxiType: VehicleType;

	/* Hãng được chọn */
	public company: Company;

	/* Số lượng xe, mặc định là 1 */
	public countCar: number = 1;

	/* Thời gian đặt */
	public catchedTime: number;

	/* Ghi chú phần thông tin đặt xe */
	public comment: string = "";

	/* Mã khuyến mại cho khách */
	public promotion: string = "";

	/* Chiều về hay không */
	public isVehicleReturn: boolean = false;

	/* Mã đặt xe */
	public bookCode: string = "";

	/* Mã đặt xe cuốc gần nhất */
	public oldBookID: string = "";

	/* Các bước đặt xe */
	public state: BookedStep = BookedStep.START;

	/* Các bước đặt xe */
	public tripStep: TripStep = TripStep.NONE;

	/* Lưu trữ trạng thái có phải đặt lịch hay không đặt lịch */
	public isSchedule: boolean = false;

	/* Lưu trữ trạng thái có phải cuốc đi chung hay không */
	public isShareBooking: boolean = false;

	/* Loại quốc khách - 0: bình thường - 1: nhỡ cuốc */
	public bookType: BookType = BookType.INIT_BOOK_TYPE;

	/* Lưu trạng thái có nhận cuộc gọi không */
	public isReceiveCall: boolean = true;

	public vehicleInfo: VehicleInfo;

	/* Thông tin lái xe */
	public driverInfo: DriverInfo;

	public updateDate: number;

	/* Lưu thông tin ước lượng */
	public estimates: string = "";

	/* Thông tin giá cước chuyến đi */
	public doneInfo: DoneInfo;

	/* ID công ty con: chỉ dùng cho Staxi */
	public companyIdTemp: number = -1;

	/* Trạng thái khách hàng đã lên xe hay chưa */
	public isCatcherCar: boolean = false;

	/* Kiểm tra xem điểm đón có hợp lệ không */
	public isValidSrcAddress(): boolean {
		return this.srcAddress != null
			&& !this.srcAddress.isEmptyFormatedAddress()
			&& this.srcAddress.isAvailableLocation();
	}

	/* Kiểm tra xem điểm trả có hợp lệ không */
	public isValidDstAddress(): boolean {
		return this.dstAddress != null
			&& !this.dstAddress.isEmptyFormatedAddress()
			&& this.dstAddress.isAvailableLocation();
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
}