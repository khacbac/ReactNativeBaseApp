import SessionStore from "../../Session";
import Language from "../../../module/model/Language";

/**
 * Loại xe
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class VehicleType {
	/* Định danh của bảng */
	public vehicleId: number = -1;

	/* Tên loại bằng tiếng việt */
	public nameVi: string;

	/* Tên loại bằng tiếng anh */
	public nameEn: string;

	/* Chỗ ngồi */
	public seat: number;

	/* Id của icon */
	public iconCode: string;

	/* Icon drawable */
	public iconResc: any;

	/* Miêu tả */
	public description: string;

	/* Loại xe */
	public type: number;

	/* Số thứ tự */
	public orders: number;

	/* Danh sách ID con */
	public listChild: Array<number> = [];

	/* Cho phép hiển thị giá hay không */
	public isShowPrice: boolean;

	/* Link ảnh icon marker xe trên bản đồ */
	public icMarkerUrl: string;

	/* Cho phép marker xoay theo hướng hay không 0: xoay, 1: không xoay */
	public markerRotation: number;

	/* CompanyID */
	public companyId: number;

	/**
	 * 0: mặc định
	 * 1: ép nhập điểm đến
	 * */
	public obligeEndPoint: number;

	/**
	 * 0: mặc định
	 * 1: chờ cuốc hoàn thành từ lái xe
	 * */
	public obligeFinishBook: number;

	/* Thời gian được hoàn thành cuốc trước khi nhận bản tin DONE */
	public custTimerFinishBook: number;

	/* Trạng thái được chọn */
	public isActive = false;

	public getName = () => {
		return SessionStore.language == Language.VN ? this.nameVi : this.nameEn;
	}
}

export default VehicleType;