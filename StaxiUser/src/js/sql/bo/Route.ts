/**
 * Tuyến app khách hàng
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class Route {
	/* ID định danh của bảng thông tin tuyến */
	public routeId: number = -1;

	/* Đanh sách điểm */
	public routeCode: string = "";

	/* Tên tuyến - tiếng việt */
	public routeNameVi: string = "";

	/* Tên tuyến - tiếng anh */
	public routeNameEn: string = "";

	/* ID mã vùng */
	public landmarkId: number = -1;

	/* Sắp xếp loại xe và tuyến */
	public routeOrder: number = -1;

	/* FK_ID công ty - tuyến */
	public companyId: number = -1;

	/* Loại tuyến */
	public routeType: number = -1;

	/**
	 * 1: active mặc định
	 * 0: bình thường
	 * */
	public isActive: number = 0;

	/* Khoảng cách báo xe đến điểm đón khách */
	public distanceInviteUser: number = 0;
}

export default Route;