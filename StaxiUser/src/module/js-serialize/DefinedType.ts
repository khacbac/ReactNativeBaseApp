import LogFile from "../LogFile";

/**
 * Các loại dữ liệu dùng để phân tích theo mảng byte có cấu trúc
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:26:32
 * @modify date 2018-07-10 08:26:32
 * @desc [description]
 */

enum DataType {
  ANY = -1,
  INT = 0,
  BYTE = 1,
  SHORT = 2,
  LONG = 3,
  FLOAT = 4,
  DOUBLE = 5,
  BOOLEAN = 6,
  STRING = 7,
  LATLNG = 8,
  LIST = 9,
  NUMBER_ARRAY = 10,
  NUMBER_ENUM = 11
}

const EMPTY = "";

/** loại giao diện xác định nó là 1 mảng để serialize */
interface IArray {
  /** lấy độ lớn byte lưu trữ độ dài của mảng */
  getSizeStoreLength(): number;

  /** hiện tại loại đối tượng khi deserialize không thể xác định, nên phải tạo đối tượng mặc định để xác định các loại thông tin trong đối tượng */
  getItemInstance();

  putValue(object: any);
}

/** loại có khả năng phân tích đối tượng thành mảng byte và ngược lại*/
interface ISerialize {
  /** ví trí trong buffer của đối tượng */
  propertyIndex: number;
}

/** lại để tạo đối tượng lưu trong mảng */
interface ISerializeItemArray<T> {
  newInstanceItemArray(): T;
}

/** loại tự định nghĩa => có datatype để serialize riêng biệt */
interface IDefineType {
  dataType: DataType;
}

/** lớp */
abstract class AbstractSerialize implements ISerialize {
  /** ví trí trong buffer của đối tượng */
  propertyIndex: number;

  /**trường sẽ bỏ qua khi serialize hoặc deserialize*/
  public ignore: boolean = false;

  public constructor(index?: number) {
    this.propertyIndex = index || 0;
  }

  public getIgnore() {
    return this.ignore;
  }

  public setIgnore(ignore: boolean) {
    this.ignore = ignore;
  }
}

/**
 * lớp trừu tượng để các đối tượng định nghĩa sẵn sử dụng
 */
abstract class AbstractDefineType<T> extends AbstractSerialize
  implements IDefineType {
  /**Giá trị lưu trữ. Tên biến 'value' không được thay đổi => ảnh hưởng đến việc gọi generic ở các hàm khác */
  public value: T;

  /** lưu trữ loại dữ liệu tự định nghĩa sẵn */
  public dataType: DataType;

  public constructor(value: T, index?: number) {
    super(index);
    this.value = value;
    this.dataType = this.getType();
  }

  public setValue(value: T): AbstractDefineType<T> {
    this.value = value;
    return this;
  }

  public abstract getType(): number;

  public abstract getBytes();

  public toString(): string {
    return JSON.stringify(this.value);
  }

  public isPrimary(): boolean {
    return false;
  }

  /** loại dữ liệu cơ bản */
  public static isBaseDataType(obj): boolean {
    //kiểm tra element có undefined hay không
    if (obj === undefined || obj == null) {
      return false;
    }

    return (
      obj.dataType == DataType.BYTE ||
      obj.dataType == DataType.SHORT ||
      obj.dataType == DataType.INT ||
      obj.dataType == DataType.LONG ||
      obj.dataType == DataType.FLOAT ||
      obj.dataType == DataType.DOUBLE ||
      obj.dataType == DataType.BOOLEAN ||
      obj.dataType == DataType.STRING
    );
  }

  public static instanceOf(object): boolean {
    return (
      object instanceof AbstractDefineType ||
      (object &&
        object.hasOwnProperty("value") &&
        object.hasOwnProperty("dataType"))
    );
  }

  public static isSerialize(element): boolean {
    //kiểm tra element có undefined hay không
    if (element === undefined || element == null) {
      return false;
    }

    // console.log("isSerialize %%%%%%%%%%%%", element + "; typeof element = " + (typeof element) + "; (typeof element) = " + (element === undefined));

    return element.propertyIndex !== undefined;
  }
}

abstract class DefineTypeNumber extends AbstractDefineType<number> {
  public constructor(value?: number, index?: number) {
    super(value ? value : 0, index);
  }

  public isPrimary(): boolean {
    return true;
  }

  public setValue(value: number): AbstractDefineType<number> {
    this.value = value || 0;
    return this;
  }
}

class DfInteger extends DefineTypeNumber {
  public getType() {
    return DataType.INT;
  }

  public static getByteLengh() {
    return 4;
  }

  public getBytes(): Array<number> {
    let buffer: Array<number> = [];
    return buffer;
  }

  public static index(index: number): DfInteger {
    return new DfInteger(0, index);
  }
}

class DfByte extends DefineTypeNumber {
  public getType() {
    return DataType.BYTE;
  }

  public static getByteLengh() {
    return 1;
  }

  public getBytes(): Array<number> {
    return [this.value & 0xff];
  }

  public static index(position: number): DfByte {
    return new DfByte(0, position);
  }
}

class DfShort extends DefineTypeNumber {
  public getType() {
    return DataType.SHORT;
  }

  public static getByteLengh() {
    return 2;
  }

  public getBytes(): Array<number> {
    return [this.value & 0xff, (this.value & 0xff00) >> 8];
  }

  public static index(index: number): DfShort {
    return new DfShort(0, index);
  }
}

class DfLong extends DefineTypeNumber {
  public getType() {
    return DataType.LONG;
  }

  public static getByteLengh() {
    return 8;
  }

  public getBytes(): Array<number> {
    let buffer: Array<number> = [];
    return buffer;
  }

  public static index(index: number): DfLong {
    return new DfLong(0, index);
  }
}

class DfFloat extends DefineTypeNumber {
  public getType() {
    return DataType.FLOAT;
  }

  public static getByteLengh() {
    return 4;
  }

  public getBytes(): Array<number> {
    let buffer: Array<number> = [];
    return buffer;
  }

  public static index(index: number): DfFloat {
    return new DfFloat(0, index);
  }

  public static floatToIntBits(var0: number): number {
    let var1 = this.floatToRawIntBits(var0);
    if ((var1 & 2139095040) == 2139095040 && (var1 & 8388607) != 0) {
      var1 = 2143289344;
    }
    return var1;
  }

  /**
   * theo tài liệu
   * https://en.wikipedia.org/wiki/Single-precision_floating-point_format
   * @param value
   */
  private static floatToRawIntBits(value: number): number {
    var n = +value,
      status = n !== n || n == -Infinity || n == +Infinity ? n : 0,
      exp = 0,
      len = 281, // 2 * 127 + 1 + 23 + 3,
      signal = (n = status !== 0 ? 0 : n) < 0,
      n = Math.abs(n),
      intPart = Math.floor(n),
      i,
      lastBit,
      rounded,
      j,
      exponent;

    let floatPart: number = n - intPart;
    let bin: Array<number> = new Array(len);

    if (status !== 0) {
      if (n !== n) {
        return 0x7fc00000;
      }
      if (n === Infinity) {
        return 0x7f800000;
      }
      if (n === -Infinity) {
        return 0xff800000;
      }
    }

    i = len;
    while (i) {
      bin[--i] = 0;
    }

    i = 129;
    while (intPart && i) {
      bin[--i] = intPart % 2;
      intPart = Math.floor(intPart / 2);
    }

    i = 128;
    while (floatPart > 0 && i) {
      (bin[++i] = ((floatPart *= 2) >= 1) - 0) && --floatPart;
    }

    i = -1;
    while (++i < len && !bin[i]);

    if (
      bin[
        (lastBit =
          22 +
          (i =
            (exp = 128 - i) >= -126 && exp <= 127
              ? i + 1
              : 128 - (exp = -127))) + 1
      ]
    ) {
      if (!(rounded = bin[lastBit])) {
        j = lastBit + 2;
        while (!rounded && j < len) {
          rounded = bin[j++];
        }
      }

      j = lastBit + 1;
      while (rounded && --j >= 0) {
        (bin[j] = !bin[j] - 0) && (rounded = 0);
      }
    }
    i = i - 2 < 0 ? -1 : i - 3;
    while (++i < len && !bin[i]);
    (exp = 128 - i) >= -126 && exp <= 127
      ? ++i
      : exp < -126 && ((i = 255), (exp = -127));
    (intPart || status !== 0) &&
      ((exp = 128),
      (i = 129),
      status == -Infinity ? (signal = 1) : status !== status && (bin[i] = 1));

    n = Math.abs(exp + 127);
    exponent = 0;
    j = 0;
    while (j < 8) {
      exponent += n % 2 << j;
      n >>= 1;
      j++;
    }

    var mantissa = 0;
    n = i + 23;
    for (; i < n; i++) {
      mantissa = (mantissa << 1) + bin[i];
    }
    return ((signal ? 0x80000000 : 0) + (exponent << 23) + mantissa) | 0;
  }

  /**
   * theo tài liệu
   * https://en.wikipedia.org/wiki/Single-precision_floating-point_format
   * @param value
   */
  public static intBitsToFloat(value: number): number {
    let sign = (value & 0x80000000) ? -1 : 1;
    let exponent = ((value >> 23) & 0xFF) - 127;
    let significand = (value & ~(-1 << 23));

    if (exponent == 128) 
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);

    if (exponent == -127) {
        if (significand == 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);

    return sign * significand * Math.pow(2, exponent);
    // let sign = (value >>> 31) & 0x01;
    // // console.log("sign ==" + sign);
    // let exponent = 0;
    // for (let i = 0; i <= 7; i++) {
    //   let valueOfBit = (value >>> (23 + i)) & 0x01;
    //   // console.log(`i = ${i} , shift: ${23 + i}, valueOfBit = ${valueOfBit}`);
    //   exponent += valueOfBit * Math.pow(2, i);
    // }
    // // console.log(
    // //   "exponent ==" + exponent + ";value = " + Math.pow(2, exponent - 127)
    // // );
    // let fraction = 1;
    // for (let i = 1; i <= 23; i++) {
    //   let valueOfBit = (value >>> (23 - i)) & 0x01;
    //   // console.log(`i = ${i} , shift: ${23 - i}, valueOfBit = ${valueOfBit}`);
    //   fraction += valueOfBit * Math.pow(2, -i);
    // }
    // // console.log("fraction ==" + fraction);
    // let total = Math.pow(-1, sign) * fraction * Math.pow(2, exponent - 127);
    // return total;
  }
}

class DfDouble extends DefineTypeNumber {
  public getType() {
    return DataType.DOUBLE;
  }

  public static getByteLengh() {
    return 8;
  }

  public static index(index: number): DfDouble {
    return new DfDouble(0, index);
  }

  public getBytes(): Array<number> {
    let buffer: Array<number> = [];
    return buffer;
  }

  public static doubleToLongBits(value: number): number {
    return 0;
  }

  public static longBitsToDouble(value: number): number {
    return 0;
  }
}

class DfBoolean extends AbstractDefineType<boolean> {
  constructor(value?: boolean, index?: number) {
    super(value || false, index);
  }
  public getType() {
    return DataType.BOOLEAN;
  }

  public static getByteLengh() {
    return 1;
  }

  public getBytes(): Array<number> {
    return [this.value ? 1 : 0];
  }

  public static index(index: number): DfBoolean {
    return new DfBoolean(false, index);
  }

  public isPrimary(): boolean {
    return true;
  }

  public setValue(value: boolean): DfBoolean {
    this.value = value || false;
    return this;
  }
}

/**
 * chuỗi xử lý theo độ dài utf8
 */
class DfString extends AbstractDefineType<string> {
  sizeStoreLength: number = 2;
  constructor(value?: string, index?: number, sizeStoreLength?: number) {
    super(value ? value : "", index);
    if (sizeStoreLength) this.sizeStoreLength = sizeStoreLength;
  }
  public getType() {
    return DataType.STRING;
  }

  /** Mảng byte được convert từ chuỗi UTF8 */
  public getBytes(): Array<number> {
    return DfString.stringToUtf8ByteArray(this.value);
  }

  public setBytes(bytes: Array<number>): void {
    this.value = DfString.utf8ByteArrayToDfString(bytes).value;
  }

  public getSizeStoreLength(): number {
    return this.sizeStoreLength;
  }

  public static of(value: string): DfString {
    return new DfString(value);
  }

  public static empty(): DfString {
    return DfString.of(EMPTY);
  }

  public static index(index: number): DfString {
    return new DfString(EMPTY, index);
  }

  public static toBytes(str: DfString) {
    if (!str) return [];
    return DfString.stringToUtf8ByteArray(str.value);
  }

  public setValue(value: string): DfString {
    this.value = value || "";
    return this;
  }

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
  public static utf8ByteArrayToString(bytes: Array<number>): string {
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

  public static utf8ByteArrayToDfString(bytes: Array<number>): DfString {
    return DfString.of(this.utf8ByteArrayToString(bytes));
  }

  public isPrimary(): boolean {
    return true;
  }
}

class DfLatLng extends AbstractDefineType<LatLng> {
  constructor(lat?: number, lng?: number, index?: number) {
    super(new LatLng(lat || 0, lng || 0), index);
  }
  public getType() {
    return DataType.LATLNG;
  }

  public getLat(): number {
    return this.value ? this.value.latitude : 0;
  }

  public getLng(): number {
    return this.value ? this.value.longitude : 0;
  }

  public setLatLng(lat: number, lng: number) {
    if (!this.value) this.value = new LatLng(0, 0);

    this.value.latitude = lat;
    this.value.longitude = lng;
  }

  public set(latlng: LatLng) {
    if (!this.value) this.value = new LatLng(0, 0);
    this.value = latlng;
  }

  public getBytes(): Array<number> {
    let buffer: Array<number> = [];
    return buffer;
  }

  public static getByteLengh() {
    return 8;
  }

  public static index(index: number): DfLatLng {
    return new DfLatLng(0, 0, index);
  }

  public static toJson(df: DfLatLng) {
    if (!df) {
      df = new DfLatLng();
    }
    return JSON.stringify(df.value);
  }

  public static fromJson(json: string) {
    let obj = JSON.parse(json);
    let lat = obj.hasOwnProperty("latitude") ? obj.latitude : 0;
    let lng = obj.hasOwnProperty("longitude") ? obj.longitude : 0;
    return new DfLatLng(lat, lng);
  }
}

class DfList<T> extends AbstractDefineType<Array<T>> implements IArray {
  /** độ lớn bằng byte để lưu trữ độ dài mảng */
  sizeStoreLength: number = 2;

  /** 1 mẫu để xác định loại đối tượng trong mảng, dùng để deserialize từ mảng byte thành mảng đối tượng  */
  itemType: T;

  /**
   *
   * @param arr
   * @param index
   * @param sizeStoreLength
   * @param instance: 1 mẫu để xác định loại đối tượng trong mảng, dùng để deserialize từ mảng byte thành mảng đối tượng
   */
  constructor(
    instance?: T,
    index?: number,
    arr?: Array<T>,
    sizeStoreLength?: number
  ) {
    super(arr ? arr : new Array<T>(), index);
    if (sizeStoreLength) this.sizeStoreLength = sizeStoreLength;
    if (instance) this.itemType = instance;
  }

  /** độ dài của size lưu trữ lenth của mảng: ví dụ: 1 byte, 2 byte, 4 byte */
  public getSizeStoreLength(): number {
    return this.sizeStoreLength;
  }

  public getType() {
    return DataType.LIST;
  }

  /**
   * xóa đối tượng
   * @param t
   */
  public remove(t: T) {
    var index = this.value.indexOf(t);
    if (index > -1) {
      this.value.splice(index, 1);
    }
  }

  /**
   * xóa phần tử tại vị trí
   * @param index
   */
  public removeAt(index: number) {
    if (index < 0 || index >= this.value.length) return;
    this.value.splice(index, 1);
  }

  public getBytes() {}

  /** hiện tại loại đối tượng khi deserialize không thể xác định, nên phải tạo đối tượng mặc định để xác định các loại thông tin trong đối tượng */
  public getItemInstance(): T {
    return this.itemType;
  }

  public putValue(t: T) {
    this.value.push(t);
  }

  public isEmpty() {
    return this.value && this.value.length <= 0;
  }

  /**
   * thực hiện chạy toàn bộ list
   * @param callback
   */
  public forEach(callback: Function) {
    this.value.forEach(element => {
      callback(element);
    });
  }

  public toArray(): Array<T> {
    let arr: Array<T> = [];
    this.value.forEach(element => {
      arr.push(element);
    });
    return arr;
  }

  public static index<T>(instance: T, index: number): DfList<T> {
    return new DfList(instance, index);
  }

  /**
   * kiểm tra có dữ liệu trong mảng
   */
  public isAvailable(){
    if (this.value == null || this.value.length == 0) return false;
    return true;
  }

  public get(position: number): T {
    if (!this.isAvailable()) return null;

    if (position < 0 || position >= this.value.length) {
      throw new Error("IndexOutOfBound position: " + position);
    }

    return this.value[position];
  }
}

class DfNumberArray extends AbstractDefineType<Array<number>>
  implements IArray {
  /** độ lớn bằng byte để lưu trữ độ dài mảng */
  sizeStoreLength: number;

  /**độ lớn của dữ liệu, được lưu trữ trong mảng, byte = 1, short = 2, long = 3*/
  subType: DataType;

  /** lấy toàn bộ mảng giá trị cuối cùng mà ko cần độ dài */
  isLastIndex;

  /**
   *
   * @param arr
   * @param index
   * @param sizeStoreLength
   * @param instance: 1 mẫu để xác định loại đối tượng trong mảng, dùng để deserialize từ mảng byte thành mảng đối tượng
   */
  constructor(
    subType?: DataType,
    index?: number,
    isLastIndex?: boolean,
    arr?: Array<number>,
    sizeStoreLength?: number
  ) {
    super(arr || new Array<number>(), index);
    this.sizeStoreLength = sizeStoreLength || 2;
    this.subType = subType || DataType.BYTE;
    this.isLastIndex = isLastIndex || false;
  }

  /** độ dài của size lưu trữ lenth của mảng: ví dụ: 1 byte, 2 byte, 4 byte */
  public getSizeStoreLength(): number {
    return this.sizeStoreLength;
  }

  public getType() {
    return DataType.NUMBER_ARRAY;
  }

  /**
   * xóa đối tượng
   * @param t
   */
  public remove(t: number) {
    var index = this.value.indexOf(t);
    if (index > -1) {
      this.value.splice(index, 1);
    }
  }

  /**
   * xóa phần tử tại vị trí
   * @param index
   */
  public removeAt(index: number) {
    if (index < 0 || index >= this.value.length) return;
    this.value.splice(index, 1);
  }

  public getBytes() {}

  /** hiện tại loại đối tượng khi deserialize không thể xác định, nên phải tạo đối tượng mặc định để xác định các loại thông tin trong đối tượng */
  public getSubType(): number {
    return this.subType;
  }

  public putValue(t: number) {
    this.value.push(t);
  }

  public putValues(t: number[]) {
    // console.log("this.value ==", this.value);
    // console.log("t ==", t);
    if (t) this.value.push(...t);
  }

  public isEmpty() {
    return this.value && this.value.length <= 0;
  }

  /**
   * trở về độ lớn của
   */
  getItemInstance():
    | DfByte
    | DfShort
    | DfInteger
    | DfLong
    | DfFloat
    | DfDouble {
    if (this.subType == DataType.BYTE) return new DfByte();
    if (this.subType == DataType.SHORT) return new DfShort();
    if (this.subType == DataType.INT) return new DfInteger();
    if (this.subType == DataType.LONG) return new DfLong();
    if (this.subType == DataType.FLOAT) return new DfFloat();
    if (this.subType == DataType.DOUBLE) return new DfDouble();
    return null;
  }

  /**
   * thực hiện chạy toàn bộ list
   * @param callback
   */
  public forEach(callback: Function) {
    this.value.forEach(element => {
      callback(element);
    });
  }

  /**
   * danh sách độ dài của mảng lưu trữ
   */
  public getLength(): number {
    return this.value ? this.value.length : 0;
  }

  public static index(
    subType: DataType,
    index: number,
    isLastIndex?: boolean
  ): DfNumberArray {
    return new DfNumberArray(subType, index, isLastIndex);
  }
}

class LatLng {
  public latitude: number;
  public longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * kiểm tra có phải vị trí xích đạo không
   */
  public isOrigin(): boolean {
    return this.latitude == 0 && this.longitude == 0;
  }

  toString(): string {
    return `(${this.latitude},${this.longitude})`;
  }
}

export {
  AbstractDefineType,
  DfInteger,
  DataType,
  DfByte,
  DfShort,
  DfLong,
  DfFloat,
  DfDouble,
  DfBoolean,
  DfString,
  DfLatLng,
  DfList,
  IArray,
  IDefineType,
  DfNumberArray,
  AbstractSerialize,
  LatLng,
  ISerialize,
  ISerializeItemArray
};
