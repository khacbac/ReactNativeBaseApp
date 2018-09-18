/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:27:12
 * @modify date 2018-07-17 03:27:12
 * @desc [Xử lý khi nhận lệnh]
*/

import CountDownTimer from "../../../../module/utils/CountDownTimer";

export default class ProcessCommandInfo extends CountDownTimer {
    private static TIMEOUT_RETRY_SENT = 5 * 1000;
  
    private static TIME_RETRY = 3 * ProcessCommandInfo.TIMEOUT_RETRY_SENT;
  
    constructor() {
      super(ProcessCommandInfo.TIME_RETRY, ProcessCommandInfo.TIMEOUT_RETRY_SENT);
    }
    public onTick(millisUntilFinished: number) {}
  
    onFinish() {}
  }