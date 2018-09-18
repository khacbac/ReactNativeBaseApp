/**
 * bản tin ack relogin server trả về
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 11:58:15
 * @modify date 2018-07-10 11:58:15
 * @desc [description]
*/
import { DfBoolean, DfInteger, DfNumberArray, DataType } from "../../../module";

export default class AckReloginMessage {

    /** trạng thái relogin */
    public success:DfBoolean = DfBoolean.index(0);

    /** chuỗi dùng để mã hóa */
    public sessionKey:DfNumberArray = DfNumberArray.index(DataType.BYTE, 1);
    
    /** các trường sử dụng */
	public fieldMap:DfInteger = DfInteger.index(2);

	/* Trạng thái trong cuốc của xe */
	public stepInfo:DfNumberArray = DfNumberArray.index(DataType.BYTE, 3, true);
}