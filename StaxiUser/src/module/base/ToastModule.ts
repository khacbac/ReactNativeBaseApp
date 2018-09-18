import { ToastAndroid, Platform, NativeModules } from "react-native";

export default class ToastModule {
  private static Toast: ToastAndroid =
    Platform.OS === "android" ? ToastAndroid : NativeModules.ToastModule;

  public static show(message: string, duration?: number, gravity?: number): void {
    if (ToastModule.Toast == null) return;
    ToastModule.Toast.showWithGravity(
      message,
      duration || ToastModule.Toast.SHORT,
      gravity || ToastModule.Toast.CENTER
    );
  }
  /** `gravity` may be ToastAndroid.TOP, ToastAndroid.BOTTOM, ToastAndroid.CENTER */
  public static showWithGravity(
    message: string,
    gravity?: number
  ): void {
    this.show(message, ToastModule.Toast.SHORT, gravity || ToastModule.Toast.CENTER);
  }
}
