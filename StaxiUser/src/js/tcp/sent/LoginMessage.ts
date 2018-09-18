/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:50:36
 * @modify date 2018-07-10 02:50:36
 * @desc [bản tin đăng nhập]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import * as Type from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import Constants from "../../constant/Constants";
import { MessageType } from "../MessageType";

export default class LoginMessage extends AbstractSentMessage {

  /*** version của ứng dụng */
  public version: Type.DfInteger = Type.DfInteger.index(0);

  /*** số điện thoại */
  public phone: Type.DfString = Type.DfString.index(1);

  /*** mật khẩu đăng nhập của lái xe */
  public password: Type.DfString = Type.DfString.index(2);

  /** Key sử dụng cho firebase */
  public deviceToken: Type.DfString = Type.DfString.index(3);

  /** loại hệ thống*/
  public osType: Type.DfByte = Type.DfByte.index(4);

  constructor(phone:string, password:string, version:number, deviceToken?:string){
    super();
    this.version.setValue(version);
    this.phone.setValue(phone);
    this.password.setValue(password);
    this.deviceToken.setValue(deviceToken||"");
    this.osType.setValue(Constants.OS_TYPE());
  }

  public getSentMessageType(): BAMessageType {
    return MessageType.LOGIN;
  }
}
