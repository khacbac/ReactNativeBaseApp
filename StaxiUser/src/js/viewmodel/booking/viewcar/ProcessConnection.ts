/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:27:12
 * @modify date 2018-07-17 03:27:12
 * @desc [Xử lý kết nối với server]
 */

import CountDownTimer from "../../../../module/utils/CountDownTimer";
import LogFile from "../../../../module/LogFile";
import { NativeTcpModule } from "../../../../module";
import ViewCarViewModel from "./ViewCarViewModel";

export default class ProcessConnection extends CountDownTimer {
  private static TIMEOUT_RETRY_SENT = 10 * 1000;

  private static TIME_RETRY = 3 * ProcessConnection.TIMEOUT_RETRY_SENT;

  private vm: ViewCarViewModel;

  constructor(vm: ViewCarViewModel) {
    super(ProcessConnection.TIME_RETRY, ProcessConnection.TIMEOUT_RETRY_SENT);
    this.vm = vm;
  }
  public async onTick(millisUntilFinished: number) {
    console.log("ProcessConnection =================", millisUntilFinished);
    LogFile.e(
      "onStart",
      "NativeTcpModule.TCP_IP: " +
        NativeTcpModule.TCP_IP +
        "; NativeTcpModule.TCP_PORT = " +
        NativeTcpModule.TCP_PORT +
        "; this.bookid = " +
        this.vm.bookid
    );

    NativeTcpModule.disconnect();

    //tạo kết nối tcp
    let isConnect = await NativeTcpModule.connect(this.vm.bookid);

    if (isConnect) {
      this.cancel();
      this.vm.tcpConnectSuccess();
    }
  }

  onFinish() {
    this.vm.tcpConnectFail();
  }
}
