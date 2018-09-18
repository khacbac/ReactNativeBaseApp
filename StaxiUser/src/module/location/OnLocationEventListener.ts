import Location from "./Location";
import ConnectionResult from "./ConnectionResult";
import OnLocationChangeListener from "./OnLocationChangeListener";

export default interface OnLocationEventListener
  extends OnLocationChangeListener {
  /** kết nối connection thành công */
  onConnected(option?: Object);

  /** dữ liệu gửi lên server thành công hay không */
  onLocationChanged(option?: Location);

  /** nhận trạng thái gps */
  onGpsStatusChanged(event: number);

  /**
   * kết nối gps lỗi
   * @param option
   */
  onConnectionFailed(option?: ConnectionResult);

  /**lỗi đợi kết nối*/
  onConnectionSuspended(event?: number);
}