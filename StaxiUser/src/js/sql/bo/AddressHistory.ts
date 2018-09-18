import { LatLng } from "../../../module";

/**
 * Thông tin lịch sử địa chỉ
 * @author Đv Hiện
 * Created on 13/07/2017
 */

class AddressHistory {
	/* ID định danh của bảng */
	public id: number = -1;

	/* Thời gian tạo */
	public createTime: number;

	/* Tên điểm */
	public name: string = '';

	/* Vị trí */
	public location: LatLng = new LatLng(0,0);

	/* Nhãn điểm */
    public fomartAddress: string = "";

	/* Điểm yêu thích */
    public favorited: boolean = false;

    /**
	 * Loại địa điểm
     * 0: Default
	 * 1: Nhà riêng
	 * 2: Công ty
	 * */
    public predefinedValue: number = 0;
    
    /* Số lần sử dụng */
    public count: number = -1;

}

export default AddressHistory;