import { DfLatLng, DfInteger, DfString } from "../../../module";

/**
 * Đối tượng request ước lượng lộ trình, giá cước di chuyển
 * @author ĐvHiện
 * Created on 13/07/2018
 */
class CalcPriceRequest {
	/* Vị trí điểm đi */
	public srcLocation: DfLatLng = DfLatLng.index(0);

	/* Vị trí điểm đến */
	public dstLocation: DfLatLng = DfLatLng.index(1);

	/* ID công ty */
	public companyId: DfInteger = DfInteger.index(2);

	/* Loại xe */
	public carType: DfInteger = DfInteger.index(3);

	/* Loại request */
	public requestType: DfInteger = DfInteger.index(4);

	/* Mã khuyến mại */
	public promotionCode: DfString = DfString.index(5);

	/* Số điện thoại */
	public phoneNumber: DfString = DfString.index(6);
}

export default CalcPriceRequest;