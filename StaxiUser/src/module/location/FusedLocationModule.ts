import { NativeModules } from "react-native";
import Location from "./Location";
import ConnectionResult from "./ConnectionResult";
import NativeEventProcess from "../base/NativeEventProcess";
import LogFile from "../LogFile";
import OnLocationEventListener from "./OnLocationEventListener";
import { LatLng } from "..";
import GpsStatus from "./GpsStatus";

/**
 * lớp xử lý kết nối gps
 */
export default class FusedLocationModule extends NativeEventProcess {
  /**
   * Key nhận sự kiện từ LOCATION đẩy xuống RN
   */
  public static LOCATION_EVENT_KEY =
    NativeModules.FusedLocationModule.LOCATION_EVENT_KEY;

  /**
   * Loại sự kiện đẩy xuống
   */
  public static LOCATION_EVENT_KEY_TYPE =
    NativeModules.FusedLocationModule.LOCATION_EVENT_KEY_TYPE;

  /**
   * key xác nhận kết nối vị trí
   */
  public static TYPE_LOCATION_CONNECTED =
    NativeModules.FusedLocationModule.TYPE_LOCATION_CONNECTED;

  /**
   * key xác nhận kết nối lỗi
   */
  public static TYPE_LOCATION_FAILED =
    NativeModules.FusedLocationModule.TYPE_LOCATION_FAILED;

  /**
   * key kết nối suspend
   */
  public static TYPE_LOCATION_SUSPENDED =
    NativeModules.FusedLocationModule.TYPE_LOCATION_SUSPENDED;

  /**
   * key trạng thái gps
   */
  public static TYPE_GPS_STATUS =
    NativeModules.FusedLocationModule.TYPE_GPS_STATUS;

  /**
   * key dữ liệu vị trí
   */
  public static TYPE_LOCATION_DATA =
    NativeModules.FusedLocationModule.TYPE_LOCATION_DATA;

  /**
   * key thay đổi vị trí
   */
  public static TYPE_LOCATION_CHANGE =
    NativeModules.FusedLocationModule.TYPE_LOCATION_CHANGE;

  /** danh sách các listener lắng nghe vị trí*/
  private onLocationEventListener: OnLocationEventListener;

   /* Trạng thái gps */
  private gpsStatus:number = -1;
  
   /** vị trí mới nhất */
  private lastLocation: Location;

  constructor(){
      super();
  }

  public static isEnableLocation(): Promise<boolean> {
    return NativeModules.FusedLocationModule.isEnableLocation();
  }

  public static openLocationSetting(): Promise<boolean> {
    return NativeModules.FusedLocationModule.openLocationSetting();
  }

  public static startLocationUpdates(): Promise<boolean> {
    return NativeModules.FusedLocationModule.startLocationUpdates();
  }

  public static stopLocationUpdates(): Promise<boolean> {
    return NativeModules.FusedLocationModule.stopLocationUpdates();
  }

  public async stopOnEvent() {
    //ngừng nhận vị trí
    let ret = NativeModules.FusedLocationModule.stopLocationUpdates();
  }

  /**
   * start lắng nghe vị trí
   * @param onLocationEventListener
   */
  public async startOnEvent(onLocationEventListener?: OnLocationEventListener) {
    //gán đối tượng lắng nghe
    this.onLocationEventListener = onLocationEventListener;

    try {
      //start location
      await NativeModules.FusedLocationModule.startLocationUpdates();
      // console.log("FusedLocation start", ret);

      super.setListener(event => {
        // console.log(new Date().getTime(), event);
        //nếu kết nối không thành công thì hủy sự kiện
        let data = event.TYPE_LOCATION_DATA;
        //kiểm tra các event trả về
        if (
          event.LOCATION_EVENT_KEY_TYPE == FusedLocationModule.TYPE_GPS_STATUS
        ) {
          this.onGpsStatusChanged(data);
        } else if (
          event.LOCATION_EVENT_KEY_TYPE ==
          FusedLocationModule.TYPE_LOCATION_CHANGE
        ) {
          this.onLocationChanged(data);
        } else if (
          event.LOCATION_EVENT_KEY_TYPE ==
          FusedLocationModule.TYPE_LOCATION_CONNECTED
        ) {
          this.onConnected(data);
        } else if (
          event.LOCATION_EVENT_KEY_TYPE ==
          FusedLocationModule.TYPE_LOCATION_FAILED
        ) {
          this.onConnectionFailed(data);
        } else if (
          event.LOCATION_EVENT_KEY_TYPE ==
          FusedLocationModule.TYPE_LOCATION_SUSPENDED
        ) {
          this.onConnectionSuspended(data);
        }
      }, this);
    } catch (error) {
      LogFile.e("startOnEvent", error);
      this.onConnectionFailed(null);
    }
  }

  public getModule() {
    return NativeModules.FusedLocationModule;
  }

  public getEventType() {
    return FusedLocationModule.LOCATION_EVENT_KEY;
  }

  /** kết nối connection thành công */
  async onConnected(option?: Object) {
    // LogFile.log("onConnected #######", option);

    //nếu ko có vị trí thì thông báo ngừng gps
    if(this.getCurrentLatLng() == null){
      this.onGpsStatusChanged(GpsStatus.GPS_EVENT_STOPPED);
      return;
    }

    //kiểm tra có enable gps ko
    let ret = await FusedLocationModule.isEnableLocation();

    if(!ret){
      this.onGpsStatusChanged(GpsStatus.GPS_EVENT_STOPPED);
      return;
		}
    
    this.onGpsStatusChanged(GpsStatus.GPS_EVENT_STARTED);
  }

  /** dữ liệu gửi lên server thành công hay không */
  onLocationChanged(option?: Location) {
    // console.log("onLocationChanged #######", option);

    this.lastLocation = option;

    //đẩy cho các tiến trình con
    if (this.onLocationEventListener != null) {
      this.onLocationEventListener.onLocationChanged(option);
    }
  }

  /** nhận trạng thái gps */
  onGpsStatusChanged(event: number) {
    // LogFile.e("onGpsStatusChanged #######", event);
    if (this.gpsStatus != event) {
      this.gpsStatus = event;
      
			// Cập nhật trạng thái lên giao diện
      if (this.onLocationEventListener != null) {
        this.onLocationEventListener.onGpsStatusChanged(event);
      }
		}
  }

  /**
   * kết nối gps lỗi
   * @param option
   */
  onConnectionFailed(option?: ConnectionResult) {
    LogFile.log("onConnectionFailed #######", option);

    this.onGpsStatusChanged(GpsStatus.GPS_EVENT_STOPPED);

    //đẩy cho các tiến trình con
    if (this.onLocationEventListener != null) {
      this.onLocationEventListener.onConnectionFailed(option);
    }
  }

  /**lỗi đợi kết nối*/
  onConnectionSuspended(event?: number) {
    LogFile.log("onConnectionSuspended #######", event);

    //đẩy cho các tiến trình con
    if (this.onLocationEventListener != null) {
      this.onLocationEventListener.onConnectionSuspended(event);
    }
  }

  public setOnLocationChangeListener(
    onLocationEventListener?: OnLocationEventListener
  ) {
    return (this.onLocationEventListener = onLocationEventListener);
  }

  /** trả về danh sách mảng còn lại */
  public removeOnLocationChangeListener() {
    this.onLocationEventListener = null;
  }

  public getCurrentLocation(): Location {
    return this.lastLocation;
  }

  public getCurrentLatLng(): LatLng {
    if (this.lastLocation == null) return null;

    return new LatLng(this.lastLocation.latitude, this.lastLocation.longitude);
  }
}
