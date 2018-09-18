import { DfByte, DfString, DfLong } from "../../../module";

/**
 * Nhận phản hồi bản tin login
 * Created on 16/07/2018
 */
export default class AckLoginMessage {

	/** trạng thái login thành công hay không */
	public loginStatus:DfByte = DfByte.index(0);

    /**
     * key mã hóa bản tin khi gửi nhận tcp
     */
	public sessionKey:DfString = DfString.index(1);

   /** Thời gian khóa tài khoản */
    public liftBanTime:DfLong = DfLong.index(3);
    
}

export enum LoginState{
    NONE = 0,
    WRONG_USER = 1,
    LOCK = 2
}