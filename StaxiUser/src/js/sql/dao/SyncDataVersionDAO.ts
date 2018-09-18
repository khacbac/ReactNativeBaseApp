import SyncDataVersion from "../bo/SyncDataVersion";
import { SQLiteUtils, ContentValues } from "../../../module";
import { ResultSet } from "react-native-sqlite-storage";
import BaseDAO from "../../../module/sql/BaseDAO";

/**
 * Quản lý các verison đồng bộ của các bảng
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class SyncDataVersionDAO extends BaseDAO {
  public static TABLE = "SyncVersionTable";
  private static PARAMS: string = "PARAMS";

  public static getQueryCreateTable(): string {
    return `CREATE TABLE IF NOT EXISTS ${this.TABLE}(
			  ${this.PARAMS} VACHAR
		  )`;
  }

  public static getQueryDropTable(): string {
    return `DROP TABLE IF EXISTS ${this.TABLE}`;
  }

  /**
   * lấy thông tin version
   */
  public static async getVesionData(): Promise<SyncDataVersion> {
    try {
      let sql = `SELECT ${this.PARAMS} FROM ${this.TABLE}`;
      console.log(sql);
      let result = await SQLiteUtils.executeSql<ResultSet>(sql);
      let item = result.rows.item(0);
      let sycn = JSON.parse(BaseDAO.getString(item, this.PARAMS));
      return Promise.resolve(sycn);
    } catch (error) {
      return Promise.resolve(new SyncDataVersion());
    }
  }

  public static syncQuery(versionData: SyncDataVersion): string[] {
    //cập nhật dữ liệu
    let map = new ContentValues();
    map.set(this.PARAMS, JSON.stringify(versionData));
    return [
      this.getQueryDropTable(),
      this.getQueryCreateTable(),
      SQLiteUtils.createInsertClause(this.TABLE, map)
    ];
  }
}

export default SyncDataVersionDAO;
