import { LatLng } from "..";

/**
 * lớp commond để lấy thông tin dữ liệu từ database
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:25:31
 * @modify date 2018-07-10 08:25:31
 * @desc [description]
*/


class BaseDAO {
  public static SPACE: string = ";";

  public static paramsToJson(source: object) {
    return "";
  }

  public static appendParamToObject(dest: Object, source: string) {}

  public static getBoolean(cursor: Array<any>, columnName: string): boolean {
    return cursor[columnName] > 0;
  }

  public static getInt(cursor: Array<any>, columnName: string): number {
    return cursor[columnName];
  }

  public static getString(cursor: Array<any>, columnName: string): string {
    return cursor[columnName];
  }

  public static getLong(cursor: Array<any>, columnName: string): number {
    return cursor[columnName];
  }

  public static getFloat(cursor: Array<any>, columnName: string): number {
    return cursor[columnName];
  }

  public static getBlob(cursor: Array<any>, columnName: string): Array<number> {
    return cursor[columnName];
  }

  public static getLatLng(cursor: Array<any>, columnName: string): LatLng {
    let str = cursor[columnName];

    if (!str) return null;

    let s = str.split(",");

    return new LatLng(parseFloat(s[0]), parseFloat(s[1]));
  }

  public static convertLocation2String(latLng: LatLng): string {
    if (!latLng) return "";
    return latLng.latitude + "," + latLng.longitude;
  }

  public static listToString(arr:number[]): string {
    if (!arr) return "";
    return arr.join(this.SPACE);
  }

  public static stringToList(str: string): number[] {
    if (!str || str.length === 0) {
      return null;
    }
    return str.split(this.SPACE).map(Number);
  }
}

export default BaseDAO;
