/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:48:18
 * @modify date 2018-07-10 02:48:18
 * @desc [Lớp xử lý chung cho các bản tin gửi lên server]
*/

import { BAMessageType } from "../../../module/tcp/BAMessageType";
import Constants from "../../constant/Constants";
import ISentMessage from "../../../module/tcp/ISentMessage";
import TcpCallBack from "../../../module/tcp/TcpCallBack";

export default abstract class AbstractSentMessage implements ISentMessage{
  /** Thời gian timeout cho 1 message khi gửi */
  public static MESSAGE_TIMEOUT = 20; // 20s

  /**Thời gian timeout nhỏ nhất khi gửi đến khi nhận message*/
  public static MIN_TIMEOUT = 10; // 10s

  /**Thời gian để thực hiện gửi lại message*/
  public static RETRY_TIMEOUT = 5;

  /**Trạng thái xử lý cho các trường hợp message gửi bị lỗi cần relogin lại**/
  public isReconnectState = false;

  /**Trạng thái đã nhận message chưa*/
  public isHasRecvMessage: boolean;

  private timeoutCallback: TimeoutCallback;

  /**Loại timeout để xử lý relogin như thế nào*/
  protected mTimeoutType: TimeoutType = TimeoutType.NONE;

  private onRetryListener: OnRetryListener;

  private callback:TcpCallBack;

  /**
   * Thời gian timeout xử lý cho message gửi, đợi message trả lời
   * @return
   */
  public getTimeout(): number {
    return AbstractSentMessage.MIN_TIMEOUT;
  }

  /**
   * hàm này trả về trạng thái có xử lý khi có một message bị timeout không
   * @return
   */
  public getTimeoutType(): TimeoutType {
    return this.mTimeoutType;
  }

  /**
   * hàm này trả về loại message nhận
   * @return
   */
  public getReceivedMessageType(): BAMessageType {
    return null;
  }

  public isReconnect():boolean{
    return this.isReconnectState;
  }

  /**
   * Thời gian timeout xử lý cho  1 lần gửi nhận message
   * @return
   */
  public getRetryTime(): number {
    return AbstractSentMessage.RETRY_TIMEOUT;
  }

  public abstract getSentMessageType(): BAMessageType;

  public getSentTime(): number {
    return new Date().getTime() + Constants.DELTA_TIME_SERVER;
  }

  public getTimeoutCallback(): TimeoutCallback {
    return this.timeoutCallback;
  }

  public setTimeoutCallback(timeoutCallback: TimeoutCallback) {
    this.timeoutCallback = timeoutCallback;
  }

  public getOnRetryListener(): OnRetryListener {
    return this.onRetryListener;
  }

  public setOnRetryListener(onRetryListener: OnRetryListener) {
    this.onRetryListener = onRetryListener;
  }

  public removeTimeoutCallBack() {
    this.timeoutCallback = null;
    this.mTimeoutType = TimeoutType.NONE;
  }

  public removeAllCallBackObject() {
    this.removeTimeoutCallBack();
    this.onRetryListener = null;
  }

  public getCallback()  {
    return this.callback;
}

public setCallback(callback:TcpCallBack) {
    this.callback = callback;
}
}

interface TimeoutCallback {
  onTimeout(message: AbstractSentMessage): boolean;
}

interface OnRetryListener {
  /**hủy retry hay không**/
  isCancel(): boolean;

  /**Thời gian để thự hiện lại**/
  onFinish(message: AbstractSentMessage);
}

/**
 * Các loại xử lý khi timeout
 */
enum TimeoutType {
  /**Không xử lý message này khi có timeout*/
  NONE,

  /**Sẽ relogin lại khi nhận trạng thái này*/
  RELOGIN,

  /**Chuyển vào giao diện xử lý**/
  DO_IN_UI
}

export { TimeoutType, OnRetryListener, TimeoutCallback };
