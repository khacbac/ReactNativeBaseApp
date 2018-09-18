import { DfString, DfLatLng, DfFloat, DfInteger, DfShort, DfList, DfByte, ISerializeItemArray, DfBoolean } from "../../../module";

/**
 * Dữ liệu ước lượng giá, lộ trình giữa 2 điểm A-B đã chọn
 * @author ĐvHiện
 * Created on 10/07/2018
 */
class VehicleWithPrice implements ISerializeItemArray<VehicleWithPrice>{

	/* Loại xe */
	public carType: DfInteger = DfInteger.index(0);

	/* Tiền cước */
	public price: DfInteger = DfInteger.index(1);

	/* Loại giá cước hiển thị */
	// 0: ước lượng
	// 1: cước thanh toán
	public priceType: DfByte = DfByte.index(2);

	public priceDriver: DfInteger = DfInteger.index(3);

	/* Trạng thái active */
	public isActive: DfBoolean;

	newInstanceItemArray(): VehicleWithPrice {
		return new VehicleWithPrice();
	}
}

/* Dữ liệu gửi về từ server */
class CalcPriceResponse {
	/* Khoảng cách */
	public distance: DfInteger = DfInteger.index(0);

	/* Thời gian */
	public duration: DfInteger = DfInteger.index(1);

	/* Đường di chuyển */
	public polyline: DfString = DfString.index(2);

	/* Giá min */
	public priceMin: DfInteger = DfInteger.index(3);

	/* Giá max */
	public priceMax: DfInteger = DfInteger.index(4);

	/* Danh giá ước lượng */
	public childPrices: DfList<VehicleWithPrice> = new DfList(new VehicleWithPrice(), 5);

	/* Loại giá cước hiển thị */
	// 0: ước lượng
	// 1: cước thanh toán
	public priceType: DfByte = DfByte.index(6);
}

export { VehicleWithPrice, CalcPriceResponse };
