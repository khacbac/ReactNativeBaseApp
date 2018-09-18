/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:25:18
 * @modify date 2018-07-17 03:25:18
 * @desc [Lớp xử lý khi đợi nhật carInfo]
 */

import { NativeAppModule } from "../../../../module";
import ProcessClientCancel from "../../../viewmodel/booking/viewcar/ProcessClientCancel";
import ClientCancelMessage from "../../../tcp/sent/ClientCancelMessage";
import { MediaManager, UnitAlert, NativeLinkModule, Handler } from "../../../../module";
import strings from "../../../../res/strings";
import Constants from "../../../constant/Constants";
import LogFile from "../../../../module/LogFile";
import ViewCarViewModel from "./ViewCarViewModel";

export default class ProcessWaitCarInfo extends Handler {

  private viewcarViewModel: ViewCarViewModel;

  constructor(viewcarViewModel: ViewCarViewModel) {
    super();
    this.viewcarViewModel = viewcarViewModel;
  }

  start(timeout: number) {

    let startTime = new Date().getTime();

    LogFile.e("ProcessWaitCarInfo start: " + startTime);


    //hủy timeout trước nếu có
    this.cancel();

    //xử lý timeout
    this.postDelayed(async () => {
      console.log(
        "ProcessWaitCarInfo setTimeout: " + (new Date().getTime() - startTime)
      );

      //kiểm tra kết nối mạng
      let ret = await NativeAppModule.isEnableNetwork();

      //nếu có kết nối mạng thì hủy cuốc vì quá thời gian nhận
      if (ret) {
        
        this.viewcarViewModel.processClientCancel = new ProcessClientCancel(
          this.viewcarViewModel,
          ClientCancelMessage.TIMEOUT_CANCEL
        );
        this.viewcarViewModel.processClientCancel.start();
      } else {
        /* Hiện thị dialog */
        UnitAlert.get()
          .setMessage(strings.connected_server_time_out)
          .setPositiveText(strings.btn_ok)
          .setPositivePress(() => NativeLinkModule.openWifiSetting())
          .show();

        // Hiển thị thông báo nếu đang offscreen
        if (this.viewcarViewModel.isStopped()) {
          this.viewcarViewModel.removeNotification();
          MediaManager.addNotification(
            strings.book_carinfo_subtitle,
            strings.connected_server_time_out
          );
        }

        // Play sound
        MediaManager.playRingtone(Constants.TIME_RING_TONE_LONG);
      }
    }, timeout);
  }
}
