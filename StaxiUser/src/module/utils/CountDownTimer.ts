import { Utils } from "..";
import LogFile from "../LogFile";

export default abstract class CountDownTimer {
  /**
   * thời gian khi kết thúc
   */
  private mMillisInFuture: number;

  /**
   * đoạn thời gian mà có thể gọi lại
   */
  private mCountdownInterval: number;

  /** thời gian kết thúc */
  private mStopTimeInFuture: number;

  /**
   * boolean representing if the timer was cancelled
   */
  private mCancelled: boolean = false;

  /**
   * handle xử lý timeout
   */
  private mHandler;

  private startTimeOut;

  /**
   * @param millisInFuture The number of millis in the future from the call
   *   to {@link #start()} until the countdown is done and {@link #onFinish()}
   *   is called.
   * @param countDownInterval The interval along the way to receive
   *   {@link #onTick(long)} callbacks.
   */

  public constructor(millisInFuture: number, countDownInterval: number) {
    this.mMillisInFuture = millisInFuture;
    this.mCountdownInterval = countDownInterval;
  }

  /**
   * Cancel the countdown.
   */
  public cancel() {
    this.mCancelled = true;
    if (!this.mHandler) {
      clearTimeout(this.mHandler);
    }
  }

  /**
   * Start the countdown.
   */
  public start(): CountDownTimer {
    // LogFile.log(
    //   `CountDownTimer start: ${this.mMillisInFuture} - ${
    //     this.mCountdownInterval
    //   }`
    // );
    this.mCancelled = false;

    //nếu ko cấu hình thời gian kết thúc thì cho kết thúc luôn
    if (this.mMillisInFuture <= 0) {
      this.onFinish();
      return this;
    }

    //gán thời gian kết thúc
    this.mStopTimeInFuture = new Date().getTime() + this.mMillisInFuture;

    // LogFile.log(
    //     `mStopTimeInFuture: mStopTimeInFuture = ${this.mStopTimeInFuture}`
    //   );

    //clear những handle cũ
    if (!this.mHandler) {
      clearTimeout(this.mHandler);
    }

    //thực hiện retry
    this.setTimeoutCountDown(0);

    return this;
  }

  private setTimeoutCountDown(timeDelay?: number) {
    // this.onTick(this.mMillisInFuture);

    this.startTimeOut = new Date().getTime();
    LogFile.log(
      `setTimeoutCountDown: timeDelay = ${timeDelay} time = ${
        this.startTimeOut
      }}`
    );

    this.mHandler = setTimeout(() => {

      let date = new Date().getTime();
      LogFile.log(
        `CountDownTimer setTimeout: ${Utils.formatTime(
          date
        )} timeDelay = ${timeDelay} time = ${date} delTime = ${date -
          this.startTimeOut}, mCancelled = ${this.mCancelled}`
      );

      //nếu hủy rồi thì bỏ qua
      if (this.mCancelled) {
        return;
      }

      //lấy thời gian còn lại
      let millisLeft = this.mStopTimeInFuture - new Date().getTime();

      // LogFile.log(`CountDownTimer start: millisLeft = ${millisLeft}`);

      //nếu hết thời gian thì kết thúc
      if (millisLeft <= 0) {
        // LogFile.log(`CountDownTimer finish ..................`);
        this.onFinish();
        return;
      }

      //lấy thời gian bắt đầu ontict
      let lastTickStart = new Date().getTime();

      //xử lý trong ontict
      // LogFile.log(`CountDownTimer onTick ..................`);
      this.onTick(millisLeft);

      //trừ thời gian thực hiện trong hàm onTick
      let lastTickDuration = new Date().getTime() - lastTickStart;

      // LogFile.log(`lastTickDuration = ${lastTickDuration}`);

      let delay;

      //kiểm tra thời gian còn lại nhỏ hơn thời gian lặp hay không
      if (millisLeft < this.mCountdownInterval) {
        //thời gian còn lại trừ đi thời sử dụng trong hàm onTick
        delay = millisLeft - lastTickDuration;

        //kết thúc luôn
        if (delay < 0) {
          // LogFile.log(`CountDownTimer finish ..................`);
          this.onFinish();
          return;
        }
      } else {
        //thời gian delay còn lại sau khi chạy hàm onTick
        delay = this.mCountdownInterval - lastTickDuration;

        //công thời gian cho đến khi có delay => vì ko biết thời gian xử lý bao lâu
        while (delay < 0) {
          delay += this.mCountdownInterval;
        }
      }
      // this.mStopTimeInFuture = new Date().getTime();

      // LogFile.log(`delay = ${delay}`);
      this.setTimeoutCountDown(delay);
    }, timeDelay);
  }

  /**
   * Callback fired when the time is up.
   */
  public abstract onFinish();

  /**
   * Callback fired on regular interval.
   * @param millisUntilFinished The amount of time until finished.
   */
  public abstract onTick(millisUntilFinished: number);
}
