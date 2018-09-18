import colors from "../../../res/colors";
import strings from "../../../res/strings";

/**
 * Đối tượng History
 * @author ChungBui
 * Created on 05/07/2018
 */
class History {

	public static convertFrom(json): History {
		let obj = new History()
		obj.bookCode = json.bookCode;
		obj.companyID = json.companyID;
		obj.cartypeID = json.cartypeID;
		obj.companyName = json.companyName;
		obj.cartypeVI = json.cartypeVI;
		obj.cartypeEN = json.cartypeEN;
		obj.createdTime = json.createdTime;
		obj.bookTime = json.bookTime;
		obj.fromAddress = json.fromAddress;
		obj.fromLat = json.fromLat;
		obj.fromLng = json.fromLng;
		obj.fromName = json.fromName;
		obj.toAddress = json.toAddress;
		obj.toLat = json.toLat;
		obj.toLng = json.toLng;
		obj.toName = json.toName;
		obj.userNote = json.userNote;
		obj.promoCode = json.promoCode;
		obj.bookType = json.bookType;
		obj.status = json.status;
		obj.nameDrive = json.nameDrive;
		obj.plate = json.plate;
		obj.carNo = json.carNo;
		obj.phoneNumber = json.phoneNumber;
		obj.imageLink = json.imageLink;
		obj.transportFee = json.transportFee;
		obj.waitingFee = json.waitingFee;
		obj.additionFee = json.additionFee;
		obj.discount = json.discount;
		obj.trackingLog = json.trackingLog;
		obj.havingGuestKm = json.havingGuestKm;
		obj.totalSecond = json.totalSecond;
		obj.isShareBooking = json.isShareBooking;
		obj.isDeleted = json.isDeleted;

		let seconds = (obj.bookTime) * 1000
		let d = new Date(seconds)

		let newFormat = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
		obj.dateFormat = newFormat;

		let minutes = d.getMinutes();
		let newShortTime = d.getHours() + ':' + (minutes < 10 ? ("0" + minutes) : minutes);
		obj.shortTime = newShortTime;



		let secondTo = (obj.bookTime + obj.totalSecond) * 1000
		let dTo = new Date(secondTo);
		let minutesTo = dTo.getMinutes();
		obj.shortTimeTo = dTo.getHours() + ":" + (minutesTo < 10 ? ("0" + minutesTo) : minutesTo);
		obj.dateTo = dTo.getDate() + "/" + (dTo.getMonth() + 1) + "/" + dTo.getFullYear()

		obj.totalFee = obj.transportFee + obj.additionFee - obj.discount;
		obj.totalFee = obj.totalFee > 0 ? obj.totalFee : 0;

		return obj
	}

	/* trạng thái đăng ký */
	// DfString
	public bookCode: string

	/* thông báo lỗi */
	// DfInteger
	public companyID: number

	/* nếu bị khoá thì trả về thời gian bị khoá tới bao giờ */
	// DfString
	public companyName: string

	// DfInteger
	public cartypeID: number
	// DfString
	public cartypeVI: string
	// DfString
	public cartypeEN: string
	// DfLong
	public createdTime: number
	// DfLong
	public bookTime: number

	public dateFormat: string

	public shortTime: string

	public shortTimeTo: string
	public dateTo: string

	public totalFee: number

	// DfLatLng
	public fromLat: number
	public fromLng: number
	// DfString
	public fromAddress: string
	// DfString
	public fromName: string

	// DfLatLng
	public toLat: number
	public toLng: number

	// DfString
	public toAddress: string
	// DfString
	public toName: string

	// DfString
	public userNote: string
	// DfString
	public promoCode: string
	// DfByte
	public bookType: number
	// DfByte
	public status: number
	// DfString
	public nameDrive: string
	// DfString
	public plate: string
	// DfString
	public carNo: string
	// DfString
	public phoneNumber: string
	// DfString
	public imageLink: string
	// DfInteger
	public transportFee: number
	// DfInteger
	public waitingFee: number
	// DfInteger
	public additionFee: number
	// DfInteger
	public discount: number
	// DfString
	public trackingLog: string
	// DfFloat
	public havingGuestKm: number
	// DfInteger
	public totalSecond: number
	// DfBoolean
	public isShareBooking: boolean

	public isDeleted: boolean

	getStatusString() {
		// if(this.promoCode.length > 0){
		// 	return strings.home_promotion_title}
		// else{
		// 	switch (this.status) {
		// 	case 1:	
		// 		return strings.status_successful
		// 	default:
		// 		return strings.status_cancelled
		// 	}
		// }
		switch (this.status) {
			case 1:
				if (this.promoCode.length > 0) {
					return strings.home_promotion_title
				}
				return strings.status_successful
			default:
				return strings.status_cancelled
		}
	}

	getToAddress() {
		if (this.toAddress == '') {
			return strings.history_address_not_define
		} else {
			return this.toAddress
		}
	}

	getFontStyleForToAddress() {
		if (this.toAddress == '') {
			return 'italic'
		}
		return 'normal'
	}

	getColorForToAddress() {
		if (this.toAddress == '') {
			return colors.colorGrayLight
		}
		return 'black'
	}

	getStateColor() {
		switch (this.status) {
			case 1:
				if (this.promoCode.length > 0) {
					return colors.colorCyan
				}
				return colors.colorMain
			default:
				return colors.fail
		}
	}
}

export default History;