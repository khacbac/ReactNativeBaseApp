import Location from "./Location";
import ConnectionResult from "./ConnectionResult";
import LogFile from "../LogFile";
import OnLocationEventListener from "./OnLocationEventListener";

export default abstract class FusedLocation implements OnLocationEventListener{

  /** kết nối connection thành công */
  onConnected(option?: Object) {
    // LogFile.log("onConnected #######", option);
  }

  /** nhận trạng thái gps */
  onGpsStatusChanged(event: number) {
    // LogFile.e("onGpsStatusChanged #######", event);
  }

  /**
   * kết nối gps lỗi
   * @param option
   */
  onConnectionFailed(option?: ConnectionResult) {
    LogFile.log("onConnectionFailed #######", option);
  }

  /**lỗi đợi kết nối*/
  onConnectionSuspended(event?: number) {
    LogFile.log("onConnectionSuspended #######", event);
  }

   /** dữ liệu gửi lên server thành công hay không */
   abstract onLocationChanged(option?:Location);
}
