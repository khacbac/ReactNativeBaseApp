import { DfString, DfLatLng, DfFloat, DfInteger, DfShort, DfList } from "../../../module";

/**
 * Dữ liệu xe xung quanh vị trí khách hàng
 * @author ĐvHiện
 * Created on 10/07/2018
 */
class CarNear {
	/* Biển số xe */
	public vehiclePlate: DfString = DfString.index(0);

	/* Vị trí xe */
	public coordinate: DfLatLng = DfLatLng.index(1);

	/* Hướng của xe */
	public direction: DfFloat = DfFloat.index(2);

    /* Loại xe */
    public carType: DfInteger = DfInteger.index(3);
}

class CarNearResponse {
    /* Số lượng xe xung quanh */
	public countNearestCar: DfShort = DfShort.index(0);

    /* Danh sách xe xung quanh */
    public carNears: DfList<CarNear> = new DfList(new CarNear(), 1);
}

export { CarNear, CarNearResponse };
