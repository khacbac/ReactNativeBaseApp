/**
 * Lớp lưu trữ dạng key-value để cập nhật vào database
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:25:08
 * @modify date 2018-07-10 08:25:08
 * @desc [description]
 */

import {
  AbstractDefineType,
  DataType
} from "../js-serialize/DefinedType";
import { Alert } from "react-native";

class ContentValues {
  private maps: Map<string, Object>;

  constructor() {
    this.maps = new Map();
  }

  public putNumber(key: string, value: number) {
    this.maps.set(key, value ? value : 0);
  }

  public putString(key: string, value: string) {
    this.maps.set(key, value ? value : "");
  }

  public putBoolean(key: string, value: boolean) {
    this.maps.set(key, value ? 1 : 0);
  }

  public putDefineType(key: string, object: AbstractDefineType<any>) {
    if (!object) throw new Error("putDefineType: Đối tượng undefined");

    if (AbstractDefineType.instanceOf(object)) {

      let type = object.dataType;

      //chưa hỗ trợ loại option
      if (
        type == DataType.BYTE ||
        type == DataType.SHORT ||
        type == DataType.INT ||
        type == DataType.LONG ||
        type == DataType.FLOAT ||
        type == DataType.DOUBLE ||
        type == DataType.BOOLEAN ||
        type == DataType.STRING
      ) {
        this.set(key, object.value);
      } else {
        throw new Error(
          "Chưa hỗ trợ để insert trực tiếp:" +  JSON.stringify(object)
        );
      }
    } else {
      console.log("Loại đối tượng lỗi: " + object.dataType);
      throw new Error(
        "biến không phải là đối tượng con của AbstractDefineType:" +
          JSON.stringify(object)
      );
    }
  }

  /**
   * thiết lập giá trị cho đối tượng map
   * @param key
   * @param value
   */
  public set(
    key: string,
    value: number | string | boolean | AbstractDefineType<any>
  ) {
    // console.log(value);
    if (value === undefined) throw new Error("ContentValues set: Đối tượng undefined");

    if (typeof value === "string") {
      this.putString(key, "'" + value + "'");
    } else if (ContentValues.isBoolean(value)) {
      this.putBoolean(key, <boolean>value);
    } else if (typeof value == "number") {
      this.putNumber(key, <number>value);
    } else if (AbstractDefineType.instanceOf(value)) {
      this.putDefineType(key, value as AbstractDefineType<any>);
    } else {
      console.log(value);
      throw new Error(
        "ContentValues set chưa hỗ trợ định dạng này:" + value.constructor.name
      );
    }
  }

  public put(
    key: string,
    value: number | string | boolean | AbstractDefineType<any>){
      this.set(key, value);
  }

  public map() {
    return this.maps;
  }

  public static isBoolean(val) {
    return val === false || val === true || val instanceof Boolean;
  }
}

export default ContentValues;
