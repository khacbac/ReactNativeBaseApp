import Landmark from "../bo/Landmark";
import { SQLiteUtils } from '../../../module';
import MapUtils from "../../../module/maps/MapUtils";
import { ResultSet } from "react-native-sqlite-storage";

/**
 * Quản lý bảng vùng hỗ trợ đặt xe
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class LandmarkDAO {
	public static TABLE = 'LandmarkTable';
	public static ID_COLUMN = 'landmarkId';
	public static POLYGONE_COLUMN = 'polygone';
	public static ADDRESS_SOURCE_COLUMN = 'addressSource';
	public static AVERAGE_COLUMN = 'averageSpeed';
	public static DISTANCE_MULTIPLIER_COLUMN = 'distanceMultiplier';
	public static ADDITION_TIME_COLUMN = 'additionTime';
	public static SUB_TYPE_COLUMN = 'subType';
	public static LANDMARK_JSON = 'landmarkJson';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${LandmarkDAO.TABLE} (
                ${LandmarkDAO.ID_COLUMN} INTEGER ,
                ${LandmarkDAO.POLYGONE_COLUMN} VARCHAR,
                ${LandmarkDAO.ADDRESS_SOURCE_COLUMN} INTEGER,
                ${LandmarkDAO.AVERAGE_COLUMN} INTEGER,
                ${LandmarkDAO.DISTANCE_MULTIPLIER_COLUMN} INTEGER,
				${LandmarkDAO.ADDITION_TIME_COLUMN} INTEGER,
				${LandmarkDAO.SUB_TYPE_COLUMN} INTEGER,
                ${LandmarkDAO.LANDMARK_JSON} VARCHAR);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${LandmarkDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<Landmark> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${LandmarkDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let landmark;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						landmark = new Landmark();
						(landmark.landmarkId = row[LandmarkDAO.ID_COLUMN]),
						(landmark.polygone = row[LandmarkDAO.POLYGONE_COLUMN]),
						(landmark.addressSource = row[LandmarkDAO.ADDRESS_SOURCE_COLUMN]),
						(landmark.averageSpeed = row[LandmarkDAO.AVERAGE_COLUMN]),
						(landmark.distanceMultiplier = row[LandmarkDAO.DISTANCE_MULTIPLIER_COLUMN]),
						(landmark.additionTime = row[LandmarkDAO.ADDITION_TIME_COLUMN]),
						(landmark.subType = row[LandmarkDAO.SUB_TYPE_COLUMN]),
						(landmark.landmarkJson = row[LandmarkDAO.LANDMARK_JSON]);
					}
					resolve(landmark);
				})
				.catch(() => {
					resolve(new Landmark());
				});
		});
	};

	// Lấy tất cả dữ liệu đã lưu
    public static async getLandmarks(): Promise<Array<Landmark>> {
        try {
			var landmarks: Array<Landmark> = new Array<Landmark>();
            let sql = `SELECT * FROM ${this.TABLE}`;
            console.log(sql);
            let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
            let landmark;
			for (let i = 0; i < resultSet.rows.length; i++) {
				landmark = new Landmark();
				let row = resultSet.rows.item(i);
				(landmark.landmarkId = row[LandmarkDAO.ID_COLUMN]),
				(landmark.polygone = row[LandmarkDAO.POLYGONE_COLUMN]),
				(landmark.addressSource = row[LandmarkDAO.ADDRESS_SOURCE_COLUMN]),
				(landmark.averageSpeed = row[LandmarkDAO.AVERAGE_COLUMN]),
				(landmark.distanceMultiplier = row[LandmarkDAO.DISTANCE_MULTIPLIER_COLUMN]),
				(landmark.additionTime = row[LandmarkDAO.ADDITION_TIME_COLUMN]),
				(landmark.subType = row[LandmarkDAO.SUB_TYPE_COLUMN]),
				(landmark.landmarkJson = row[LandmarkDAO.LANDMARK_JSON]);
				if(landmark.polygone != ""){
					landmark.coordinatePolys = MapUtils.decodePolyline(landmark.polygone);
				}
				landmarks.push(landmark);
			}
            return Promise.resolve(landmarks);
        } catch (error) {
            return Promise.resolve([]);
        }
    }
}

export default LandmarkDAO;