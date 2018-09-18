import { SQLiteUtils } from "../../module";
import BookedHistoryDAO from "./dao/BookedHistoryDAO";
import AddressHistoryDAO from "./dao/AddressHistoryDAO";
import UserDAO from "./dao/UserDAO";
import SyncDataVersionDAO from "./dao/SyncDataVersionDAO";
import HistoryJsonDAO from "./dao/HistoryOnlineDAO";

export default class SqliteHelper {
  /**
   * kiểm tra để tạo database và cập nhật các field trong database
   */
  public static async migrateData(): Promise<boolean> {
    try {
      // let isExistDatabase = await NativeAppModule.isExistedDatabase(
      //   SQLiteUtils.DATABASE_NAME
      // );

      // console.log(`${SQLiteUtils.DATABASE_NAME} đã tồn tại ${isExistDatabase}`);
      // Alert.alert("SQLiteUtils.DATABASE_NAME:" + isExistDatabase);
      // isExistDatabase = true;
      //nếu database chưa tồn tại thì tạo bảng
      // if (!isExistDatabase) {
        let arr = [];
        arr.push(BookedHistoryDAO.getQueryCreateTable());
        arr.push(AddressHistoryDAO.getQueryCreateTable());
        arr.push(UserDAO.getQueryCreateTable());
        arr.push(HistoryJsonDAO.getQueryCreateJsonTable());
        arr.push(SyncDataVersionDAO.getQueryCreateTable());

        // Alert.alert(JSON.stringify(arr));
        let ret = await SQLiteUtils.executeSqls(arr);

        // Alert.alert("Tạo bản thành công: " + JSON.stringify(ret));
      // }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(false);
    }
  }
}
