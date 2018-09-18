import CountDownTimer from "../../../../module/utils/CountDownTimer";
import BAMessage from "../../../../module/tcp/BAMessage";
import ViewCarViewModel from "./ViewCarViewModel";
import ClientCancelMessage from "../../../tcp/sent/ClientCancelMessage";
import LogFile from "../../../../module/LogFile";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:23:07
 * @modify date 2018-07-17 03:23:07
 * @desc [xử lý hủy cuốc: gửi 5 lần cho đến khi có ack trả về hủy thành công]
*/
export default class ProcessClientCancel extends CountDownTimer {
    /** thời gian timeout sau 1 lần */
    private static TIMEOUT = 5 * 1000;
  
    /*** số thời gian xử lý */
    private static NUNBER_RETRY = 10 * ProcessClientCancel.TIMEOUT;
  
    private bMessage: BAMessage;
  
    private static isDestroy: boolean = false;
  
    private startTime;
  
    private viewcarVM: ViewCarViewModel;
  
    constructor(viewcarVM: ViewCarViewModel, cancelType) {
      super(ProcessClientCancel.NUNBER_RETRY, ProcessClientCancel.TIMEOUT);
      this.viewcarVM = viewcarVM;
      this.bMessage = new BAMessage();
      this.bMessage.setWrapperData(new ClientCancelMessage(cancelType));
  
      this.startTime = new Date().getTime();
      console.log("ProcessClientCancel start: " + this.startTime);
    }
    public onTick(millisUntilFinished: number) {
      console.log(
        "ProcessClientCancel onTick: " + (new Date().getTime() - this.startTime)
      );
  
      // hủy người dùng đặt xe
      if (ProcessClientCancel.isDestroy) {
        this.onFinish();
        return;
      }
  
      //xử lý gửi khi có mạng
      this.viewcarVM.sendBAMessageOnNetwork(this.bMessage);
    }
  
    onFinish() {
      LogFile.e("ProcessClientCancel onFinish ===================");
      this.viewcarVM.doClientCancelMessage();
    }
  
    /* Hủy timeout khi người dùng hủy đặt xe */
    public static killClientCancelThread() {
      this.isDestroy = true;
    }
  }