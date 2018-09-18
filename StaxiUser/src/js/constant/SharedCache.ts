/**
 * Lưu trữ một số dữ liệu cố định lên ổ cứng
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:22:39
 * @modify date 2018-07-10 08:22:39
 * @desc [description]
 */

import { AsyncStorage } from "react-native";
import Language from "../../module/model/Language";
import Constants from "./Constants";
import { LatLng } from "../../module";
import LogFile from "../../module/LogFile";
import BAAddress from "../model/BAAddress";

export default class SharedCache {
  private static CIPHER_KEY = "CIPHER_KEY";
  /* Kiểm tra xem ứng dụng đã được cài đặt hay chưa */
  private static SYNC_AVAILABLE_UPDATE = "APP_SYNC_AVAILABLE_VERSION_NEW";

  private static SEARCH_OPTIONS = "SEARCH_OPTIONS";

  private static TIME_WAIT_SMS = "TIME_WAIT_SMS";
  private static LASTEST_LOCATION = "LASTEST_LOCATION";
  private static SETTING_CONFIG = "SETTING_CONFIG";

  private static SESSION_KEY = "CIPHER_KEY";
  private static RF_ID = "RF_ID";

  private static LANGUAGE = "LANGUAGE";

  /* Trạng thái open app hiển thị màn hình giới thiệu xe sân bay */
  private static CAR_AIRPORT_SHOW_REVIEW = "CAR_AIRPORT_SHOW_REVIEW";

  private static async getItem(key: string, defaultValue?: any) {
    try {
      let ret = await AsyncStorage.getItem(key);
      return Promise.resolve(ret);
    } catch (error) {
      return Promise.resolve(defaultValue);
    }
  }

  /* Lấy thời gian đợi sms */
  public static async getSmsWaitTime(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(this.TIME_WAIT_SMS);
      return Promise.resolve(parseInt(value));
    } catch (error) {
      return Promise.resolve(new Date().getTime());
    }
  }

  /* Thiết lập thời gian đợi */
  public static async setSmsWaitTime(newVersion: number): Promise<boolean> {
    try {
      await this.setItem(this.TIME_WAIT_SMS, newVersion);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  /* Lấy thông tin cài đặt */
  public static async getLanguage(): Promise<Language> {
    try {
      let ret = await AsyncStorage.getItem(this.LANGUAGE);
      if (ret) {
        return Promise.resolve(parseInt(ret));
      } else {
        return Promise.resolve(Language.VN);
      }
    } catch (error) {
      return Promise.resolve(Language.VN);
    }
  }

  /* Thiết lập thời gian đợi */
  public static async setLanguage(language: Language) {
    return this.setItem(this.LANGUAGE, language);
  }

  private static async setItem(key: string, value: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value.toString());
      return Promise.resolve(true);
    } catch (error) {
      LogFile.e("SharedCache setItem", error.message || error);
      return Promise.resolve(false);
    }
  }

  /* Lấy thời gian hiện tại của server */
  public static getServerTime(): number {
    return new Date().getTime() + Constants.DELTA_TIME_SERVER;
  }

  /* Lấy thời gian đợi sms */
  public static async getLastestLocation(): Promise<BAAddress> {
    let baAddress: BAAddress = new BAAddress();
    try {
      //   LogFile.log("getLastestLocation$$$$ %%%%%%%%%%%%%");
      //lấy vị trí cũ
      let str = await AsyncStorage.getItem(this.LASTEST_LOCATION);

      if (str != null && str.length != 0) {
        let locs = JSON.parse(str);
        baAddress.location = new LatLng(locs.latitude, locs.longitude);
        baAddress.formattedAddress = locs.address;
      } else {
        // Vị trí hồ hoàn kiếm
        baAddress.location = new LatLng(21.029051, 105.852499);
        baAddress.formattedAddress = "Hàng Trống, Hoàn Kiếm, Hanoi";
      }
    } catch (error) {
      LogFile.log("getLastestLocation", error);
      baAddress.location = new LatLng(21.029051, 105.852499);
      baAddress.formattedAddress = "Hàng Trống, Hoàn Kiếm, Hanoi";
    }

    return Promise.resolve(baAddress);
  }

  /* Thiết lập vị trí sử dụng cuối gần nhất */
  public static setLastestLocation(baAddress: BAAddress) {
    if (baAddress == null) return;

    return this.setItem(
      this.LASTEST_LOCATION,
      JSON.stringify({ latitude: baAddress.location.latitude, longitude: baAddress.location.longitude, address: baAddress.formattedAddress })
    );
  }


}
