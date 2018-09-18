/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:49:42
 * @modify date 2018-07-10 02:49:42
 * @desc [Gửi token thiết bị lên server]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import {DfByte, DfString} from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import Constants from "../../constant/Constants";
import { MessageType } from "../MessageType";

export default class DeviceTokenMessage extends AbstractSentMessage {

  /*** version của ứng dụng */
  public deviceType: DfByte = DfByte.index(0);

  /***số điện thoại */
  public phone: DfString = DfString.index(1);

  /*** token key*/
  public token: DfString = DfString.index(2);

  constructor(phone:string, token:string){
    super();
    this.deviceType.setValue(Constants.OS_TYPE());
    this.phone.setValue(phone);
    this.token.setValue(token);
  }

  public getSentMessageType(): BAMessageType {
    return MessageType.DEVICE_TOKEN;
  }
}
