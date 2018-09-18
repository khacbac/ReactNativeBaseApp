import Route from '../bo/Route';
import {SQLiteUtils} from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';

/**
 * Quản lý bảng tuyến xe
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class RouteDAO {
	public static TABLE = 'RouteTable';
	public static ID_COLUMN = 'routeId';
	public static CODE_COLUMN = 'routeCode';
	public static NAME_VI_COLUMN = 'routeNameVi';
	public static NAME_EN_COLUMN = 'routeNameEn';
	public static LANDMARK_ID_COLUMN = 'landmarkId';
	public static ORDER_COLUMN = 'routeOrder';
	public static COMPANY_ID_COLUMN = 'companyId';
	public static ROUTE_TYPE_COLUMN = 'routeType';
	public static ACTIVE_STATE_COLUMN = 'isActive';
	public static DISTANCE_INVITE_COLUMN = 'distanceInviteUser';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${RouteDAO.TABLE} (
                ${RouteDAO.ID_COLUMN} INTEGER ,
                ${RouteDAO.CODE_COLUMN} VARCHAR(50),
                ${RouteDAO.NAME_VI_COLUMN} VARCHAR(50),
                ${RouteDAO.NAME_EN_COLUMN} VARCHAR(50),
                ${RouteDAO.LANDMARK_ID_COLUMN} INTEGER,
                ${RouteDAO.ORDER_COLUMN} INTEGER,
                ${RouteDAO.COMPANY_ID_COLUMN} INTEGER,
                ${RouteDAO.ROUTE_TYPE_COLUMN} INTEGER,
                ${RouteDAO.ACTIVE_STATE_COLUMN} INTEGER,
                ${RouteDAO.DISTANCE_INVITE_COLUMN} INTEGER);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${RouteDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<Route> => {
		return new Promise((resolve, reject) => {

			const sqlInsert = `SELECT * FROM ${RouteDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let route:Route;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						route = new Route();
						(route.routeId = row[RouteDAO.ID_COLUMN]),
						(route.routeCode = row[RouteDAO.CODE_COLUMN]),
						(route.routeNameVi = row[RouteDAO.NAME_VI_COLUMN]),
						(route.routeNameEn = row[RouteDAO.NAME_EN_COLUMN]),
						(route.landmarkId = row[RouteDAO.LANDMARK_ID_COLUMN]),
						(route.routeOrder = row[RouteDAO.ORDER_COLUMN]),
						(route.companyId = row[RouteDAO.COMPANY_ID_COLUMN])
						(route.routeType = row[RouteDAO.ROUTE_TYPE_COLUMN]),
						(route.isActive = row[RouteDAO.ACTIVE_STATE_COLUMN])
						(route.distanceInviteUser = row[RouteDAO.DISTANCE_INVITE_COLUMN])
					}
					resolve(route);
				})
				.catch(() => {
					resolve(new Route());
				})
		});
	}

	// Lấy tất cả dữ liệu đã lưu
    public static async getRoutes(): Promise<Array<Route>> {
        try {
			var routes: Array<Route> = new Array<Route>();
            let sql = `SELECT * FROM ${RouteDAO.TABLE}`;
            console.log(sql);
            let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
            let route;
			for (let i = 0; i < resultSet.rows.length; i++) {
				route = new Route();
				let row = resultSet.rows.item(i);
				(route.routeId = row[RouteDAO.ID_COLUMN]),
				(route.routeCode = row[RouteDAO.CODE_COLUMN]),
				(route.routeNameVi = row[RouteDAO.NAME_VI_COLUMN]),
				(route.routeNameEn = row[RouteDAO.NAME_EN_COLUMN]),
				(route.landmarkId = row[RouteDAO.LANDMARK_ID_COLUMN]),
				(route.routeOrder = row[RouteDAO.ORDER_COLUMN]),
				(route.companyId = row[RouteDAO.COMPANY_ID_COLUMN]),
				(route.routeType = row[RouteDAO.ROUTE_TYPE_COLUMN]),
				(route.isActive = row[RouteDAO.ACTIVE_STATE_COLUMN]);
				//(route.distanceInviteUser = row[RouteDAO.DISTANCE_INVITE_COLUMN])
				routes.push(route);
			}
            return Promise.resolve(routes);
        } catch (error) {
            return Promise.resolve([]);
        }
    }

	// Lấy tuyến theo id
    public static async getRouteByID(routeID: number): Promise<Route> {
        try {
            let sql = `SELECT * FROM ${RouteDAO.TABLE} WHERE ${RouteDAO.ID_COLUMN} = ${routeID}`;
            console.log(sql);
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			
            let route: Route;
			for (let i = 0; i < resultSet.rows.length; i++) {
				route = new Route();
				let row = resultSet.rows.item(i);
				(route.routeId = row[RouteDAO.ID_COLUMN]),
				(route.routeCode = row[RouteDAO.CODE_COLUMN]),
				(route.routeNameVi = row[RouteDAO.NAME_VI_COLUMN]),
				(route.routeNameEn = row[RouteDAO.NAME_EN_COLUMN]),
				(route.landmarkId = row[RouteDAO.LANDMARK_ID_COLUMN]),
				(route.routeOrder = row[RouteDAO.ORDER_COLUMN]),
				(route.companyId = row[RouteDAO.COMPANY_ID_COLUMN]),
				(route.routeType = row[RouteDAO.ROUTE_TYPE_COLUMN]),
				(route.isActive = row[RouteDAO.ACTIVE_STATE_COLUMN]);
				//(route.distanceInviteUser = row[RouteDAO.DISTANCE_INVITE_COLUMN])

				break;
			}
            return Promise.resolve(route);
        } catch (error) {
            return Promise.resolve(null);
        }
	}
	
	/**
	 * Lấy tuyến mặc định theo landmark id Tuyến mặc định của vùng là tuyến có
	 * route_landmarkID = landmarkID truyền vào và route id là nhỏ nhất trong
	 * danh sách tìm được
	 * 
	 * @param landmarkID
	 *            ID vùng muốn tìm tuyến mặc định
	 * @return: Tuyến mặc định
	 */
    public static async getRouteDefaultByLandmarkID(landmarkID: number): Promise<Route> {
        try {
            let sql = `SELECT * FROM ${RouteDAO.TABLE} WHERE ${RouteDAO.LANDMARK_ID_COLUMN} = ${landmarkID} ORDER BY ${RouteDAO.ID_COLUMN} ASC`;
            console.log(sql);
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			
            let route: Route;
			for (let i = 0; i < resultSet.rows.length; i++) {
				route = new Route();
				let row = resultSet.rows.item(i);
				(route.routeId = row[RouteDAO.ID_COLUMN]),
				(route.routeCode = row[RouteDAO.CODE_COLUMN]),
				(route.routeNameVi = row[RouteDAO.NAME_VI_COLUMN]),
				(route.routeNameEn = row[RouteDAO.NAME_EN_COLUMN]),
				(route.landmarkId = row[RouteDAO.LANDMARK_ID_COLUMN]),
				(route.routeOrder = row[RouteDAO.ORDER_COLUMN]),
				(route.companyId = row[RouteDAO.COMPANY_ID_COLUMN]),
				(route.routeType = row[RouteDAO.ROUTE_TYPE_COLUMN]),
				(route.isActive = row[RouteDAO.ACTIVE_STATE_COLUMN]);
				//(route.distanceInviteUser = row[RouteDAO.DISTANCE_INVITE_COLUMN])

				break;
			}
            return Promise.resolve(route);
        } catch (error) {
            return Promise.resolve(null);
        }
    }
}

export default RouteDAO;