/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:49:00
 * @modify date 2018-07-10 02:49:00
 * @desc [Bản tin hủy cuốc]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import {DfByte} from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class ClientCancelMessage extends AbstractSentMessage {

 /**Người dùng hủy*/
 public static USER_CANCEL = 1;

 /**Timeout*/
 public static TIMEOUT_CANCEL = 2;

  /***trạng thái gặp khách*/
  public state: DfByte = DfByte.index(0);
 

 constructor(state:number){
   super();
   this.state.setValue(state&&0xff);
 }

 /**
  * tạo đối tượng khi người dùng hủy
  */
 public static createUserCancelState():ClientCancelMessage{
   return new ClientCancelMessage(this.USER_CANCEL);
 }

 /**
  * tạo đối tượng khi hết thời gian ko có lái xe nhận
  */
 public static createTimeoutState():ClientCancelMessage{
  return new ClientCancelMessage(this.TIMEOUT_CANCEL);
}



 public getSentMessageType(): BAMessageType {
   return MessageType.CLIENT_CANCEL;
 }
}
