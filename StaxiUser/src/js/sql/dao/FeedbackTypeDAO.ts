import FeedbackType from '../bo/FeedbackType';
import { SQLiteUtils } from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';

/**
 * Quản lý bảng danh sách phản hồi
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class FeedbackTypeDAO {
	public static TABLE = 'FeedbackTypeTable';
	public static ID_COLUMN = 'feedbackTypeId';
	public static NAME_VI_COLUMN = 'nameVI';
    public static NAME_EN_COLUMN = 'nameEN';
	public static ORDER_COLUMN = 'orders';
	public static FEEDBACK_JSON_COLUMN = 'feesbackJson';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${FeedbackTypeDAO.TABLE} (
                ${FeedbackTypeDAO.ID_COLUMN} INTEGER ,
                ${FeedbackTypeDAO.NAME_VI_COLUMN} VARCHAR(100),
                ${FeedbackTypeDAO.NAME_EN_COLUMN} VARCHAR(100),
                ${FeedbackTypeDAO.ORDER_COLUMN} INTEGER,
                ${FeedbackTypeDAO.FEEDBACK_JSON_COLUMN} VARCHAR);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${FeedbackTypeDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<FeedbackType> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${FeedbackTypeDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let feedbackType;
					for (let i = 0; i < resultSet.rows.length; i++) {
						feedbackType = new FeedbackType();
						let row = resultSet.rows.item(i);
						(feedbackType.feedbackTypeId = row[FeedbackTypeDAO.ID_COLUMN]),
						(feedbackType.nameVI = row[FeedbackTypeDAO.NAME_VI_COLUMN]),
						(feedbackType.nameEN = row[FeedbackTypeDAO.NAME_EN_COLUMN]),
						(feedbackType.order = row[FeedbackTypeDAO.ORDER_COLUMN]),
						(feedbackType.feesbackJson = row[FeedbackTypeDAO.FEEDBACK_JSON_COLUMN]);
					}
					resolve(feedbackType);
				})
				.catch(() => {
					resolve(new FeedbackType());
				});
		});
	};
}

export default FeedbackTypeDAO;