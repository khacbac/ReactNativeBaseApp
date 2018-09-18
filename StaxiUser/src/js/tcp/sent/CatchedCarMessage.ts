/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:48:38
 * @modify date 2018-07-10 02:48:38
 * @desc [Gửi bản tin đã gặp xe lên server]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import { DfByte } from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class CatchedCarMessage extends AbstractSentMessage {
  /** gặp khách */
  public static CATCHED_CAR = 0;

  /**chưa gặp khách*/
  public static NOT_CATCHED_CAR = 1;

  /**Hủy gặp khách*/
  public static CANCEL_CATCHED_CAR = 2;

  constructor(state: number) {
    super();
    this.state.setValue(state && 0xff);
  }
  /***trạng thái gặp khách*/
  public state: DfByte = DfByte.index(0);

  /**
   * tạo đối tượng gặt khách
   */
  public static createCatchedCar(): CatchedCarMessage {
    return new CatchedCarMessage(this.CATCHED_CAR);
  }

  public getSentMessageType(): BAMessageType {
    return MessageType.CATCHED_CAR;
  }
}
