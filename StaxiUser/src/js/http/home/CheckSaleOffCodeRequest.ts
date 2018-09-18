import { DfInteger, DfString, DfLatLng } from "../../../module";

/**
	 * Lớp nội lưu trữ thông tin gửi lên server
	 * 
	 * @author BacHK.
	 */
class CheckSaleOffCodeRequest {
    public companyID: DfInteger = DfInteger.index(0);

    public promoCode: DfString = DfString.index(1);

    public userName: DfString = DfString.index(2);

    public password: DfString = DfString.index(3);

    public carType: DfInteger = DfInteger.index(4);

    public routeID: DfInteger = DfInteger.index(5);

    public currenLocation: DfLatLng = DfLatLng.index(6);
}

export default CheckSaleOffCodeRequest;