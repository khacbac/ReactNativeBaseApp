/**
 * Loại xe trong tuyến
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class RouteVehicleType {
	/* ID định danh của bảng */
	public routeVehicleTypeId: number;

	/* ID tuyến */
	public routeId: number;

	/* ID loại xe */
	public vehicleId: number;

	/* STT sắp xếp xe */
	public vehicleStt: number;

	/* Active mặc định */
	public isVehicleActive: boolean;

	/* Json mở rộng */
	public routeVehicleJson: string;
}

export default RouteVehicleType;