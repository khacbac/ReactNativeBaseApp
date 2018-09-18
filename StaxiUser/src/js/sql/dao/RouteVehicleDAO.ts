import RouteVehicleType from '../bo/RouteVehicleType';
import { SQLiteUtils } from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';

/**
 * Quản lý bảng loại xe trong tuyến
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class RouteVehicleDAO {
	public static TABLE = 'RouteVehicleTable';
	public static ID_COLUMN = 'routeVehicleTypeId';
	public static ROUTE_ID_COLUMN = 'routeId';
	public static VEHICLE_ID_COLUMN = 'vehicleId';
	public static VEHICLE_STT_COLUMN = 'vehicleStt';
	public static IS_VEHICLE_ACTIVE_COLUMN = 'isVehicleActive';
	public static ROUTE_VEHICLE_JSON = 'routeVehicleJson';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${RouteVehicleDAO.TABLE} (
                ${RouteVehicleDAO.ID_COLUMN} INTEGER ,
                ${RouteVehicleDAO.ROUTE_ID_COLUMN} INTEGER,
                ${RouteVehicleDAO.VEHICLE_ID_COLUMN} INTEGER,
				${RouteVehicleDAO.VEHICLE_STT_COLUMN} INTEGER,
				${RouteVehicleDAO.IS_VEHICLE_ACTIVE_COLUMN} BOOL,
                ${RouteVehicleDAO.ROUTE_VEHICLE_JSON} VARCHAR);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${RouteVehicleDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<RouteVehicleType> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${RouteVehicleDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let routeVehicle;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						routeVehicle = new RouteVehicleType();
						(routeVehicle.routeVehicleTypeId = row[RouteVehicleDAO.ID_COLUMN]),
						(routeVehicle.routeId = row[RouteVehicleDAO.ROUTE_ID_COLUMN]),
						(routeVehicle.vehicleId = row[RouteVehicleDAO.VEHICLE_ID_COLUMN]),
						(routeVehicle.vehicleStt = row[RouteVehicleDAO.VEHICLE_STT_COLUMN]),
						(routeVehicle.isVehicleActive = row[RouteVehicleDAO.IS_VEHICLE_ACTIVE_COLUMN]),
						(routeVehicle.routeVehicleJson = row[RouteVehicleDAO.ROUTE_VEHICLE_JSON]);
					}
					resolve(routeVehicle);
				})
				.catch(() => {
					resolve(new RouteVehicleType());
				});
		});
	};

	// Lấy tất cả dữ liệu đã lưu
    public static async getRouteVehicles(): Promise<Array<RouteVehicleType>> {
		var routeVehicles: Array<RouteVehicleType> = new Array<RouteVehicleType>();
        try {
            let sql = `SELECT * FROM ${this.TABLE}`;
            console.log(sql);
            let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
            let routeVehicle;
			for (let i = 0; i < resultSet.rows.length; i++) {
				routeVehicle = new RouteVehicleType();
				let row = resultSet.rows.item(i);
				(routeVehicle.routeVehicleTypeId = row[RouteVehicleDAO.ID_COLUMN]),
				(routeVehicle.routeId = row[RouteVehicleDAO.ROUTE_ID_COLUMN]),
				(routeVehicle.vehicleId = row[RouteVehicleDAO.VEHICLE_ID_COLUMN]),
				(routeVehicle.vehicleStt = row[RouteVehicleDAO.VEHICLE_STT_COLUMN]),
				(routeVehicle.isVehicleActive = row[RouteVehicleDAO.IS_VEHICLE_ACTIVE_COLUMN]),
				(routeVehicle.routeVehicleJson = row[RouteVehicleDAO.ROUTE_VEHICLE_JSON]);
				routeVehicles.push(routeVehicle);
			}

            return Promise.resolve(routeVehicles);
        } catch (error) {
            return Promise.resolve(routeVehicles);
        }
    }
}

export default RouteVehicleDAO;