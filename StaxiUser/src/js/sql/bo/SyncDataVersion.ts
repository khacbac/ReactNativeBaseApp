/**
 * Quản lý version các bảng đồng bộ cho app khách hàng
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class SyncDataVersion {
	// Id cuả bảng
	public syncDataVersionId: number = 0;

	// Version bảng công ty
	public companyVersion: number = 0;

	// Version bảng loại xe
	public vehicleTypeVersion: number = 0;

	// Version bảng phản hồi
	public feedbackTypeVersion: number = 0;

	// Version bảng giá
	public priceVersion: number = 0;

	// Version bảng vùng
	public landmarkVersion: number = 0;

	// Version bảng tuyến
	public routeVersion: number = 0;

	//Version bảng loại xe trong tuyến
	public routeVehicleVersion: number = 0;
}

export default SyncDataVersion;