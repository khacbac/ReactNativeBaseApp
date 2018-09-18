import MethodName from "../../http/MethodName";
import { requestByObject } from "../../http/HttpHelper";
import UserDAO from "../../sql/dao/UserDAO";
import strings from '../../../res/strings'
import BookedHistoryDAO from "../../sql/dao/BookedHistoryDAO";
import HistoryJsonDAO from "../../sql/dao/HistoryOnlineDAO";
import AddressHistoryDAO from "../../sql/dao/AddressHistoryDAO";
import SessionStore from "../../Session";
import { DfString, DfByte, DfShort } from "../../../module";

/* Update Acc */
async function updateAcc(lang: number, naCode: string, phone: string, pass: string, uuid: string, email: string, name: string, localFile: string): Promise<{ status: number, str: String }> {
    let request = new UpdateAccRequest();
    request.language.setValue(lang);
    request.countryCode.setValue(naCode);
    request.phoneNumber.setValue(phone);
    request.password.setValue(pass);
    request.uuid.setValue(uuid);
    request.email.setValue(email);
    request.name.setValue(name);
    request.imageBase64.setValue('');

    console.log(`request_update_acc: ${JSON.stringify(request)}__localfile: ${localFile}`)

    try {
        let response: UpdateAccResponse = await requestByObject(
            MethodName.UpdateAcc,
            request,
            new UpdateAccResponse()
        );

        let res = response.status.value;
        let msg = strings.user_update_profile_succeed;

        if (res == 1) {
            await UserDAO.updateProfileUser(email, name, localFile)
            //Thiết lập lại session
             //TODO: có thể cập nhật lại các trường cho đối tượng user cũ
            let user = await UserDAO.getUser();
            SessionStore.setUser(user);
            // SessionStore.navigationDrawable(user);
        } else {
            console.log("error: " + res);
            msg = response.status.value;
        }

        return Promise.resolve({ status: res, str: msg });
    } catch (error) {
        console.log(error.message || error);
        return Promise.resolve({ status: 2, str: strings.not_connected_server });
    }
}

/* Remove Acc */
async function removeAcc(naCode: string, phone: string, pass: string): Promise<{ status: number, str: String }> {
    let request = new RemoveAccRequest();
    request.countryCode.setValue(naCode);
    request.phoneNumber.setValue(phone);
    request.password.setValue(pass);

    try {
        let response: RemoveAccResponse = await requestByObject(
            MethodName.RemoveAcc,
            request,
            new RemoveAccResponse()
        );

        let res = response.status.value;
        let msg = strings.user_delete_profile_succeed;

        if (res == 1) {
            //Update to DB
            await UserDAO.removeAcc();

            await HistoryJsonDAO.deleteJsonTable()
        
            await AddressHistoryDAO.deleteAll()

            //Xoá lịch sử đặt xe
            await BookedHistoryDAO.deleteAll()
                .then(() => {
                    console.log("deleteDataBase thành công");
                })
                .catch(err => {
                    console.log("deleteDataBase lỗi", err);

                });
        } else {
            msg = strings.user_update_profile_fail;
        }

        return Promise.resolve({ status: res, str: msg });
    } catch (error) {
        console.log(error.message || error);
        return Promise.reject(error);
    }
}

export { removeAcc, updateAcc };

class RemoveAccRequest {
    /* mã nước */
    public countryCode: DfString = DfString.index(1);

    /* số điện thoại */
    public phoneNumber: DfString = DfString.index(2);

    /* ngôn ngữ*/
    public password: DfString = DfString.index(3);
}

class RemoveAccResponse {
    /* trạng thái xoá tài khoản */
    public status: DfByte = DfByte.index(1);

    /* thông báo lỗi */
    public message: DfString = DfString.index(2);
}

class UpdateAccRequest {
    /* ngôn ngữ*/
    public language: DfShort = DfShort.index(1);

    /* mã nước */
    public countryCode: DfString = DfString.index(2);

    /* số điện thoại */
    public phoneNumber: DfString = DfString.index(3);

    /* Mật khẩu */
    public password: DfString = DfString.index(4);

    /* device ID */
    public uuid: DfString = DfString.index(5);

    /* email */
    public email: DfString = DfString.index(6);

    /* tên đăng nhập */
    public name: DfString = DfString.index(7);

    /* imageBase64 */
    public imageBase64: DfString = DfString.index(8);

}

class UpdateAccResponse {
    /* trạng thái update tài khoản */
    public status: DfByte = DfByte.index(1);

    /* thông báo lỗi */
    public message: DfString = DfString.index(2);
}
