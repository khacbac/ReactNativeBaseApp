import { Platform } from "react-native";
class IOSVersion {
  public static ios() {
    return Platform.OS === "ios";
  }
  public static iOS8(): boolean {
    return IOSVersion.ios() && Platform.Version >= 8;
  }
  public static iOS9(): boolean {
    return IOSVersion.ios() && Platform.Version >= 9;
  }

  public static iOS10(): boolean {
    return IOSVersion.ios() && Platform.Version >= 10;
  }

  public static iOS11(): boolean {
    return IOSVersion.ios() && Platform.Version >= 11;
  }

  public static iOS12(): boolean {
    return IOSVersion.ios() && Platform.Version >= 12;
  }
  /**
   * @param apiLevel
   *            minimum API level version that has to support the device
   * @return true when the caller API version is at least apiLevel
   */
  public static isAtLeastAPI(apiLevel: number) {
    return IOSVersion.ios() && Platform.Version >= apiLevel;
  }
}

export default IOSVersion;
