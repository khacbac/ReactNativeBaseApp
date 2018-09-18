import { NativeModules, Platform, EventSubscriptionVendor } from "react-native";
import NativeEventProcess from "./NativeEventProcess";
import PlatformOS from "../PlatformOS";

export default class LifeCycleModule extends NativeEventProcess {
  private static isAndroid = PlatformOS.isAndroid();

  /**
   * nhận sự kiện LifeCycle
   */
  public static LIFE_CYCLE_EVENT_KEY = LifeCycleModule.isAndroid
    ? NativeModules.LifeCycleModule.LIFE_CYCLE_EVENT_KEY
    : "LIFE_CYCLE_EVENT_KEY";

  /**
   * mã nhận các loại sự kiện
   */
  public static LIFE_CYCLE_TYPE = LifeCycleModule.isAndroid
    ? NativeModules.LifeCycleModule.LIFE_CYCLE_TYPE
    : "LIFE_CYCLE_TYPE";

  /**
   * kết quả sự kiện
   */
  public static LIFE_CYCLE_RESUME = LifeCycleModule.isAndroid
    ? NativeModules.LifeCycleModule.LIFE_CYCLE_RESUME
    : 1;

  /**
   * nhận sự kiện khi pause
   */
  public static LIFE_CYCLE_PAUSE = LifeCycleModule.isAndroid
    ? NativeModules.LifeCycleModule.LIFE_CYCLE_PAUSE
    : 2;

  /**
   * nhận sự kiện khi pause
   */
  public static LIFE_CYCLE_DESTROY = LifeCycleModule.isAndroid
    ? NativeModules.LifeCycleModule.LIFE_CYCLE_DESTROY
    : 3;

  /** module xử lý */
  public getModule(): EventSubscriptionVendor {
    if (LifeCycleModule.isAndroid) return NativeModules.LifeCycleModule;

    return null;
  }

  /** phân loại sự kiện */
  public getEventType(): string {
    return LifeCycleModule.LIFE_CYCLE_EVENT_KEY;
  }

  /**
   * bắt đầu start đối tượng nhận xử lý
   * @param onResultOk
   * @param onResultCancel
   */
  public start(lifecycleEventListener: LifecycleEventListener) {
    //start ko nhận sự kiện
    if (lifecycleEventListener == null) return;

    super.setListener(event => {
      if (event.LIFE_CYCLE_TYPE == LifeCycleModule.LIFE_CYCLE_RESUME) {
        lifecycleEventListener.onHostResume();
      } else if (event.LIFE_CYCLE_TYPE == LifeCycleModule.LIFE_CYCLE_PAUSE) {
        lifecycleEventListener.onHostPause();
      } else if (event.LIFE_CYCLE_TYPE == LifeCycleModule.LIFE_CYCLE_DESTROY) {
        lifecycleEventListener.onHostDestroy();
      }
    });
  }
}

export interface LifecycleEventListener {

  /** khi ứng dụng bắt đầu hiện thị lên foreground */
  onHostResume();

  /** khi ứng dụng bắt đầu chạy xuống background */
  onHostPause();

  /** khi ứng dụng bắt đầu bị tắt */
  onHostDestroy();
}
