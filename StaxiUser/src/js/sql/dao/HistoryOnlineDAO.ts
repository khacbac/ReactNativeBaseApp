/**
 * Quản lý bảng user
 * @author ChungBui
 * Created on 03/07/2018
 */
import SQLiteUtils from '../../../module/sql/SQLiteUtils';
import BaseDAO from '../../../module/sql/BaseDAO';
import { ContentValues } from '../../../module';
import History from '../bo/History';
import { ResultSet } from 'react-native-sqlite-storage';

class HistoryJsonDAO extends BaseDAO {

    public static TABLE_JSON = "HistoryTableByJson";
    public static COLUMN_BOOKING_CODE = "bookingCode";
    public static COLUMN_IS_DELETED = "isDeleted";
    public static COLUMN_JSON_CONTENT = "jsonContent";



    public static getQueryCreateJsonTable(): string {
        return `CREATE TABLE IF NOT EXISTS ${this.TABLE_JSON} (
            ${this.COLUMN_BOOKING_CODE} VARCHAR(50) PRIMARY KEY NOT NULL ,
            ${this.COLUMN_JSON_CONTENT} TEXT,
            ${this.COLUMN_IS_DELETED} INTEGER );`;
    }


    public static getQueryDropJsonTable() {
        return `DROP TABLE IF EXISTS ${this.TABLE_JSON}`;
    }



    public static async deleteJsonTable() {
        await SQLiteUtils.executeSql(this.getQueryDropJsonTable());
    }

    /** Xoá các bản ghi có delete = true */

    public static async deleteWhereDeleteTrue(){
        return true;
    }

    //cập nhật trạng thái cho các item người dùng xoá
    public static async updateDeleteItem(idDeleted: string): Promise<{}> {
        let values = new ContentValues();
        // let jsonContent = JSON.stringify(history);
        values.set(this.COLUMN_IS_DELETED, true);
        let sql = SQLiteUtils.createUpdateClause(this.TABLE_JSON, values, `${this.COLUMN_BOOKING_CODE} = '${idDeleted}'`);
        // console.log("querry delete item ", arrQueries);
        return SQLiteUtils.executeSql(sql)
    }

    // Insert dữ liệu
    public static async insertToJsonTable(histories: Array<History>, localList : Array<History>): Promise<{}> {

        let arrQueries = [];

        // Tạo bộ lọc cho những cuốc có ID trùng nhau
        // do trường hợp lái xe huỷ cuốc và khách hàng đặt lại cuốc khác 
        let filterDic = {}
        let filtedArray = []

        histories.forEach(history => {
            
            if (filterDic[history.bookCode] == undefined) {
                filterDic[history.bookCode] = history;
            } else {
                let previosHistory = filterDic[history.bookCode]
                if (previosHistory.bookTime < history.bookTime) {
                    filterDic[history.bookCode] = history;
                }
            }
        });

        for (var key in filterDic) {
            // check if the property/key is defined in the object itself, not in parent
            if (filterDic.hasOwnProperty(key)) {           
                filtedArray.push(filterDic[key]);
            }
        }
        // console.log("filted array ", filtedArray)
        filtedArray.forEach(history => {
            let values = new ContentValues();

            let jsonContent = JSON.stringify(history);

            values.set(this.COLUMN_BOOKING_CODE, history.bookCode)
            values.set(this.COLUMN_JSON_CONTENT, jsonContent);
            values.set(this.COLUMN_IS_DELETED, false);


            // console.log("history sync ", histories);
            // console.log("local history ", localList);
            //lấy ra các bản ghi cũ để so sánh
            // this.getAllListHistory()
            // .then((list)=>{
                var listID = localList.map(item => item.bookCode)
                if (listID.indexOf(history.bookCode) >= 0) {

                    arrQueries.push(SQLiteUtils.createUpdateClause(this.TABLE_JSON, values, `${this.COLUMN_BOOKING_CODE} = '${history.bookCode}'`));
                } else {
    
                    arrQueries.push(SQLiteUtils.createInsertClause(this.TABLE_JSON, values));
                }
            // })
            // .catch((err) =>console.log("insertToJsonTable", err))

        });
        
        return SQLiteUtils.executeSqls(arrQueries)
    }

    public static getDisableHistoriesByJson():Promise<History[]> {
        return new Promise((resolve, reject)=>{
            const sqlInsert = `SELECT * FROM ${this.TABLE_JSON} WHERE ${this.COLUMN_IS_DELETED} = 1 `;
            SQLiteUtils.executeSql(sqlInsert)
                .then((resultSet: ResultSet) => {
                    if (!resultSet.rows.length) {
                        resolve([]);
                        return;
                    }

                    var list = new Array<History>();
                    for (let index = 0; index < resultSet.rows.length; index++) {
                        const item = resultSet.rows.item(index);

                        let jsonContent = BaseDAO.getString(item, this.COLUMN_JSON_CONTENT);

                        let historyJson = JSON.parse(jsonContent)
                        let history = History.convertFrom(historyJson)
                        list.push(history)
                    }
                    list.sort((a, b) => (b.bookTime - a.bookTime))
                    // console.log("get available history by json ", list);
                    resolve(list)
                })
                .catch((err) => reject(err))
        })
    }

    public static getAllListHistory (): Promise<History[]> {
        return new Promise((resolve, reject) => {
            const sqlInsert = `SELECT * FROM ${this.TABLE_JSON}`;
            SQLiteUtils.executeSql(sqlInsert)
                .then((resultSet: ResultSet) => {
                    if (!resultSet.rows.length) {
                        resolve([]);
                        return;
                    }

                    var list = new Array<History>();
                    for (let index = 0; index < resultSet.rows.length; index++) {
                        const item = resultSet.rows.item(index);

                        let jsonContent = BaseDAO.getString(item, this.COLUMN_JSON_CONTENT);

                        let historyJson = JSON.parse(jsonContent)
                        let history = History.convertFrom(historyJson)
                        list.push(history)
                    }
                    list.sort((a, b) => (b.bookTime - a.bookTime))
                    resolve(list)
                })
                .catch((err) => reject(err))
        });
    }

    public static getAvailableHistoriesByJson(): Promise<History[]> {
        return new Promise((resolve, reject) => {
            const sqlInsert = `SELECT * FROM ${this.TABLE_JSON} WHERE ${this.COLUMN_IS_DELETED} = 0 `;
            SQLiteUtils.executeSql(sqlInsert)
                .then((resultSet: ResultSet) => {
                    if (!resultSet.rows.length) {
                        resolve([]);
                        return;
                    }

                    var list = new Array<History>();
                    for (let index = 0; index < resultSet.rows.length; index++) {
                        const item = resultSet.rows.item(index);

                        let jsonContent = BaseDAO.getString(item, this.COLUMN_JSON_CONTENT);

                        let historyJson = JSON.parse(jsonContent)
                        let history = History.convertFrom(historyJson)
                        list.push(history)
                    }
                    list.sort((a, b) => (b.bookTime - a.bookTime))
                    // console.log("get available history by json ", list);
                    resolve(list)
                })
                .catch((err) => reject(err))
        });
    }
}

export default HistoryJsonDAO;