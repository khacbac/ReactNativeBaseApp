import VehicleType from '../bo/VehicleType';
import { SQLiteUtils } from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';

/**
 * Quản lý bảng loại xe
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class VehicleTypeDAO {
	public static TABLE = 'VehicleTypeTable';
	public static ID_COLUMN = 'vehicleTypeId';
	public static NAME_VI_COLUMN = 'nameVi';
	public static NAME_EN_COLUMN = 'nameEn';
	public static SEAT_COLUMN = 'seat';
	public static ICON_CODE_COLUMN = 'iconCode';
	public static ICON_RESC_COLUMN = 'iconResc';
	public static DESCRIPTION_COLUMN = 'description';
	public static TYPE_COLUMN = 'type';
	public static ORDER_COLUMN = 'orders';
	public static LIST_CHILD_COLUMN = 'listChild';
	public static IS_SHOW_PRICE_COLUMN = 'isShowPrice';
	public static IC_MARKER_URL_COLUMN = 'icMarkerUrl';
	public static MARKER_ROATION_COLUMN = 'markerRotation';
	public static COMPANY_ID_COLUMN = 'companyId';
	public static OBLIGE_END_POINT_COLUMN = 'obligeEndPoint';
	public static OBLIGE_FINISH_COLUMN = 'obligeFinishBook';
	public static CUST_TIME_FINISH_COLUMN = 'custTimerFinishBook';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${VehicleTypeDAO.TABLE} (
                ${VehicleTypeDAO.ID_COLUMN} INTEGER ,
                ${VehicleTypeDAO.NAME_VI_COLUMN} VARCHAR(50),
                ${VehicleTypeDAO.NAME_EN_COLUMN} VARCHAR(50),
                ${VehicleTypeDAO.SEAT_COLUMN} INTEGER,
                ${VehicleTypeDAO.ICON_CODE_COLUMN} VARCHAR(30),
                ${VehicleTypeDAO.ICON_RESC_COLUMN} INTEGER,
                ${VehicleTypeDAO.DESCRIPTION_COLUMN} VARCHAR(100),
                ${VehicleTypeDAO.TYPE_COLUMN} INTEGER,
                ${VehicleTypeDAO.ORDER_COLUMN} INTEGER,
                ${VehicleTypeDAO.LIST_CHILD_COLUMN} VARCHAR,
                ${VehicleTypeDAO.IS_SHOW_PRICE_COLUMN} BOOL,
                ${VehicleTypeDAO.IC_MARKER_URL_COLUMN} VARCHAR,
				${VehicleTypeDAO.MARKER_ROATION_COLUMN} INTEGER,
				${VehicleTypeDAO.COMPANY_ID_COLUMN} INTEGER,
				${VehicleTypeDAO.OBLIGE_END_POINT_COLUMN} INTEGER,
				${VehicleTypeDAO.OBLIGE_FINISH_COLUMN} INTEGER,
                ${VehicleTypeDAO.CUST_TIME_FINISH_COLUMN} INTEGER);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${VehicleTypeDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<VehicleType> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${VehicleTypeDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let vehicleType;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						vehicleType = new VehicleType();
						(vehicleType.vehicleId = row[VehicleTypeDAO.ID_COLUMN]),
							(vehicleType.nameVi = row[VehicleTypeDAO.NAME_VI_COLUMN]),
							(vehicleType.nameEn = row[VehicleTypeDAO.NAME_EN_COLUMN]),
							(vehicleType.seat = row[VehicleTypeDAO.SEAT_COLUMN]),
							(vehicleType.iconCode = row[VehicleTypeDAO.ICON_CODE_COLUMN]),
							(vehicleType.iconResc = row[VehicleTypeDAO.ICON_RESC_COLUMN]),
							(vehicleType.description = row[VehicleTypeDAO.DESCRIPTION_COLUMN]),
							(vehicleType.type = row[VehicleTypeDAO.TYPE_COLUMN]),
							(vehicleType.orders = row[VehicleTypeDAO.ORDER_COLUMN]),
							(vehicleType.listChild = row[VehicleTypeDAO.LIST_CHILD_COLUMN]),
							(vehicleType.isShowPrice = row[VehicleTypeDAO.IS_SHOW_PRICE_COLUMN]),
							(vehicleType.icMarkerUrl = row[VehicleTypeDAO.IC_MARKER_URL_COLUMN]),
							(vehicleType.markerRotation = row[VehicleTypeDAO.MARKER_ROATION_COLUMN]),
							(vehicleType.companyId = row[VehicleTypeDAO.COMPANY_ID_COLUMN]),
							(vehicleType.obligeEndPoint = row[VehicleTypeDAO.OBLIGE_END_POINT_COLUMN]),
							(vehicleType.obligeFinishBook = row[VehicleTypeDAO.OBLIGE_FINISH_COLUMN]);
						// (vehicleType.custTimerFinishBook = row[VehicleTypeDAO.CUST_TIME_FINISH_COLUMN]);
					}
					resolve(vehicleType);
				})
				.catch(() => {
					resolve(new VehicleType());
				});
		});
	};

	// Lấy tất cả dữ liệu đã lưu
	public static async getVehicles(): Promise<Array<VehicleType>> {
		try {
			var vehicles: Array<VehicleType> = new Array<VehicleType>();
			let sql = `SELECT * FROM ${this.TABLE}`;
			console.log(sql);
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			let vehicleType;
			for (let i = 0; i < resultSet.rows.length; i++) {
				vehicleType = new VehicleType();
				let row = resultSet.rows.item(i);
				(vehicleType.vehicleId = row[VehicleTypeDAO.ID_COLUMN]),
					(vehicleType.nameVi = row[VehicleTypeDAO.NAME_VI_COLUMN]),
					(vehicleType.nameEn = row[VehicleTypeDAO.NAME_EN_COLUMN]),
					(vehicleType.seat = row[VehicleTypeDAO.SEAT_COLUMN]),
					(vehicleType.iconCode = row[VehicleTypeDAO.ICON_CODE_COLUMN]),
					(vehicleType.iconResc = row[VehicleTypeDAO.ICON_RESC_COLUMN]),
					(vehicleType.description = row[VehicleTypeDAO.DESCRIPTION_COLUMN]),
					(vehicleType.type = row[VehicleTypeDAO.TYPE_COLUMN]),
					(vehicleType.orders = row[VehicleTypeDAO.ORDER_COLUMN]),
					(vehicleType.listChild = row[VehicleTypeDAO.LIST_CHILD_COLUMN]),
					(vehicleType.isShowPrice = row[VehicleTypeDAO.IS_SHOW_PRICE_COLUMN]),
					(vehicleType.icMarkerUrl = row[VehicleTypeDAO.IC_MARKER_URL_COLUMN]),
					(vehicleType.markerRotation = row[VehicleTypeDAO.MARKER_ROATION_COLUMN]),
					(vehicleType.companyId = row[VehicleTypeDAO.COMPANY_ID_COLUMN]),
					(vehicleType.obligeEndPoint = row[VehicleTypeDAO.OBLIGE_END_POINT_COLUMN]),
					(vehicleType.obligeFinishBook = row[VehicleTypeDAO.OBLIGE_FINISH_COLUMN]);
				// (vehicleType.custTimerFinishBook = row[VehicleTypeDAO.CUST_TIME_FINISH_COLUMN]);
				vehicles.push(vehicleType);
			}

			return Promise.resolve(vehicles);
		} catch (error) {
			return Promise.resolve([]);
		}
	}

	public static async getVehicleTypeByID(id: number): Promise<VehicleType> {
		try {
			var vehicle: VehicleType = new VehicleType();
			let sql = `SELECT * FROM ${this.TABLE} WHERE vehicleTypeId = ` + id;
			console.log(sql);
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			if (resultSet.rows.length > 0) {
				let row = resultSet.rows.item(0);
				vehicle.vehicleId = row[VehicleTypeDAO.ID_COLUMN];
				vehicle.nameVi = row[VehicleTypeDAO.NAME_VI_COLUMN];
				vehicle.nameEn = row[VehicleTypeDAO.NAME_EN_COLUMN];
				vehicle.seat = row[VehicleTypeDAO.SEAT_COLUMN];
				vehicle.iconCode = row[VehicleTypeDAO.ICON_CODE_COLUMN];
				vehicle.iconResc = row[VehicleTypeDAO.ICON_RESC_COLUMN];
				vehicle.description = row[VehicleTypeDAO.DESCRIPTION_COLUMN];
				vehicle.type = row[VehicleTypeDAO.TYPE_COLUMN];
				vehicle.orders = row[VehicleTypeDAO.ORDER_COLUMN];
				vehicle.listChild = row[VehicleTypeDAO.LIST_CHILD_COLUMN];
				vehicle.isShowPrice = row[VehicleTypeDAO.IS_SHOW_PRICE_COLUMN];
				vehicle.icMarkerUrl = row[VehicleTypeDAO.IC_MARKER_URL_COLUMN];
				vehicle.markerRotation = row[VehicleTypeDAO.MARKER_ROATION_COLUMN];
				vehicle.companyId = row[VehicleTypeDAO.COMPANY_ID_COLUMN];
				vehicle.obligeEndPoint = row[VehicleTypeDAO.OBLIGE_END_POINT_COLUMN];
				vehicle.obligeFinishBook = row[VehicleTypeDAO.OBLIGE_FINISH_COLUMN];
				vehicle.custTimerFinishBook = row[VehicleTypeDAO.CUST_TIME_FINISH_COLUMN];
			}
			return Promise.resolve(vehicle);

		} catch (error) {
			return Promise.resolve(error);
		}
	}

}

export default VehicleTypeDAO;