/**
 * Lớp xử lý truy xuất dữ liệu với database
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:24:41
 * @modify date 2018-07-10 08:24:41
 * @desc [description]
 */

import {
  openDatabase,
  Transaction,
  ResultSet,
  SQLError,
  SQLiteDatabase,
  DEBUG,
  enablePromise,
  deleteDatabase,
  DatabaseParams
} from "react-native-sqlite-storage";
import ContentValues from "./ContentValues";
import LogFile from "../LogFile";

enum QueryType {
  SELECT,
  INSERT,
  DELETE,
  UPDATE
}

class SQLiteUtils {
  public static DATABASE_NAME = "react-taxi.db";
  public static DATABASE_VERSION = "1.0";
  public static LOCATION = "default";
  public static DATABASE_SIZE = 200000;

  public static databaseParam(): DatabaseParams {
    return { name: this.DATABASE_NAME, location: "default" };
  }

  public static setDeveloper(value: boolean) {
    DEBUG(false);
  }

  /**
   * Lớp xử lý kết nối database và thực hiện các query dữ liệu
   */
  // class SQLiteHelper {
  public static database(callback: {
    (argument: SQLiteDatabase, error?: SQLError);
  }) {
    this.setDeveloper(true);
    let database = openDatabase(
      this.databaseParam(),
      () => {
        console.log("connect DB is ok");
        callback(database);
      },
      err => {
        console.log(`connect DB is failed: ${err}`);
        callback(database, err);
      }
    );
  }

  /**
   * mở database sử dụng promise
   * @param callback
   */
  public static open(): Promise<SQLiteDatabase> {
    this.setDeveloper(true);
    enablePromise(true);
    return openDatabase({ name: this.DATABASE_NAME, location: "default" });
  }

  /**
   * thực hiện danh sách câu lệnh
   * @param sqlStatement: danh sách các query và trả về thành công hay thất bại
   * @param queryType: chỉ áp dụng khi query 1 lệnh
   */
  public static async executeSqls(
    sqlStatement: string[],
    queryType?: QueryType
  ) {
    // console.log("SQLiteUtils start Query: " + sqlStatement);

    // console.log("executeSqls start length = " + sqlStatement.length);

    //trường hợp mảng rỗng thì bỏ qua
    if (!sqlStatement) {
      return Promise.reject(
        new Error("Chuỗi Query không đúng format: " + sqlStatement)
      );
    }

    //nếu 1 câu lệnh thì thực hiện hàm 1 câu lệnh
    if (sqlStatement.length === 1) {
      return this.executeSql(sqlStatement[0], queryType);
    }

    try {
      this.setDeveloper(true);
      enablePromise(true);

      //mở database
      let db = await openDatabase(this.databaseParam());

      return new Promise((resolve, reject) => {
        db.transaction((tx: Transaction) => {
          //thực hiện tất cả các câu lệnh ở đây
          let length = sqlStatement.length;
          let promisses = [];
          for (let i = 0; i < length; i++) {
            // console.log(sqlStatement[i]);
            promisses.push(tx.executeSql(sqlStatement[i]));
          }

          //xử lý tất cả các promiss
          Promise.all(promisses)
            .then(ret => {
              resolve(ret);
            })
            .catch(err => {
              // console.log("SqliteUtils.transaction - thực hiện lỗi:");
              reject(err.message || err);
            });

          // console.log("transaction end ------------------------");
        }).catch(err => {
          reject(
            new Error(
              "database.transaction - Kết quả trả về lỗi: " +
                (err.message || err)
            )
          );
        });
      });
    } catch (err) {
      // console.log("SqliteUtils.transaction - ", err);
      return Promise.reject(
        new Error(
          "database Open - Lỗi khi query dữ liệu từ database" +
            (err.message || err)
        )
      );
    }
  }

  /**
   * Thực hiện query database. chỉ áp dụng cho 1 lệnh
   * nếu nhiều lệnh cách nhau ";" thì cũng chỉ trả về lệnh đầu tiên
   * @param sqlStatement
   * @param queryType
   */
  public static async executeSql<T>(
    sqlStatement: string,
    queryType?: QueryType
  ): Promise<any> {

    let db: SQLiteDatabase;
    let response;
    let error;
    try {
      this.setDeveloper(true);
      enablePromise(true);

      //mở database
      db = await openDatabase(this.databaseParam());

      //đợi kết quả
      let result = await db.executeSql(sqlStatement);

      console.log("sqlStatement", sqlStatement);

      //trả về lỗi
      if (result == undefined || result == null) {
        throw new Error(
          "Kết quả trả về lỗi: result == undefined || result == null"
        );
      }

      //kiểm tra kết quả đầu tiên trong mảng
      let ret: ResultSet = result[0];
      if (ret == undefined || ret == null) {
        throw new Error(
          "Kết quả trả về lỗi: result[0] == undefined || result[0] == null"
        );
      }

      //gán lại giá trị
      switch (queryType) {
        case QueryType.INSERT:
          LogFile.e("executeSql INSERT", JSON.stringify(ret));
          response = ret.insertId || -1;
          break;
        case QueryType.UPDATE:
          LogFile.e("executeSql UPDATE", JSON.stringify(ret));
          response = ret.rowsAffected || -1;
          break;
        default:
          response = ret;
          break;
      }
    } catch (err) {
      error = err;
    } finally {
      //đóng database
      // await this.close(db);
    }

     //xử lý kết quả trả về
    return new Promise((resolve, reject) => {
      // console.log("SqliteUtils.executeSql - ", response, error);

      if (response != undefined) {
        resolve(response);
      } else {
        
        reject(new Error("SqliteUtils.executeSql " + (error.message || error)));
      }
    });
  }

  private static async executeError(db, error) {
    //đóng database
    await this.close(db);

    return Promise.reject(new Error(error));
  }

  /**
   * close database
   * @param db
   */
  public static async close(db:SQLiteDatabase) {
    if (db) {
      console.log("Closing database ...");
      try {
        await db.close();
        console.log("Database CLOSED");
      } catch (error) {
        console.log("Database CLOSE Error: " + (error.message || error));
      }
    } else {
      console.log("Database was not OPENED");
    }
  }

  public static deletedb() {
    deleteDatabase(this.databaseParam())
      .then(() => {
        console.log("Database DELETED");
      })
      .catch(error => {
        console.log("Database CLOSE Error: " + (error.message || error));
      });
  }

  /**
   * xóa có điều kiện
   * @param tableName
   * @param where
   */
  public static async del(tableName: string, where?: string) {
    // console.log("SqliteHelper deleteWhere------------: ");
    let sqlStatement = `DELETE FROM ${tableName}`;

    //thêm điều kiện
    if (where) sqlStatement = sqlStatement + ` WHERE ${where}`;

    //thực hiện query
    let ret = await this.executeSql(sqlStatement);

    return ret;
  }

  /**
   * xóa bảng
   * @param tableName
   * @param where
   */
  public static dropTable(tableName: string) {
    return this.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
  }

  /**
   * chèn dữ liệu vào database
   * @param object
   */
  public static insert(
    tableName: string,
    maps: ContentValues,
    whereClause?: string
  ): Promise<number> {
    let sqlStatement = this.createInsertClause(tableName, maps, whereClause);
    // console.log(`sql_insert_user: ${sqlStatement}`)
    //thực hiện querry
    return this.executeSql(sqlStatement, QueryType.INSERT);
  }

  /**
   * tạo các query để insert
   * @param tableName
   * @param contentValues
   * @param whereClause
   */
  public static createInsertClause(
    tableName: string,
    contentValues: ContentValues,
    whereClause?: string
  ): string {
    let column = "";
    let values = "";
    let isFirst = true;
    contentValues.map().forEach((value, key) => {
      let comma = isFirst ? "" : ",";
      column += comma + key;
      values += comma + value;
      isFirst = false;
    });

    let sqlStatement = `INSERT INTO ${tableName} (${column}) VALUES (${values})`;
    // console.log("SqliteHelper sqlStatement ----------: " + sqlStatement);
    if (whereClause) sqlStatement += ` WHERE ${whereClause}`;

    return sqlStatement;
  }

  /**
   * query update
   * @param tableName
   * @param contentValues
   * @param whereClause
   */
  public static createUpdateClause(
    tableName: string,
    contentValues: ContentValues,
    whereClause?: string
  ): string {
    let column = "";
    let isFirst = true;
    contentValues.map().forEach((value, key, map) => {
      column += (isFirst ? "" : ",") + key + " = " + value;
      isFirst = false;
    });
    let sqlStatement = `UPDATE ${tableName} SET ${column}`;
    //thêm điệu kiện
    if (whereClause) sqlStatement += ` WHERE ${whereClause}`;

    return sqlStatement;
  }

  /**
   * cập nhật dữ liệu vào bảng
   * @param tableName
   * @param maps
   * @param whereClause
   */
  public static update(
    tableName: string,
    maps: ContentValues,
    whereClause?: string
  ) {
    // console.log("SqliteHelper update ----------: ");

    let sqlStatement = this.createUpdateClause(tableName, maps, whereClause);
    return this.executeSql(sqlStatement, QueryType.UPDATE);
  }
}
export default SQLiteUtils;
