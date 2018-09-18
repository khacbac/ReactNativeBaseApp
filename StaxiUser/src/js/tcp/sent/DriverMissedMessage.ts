/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:49:59
 * @modify date 2018-07-10 02:49:59
 * @desc [Gửi thông tin bắt nhầm xe]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class DriverMissedMessage extends AbstractSentMessage {
  public getSentMessageType(): BAMessageType {
    return MessageType.DRIVER_MISSED;
  }
}
