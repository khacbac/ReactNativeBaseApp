import { DfString, DfInteger, DfBoolean } from "../../../../module";
import { requestByObject, MethodName } from "../../../http/HttpHelper";
import SessionStore from "../../../Session";

export default class CancelScheduleHandler {
    /**
	 * Gửi thông tin cuốc đặt
	 */
    public static async verifyCancelSchedule(bookCode: string, companyID: number): Promise<CancelScheduleReponseModel> {

        let viaRequestModel = new CancelScheduleRequestModel();

        viaRequestModel.phone.setValue(SessionStore.getUser().phone);
        viaRequestModel.password.setValue(SessionStore.getUser().password);
        viaRequestModel.bookCode.setValue(bookCode);
        viaRequestModel.companyID.setValue(companyID);

        // Thực hiện request
        try {
            let response: CancelScheduleReponseModel = await requestByObject(
                MethodName.ScheduleCancel,
                viaRequestModel,
                new CancelScheduleReponseModel()
            );

            return Promise.resolve(response);
        } catch (error) {
            // Alert.alert("Kết nối đến server quá lâu" + (error.message || error));
            return Promise.reject(error);
        }
    }
}

/**
	 * Lớp nội lưu trữ thông tin gửi lên server
	 * 
	 * @author BacHK.
	 */
export class CancelScheduleRequestModel {
    public phone: DfString = DfString.index(0);

    public password: DfString = DfString.index(1);

    public bookCode: DfString = DfString.index(2);

    public companyID: DfInteger = DfInteger.index(3);

}

/**
 * Lớp nội nhận thông tin
 * 
 * @author BacHK.
 */
export class CancelScheduleReponseModel {
    public status: DfBoolean = DfBoolean.index(0);
}