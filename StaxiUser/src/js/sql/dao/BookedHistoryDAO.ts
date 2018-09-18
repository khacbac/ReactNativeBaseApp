/**
 * Quản lý bảng user
 * @author ChungBui
 * Created on 03/07/2018
 */
import SQLiteUtils from "../../../module/sql/SQLiteUtils";
import BaseDAO from "../../../module/sql/BaseDAO";
import { ContentValues, Cursor, Utils, DefinedBuffer } from "../../../module";
import { ResultSet } from "react-native-sqlite-storage";
import BookedHistory from "../bo/BookedHistory";
import CompanyDAO from "./CompanyDAO";
import VehicleTypeDAO from "./VehicleTypeDAO";
import BAAddress from "../../model/BAAddress";
import BookedStep from "../../constant/BookedStep";
import Company from "../bo/Company";
import VehicleType from "../bo/VehicleType";
import VehicleInfo from "../../model/VehicleInfo";
import DriverInfo from "../../model/DriverInfo";
import SqliteHelper from "../SqliteHelper";
import LogFile from "../../../module/LogFile";

class BookedHistoryDAO extends BaseDAO {
  public static TABLE = "BookedHistory";
  private static ID = "BookedHistoryID";
  private static COMPANY_ID = "CompanyID";
  private static COMPANY_ID_TEMP = "CompanyIDTemp";
  private static TAXI_TYPE_ID = "TaxiTypeID";
  private static CATCHED_TIME = "CatchedTime";
  private static COUNT_CAR = "CountCar";
  private static SRC_LOCATION = "SrcLocation";
  private static SRC_LOCATION_NAME = "SrcLocationName";
  private static SRC_ADDRESS = "SrcAddress";
  private static DST_LOCATION = "DstLocation";
  private static DST_LOCATION_NAME = "DstLocationName";
  private static DST_ADDRESS = "DstAddress";
  private static PROMOTION = "Promotion";
  private static COMMENT = "Comment";
  private static STATE = "State";
  private static BOOKED_CODE = "BookedCode";
  private static SCHEDULE = "IsSchedule";
  private static VEHICLE_NO = "VehicleNo";
  private static VEHICLE_PLATE = "VehiclePlate";
  private static DRIVER_CODE = "DriverCode";
  private static DRIVER_NAME = "DriverName";
  private static DRIVER_PHONE = "DriverPhone";
  private static DRIVER_RATING = "DriverRating";
  private static DRIVER_AVATAR = "DriverAvatar";
  private static UPDATE_DATE = "UpdateDate";
  private static UPDATE_ESTIMATES = "EstimatesPrice";
  private static SHARE_BOOKING = "ShareBooking";
  private static IS_CATCHER_CAR = "IsCatcherCar";

  public static getQueryCreateTable(): string {
    return `CREATE TABLE IF NOT EXISTS ${this.TABLE} (
            ${this.ID} INTEGER PRIMARY KEY NOT NULL, 
            ${this.COMPANY_ID} INTEGER ,
            ${this.COMPANY_ID_TEMP} INTEGER, 
            ${this.TAXI_TYPE_ID} INTEGER, 
            ${this.CATCHED_TIME} INTEGER, 
            ${this.COUNT_CAR} INTEGER, 
            ${this.SRC_LOCATION} VARCHAR(50),
            ${this.SRC_LOCATION_NAME} VARCHAR,
            ${this.SRC_ADDRESS} VARCHAR,
            ${this.DST_LOCATION} VARCHAR(50),
            ${this.DST_LOCATION_NAME} VARCHAR,
            ${this.DST_ADDRESS} VARCHAR,
            ${this.PROMOTION} VARCHAR(30),
            ${this.COMMENT} VARCHAR,
            ${this.STATE} INTEGER, 
            ${this.BOOKED_CODE} VARCHAR(50),
            ${this.SCHEDULE} BOOL,
            ${this.VEHICLE_NO} VARCHAR(30),
            ${this.VEHICLE_PLATE} VARCHAR(30),
            ${this.DRIVER_CODE} VARCHAR(30),
            ${this.DRIVER_NAME} VARCHAR(30),
            ${this.DRIVER_PHONE} VARCHAR(30),
            ${this.DRIVER_RATING} FLOAT,
            ${this.DRIVER_AVATAR} VARCHAR,
            ${this.UPDATE_DATE} INTEGER, 
            ${this.UPDATE_ESTIMATES} VARCHAR, 
            ${this.SHARE_BOOKING} BOOL, 
            ${this.IS_CATCHER_CAR} BOOL)`;
  }

  public static getQueryDropTable() {
    return `DROP TABLE IF EXISTS ${this.TABLE}`;
  }

  /* Lưu thông tin cuốc đặt vào database, trả về id đã lưu */
  public static insertBookedVehicle(history: BookedHistory): Promise<number> {
    // map dữ liệu cho các cột
    let values = new ContentValues();

    values.put(this.COMPANY_ID, history.company.companyKey);
    values.put(this.COMPANY_ID_TEMP, history.company.companyKey);
    values.put(this.TAXI_TYPE_ID, history.taxiType.vehicleId);
    values.put(this.CATCHED_TIME, history.catchedTime);
    values.put(this.COUNT_CAR, history.countCar);

    // chèn địa chỉ đón
    values.put(
      this.SRC_LOCATION,
      BaseDAO.convertLocation2String(history.srcAddress.location)
    );
    values.put(this.SRC_LOCATION_NAME, history.srcAddress.name);
    values.put(this.SRC_ADDRESS, history.srcAddress.formattedAddress);

    // chèn địa chỉ đến
    if (history.dstAddress != null) {
      values.put(
        this.DST_LOCATION,
        BaseDAO.convertLocation2String(history.dstAddress.location)
      );
      values.put(this.DST_LOCATION_NAME, history.dstAddress.name);
      values.put(this.DST_ADDRESS, history.dstAddress.formattedAddress);
    }

    values.put(this.PROMOTION, history.promotion);
    values.put(this.COMMENT, history.comment);
    values.put(this.STATE, history.state);
    values.put(this.BOOKED_CODE, history.bookCode);
    values.put(this.SCHEDULE, history.isSchedule);
    values.put(this.UPDATE_DATE, history.updateDate);
    values.put(this.UPDATE_ESTIMATES, history.estimates);
    values.put(this.SHARE_BOOKING, history.isShareBooking);
    values.put(this.IS_CATCHER_CAR, history.isCatcherCar);

    return SQLiteUtils.insert(this.TABLE, values);
  }

  private static whereClauseId(id) {
    return this.ID + " = " + id;
  }

  /* Cập nhật trạng thái khi đặt xe */
  public static async updateState(history: BookedHistory): Promise<boolean> {
    // map dữ liệu cho các cột
    let values = new ContentValues();

    values.set(this.STATE, history.state);
    values.set(this.IS_CATCHER_CAR, history.isCatcherCar);

    try {
      let ret = await SQLiteUtils.update(
        this.TABLE,
        values,
        this.whereClauseId(history.id)
      );
      LogFile.e("updateState", ret);
      return Promise.resolve(true);
    } catch (error) {
      LogFile.e(
        "cancelReloginTimeOut HistoryHelper.updateState " +
        error +
        ";state:" +
        history.state
      );
      return Promise.resolve(false);
    }
  }

  /* Cập nhật thông tin xe */
  public static updateVehicleInfo(history: BookedHistory) {
    let values = new ContentValues();
    values.put(this.STATE, history.state);
    values.put(this.VEHICLE_NO, history.vehicleInfo.carNo);
    values.put(this.VEHICLE_PLATE, history.vehicleInfo.vehiclePlate);
    values.put(this.DRIVER_CODE, history.driverInfo.driverCode);
    values.put(this.DRIVER_NAME, history.driverInfo.name);
    values.put(this.DRIVER_PHONE, history.driverInfo.phone);
    values.put(this.DRIVER_RATING, history.driverInfo.rating);
    values.put(this.DRIVER_AVATAR, history.driverInfo.avatarLink);
    values.put(this.COMPANY_ID_TEMP, history.companyIdTemp);

    return SQLiteUtils.update(
      this.TABLE,
      values,
      this.whereClauseId(history.id)
    );
  }

  /* Xóa tất cả dữ liệu trong bảng lịch sử */
  public static deleteAll() {
    return SQLiteUtils.del(this.TABLE);
  }

  /* Xóa một cuốc theo ID */
  public static deleteTo(id: number) {
    return SQLiteUtils.del(this.TABLE, this.whereClauseId(id));
  }

  /**
   * Lấy danh sách các cuốc đặt xe theo điều kiện
   * BH: BookedHistoryDao
   * COM: CompanyDao
   * VT: VehicleTypeDAO
   * */
  private static getBookedHistoryByWhereClause(
    whereClause?: string
  ): Promise<Array<BookedHistory>> {
    return new Promise((resolve, reject) => {
      let lst = new Array<BookedHistory>();
      let sql =
        "SELECT BH.BookedHistoryID, BH.CatchedTime, BH.CountCar, " +
        " BH.SrcLocation, BH.SrcLocationName, BH.SrcAddress, " +
        " BH.DstAddress, BH.DstLocationName, BH.DstLocation," +
        " BH.Comment, BH.Promotion, BH.State, BH.BookedCode, BH.IsSchedule," +
        " BH.CompanyID, COM.name, COM.reputation, COM.phone, COM.xnCode, " +
        " BH.TaxiTypeID, VT.nameVi, VT.nameEn, VT.iconCode, VT.iconResc, VT.type, VT.orders, VT.listChild, " +
        " BH.VehicleNo, BH.VehiclePlate," +
        " BH.DriverCode, BH.DriverName, BH.DriverPhone, BH.DriverRating, BH.DriverAvatar," +
        " BH.UpdateDate, BH.EstimatesPrice, BH.CompanyIDTemp, BH.ShareBooking, BH.IsCatcherCar" +
        " FROM " +
        this.TABLE +
        " BH" +
        //+ " INNER JOIN " + CompanyDAO.TABLE + " COM "
        " INNER JOIN " +
        CompanyDAO.TABLE +
        " COM ON BH.CompanyID = COM.companyKey " +
        " INNER JOIN " +
        VehicleTypeDAO.TABLE +
        " VT ON BH.TaxiTypeID = VT.vehicleTypeId ";

      if (whereClause !== undefined) sql += " WHERE " + whereClause;

      SQLiteUtils.executeSql(sql)
        .then((resultSet: ResultSet) => {
          let history: BookedHistory;
          let formattedAddress;
          let cursor: Cursor;
          for (let i = 0; i < resultSet.rows.length; i++) {
            cursor = new Cursor(resultSet.rows.item(i));
            history = new BookedHistory();
            history.id = cursor.getInt(this.ID);
            history.catchedTime = cursor.getLong(this.CATCHED_TIME);
            history.countCar = cursor.getInt(this.COUNT_CAR);

            // Địa chỉ đón
            history.srcAddress = new BAAddress();
            history.srcAddress.location = cursor.getLatLng(this.SRC_LOCATION);
            history.srcAddress.name = cursor.getString(this.SRC_LOCATION_NAME);
            history.srcAddress.formattedAddress = cursor.getString(
              this.SRC_ADDRESS
            );

            // Địa chỉ đến
            formattedAddress = cursor.getString(this.DST_ADDRESS);
            if (formattedAddress != null && !Utils.isEmpty(formattedAddress)) {
              history.dstAddress = new BAAddress();
              history.dstAddress.formattedAddress = formattedAddress;
              history.dstAddress.name = cursor.getString(
                this.DST_LOCATION_NAME
              );
              history.dstAddress.location = cursor.getLatLng(this.DST_LOCATION);
            }

            history.comment = cursor.getString(this.COMMENT);
            history.promotion = cursor.getString(this.PROMOTION);
            history.state = cursor.getInt(this.STATE);
            history.bookCode = cursor.getString(this.BOOKED_CODE);
            history.isSchedule = cursor.getBoolean(this.SCHEDULE);

            // Thông tin hãng
            history.company = new Company();
            history.company.companyKey = cursor.getInt(this.COMPANY_ID);
            history.company.name = cursor.getString(CompanyDAO.NAME_COLUMN);
            history.company.reputation = cursor.getString(
              CompanyDAO.REPUTATION_COLUMN
            );
            history.company.phone = cursor.getString(CompanyDAO.PHONE_COLUMN);
            history.company.xnCode = cursor.getInt(CompanyDAO.XN_CODE_COLUMN);

            // Thông tin loại xe
            history.taxiType = new VehicleType();
            history.taxiType.vehicleId = cursor.getInt(this.TAXI_TYPE_ID);
            history.taxiType.nameVi = cursor.getString(
              VehicleTypeDAO.NAME_VI_COLUMN
            );
            history.taxiType.nameEn = cursor.getString(
              VehicleTypeDAO.NAME_EN_COLUMN
            );
            history.taxiType.iconCode = cursor.getString(
              VehicleTypeDAO.ICON_CODE_COLUMN
            );
            history.taxiType.description = cursor.getString(
              VehicleTypeDAO.DESCRIPTION_COLUMN
            );
            history.taxiType.type = cursor.getInt(VehicleTypeDAO.TYPE_COLUMN);
            history.taxiType.orders = cursor.getInt(
              VehicleTypeDAO.ORDER_COLUMN
            );
            history.taxiType.listChild = this.convertBytesToListChild(
              cursor.getBlob(VehicleTypeDAO.LIST_CHILD_COLUMN)
            );

            // Thông tin xe
            history.vehicleInfo = new VehicleInfo();
            history.vehicleInfo.carNo = cursor.getString(this.VEHICLE_NO);
            history.vehicleInfo.vehiclePlate = cursor.getString(
              this.VEHICLE_PLATE
            );

            // Thông tin lái xe
            history.driverInfo = new DriverInfo();
            history.driverInfo.driverCode = cursor.getString(this.DRIVER_CODE);
            history.driverInfo.name = cursor.getString(this.DRIVER_NAME);
            history.driverInfo.phone = cursor.getString(this.DRIVER_PHONE);
            history.driverInfo.rating = cursor.getFloat(this.DRIVER_RATING);
            history.driverInfo.avatarLink = cursor.getString(
              this.DRIVER_AVATAR
            );

            history.updateDate = cursor.getLong(this.UPDATE_DATE);
            history.estimates = cursor.getString(this.UPDATE_ESTIMATES);
            history.companyIdTemp = cursor.getInt(this.COMPANY_ID_TEMP);
            history.isShareBooking = cursor.getBoolean(this.SHARE_BOOKING);
            history.isCatcherCar = cursor.getBoolean(this.IS_CATCHER_CAR);

            lst.push(history);
          }
          resolve(lst);
        })
        .catch(err => resolve(lst));
    });
  }

  /* Lấy tất cả các bản ghi để hiện thị cho danh sách lịch sử */
  public static getBookedTaxis(): Promise<Array<BookedHistory>> {
    // ORDER BY BH.CatchedTime: lấy dữ liệu theo thời gian
    // DESC: sắp xếp thời gian lớn hơn trên cùng(index = 0...)
    let whereClause =
      "BH.BookedCode != '" + "" + "' ORDER BY BH.CatchedTime DESC LIMIT 30";

    return this.getBookedHistoryByWhereClause(whereClause);
  }

  /* Lấy cuốc xe đang đặt lịch */
  public static async getScheduleBookTaxi(): Promise<BookedHistory> {
    // Lấy thời gian bắt xe lớn hơn thời gian hiện tại, cuốc đặt lịch và trạng thái đã init thành công
    let whereClause =
      this.CATCHED_TIME +
      " > " +
      new Date().getTime() +
      " AND " +
      this.SCHEDULE +
      " = 1 AND " +
      this.STATE +
      " = " +
      BookedStep.DONE +
      " LIMIT 1";

    let list: Array<BookedHistory> = await this.getBookedHistoryByWhereClause(whereClause);
    if (list && list.length > 0) {
      return list[0];
    }

    return new BookedHistory();
  }

  /* Cập nhật trạng thời gian đặt lịch khi đặt lại từ lịch sử */
  public static updateCatchedTime(history: BookedHistory): Promise<any> {
    let values = new ContentValues();
    values.put(this.CATCHED_TIME, history.catchedTime);
    return SQLiteUtils.update(
      this.TABLE,
      values,
      this.whereClauseId(history.id)
    );
  }

  /* Cập nhật trạng thái đặt lịch */
  public static updateScheduleState(history: BookedHistory): Promise<any> {
    // map dữ liệu cho các cột
    let values = new ContentValues();
    values.put(this.STATE, history.state);
    values.put(this.SCHEDULE, history.isSchedule);
    values.put(this.SHARE_BOOKING, history.isShareBooking);
    return SQLiteUtils.update(
      this.TABLE,
      values,
      this.whereClauseId(history.id)
    );
  }

  /* Thông tin cuốc */
  public static getActiveBookTaxiModel(): Promise<Array<BookedHistory>> {
    let arr = [BookedStep.INITBOOK, BookedStep.CARS_INFO];

    let whereClause = `BH.State IN (${arr.join(",")}) AND  ${
      this.SCHEDULE
      } = 0 ORDER BY BH.CatchedTime DESC LIMIT 1`;

    return this.getBookedHistoryByWhereClause(whereClause);
  }

  /* Thông tin cuốc */
  public static getActiveBookCarModel(): Promise<Array<BookedHistory>> {
    let arr = [
      BookedStep.INITBOOK,
      BookedStep.CARS_INFO,
      BookedStep.CATCHED_CAR
    ];

    let whereClause = `BH.State IN (${arr.join(",")}) AND  ${
      this.SCHEDULE
      } = 0 ORDER BY BH.CatchedTime DESC LIMIT 1`;

    return this.getBookedHistoryByWhereClause(whereClause);
  }

  /* Thông tin cuốc đặt lịch */
  public static getScheduledBookTaxiTime(): Promise<number> {
    return new Promise((resolve, reject) => {
      // lấy thời gian bắt xe lớn hơn thời gian hiện tại, cuốc đặt lịch và
      // trạng thái đã init thành công
      let selection =
        this.CATCHED_TIME +
        " > " +
        new Date().getTime() +
        " AND " +
        this.SCHEDULE +
        " = 1 AND " +
        this.STATE +
        " = " +
        BookedStep.DONE;
      let sql = `SELECT ${this.CATCHED_TIME} FROM ${
        this.TABLE
        } WHERE ${selection}`;

      SQLiteUtils.executeSql(sql)
        .then((resultSet: ResultSet) => {
          if (resultSet.rows.length > 0) {
            resolve(resultSet.rows.item(0)[this.CATCHED_TIME]);
          } else {
            resolve(0)
          }
        })
        .catch(err => resolve(0));
    });
  }

  /* Lấy thông tin cuốc theo tableId */
  public static getBookTaxiById(id: number): Promise<Array<BookedHistory>> {
    let whereClause = "BH.BookedHistoryID = " + id;
    return this.getBookedHistoryByWhereClause(whereClause);
  }

  /** Convert bytes sang ListChild */
  private static convertBytesToListChild(bs: Array<number>): Array<number> {
    let listChilds = new Array<number>();
    let buffer = DefinedBuffer.wrap(bs);
    let size = bs.length / 4;
    for (let i = 0; i < size; i++) {
      listChilds.push(buffer.getInt32());
    }
    return listChilds;
  }

  public static async dropTable() {
    await SQLiteUtils.executeSql(this.getQueryDropTable());
  }
}

export default BookedHistoryDAO;
