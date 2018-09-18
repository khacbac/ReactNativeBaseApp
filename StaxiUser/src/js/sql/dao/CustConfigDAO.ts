/**
 * Quản lý bảng cấu hình app khách hàng
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class CustConfigDAO {
	public static TABLE = 'ConfigCustTable';
	public static ID_COLUMN = 'configCustId';
	public static IS_ENABLE_GPS_COLUMN = 'isEnableGps';
	public static OBLIGE_END_POINT_COLUMN = 'obligeEndPoint';
	public static OBLIGE_FINISH_BOOK_COLUMN = 'obligeFinishBook';
	public static CUST_TIME_FINISH_BOOK_COLUMN = 'custTimerFinishBook';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${CustConfigDAO.TABLE} (
				${CustConfigDAO.ID_COLUMN} INTEGER ,
				${CustConfigDAO.IS_ENABLE_GPS_COLUMN} BOOL ,
                ${CustConfigDAO.OBLIGE_END_POINT_COLUMN} INTEGER,
                ${CustConfigDAO.OBLIGE_FINISH_BOOK_COLUMN} INTEGER,
                ${CustConfigDAO.CUST_TIME_FINISH_BOOK_COLUMN} INTEGER);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${this.TABLE}`;
	}
}

export default CustConfigDAO;