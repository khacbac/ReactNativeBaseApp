import User from "../../sql/bo/User";
import BookTaxiModel from "../../viewmodel/booking/BookTaxiModel";
import { DfByte, DfString, DfInteger, DfList } from "../../../module";
import { FileUpload, BookingFeedbackRequest } from "./BookingFeedbackRequest";
import { requestByObject } from "../HttpHelper";
import MethodName from "../MethodName";

class DriverFeedbackHandler {
    public static get(user: User, bookTaxiModel: BookTaxiModel, rateNumber: number,
        notes: string, feedbackTypeId?: number, uploads?: FileUpload[]): BookingFeedbackRequest {

        let request = new BookingFeedbackRequest();
        request.phone.setValue(user.phone);
        request.password.setValue(user.password);
        request.bookCode.setValue(bookTaxiModel.bookCode);
        request.strDriverCode.setValue(bookTaxiModel.driverInfo.driverCode);
        request.companyID.setValue(bookTaxiModel.company.companyKey);
        request.rateNumber.setValue(rateNumber);
        request.notes.setValue(notes);
        request.bookingTime.setValue((new Date().getTime() - bookTaxiModel.catchedTime) / 1000);
        request.feedbackTypeId.setValue(feedbackTypeId || 0);
        request.files.setValue(uploads || []);
        return request;
    }

    public static async driverFeedBackRequest(
        request: BookingFeedbackRequest
    ): Promise<Array<any>> {
        // Thực hiện request
        try {
            let response: Array<any> = await requestByObject(
                MethodName.DriverFeedback,
                request,
                new Array<any>()
            );
            return Promise.resolve(response);
        } catch (error) {
            // Alert.alert("Kết nối đến server quá lâu" + (error.message || error));
            return Promise.reject(error);
        }
    }
}

export default DriverFeedbackHandler;