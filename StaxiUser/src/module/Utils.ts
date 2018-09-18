/**
 * Lớp tiện ích => sử dụng một số hàm chung
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:27:36
 * @modify date 2018-07-10 08:27:36
 * @desc [description]
 */

import { Platform, NetInfo } from "react-native";
import StringBuilder from "./model/StringBuilder";
import { LatLng } from ".";
import SphericalUtil from "./maps/SphericalUtil";
import images from "../res/images";

const uuidv1 = require('uuid/v1');

class Utils {
  /**
   * Converts a JS string to a UTF-8 "byte" array.
   * @param {string} str 16-bit unicode string.
   * @return {!Array<number>} UTF-8 byte array.
   */
  public static stringToUtf8ByteArray(str: string) {
    var out = [],
      p = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else if (c < 2048) {
        out[p++] = (c >> 6) | 192;
        out[p++] = (c & 63) | 128;
      } else if (
        (c & 0xfc00) == 0xd800 &&
        i + 1 < str.length &&
        (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00
      ) {
        // Surrogate Pair
        c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
        out[p++] = (c >> 18) | 240;
        out[p++] = ((c >> 12) & 63) | 128;
        out[p++] = ((c >> 6) & 63) | 128;
        out[p++] = (c & 63) | 128;
      } else {
        out[p++] = (c >> 12) | 224;
        out[p++] = ((c >> 6) & 63) | 128;
        out[p++] = (c & 63) | 128;
      }
    }
    return out;
  }

  /**
   * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
   * @param {Uint8Array|Array<number>} bytes UTF-8 byte array.
   * @return {string} 16-bit Unicode string.
   */
  public static utf8ByteArrayToString(bytes: Array<number>) {
    var out = [],
      pos = 0,
      c = 0;
    while (pos < bytes.length) {
      var c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        var c2 = bytes[pos++];
        out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else if (c1 > 239 && c1 < 365) {
        // Surrogate Pair
        var c2 = bytes[pos++];
        var c3 = bytes[pos++];
        var c4 = bytes[pos++];
        var u =
          (((c1 & 7) << 18) |
            ((c2 & 63) << 12) |
            ((c3 & 63) << 6) |
            (c4 & 63)) -
          0x10000;
        out[c++] = String.fromCharCode(0xd800 + (u >> 10));
        out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
      } else {
        var c2 = bytes[pos++];
        var c3 = bytes[pos++];
        out[c++] = String.fromCharCode(
          ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
      }
    }
    return out.join("");
  }

  public static arraycopy(
    src: Array<number>,
    srcPos: number,
    dest: Array<number>,
    destPos: number,
    length: number
  ) {
    let size = length + srcPos;
    if (src.length < size) {
      size = src.length;
    }

    for (var i = srcPos, j = destPos; i < size; i++ , j++) {
      dest[j] = src[i];
    }
  }


  /**
   * sinh ra số nguyên nhỏ hơn giá trị max
   * @param max: giá trị lớn nhất được truyền vào
   */
  public static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * lấy giá trị byte random
   * @param bytes
   */
  public static nextBytes(size: number): number[] {
    let ByteSIZE = 8;
    let bytes: number[] = new Array(size);
    // Log.e("nextBytes -------" + bytes);
    for (let i = 0, len = size; i < len;) {
      for (
        let rnd = this.getRandomInt(32), n = Math.min(len - i, 4);
        n-- > 0;
        rnd >>= ByteSIZE
      ) {
        bytes[i++] = rnd;
      }
    }
    return bytes;
  }

  /* Tạo khóa ngẫu nhiên từ 20-30 ký tự */
  public static createKeys(min: number, max: number): string {
    let len = this.getRandomInt(max - min + 1) + min;
    let sb: string = "";
    for (let i = 0; i < len; i++) {
      sb += String.fromCharCode(this.getRandomInt(127 - 48 + 1) + 48);
    }
    return sb;
  }

  /**
   * Kiểm tra xem tọa độ này có phải là tọa độ (0,0)
   *
   * @param location
   * @return
   */
  public static isOriginLocation(location: {
    latitude: number;
    longitude: number;
  }): boolean {
    /* Nếu không có vị trí */
    if (location == null) return true;

    /* vị trí tâm xích đạo */
    if (location.latitude != 0 && location.longitude != 0) {
      return false;
    }

    return true;
  }

	/*
	 * Kiểm tra vị trí hiện tại có phải là vị trí GPS
	 * @param location
	 * @return true nếu vị trí hiện tại là vị trí GPS
	 */
  public static isCurrentLocation(location: LatLng, currentLocation: LatLng): boolean {
    if (this.isOriginLocation(location) || this.isOriginLocation(currentLocation)) {
      return false;
    }

    // Kiểm tra khoảng cách
    return SphericalUtil.isBetweenLatlng(location, currentLocation);
    // if (!SphericalUtil.isBetweenLatlng(location, currentLocation)) {
    // 	return false;
    // }
    // return true;
  }

  /**
   * chuỗi rỗng
   * @param str
   */
  public static isEmpty(str: string): boolean {
    return !str || !str.trim();
  }

  /**
   * đối tượng null
   * @param object
   */
  public static isNull(object): boolean {
    return typeof object === "undefined" || object === null;
  }

  /**
   * Tạo UUID
   * Kiểm tra xem tọa độ này có phải là tọa độ (0,0)
   *
   * @param location
   * @return
   */
  public static genUUID(): string {
    return uuidv1();
  }

  /* Kiểm tra định dạng số điện thoại */
  public static isValidPhone(phone): boolean {
    var re = /^08\d{8}$|^09\d{8}$|^01\d{9}$/;
    return re.test(phone);
  }

  /* Cut số điện thoại */
  public static trimPhone(phone: string): string {
    if (phone === undefined)
      return '';
    if (phone.startsWith("+849") && phone.length == 12) {
      phone = phone.substring(3);
    } else if (phone.startsWith("+848") && phone.length == 12) {
      phone = phone.substring(3);
    } else if (phone.startsWith("+841") && phone.length == 13) {
      phone = phone.substring(3);
    } else if (phone.startsWith("849") && phone.length == 11) {
      phone = phone.substring(2);
    } else if (phone.startsWith("848") && phone.length == 11) {
      phone = phone.substring(2);
    } else if (phone.startsWith("841") && phone.length == 12) {
      phone = phone.substring(2);
    }
    if (!phone.startsWith("0")) {
      phone = "0" + phone;
    }
    return phone;
  }

  /**
   /* Kiểm tra định dạng email */
  public static isValidEmail(email: String): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Lấy tên file từ URI
   */
  public static async getFileNameFromUri(
    localFile: string,
    defaultImage: any
  ): Promise<{ uri: string }> {

    if (Platform.OS === 'android') {
      if (localFile == "") {
        return Promise.resolve(defaultImage);
      } else {
        return Promise.resolve({ uri: localFile });
      }
    }

    var RNFS = require("react-native-fs");
    let arr = String(localFile).split("/");
    let shortFile = arr[arr.length - 1];

    let fullFileName =
      RNFS.TemporaryDirectoryPath +
      "react-native-image-crop-picker/" +
      shortFile;

    console.log(`test_profile_image__filename_uri: ${fullFileName}___short_file: ${shortFile}`);
    var rsImageUri = defaultImage;

    if (shortFile && shortFile.length > 0) {
      if (await RNFS.exists(fullFileName)) {
        if (fullFileName && fullFileName != "") {
          rsImageUri = { uri: fullFileName };
        }
      }
    }
    return rsImageUri;
  }

  /**
   * kiểm tra biến là kiểu boolean
   * @param val
   */
  public static isBoolean(val) {
    return val === false || val === true || val instanceof Boolean;
  }

  /**
   * kiểm tra biến là kiểu số
   * @param n
   */
  public static isNumber(n) {
    var re = /[0-9]$/;
    return re.test(n);
  }

  /**
   * kiểm tra biến là kiểu chuỗi
   * @param n
   */
  public static isString(n) {
    return typeof n === "string";
  }

  /**
   * chuyển đổi số miliseconds thành một chuỗi
   * yyyy-MM-d H:m:ss.SSS
   * @param time: thời gian miliseconds
   */
  public static formatTime(time: number | Date) {
    let date: Date;
    if (this.isNumber(time)) {
      date = new Date(time);
    } else {
      date = <Date>time;
    }
    return `${date.getFullYear()}-${this.convertTimeUnit(
      date.getMonth()
    )}-${this.convertTimeUnit(date.getDate())} ${this.convertTimeUnit(
      date.getHours()
    )}:${this.convertTimeUnit(date.getMinutes())}:${this.convertTimeUnit(
      date.getSeconds()
    )}:${date.getMilliseconds()}}`;
  }

  /**
   * HH:mm-dd/MM/yyyy
   */
  /**
   *  @param time: thời gian miliseconds
   * @param: mẫu pattern ví dụ: HH:mm-dd/MM/yyyy;
   */
  public static formatDateTime(time: number | Date, pattern?: string) {
    if (!pattern) pattern = "yyyy-MM-dd HH:mm";

    let date: Date;
    if (this.isNumber(time)) {
      date = new Date(time);
    } else {
      date = <Date>time;
    }

    return pattern
      .replace("yyyy", date.getFullYear().toString())
      .replace("MM", this.convertTimeUnit(date.getMonth() + 1).toString())
      .replace("dd", this.convertTimeUnit(date.getDate()).toString())
      .replace("HH", this.convertTimeUnit(date.getHours()).toString())
      .replace("mm", this.convertTimeUnit(date.getMinutes()).toString())
      .replace("ss", this.convertTimeUnit(date.getSeconds()).toString())
      .replace("SSS", date.getMilliseconds().toString());
  }

  public static convertTimeUnit(value) {
    return value >= 10 ? value : "0" + value;
  }

  /**
   * tạo đối tượng mới với dữ liệu của thuộc tính cũ
   * nhưng nó ko phải là 1 đối tượng như thuộc tính cũ,
   * các method như đối tượng cũ sẽ ko sử dụng được
   * @param obj
   */
  public static clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * lấy đối tượng ảnh khi biết tên key của đối tượng
   * @param images
   * @param iconName
   */
  public static getDrawableIdFromIconName(images: object, iconName: string) {
    if (images === undefined || iconName === undefined) return null;

    let arr: string[] = Object.keys(images);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == iconName) {
        return arr[i];
      }
    }
    return null;
  }

  /**
   * Lấy icon from iconcode.
   */
  public static getDrawableFromIconCode(iconCode) {
    return images[iconCode];
  }

  /**
   * format khoảng khách
   * @param distance: đơn vị m
   */
  public static formatDistance(distance: number) {
    let kmUnit = 1000;
    distance = (distance / kmUnit);
    if (Number.isInteger(distance)) {
      return distance + "";
    } else {
      return distance.toFixed(1);
    }
  }

  /* Định dạng thời gian theo dạng 0:0 */
  public static formatLabelTime(totalSecond: number): string {
    let result = new StringBuilder();

    let hours = totalSecond / 3600;
    if (hours > 0) {
      result.append(this.formatFieldTime(hours));
    }

    let estMinute = (totalSecond % 3600) / 60;
    if (estMinute > 0) {
      result.append(this.formatFieldTime(estMinute));
    }
    return result.toString();
  }

  /**
   * format giá trị của trường time 00:00
   *
   * @param field
   * @return
   */
  public static formatFieldTime(field: number): string {
    // nếu nhỏ hơn 0 thì gán về 0
    if (field < 0) field = 0;

    // nếu nhỏ hơn 10
    if (field < 10) {
      return "" + field;
    }

    return "" + field;
  }

  public static isFunction(f: any): boolean {
    return typeof f === 'function';
  }

}

export default Utils;
