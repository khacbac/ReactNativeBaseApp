import { NativeModules, EventSubscriptionVendor } from "react-native";
import NativeEventProcess from "./NativeEventProcess";
import PlatformOS from "../PlatformOS";

export default class ActivityResultModule extends NativeEventProcess {
  private static isAndroid = PlatformOS.isAndroid();
  /**
   * nhận sự kiện onActivityResult
   */
  public static ON_ACTIVITY_RESULT_KEY = ActivityResultModule.isAndroid
    ? NativeModules.ActivityResultModule.ON_ACTIVITY_RESULT_KEY
    : "ON_ACTIVITY_RESULT_KEY";

  /**
   * mã nhận sự kiện
   */
  public static ON_ACTIVITY_REQUEST_CODE = ActivityResultModule.isAndroid
    ? NativeModules.ActivityResultModule.ON_ACTIVITY_REQUEST_CODE
    : "ON_ACTIVITY_REQUEST_CODE";

  /**
   * kết quả sự kiện
   */
  public static ON_ACTIVITY_RESULT_CODE = ActivityResultModule.isAndroid
    ? NativeModules.ActivityResultModule.ON_ACTIVITY_RESULT_CODE
    : "ON_ACTIVITY_RESULT_CODE";

  /**
   * nhận sự kiện onNewIntent
   */
  public static ON_NEW_INTENT = ActivityResultModule.isAndroid
    ? NativeModules.ActivityResultModule.ON_NEW_INTENT
    : "ON_NEW_INTENT";

  /** module xử lý */
  public getModule(): EventSubscriptionVendor {
    return NativeModules.ActivityResultModule;
  }

  /** phân loại sự kiện */
  public getEventType(): string {
    return ActivityResultModule.ON_ACTIVITY_RESULT_KEY;
  }

  /**
   * bắt đầu start đối tượng nhận xử lý
   * @param onResultOk 
   * @param onResultCancel 
   */
  public start(onResultOk:Function, onResultCancel?:Function) {
    super.setListener(event => {
    //   console.log("ActivityResultModule: ", event);

      if (event.ON_ACTIVITY_RESULT_CODE == 0) {
        onResultOk(event.ON_ACTIVITY_REQUEST_CODE);
      } else {
        onResultCancel(event.ON_ACTIVITY_REQUEST_CODE);
      }
    });
  }
}
