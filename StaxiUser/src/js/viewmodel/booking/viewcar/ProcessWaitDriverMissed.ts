/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:26:11
 * @modify date 2018-07-17 03:26:11
 * @desc [Xử lý nhỡ cuốc]
*/

import CountDownTimer from "../../../../module/utils/CountDownTimer";
import BAMessage from "../../../../module/tcp/BAMessage";
import DriverMissedMessage from "../../../tcp/sent/DriverMissedMessage";
import ViewCarViewModel from "./ViewCarViewModel";

/**
 * xử lý khi nhỡ cuốc
 */
export default class ProcessWaitDriverMissed extends CountDownTimer {
    /** Thời gian mỗi lần gửi */
    private static TIMEOUT_RETRY_SENT = 5 * 1000;
  
    /* Số lượng retry khi gửi không thành công */
    private static TIME_RETRY = 5 * ProcessWaitDriverMissed.TIMEOUT_RETRY_SENT;
  
    private bMessage: BAMessage;

    private viewCarVM:ViewCarViewModel;
  
    constructor(viewCarVM:ViewCarViewModel) {
      super(
        ProcessWaitDriverMissed.TIME_RETRY,
        ProcessWaitDriverMissed.TIMEOUT_RETRY_SENT
      );
      this.viewCarVM = viewCarVM;
      this.bMessage = new BAMessage();
      this.bMessage.setWrapperData(new DriverMissedMessage());
    }
    public onTick(millisUntilFinished: number) {

      //thực hiện gửi nhầm xe lên server => đợi server hủy cuốc
      this.viewCarVM.sendBAMessageOnNetwork(this.bMessage);
    }
    onFinish() {

    }
  }