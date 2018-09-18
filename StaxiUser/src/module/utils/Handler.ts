/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-08-09 05:22:09
 * @modify date 2018-08-09 05:22:09
 * @desc [xử lý delay tiến trình => thời gian tôi đa chỉ MAX_TIMER_DURATION_MS
 *  nếu vượt quá chỉ gán bằng ngưỡng này tránh bị cảnh báo RN:
 * Setting a timer for a long period of time, i.e. multiple minutes, 
 * is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. 
 * See https://github.com/facebook/react-native/issues/12981 for more info.
 * ]
*/

export default class Handler {
  /** thời gian tối đa cho timeout */
  public static MAX_TIMER_DURATION_MS = 60 * 1000;

  private key: number;

  private isCancel: boolean;

  public postDelayed(runable: Function, delayMillis?: number): number {
    if (runable == undefined) return;

    this.isCancel = false;

    // thiết lập lại giá trị timer
    delayMillis = delayMillis || 0;
    if(delayMillis > Handler.MAX_TIMER_DURATION_MS){
        delayMillis = Handler.MAX_TIMER_DURATION_MS;
    }

    //xử lý timeout
    this.key = setTimeout(async () => {
      console.log("postDelayed setTimeout: " + new Date().getTime());
      if (this.isCancel) return;
      runable && runable();
      this.key = undefined;
    }, delayMillis);

    console.log("postDelayed setTimeout key: " + this.key);
    return this.key;
  }

  public cancel() {
    this.isCancel = true;
    if (this.key != undefined) clearTimeout(this.key);
    this.key = undefined;
  }
}
