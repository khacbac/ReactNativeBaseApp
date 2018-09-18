import {DfInteger} from "../../../module";

/**
 * Đối tượng request đồng bộ bảng dữ liệu app khách hàng
 * @author ĐvHiện
 * Created on 29/06/2018
 */
class SyncDataRequest {
	/* version bảng công ty */
	public companyVersion: DfInteger = DfInteger.index(0);

	/* version bảng loại xe */
	public vehicleTypeVersion: DfInteger = DfInteger.index(1);

	/* version bảng giá */
	public priceVersion: DfInteger = DfInteger.index(2);

	/* version bảng phản hồi */
	public feedbackTypeVersion: DfInteger = DfInteger.index(3);

	/* version bảng vùng */
	public landmarkVersion: DfInteger = DfInteger.index(4);

	/* version bảng tuyến */
	public routeVersion: DfInteger = DfInteger.index(5);

	/* version bảng loại xe trong tuyến */
	public routeVehicleVersion: DfInteger = DfInteger.index(6);

	/* hệ điều hành client */
	public osType: DfInteger = DfInteger.index(7);

	/* version app client */
	public appVersion: DfInteger = DfInteger.index(8);
}

export default SyncDataRequest;