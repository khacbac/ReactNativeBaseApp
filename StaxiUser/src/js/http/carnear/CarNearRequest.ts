import { DfLatLng, DfShort, DfInteger,DfList, DfByte } from "../../../module";

/**
 * Đối tượng request xe xung quanh vị trí khách hàng
 * @author ĐvHiện
 * Created on 10/07/2018
 */
class CarNearRequest {
	/* Vị trí người dùng */
	public currentLocation: DfLatLng = DfLatLng.index(0);

	/* Loại xe đã chọn */
	public carTypeId: DfShort = DfShort.index(1);

	/* ID công ty */
	public companyId: DfInteger = DfInteger.index(2);

	/* Danh sách Id công ty yêu thích */
	public companyIdsFavorite: DfList<DfInteger> = DfList.index(new DfInteger(), 3);

	/* Danh sách Id công ty bị chặn */
	public companyIdsDeny: DfList<DfInteger> = DfList.index(new DfInteger(), 4);

	/* Id tuyến */
	public routerId: DfInteger = DfInteger.index(5);

	// 0: Không chọn hãng yêu thích, 1: Chỉ chọn hãng yêu thích
	public isOnlyFavorite: DfByte = DfByte.index(6);
}

export default CarNearRequest;