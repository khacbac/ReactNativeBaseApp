import { LatLng } from "../../../module";

/**
 * Vùng app khách hàng
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class Landmark {
	/* ID định danh của bảng thông tin vùng */
	public landmarkId: number;

	/* Đanh sách điểm */
	public polygone: string;

	/* Danh sách điểm decode */
	public coordinatePolys: Array<{latitude: number, longitude: number}>;

	/* Nguồn request địa chỉ */
	public addressSource: number;

	/* Vận tốc ước lượng theo vùng(dùng để tính ước lượng xe) */
	public averageSpeed: number;

	/* Khoảng cách ước lượng(bù trừ cho đường chim bay) */
	public distanceMultiplier: number;

	/**
	 * Số phút thêm cho ước lượng theo vùng(những vùng dễ tắc, nhiều đèn đỏ như
	 * nội thành)
	 */
	public additionTime: number;

	/* Loại tuyến để set giao diện */
	public subType: number;

	/* Trường mở rộng */
	public landmarkJson: string;
}

export default Landmark;