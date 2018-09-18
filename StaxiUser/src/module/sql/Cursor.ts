import { LatLng } from "..";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:25:31
 * @modify date 2018-07-10 08:25:31
 * @desc [Lớp để lấy các trường database]
 */

class Cursor {
  private item: any;
  constructor(item) {
      this.item = item;
  }
  public static SPACE: string = ";";

  public paramsToJson(source: object) {
    return "";
  }

  public appendParamToObject(dest: Object, source: string) {}

  public getBoolean(columnName: string): boolean {
    return this.item[columnName] > 0;
  }

  public getInt(columnName: string): number {
    return this.item[columnName];
  }

  public getString(columnName: string): string {
    return this.item[columnName];
  }

  public getLong(columnName: string): number {
    return this.item[columnName];
  }

  public getFloat(columnName: string): number {
    return this.item[columnName];
  }

  public getBlob(columnName: string): Array<number> {
    return this.item[columnName];
  }

  public getLatLng(columnName: string): LatLng {
    let str = this.item[columnName];

    if (!str) return null;

    let s = str.split(",");

    return new LatLng(parseFloat(s[0]), parseFloat(s[1]));
  }

  public setLatLng(latLng: LatLng): string {
    if (!latLng) return "";
    return latLng.latitude + "," + latLng.longitude;
  }

  public listToString(arr: number[]): string {
    if (!arr) return "";
    return arr.join(Cursor.SPACE);
  }

  public stringToList(str: string): number[] {
    if (!str || str.length === 0) {
      return null;
    }
    return str.split(Cursor.SPACE).map(Number);
  }
}

export default Cursor;
