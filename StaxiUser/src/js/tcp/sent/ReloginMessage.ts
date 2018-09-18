/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:50:59
 * @modify date 2018-07-10 02:50:59
 * @desc [bản tin kết nối lại]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import { DfString, DfByte, DfBoolean } from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class ReloginMessage extends AbstractSentMessage {

  /*** số điện thoại */
  public phone: DfString = DfString.index(1);

  /*** mật khẩu đăng nhập của lái xe */
  public password: DfString = DfString.index(2);

  /**step hiện tại của client*/
  public clientStep: DfByte = DfByte.index(3);

 /** Client có khởi động lại app hay không. 1 = true, gửi kèm sessionKey. 0 = false */
  public isRestartApp: DfBoolean = DfBoolean.index(4);

  /** book hiện tại */
  public bookID: DfString = DfString.index(5);

  public getSentMessageType(): BAMessageType {
    return MessageType.RELOGIN;
  }
  
}
