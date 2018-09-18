import { DfString, DfInteger, DfBoolean, DfLong, DfByte, DfShort, DfList, DfLatLng, LatLng } from "../../../../module";
import { requestByObject, MethodName } from "../../../http/HttpHelper";
import User from "../../../sql/bo/User";
import BookTaxiModel from "../BookTaxiModel";
import Constants from "../../../constant/Constants";

export default class BookingViaHandler {
    /**
	 * Gửi thông tin cuốc đặt
	 */
    public static async verifyBookingVia(bookModel: BookTaxiModel, user: User): Promise<BookingViaReponseModel> {

        let viaRequestModel = new BookingViaRequestModel();

        viaRequestModel.companyID.setValue(bookModel.company.companyKey);
        viaRequestModel.catchedTime.setValue(this.getFormatTimeServer(bookModel.catchedTime));

        viaRequestModel.location.setValue(bookModel.srcAddress.location);
        viaRequestModel.formattedAddress.setValue(bookModel.srcAddress.formattedAddress);
        viaRequestModel.name.setValue(bookModel.srcAddress.name);

        viaRequestModel.location1.setValue(bookModel.dstAddress.location);
        viaRequestModel.formattedAddress1.setValue(bookModel.dstAddress.formattedAddress);
        viaRequestModel.name1.setValue(bookModel.dstAddress.name);

        viaRequestModel.currentCoordinate.setValue(bookModel.currentLocation || new LatLng(0, 0));
        viaRequestModel.phone.setValue(user.phone);
        viaRequestModel.countCar.setValue(bookModel.countCar);
        viaRequestModel.carType.setValue(bookModel.taxiType.vehicleId);
        viaRequestModel.bookType.setValue(bookModel.bookType);
        viaRequestModel.priority.setValue(bookModel.priority);
        viaRequestModel.isReceivedCall.setValue(1);
        viaRequestModel.comment.setValue(bookModel.comment);
        viaRequestModel.promoCode.setValue(bookModel.promotion);
        viaRequestModel.password.setValue(user.password);
        viaRequestModel.isShareBooking.setValue(bookModel.isShareBooking);

        console.log(`test_shedulte__request: ${JSON.stringify(viaRequestModel)}`);
        // Thực hiện request
        try {
            console.log(`test_shedulte__request_1`);
            let response: BookingViaReponseModel = await requestByObject(
                MethodName.BOOKING_VIA,
                viaRequestModel,
                new BookingViaReponseModel(),
            );

            console.log(`test_shedulte__request_3__${JSON.stringify(response)}`);
            return Promise.resolve(response);
        } catch (error) {
            console.log(`test_shedulte__request_2`);
            // Alert.alert("Kết nối đến server quá lâu" + (error.message || error));
            return Promise.reject(error);
        }
    }

    private static getFormatTimeServer(clientTime: number) {
        return (clientTime + Constants.DELTA_TIME_SERVER) / 1000
    }
}

/**
	 * Lớp nội lưu trữ thông tin gửi lên server
	 * 
	 * @author BacHK.
	 */
export class BookingViaRequestModel {

    public companyID: DfInteger = DfInteger.index(0);

    public catchedTime: DfLong = DfLong.index(1);

    public location: DfLatLng = DfLatLng.index(3);
    public formattedAddress: DfString = DfString.index(4);
    public name: DfString = DfString.index(5);

    public location1: DfLatLng = DfLatLng.index(6);
    public formattedAddress1: DfString = DfString.index(7);
    public name1: DfString = DfString.index(8);
    public currentCoordinate: DfLatLng = DfLatLng.index(9);

    public phone: DfString = DfString.index(10);

    public countCar: DfByte = DfByte.index(11);

    public carType: DfShort = DfShort.index(12);

    public bookType: DfByte = DfByte.index(13);

    public priority: DfByte = DfByte.index(14);

    public isReceivedCall: DfByte = DfByte.index(15);

    public comment: DfString = DfString.index(16);

    public promoCode: DfString = DfString.index(17);

    public ignoreDriverList: DfList<BookViaVehiclePlate> = DfList.index(new BookViaVehiclePlate(), 18);

    public password: DfString = DfString.index(19);

    public isShareBooking: DfBoolean = DfBoolean.index(20);

}

export class BookViaVehiclePlate {
    private ignoreDriverList: DfString = DfString.index(1);

    public BookViaVehiclePlate(ignoreDriverList: string) {
        this.ignoreDriverList.value = ignoreDriverList;
    }
}

/**
 * Lớp nội nhận thông tin
 * 
 */
export class BookingViaReponseModel {
    public status: DfByte = DfByte.index(0);
    public bookCode: DfString = DfString.index(1);
    public message: DfString = DfString.index(2);
    public liftbanTime: DfLong = DfLong.index(3);
}