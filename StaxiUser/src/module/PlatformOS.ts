import { Platform } from "react-native";

export default class PlatformOS{
    public static ios() {
        return Platform.OS === "ios";
      }
    
      public static isAndroid() {
        return Platform.OS === "android";
      }
}