import { DfString, DfLong, DfList } from "../../../module";


/**
 * Đối tượng request history of user
 * @author ChungBui
 * Created on 03/07/2018
 */
class HistoryRequest {
    /* số điện thoại */
    public phoneNumber: DfString = DfString.index(1);

     /* password */
     public password: DfString = DfString.index(2);

    /* tên đăng nhập */
    public recentBookTime: DfLong = DfLong.index(3);

    /* mã khuyến mại */
    public updateIDs: DfList<DfString> = DfList.index(new DfString(),4);

    /* device ID */
    public deleteIDs: DfList<DfString> = DfList.index(new DfString(),5);

}

export default HistoryRequest;