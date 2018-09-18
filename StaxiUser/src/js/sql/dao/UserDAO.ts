/**
 * Quản lý bảng user
 * @author ĐvHiện
 * Created on 05/06/2018
 */
import SQLiteUtils from '../../../module/sql/SQLiteUtils';
import User from '../bo/User';
import BaseDAO from '../../../module/sql/BaseDAO';
import { ContentValues } from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';

class UserDAO extends BaseDAO {

    public static TABLE = "UserTable";
    public static ID_COLUMN = "userId";
    public static PHONE_COLUMN = "phone";
    public static EMAIL_COLUMN = "email";
    public static NAME_COLUMN = "name";
    public static REF_ID_COLUMN = "refId";
    public static CLIENT_ID_COLUMN = "clientId";
    public static NA_CODE_COLUMN = "naCode";
    public static LIFTBANTIME_COLUMN = "lift_ban_time";
    public static PASSWORD_COLUMN = "password";
    public static REF_ID_TEMP_COLUMN = "ref_id_temp";
    public static IS_ACTIVE_COLUMN = "is_active";
    public static CREATE_DATE_COLUMN = "create_date";
    public static IS_CHECK_RULE_COLUMN = "is_check_rule";
    public static POFILE_IMAGE_LOCAL = "profile_image_local";
    public static UUID = "uuid";
    public static NEW_EMAIL_COLUMN = "new_email";
    public static NEW_NAME_COLUMN = "new_name";

    // Tạo bảng
    public static getQueryCreateTable(): string {
        return `CREATE TABLE IF NOT EXISTS ${this.TABLE} (
                ${UserDAO.ID_COLUMN} INTEGER PRIMARY KEY NOT NULL ,
                ${UserDAO.EMAIL_COLUMN} VARCHAR(50),
                ${UserDAO.NAME_COLUMN} VARCHAR(30),
                ${UserDAO.PHONE_COLUMN} VARCHAR(15) ,
                ${UserDAO.REF_ID_COLUMN} VARCHAR(30) ,
                ${UserDAO.CLIENT_ID_COLUMN} VARCHAR,
                ${UserDAO.NA_CODE_COLUMN} VARCHAR,
                ${UserDAO.LIFTBANTIME_COLUMN} INTEGER,
                ${UserDAO.PASSWORD_COLUMN} VARCHAR,
                ${UserDAO.REF_ID_TEMP_COLUMN} VARCHAR,
                ${UserDAO.IS_ACTIVE_COLUMN} INTEGER,
                ${UserDAO.IS_CHECK_RULE_COLUMN} INTEGER,
                ${UserDAO.CREATE_DATE_COLUMN} VARCHAR,
                ${UserDAO.UUID} VARCHAR,
                ${UserDAO.POFILE_IMAGE_LOCAL} NVARCHAR,
                ${UserDAO.NEW_EMAIL_COLUMN} VARCHAR(50),
                ${UserDAO.NEW_NAME_COLUMN} VARCHAR(30))`;
    }

    public static getQueryDropTable() {
        return `DROP TABLE IF EXISTS ${this.TABLE}`;
    }

    // Insert dữ liệu
    public static async insert(user: User): Promise<number> {

        let arr = [];

        //drop bang
        arr.push(this.getQueryDropTable());

        //tao bang
        arr.push(this.getQueryCreateTable());
        await SQLiteUtils.executeSqls(arr);

        let values = new ContentValues();
        values.set(this.ID_COLUMN, user.userId);
        values.set(this.PHONE_COLUMN, user.phone);
        values.set(this.EMAIL_COLUMN, user.email);
        values.set(this.NAME_COLUMN, user.name);
        values.set(this.REF_ID_COLUMN, user.refID);
        values.set(this.CLIENT_ID_COLUMN, user.clientId);
        values.set(this.NA_CODE_COLUMN, user.naCode);
        values.set(this.LIFTBANTIME_COLUMN, user.liftbanTime);
        values.set(this.PASSWORD_COLUMN, user.password);
        values.set(this.REF_ID_TEMP_COLUMN, user.refIDtemp);
        values.set(this.IS_ACTIVE_COLUMN, user.isActive);
        values.set(this.IS_CHECK_RULE_COLUMN, user.isCheckRule ? 1 : 0);
        values.set(this.CREATE_DATE_COLUMN, user.createDate);
        values.set(this.UUID, user.uuid);
        values.set(this.POFILE_IMAGE_LOCAL, '');
        values.set(this.NEW_EMAIL_COLUMN, user.email);
        values.set(this.NEW_NAME_COLUMN, user.name);
        return SQLiteUtils.insert(this.TABLE, values);
    }

    public static async updateInfoUser(password: string, name: string, email: string, avartar: string): Promise<any> {
        let values = new ContentValues();
        values.set(this.EMAIL_COLUMN, email);
        values.set(this.NAME_COLUMN, name);
        values.set(this.PASSWORD_COLUMN, password);
        values.set(this.POFILE_IMAGE_LOCAL, avartar);
        values.set(this.IS_ACTIVE_COLUMN, true);
        return SQLiteUtils.update(this.TABLE, values);
    }

    public static async updateInfoUserTemp(name: string, email: string, refCodeTemp:string): Promise<any> {
        let values = new ContentValues();
        values.set(this.EMAIL_COLUMN, email);
        values.set(this.NAME_COLUMN, name);
        values.set(this.REF_ID_TEMP_COLUMN, refCodeTemp);
        return SQLiteUtils.update(this.TABLE, values);
    }

    public static async updateProfileUser(email: string, name: string, imageUri: string): Promise<any> {
        let values = new ContentValues();
        values.set(this.NEW_EMAIL_COLUMN, email);
        values.set(this.NEW_NAME_COLUMN, name);
        values.set(this.POFILE_IMAGE_LOCAL, imageUri);
        return SQLiteUtils.update(this.TABLE, values);
    }

    public static async removeAcc(): Promise<any> {
        return SQLiteUtils.del(this.TABLE);
    }


    // Lấy tất cả dữ liệu đã lưu
    public static async getUser(): Promise<User> {
        try {
            let sql = `SELECT * FROM ${this.TABLE}`;
            console.log(sql);
            let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
            let user;
            if (resultSet.rows.length> 0) {
                let item = resultSet.rows.item(0);
                user = new User();
                user.userId = BaseDAO.getInt(item, UserDAO.ID_COLUMN);
                user.phone = BaseDAO.getString(item, UserDAO.PHONE_COLUMN);
                user.email = BaseDAO.getString(item, UserDAO.NEW_EMAIL_COLUMN);
                user.name = BaseDAO.getString(item, UserDAO.NEW_NAME_COLUMN);
                user.clientId = BaseDAO.getString(item, UserDAO.CLIENT_ID_COLUMN);
                user.naCode = BaseDAO.getString(item, UserDAO.NA_CODE_COLUMN);
                user.liftbanTime = BaseDAO.getInt(item, UserDAO.LIFTBANTIME_COLUMN);
                user.password = BaseDAO.getString(item, UserDAO.PASSWORD_COLUMN);
                user.refIDtemp = BaseDAO.getString(item, UserDAO.REF_ID_TEMP_COLUMN);
                user.isActive = BaseDAO.getBoolean(item, UserDAO.IS_ACTIVE_COLUMN);
                user.isCheckRule = BaseDAO.getBoolean(item, UserDAO.IS_CHECK_RULE_COLUMN);
                user.createDate = BaseDAO.getLong(item, UserDAO.CREATE_DATE_COLUMN);
                user.uuid = BaseDAO.getString(item, UserDAO.UUID);
                user.profileImageUri = BaseDAO.getString(item, UserDAO.POFILE_IMAGE_LOCAL);
            }else{
                user = new User();
            }
            return Promise.resolve(user);
        } catch (error) {
            return Promise.resolve(new User());
        }
    }
}

export default UserDAO;