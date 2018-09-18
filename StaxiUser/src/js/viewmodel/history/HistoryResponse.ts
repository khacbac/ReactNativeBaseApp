import { DfString, DfInteger, DfLong, DfLatLng, DfByte, DfFloat, DfBoolean, DfList } from "../../../module";
import History from "../../sql/bo/History";


/**
 * Đối tượng history response
 * @author ChungBui
 * Created on 03/07/2018
 */
class HistoryParser {
    /* trạng thái đăng ký */
    public bookCode: DfString = DfString.index(1);

    /* thông báo lỗi */
    public companyID: DfInteger = DfInteger.index(2);

    /* nếu bị khoá thì trả về thời gian bị khoá tới bao giờ */
    public companyName: DfString = DfString.index(3);
    
    public cartypeID: DfInteger  = DfInteger.index(4);
    public cartypeVI: DfString = DfString.index(5);
    public cartypeEN: DfString = DfString.index(6);
    public createdTime: DfLong = DfLong.index(7);
    public bookTime: DfLong  = DfLong.index(8);

    public fromCoordinate: DfLatLng = DfLatLng.index(9);
    public fromAddress: DfString  = DfString.index(10);
    public fromName: DfString  = DfString.index(11);

    public toCoordinate: DfLatLng = DfLatLng.index(12);
    public toAddress: DfString  = DfString.index(13);
    public toName: DfString  = DfString.index(14);

    public userNote: DfString = DfString.index(15);
    public promoCode: DfString = DfString.index(16);
    public bookType: DfByte = DfByte.index(17);
    public status:DfByte  = DfByte.index(18);
    public nameDrive: DfString  = DfString.index(19);
    public plate: DfString  = DfString.index(20);
    public carNo: DfString = DfString.index(21);
    public phoneNumber: DfString  = DfString.index(22);
    public imageLink: DfString  = DfString.index(23);
    public transportFee: DfInteger = DfInteger.index(24);
    public waitingFee: DfInteger = DfInteger.index(25);
    public additionFee: DfInteger = DfInteger.index(26);
    public discount: DfInteger = DfInteger.index(27);
    public trackingLog: DfString  = DfString.index(28);
    public havingGuestKm: DfFloat  = DfFloat.index(29);
    public totalSecond: DfInteger = DfInteger.index(30);
    public isShareBooking: DfBoolean  = DfBoolean.index(31);

    public static getHistory(response:HistoryParser): History {
        let instance = new History()
        
        instance.bookCode = response.bookCode.value;
        // BaseDAO.getString(item,this.COLUMN_BOOKING_CODE);
        instance.companyID = response.companyID.value;
        // BaseDAO.getInt(item,this.COLUMN_COMPANY_ID);
        instance.cartypeID = response.cartypeID.value;
        // BaseDAO.getInt(item,this.COLUMN_CAR_TYPE_ID);
        instance.companyName = response.companyName.value;
        // BaseDAO.getString(item,this.COLUMN_COMPANY_REPUTATION);
        instance.cartypeVI = response.cartypeVI.value;
        // BaseDAO.getString(item,this.COLUMN_CAR_TYPE_VI);
        instance.cartypeEN = response.cartypeEN.value;
        // BaseDAO.getString(item,this.COLUMN_CAR_TYPE_EN);
        instance.createdTime = response.createdTime.value  - 7*60*60;
        // BaseDAO.getLong(item,this.COLUMN_CREATED_TIME);
        instance.bookTime = response.bookTime.value - 7*60*60;
        // BaseDAO.getLong(item,this.COLUMN_BOOKING_TIME);
        instance.fromAddress = response.fromAddress.value;
        // BaseDAO.getString(item,this.COLUMN_FROM_ADDRESS);
        instance.fromLat = response.fromCoordinate.value.latitude;
        // BaseDAO.getFloat(item,this.COLUMN_FROM_LATITUDE);
        instance.fromLng = response.fromCoordinate.value.longitude;
        // BaseDAO.getFloat(item,this.COLUMN_FROM_LONGTITUDE);
        instance.fromName = response.fromName.value;
        // BaseDAO.getString(response,this.COLUMN_FROM_ADDRESS_NAME);
        instance.toAddress = response.toAddress.value;
        // BaseDAO.getString(item,this.COLUMN_TO_ADDRESS);
        instance.toLat = response.toCoordinate.value.latitude;
        // BaseDAO.getFloat(item,this.COLUMN_TO_LATITUDE);
        instance.toLng = response.toCoordinate.value.longitude;
        // BaseDAO.getFloat(item,this.COLUMN_TO_LONGTITUDE);
        instance.toName = response.toName.value;
        // BaseDAO.getString(item,this.COLUMN_TO_ADDRESS_NAME);
        instance.userNote = response.userNote.value;
        // BaseDAO.getString(item,this.COLUMN_USER_NOTE);
        instance.promoCode = response.promoCode.value;
        // BaseDAO.getString(item,this.COLUMN_PROMO_CODE);
        instance.bookType = response.bookType.value;
        // BaseDAO.getInt(item,this.COLUMN_BOOK_TYPE_RAW);
        instance.status = response.status.value;
        // BaseDAO.getInt(item,this.COLUMN_STATUS_RAW);
        instance.nameDrive = response.nameDrive.value;
        // BaseDAO.getString(item,this.COLUMN_DRIVE_NAME);
        instance.plate = response.plate.value;
        // BaseDAO.getString(item,this.COLUMN_CAR_PLATE);
        instance.carNo = response.carNo.value;
        // BaseDAO.getString(item,this.COLUMN_CAR_NO);
        instance.phoneNumber = response.phoneNumber.value;
        // BaseDAO.getString(item,this.COLUMN_DRIVER_PHONE);
        instance.imageLink = response.imageLink.value;
        // BaseDAO.getString(item,this.COLUMN_DRIVER_IMAGE);
        instance.transportFee = response.transportFee.value;
        // BaseDAO.getInt(item,this.COLUMN_TRANSPORT_FEE);
        instance.waitingFee = response.waitingFee.value;
        // BaseDAO.getInt(item,this.COLUMN_WAITING_FEE);
        instance.additionFee = response.additionFee.value;
        // BaseDAO.getInt(item,this.COLUMN_ADDITION_FEE);
        instance.discount = response.discount.value;
        // BaseDAO.getInt(item,this.COLUMN_DISCOUNT);
        instance.trackingLog = response.trackingLog.value;
        // BaseDAO.getString(item,this.COLUMN_PATH);
        instance.havingGuestKm = response.havingGuestKm.value;
        // BaseDAO.getInt(item,this.COLUMN_HAVING_GUEST_PROMATION);
        instance.totalSecond = response.totalSecond.value;
        // BaseDAO.getInt(item,this.COLUMN_TOTAL_TIME);
        instance.isShareBooking = response.isShareBooking.value;
        // BaseDAO.getBoolean(item,this.COLUMN_IS_SHARE_BOOKING);
        instance.isDeleted = false;
        // BaseDAO.getBoolean(item,this.COLUMN_IS_SHARE_BOOKING);


		let seconds = (instance.bookTime)*1000
		let d = new Date(seconds)

		let newFormat = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
		instance.dateFormat = newFormat;
        let minutes = d.getMinutes();
		let newShortTime = d.getHours() + ':' + (minutes<10? ("0" + minutes):minutes);
		instance.shortTime = newShortTime;



		let secondTo = (instance.bookTime + instance.totalSecond)*1000
		let dTo = new Date(secondTo);
		let minutesTo = dTo.getMinutes();
		instance.shortTimeTo = dTo.getHours() + ":" + (minutesTo<10? ("0" + minutesTo):minutesTo);
		instance.dateTo = dTo.getDate() + "/" + (dTo.getMonth() + 1) + "/" + dTo.getFullYear()

		instance.totalFee = instance.transportFee + instance.additionFee - instance.discount;
        return instance
    }
}

class HistoryResponse {
    public listHistory:DfList<HistoryParser> = new DfList(new HistoryParser(), 1);
}

export {
    HistoryParser,
    HistoryResponse
};
