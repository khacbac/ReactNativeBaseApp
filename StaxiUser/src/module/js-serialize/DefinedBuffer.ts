/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-16 01:40:18
 * @modify date 2018-07-16 01:40:18
 * @desc [Lớp xử lý package và unpackage giá trị để thêm vào mảng byte]
*/
import {
  DfInteger,
  DfShort,
  DfByte,
  DfLong,
  DfFloat,
  DfDouble,
  DfBoolean,
  DfString,
  DfLatLng,
} from "./DefinedType";
import { LatLng } from "..";
class DefinedBuffer {
  static readonly CAPACITY_SIZE = 1024;
  static readonly CHARSET = "UTF-8";

  private mBuffer: number[];
  private mOffset: number;

  public constructor(buffer: number[], offset: number) {
    this.mBuffer = buffer;
    this.mOffset = offset;
  }

  public static allocate(length?:number): DefinedBuffer {
    return new DefinedBuffer(new Array(length||DefinedBuffer.CAPACITY_SIZE), 0);
  }

  /**
   * Chèn mảng byte tới buffer
   *
   * @param array
   * @return
   */
  public static wrap(buffer: number[]): DefinedBuffer {
    return new DefinedBuffer(buffer, 0);
  }

  /**
   * sắp xếp mảng byte vào mảng byte lớn
   *
   * @param src
   */
  public putBytes(src: number[]):DefinedBuffer {
    // nếu không có dữ liệu để chèn thì hủy
    if (src == null || src.length == 0) return;
    let len = src.length;
    this.appendCapacity(len);
    // Log.e("putBytes ==== " + len + "; this.mOffset = " + this.mOffset);
    // Log.b(src);
    DefinedBuffer.arraycopy(src, 0, this.mBuffer, this.mOffset, len);
    this.moveTo(len);
    return this;
  }

  /**
   * Lấy mảng byte con trong mảng byte với chiều dài chỉ rõ
   *
   * @param len
   * @return
   */
  public getBytes(len: number): number[] {
    if (len <= 0) return null;
    this.appendCapacity(len);
    var dst = new Array(len);
    DefinedBuffer.arraycopy(this.mBuffer, this.mOffset, dst, 0, len);
    this.moveTo(len);
    return dst;
  }

  /**
   * lấy size thực của mảng được lưu
   */
  public getByteBuffer(): number[] {
    // console.log(
    //   "Buffer leng = " + this.mBuffer.length + "; mOffset = " + this.mOffset
    // );
    if (this.mBuffer.length <= this.mOffset) {
      this.mOffset = this.mBuffer.length;
      return this.mBuffer;
    } else {
      let bs: Array<number> = new Array(this.mOffset);
      // bs.concat(this.mBuffer);
      for (let i = 0; i < this.mOffset; i++) {
        bs[i] = this.mBuffer[i];
      }
      this.mBuffer = bs;
      // return this.mBuffer;
      return bs;
    }
  }

  /**
   * ném ngoại lệ khi lấy dữ liệu từ buffer không hợp lệ
   *
   * @param len
   */
  private appendCapacity(len: number): void {
    if (this.mBuffer == null) {
      throw TypeError();
    }
    if (this.mOffset < 0 || len <= 0) {
      throw new RangeError();
    }

    let bufferLength = this.mBuffer.length;
    // tăng bộ nhớ lên
    if (this.mOffset + len > bufferLength) {
      if (len < DefinedBuffer.CAPACITY_SIZE) {
        len = DefinedBuffer.CAPACITY_SIZE;
      }

      let bs: Array<number> = new Array(this.mOffset + len);
      for (let i = 0; i < bufferLength; i++) {
        bs[i] = this.mBuffer[i];
      }
      this.mBuffer = bs;
    }
  }

  /**
   * Lấy giá trị số Int từ 4 byte trong mảng
   *
   * @return
   */
  public getInteger(): DfInteger {
    return new DfInteger(this.getInt32());
  }

  /**
   * Lưu giá trị số Integer vào mảng byte
   *
   * @param value
   */
  public putInt32(value: number): DefinedBuffer {
    let size = DfInteger.getByteLengh();
    this.appendCapacity(size);
    for (let i = size-1; i >= 0; i--) {
      this.mBuffer[this.mOffset + i] = (value >> (8 * i)) & 0x00ff;
    }
    this.moveTo(size);

    return this;
  }

  public getInt32(): number {
    let size = DfInteger.getByteLengh();
    this.appendCapacity(size);
    let value = 0;
    for (let i = size - 1; i >= 0; i--) {
      value += (this.mBuffer[this.mOffset + i] & 0xff) << (8 * i);
    }
    this.moveTo(size);
    return value;
  }

  /**
   * Lưu giá trị số Integer vào mảng byte
   *
   * @param value
   */
  public putInteger(value: DfInteger): void {
    this.putInt32(value.value);
  }

  /**
   * Tính giá trị 2 byte
   *
   * @return
   */
  public getShort(): DfShort {
    return new DfShort(this.getInt16());
  }
  /**
   * Lưu một số kiểu short vào 2 byte trong mảng byte
   *
   * @param value
   */
  public putShort(value: DfShort): void {
    this.putInt16(value.value);
  }

  /**
   * Tính giá trị 2 byte
   *
   * @return
   */
  public getInt16(): number {
    this.appendCapacity(2);
    let value =
      ((this.mBuffer[this.mOffset + 1] << 8) & 0xff00) |
      (this.mBuffer[this.mOffset] & 0xff);
    this.moveTo(2);
    return value;
  }
  /**
   * Lưu một số kiểu short vào 2 byte trong mảng byte
   *
   * @param value
   */
  public putInt16(value: number): DefinedBuffer {
    this.appendCapacity(2);
    this.mBuffer[this.mOffset] = value & 0xff;
    this.mBuffer[this.mOffset + 1] = (value & 0xff00) >> 8;
    this.moveTo(2);
    return this;
  }

  /**
   * lấy giá trị kiểu float, dạng 4 byte
   *
   * @return
   */
  public getDfLatLng(): DfLatLng {
    return new DfLatLng(this.getFloat32(), this.getFloat32());
  }

  public getLatLng(): LatLng {
    return new LatLng(this.getFloat32(), this.getFloat32());
  }
  /**
   * Lưu giá trị kiểu float, dạng 2 byte
   *
   * @param value
   */
  public putDfLatLng(value: DfLatLng): DefinedBuffer {
    return this.putLatLng(value.value);
  }

  /**
   * đẩy đối tượng latlng vào buffer
   * @param value
   */
  public putLatLng(value: LatLng): DefinedBuffer {
    //đẩy tọa độ lat
    this.putFloat32(value.latitude);

    //đẩy tọa độ lng
    this.putFloat32(value.longitude);

    return this;
  }

  /**
   * lấy giá trị kiểu float, dạng 4 byte
   *
   * @return
   */
  public getFloat(): DfFloat {
    return new DfFloat(this.getFloat32());
  }

  public getFloat32(): number {
    return DfFloat.intBitsToFloat(this.getInt32());
  }
  /**
   * Lưu giá trị kiểu float, dạng 2 byte
   *
   * @param value
   */
  public putFloat(value: DfFloat): DefinedBuffer {
    return this.putFloat32(value.value);
  }

  public putFloat32(value: number): DefinedBuffer {
    let int = DfFloat.floatToIntBits(value);

    // NativeTestModule.floatToIntBits(value).then((ret)=>{
    //   console.log(`RN: ${int} , JAVA: ${ret}`);
    // })

    return this.putInt32(int);
  }

  /**
   * lấy giá trị kiểu float, dạng 8 byte
   *
   * @return
   */
  public getDouble(): DfDouble {
    return new DfDouble(this.getFloat64());
  }

  /**
   * lấy giá trị kiểu float, dạng 8 byte
   *TODO: phần này chưa xử lý
   * @return
   */
  public getFloat64(): number {
    return DfDouble.longBitsToDouble(this.getInt64());
  }
  /**
   * Lưu giá trị kiểu float, dạng 2 byte
   *
   * @param value
   */
  public putDouble(value: DfDouble): DefinedBuffer {
    return this.putFloat64(value.value);
  }

  /**
   * đẩy dữ liệu 8 byte kiểu double thành mảng byte
   * TODO: phần này chưa xử lý
   * @param value 
   */
  public putFloat64(value: number): DefinedBuffer {
    return this.putInt64(DfDouble.doubleToLongBits(value));;
  }

  /**
   * Lấy giá trị số Long từ 8 byte trong mảng
   *
   * @return
   */
  public getLong(): DfLong {
    return new DfLong(this.getInt64());
  }

  /**
   * lấy giá trị 64 bít
   */
  public getInt64(): number {
    let size = DfLong.getByteLengh();
    this.appendCapacity(size);

    //lấy giá trị của 4 byte cao
    let m4byte = 0;
		for (let i = 7; i > 3; i--) {
			m4byte += ((this.mBuffer[this.mOffset + i] & 0xff) << (8 * (i - 4)));
		}

		//lấy giá trị của 4 byte thấp
		let l4byte = 0;
		for (let i = 3; i > -1; i--) {
			l4byte +=  ((this.mBuffer[this.mOffset + i] & 0xff) << (8 * i));
		}
    this.moveTo(size);
    return (m4byte << 32) + l4byte;
  }

  /**
   * Lưu giá trị số long vào mảng byte
   *
   * @param value
   */
  public putLong(value: DfLong): DefinedBuffer {
    return this.putInt64(value.value);
  }

  /**
   * đẩy 1 giá trị long vào mảng byte
   * ví dụ: 
   * time = 1530494197 =>1011011001110010111110011110101
   * Byte Array: {245, 124, 57, 91, 0, 0, 0, 0};
   * @param value 
   */
  public putInt64(value: number): DefinedBuffer {
    let size = DfLong.getByteLengh();

    this.appendCapacity(size);
    for (let i = 0; i < size; i++) {
      this.mBuffer[this.mOffset + i] = (value & 0xff);
      value >>>=8;
		}
    this.moveTo(size);
    return this;
  }

  /**
   * sắp xếp mảng byte vào mảng byte lớn
   *
   * @param dst
   */
  public putByte(value: DfByte): DefinedBuffer {
    return this.putInt8(value.value);
  }

  public putInt8(value: number): DefinedBuffer {
    this.appendCapacity(1);
    this.mBuffer[this.mOffset] = value;
    this.moveTo(1);
    return this;
  }


  /**
   * Lấy mảng byte con trong mảng byte với chiều dài chỉ rõ
   *
   * @return
   */
  public getByte(): DfByte {
    return new DfByte(this.getInt8());
  }

  public getInt8(): number {
    this.appendCapacity(1);
    let value = this.mBuffer[this.mOffset];
    this.moveTo(1);
    return value;
  }

  public putBoolean(dst: DfBoolean): DefinedBuffer {
    let b = dst ? 1 : 0;
    return this.putByte(new DfByte(b));
  }

  public getBoolean(): DfBoolean {
    return new DfBoolean(this.getBool());
  }

  public getBool(): boolean {
    return this.getInt8() > 0;
  }

  /**
   * đẩy 1 chuỗi vào 1 mảng có sẵn
   *
   * @param value
   */
  public putString(value: string): DefinedBuffer {
    if (!value) return;
    return this.putBytes(DfString.stringToUtf8ByteArray(value));
  }

  /**
   * đấy một chuỗi string vào mảng byte.
   * chuỗi này được chèn thành 2 phần:
   * phần 1: 2 byte đầu lưu trữ chiều dài của chuỗi
   * phần 2: là mảng byte của cuỗi
   * @param value
   */
  public putShortString(value: DfString): DefinedBuffer {
    // console.log(`putShortString index: ${value.index} ==` + value.value);

    if (value) {
      let bs = DfString.toBytes(value);
      // Log.e("putShortString lenth = " + bs.length)
      // Log.b(bs)
      this.putShort(new DfShort(bs.length));
      this.putBytes(bs);
    } else {
      this.putShort(new DfShort(0));
    }
    return this;
  }

  /**
   * Lấy chuỗi trong mảng
   *
   * @param length
   *            : độ dài của cuỗi
   * @return
   */
  public getString(length: number): string {
    if (length == 0) return "";
    let value = this.getBytes(length);

    if (value == null) return "";

    return DfString.utf8ByteArrayToString(value);
  }

  /**
   * Lấy chuỗi trong mảng
   *
   * @param length
   *            : độ dài của cuỗi
   * @return
   */
  public getDfString(length: number): DfString {
    if (length == 0) return DfString.empty();
    let value = this.getBytes(length);

    if (value == null) return DfString.empty();

    return DfString.utf8ByteArrayToDfString(value);
  }

  public getShortDfString(): DfString {
    //lấy độ dài của chuỗi
    let length: number = this.getShort().value;

    //trả về chuỗi
    return this.getDfString(length);
  }

  /**
	 * Lấy mảng byte từ cuối mảng
	 * @return
	 */
  public getLastBytes():Array<number>{
		let len = this.mBuffer.length - this.mOffset;
		return this.getBytes(len);
	}

  public toString(): String {
    let s = "";
    s += "{" + (this.mBuffer[0] & 0xff);
    for (let i = 1; i < this.mBuffer.length - 1; i++) {
      s += ", " + (this.mBuffer[i] & 0xff);
    }
    s += ", " + (this.mBuffer[this.mBuffer.length - 1] & 0xff) + " };";

    return s;
  }

  /**
   * di chuyển con trỏ lệch tơi ví trí bằng step
   *
   * @param step
   */
  public moveTo(step: number): void {
    this.mOffset += step;
  }

  /**
   * copy dữ liệu vào mảng byte
   * @param src
   * @param srcPos
   * @param dest
   * @param destPos
   * @param length
   */
  private static arraycopy(
    src: Array<number>,
    srcPos: number,
    dest: Array<number>,
    destPos: number,
    length: number
  ) {
    // Log.e("arraycopy srcPos " + srcPos + "; destPos = " + destPos + ";length = " + length);
    // Log.b(src);
    // Log.b(dest);

    let size = length + srcPos;
    if (src.length < size) {
      size = src.length;
    }

    // Log.e("arraycopy src length =  " + size);

    if (dest.length < length + destPos) {
      let bs: Array<number> = new Array(length + destPos);
      bs.concat(dest);
      dest = bs;
    }

    // Log.e("arraycopy destSize =  " + dest.length);

    for (var i = srcPos, j = destPos; i < size; i++, j++) {
      dest[j] = src[i];
    }
  }

  /**
   * Converts a JS string to a UTF-8 "byte" array.
   * @param {string} str 16-bit unicode string.
   * @return {!Array<number>} UTF-8 byte array.
   */

  /**
   * kiểm tra giá trị có phải là một số nguyên hay không
   * @param value
   */
  private isInteger(value: number): void {
    if (Number.isInteger(value))
      throw Error("Giá trị truyền vào không phải là một số nguyên: " + value);
  }

  private static validNumber(value: number): number {
    return !value ? 0 : value;
  }

  /**
	 * lấy toàn bộ buffer, không quan tâm số lượng byte thực có trong buffer
	 * @return
	 */
	public getBuffer():number[] {
		return this.mBuffer;
  }
  
  public getOffset():number{
    return this.mOffset;
  }
}

export default DefinedBuffer;

