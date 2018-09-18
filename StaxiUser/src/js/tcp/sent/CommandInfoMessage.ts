/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:49:13
 * @modify date 2018-07-10 02:49:13
 * @desc [Bản tin gửi lệnh lên server]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import {DfString} from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class CommandInfoMessage extends AbstractSentMessage {

  /***id cuốc khách */
  public bookId: DfString = DfString.index(0);

  /*** số điện thoại */
  public phone: DfString = DfString.index(1);

  /*** mật khẩu */
  public password: DfString = DfString.index(2);

  constructor(bookId:string, phone:string, password:string){
    super();
    this.bookId.setValue(bookId);
    this.phone.setValue(phone);
    this.password.setValue(password);
  }


  public getSentMessageType(): BAMessageType {
    return MessageType.COMMAND_INFO;
  }
}
