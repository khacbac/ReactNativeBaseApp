/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-16 01:40:59
 * @modify date 2018-07-16 01:40:59
 * @desc [Lớp xử lý package và unpackage đối tượng thành mảng byte]
*/

import DefinedBuffer from "./DefinedBuffer";
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
  DataType,
  AbstractDefineType,
  DfList,
  DfNumberArray,
  ISerialize
} from "./DefinedType";
import LogFile from "../LogFile";
/**
 * @author: Lucnd
 * Lớp tiện ích chuyển đổi đối tượng thành một mảng byte và ngược lại
 * Hiện tại khi phân tích đối tượng cho sắp xếp theo index các thuộc tính trong đối tượng
 * mà đang sửa dụng index sắp xếp các thuộc tính tự trong class.
 * => chú ý khi thay đổi vị trí các thuộc tính trong lớp
 */
class ByteHelper {
  /**
   * zip đối tượng thành mảng byte
   * @param object
   */
  public static serialize(object: Object): number[] {
    var buffer = DefinedBuffer.allocate();
    this.putObject(buffer, object);
    return buffer.getByteBuffer();
  }

  /**
   * chuyển đổi đối tượng thành mảng => đẩy vào buffer lưu trữ
   * @param object
   */
  public static putObject(buffer: DefinedBuffer, object: object): void {
    // console.log(JSON.stringify(Object.values(object)));

    //kiểm tra loại object có phải là loại tự định nghĩa hay không
    if (object instanceof AbstractDefineType && !object.getIgnore()) {
      // console.log(" object = " + JSON.stringify(object));
      return this.setValue(buffer, object);
    }

    //sắp xếp trước
    // let sortedObjects = this.sort(object);
    // sortedObjects.forEach(element => {
    //   if (element instanceof AbstractDefineType && !element.getIgnore()) {
    //     this.setValue(buffer, element);
    //   } else{
    //     this.putObject(buffer, element);
    //   }
    // });

    // lấy tất cả các giá trị trong đối tượng
    (<any>Object).values(object).forEach(element => {

      //nếu loại tự định nghĩa thì thiết lập trực tiếp luôn
      if (element instanceof AbstractDefineType && !element.getIgnore()) {
        this.setValue(buffer, element);

      //nếu là một đối tượng khác muốn push dữ liệu lên
      } else if (AbstractDefineType.isSerialize(element)) {
        // console.log("isSerialize putObject", JSON.stringify(element));
        this.putObject(buffer, element);
      }
    });
  }

 /**
   * sắp xếp các trường đối tượng theo index được chỉ rõ
   * @param object
   */
  private static sort(object): Array<Object> {
    let ret = [];
    (<any>Object).values(object).forEach(element => {
      if (AbstractDefineType.isSerialize(element)) {
        ret.push(element);
      }
    });
    return ret.sort(this.compare);
  }

  private static compare(a: ISerialize, b: ISerialize) {
    if (a.propertyIndex < b.propertyIndex) return -1;
    if (a.propertyIndex > b.propertyIndex) return 1;
    return 0;
  }

  public static setValue(buffer: DefinedBuffer, element: AbstractDefineType<any>) {
    let type = element.dataType;
    // console.log("setValue buffer.getOffset()", buffer.getOffset() + "; =" + element.constructor.name);
    // console.log("setValue", JSON.stringify(element));
    if (type == DataType.STRING) {
      // console.log(" DataType.STRING = bytes.length ==" + JSON.stringify(element));
      let bytes: Array<number> = DfString.toBytes(<DfString>element);
      // console.log(" DataType.STRING = bytes.length ==" + bytes.length);
      //đẩy độ lớn lưu trữ giá trị độ dài mảng
      this.putSize(
        buffer,
        (<DfString>element).getSizeStoreLength(),
        bytes.length
      );
      // LogFile.logBinary(bytes);
      //đẩy mảng byte vào
      buffer.putBytes(bytes);
    } else if (type == DataType.INT) {
      buffer.putInteger(<DfInteger>element);
    } else if (type == DataType.BYTE) {
      buffer.putByte(<DfByte>element);
    } else if (type == DataType.SHORT) {
      buffer.putShort(<DfShort>element);
    } else if (type == DataType.LONG) {
      buffer.putLong(<DfLong>element);
    } else if (type == DataType.FLOAT) {
      buffer.putFloat(<DfFloat>element);
    } else if (type == DataType.DOUBLE) {
      buffer.putDouble(<DfDouble>element);
    } else if (type == DataType.BOOLEAN) {
      buffer.putBoolean(<DfBoolean>element);
    } else if (type == DataType.LATLNG) {
      buffer.putDfLatLng(<DfLatLng>element);
    } else if (element instanceof DfList) {
      // console.log("putObject ==" + JSON.stringify(element));
      this.putList(buffer, <DfList<any>>element);
    } else if (element instanceof DfNumberArray) {
      // console.log("putNumberArray ==" + JSON.stringify(element));
      this.putNumberArray(buffer, <DfNumberArray>element);
    } else {
      // console.log(" element.constructor.name ==" + element.constructor.name);
      this.putObject(buffer, element);
    }
  }

  /**
   * nén 1 mảng dữ liệu
   * @param buffer
   * @param object
   */
  public static putList(buffer: DefinedBuffer, object: DfList<any>): void {
    // console.log(object.value);

    // console.log(JSON.stringify(Object.values(object)));

    //lấy độ dài của list
    this.putSize(buffer, object.getSizeStoreLength(), object.value.length);
    // console.log(
    //   "putList object.value.length==" + object.value.length
    // );

    object.value.forEach(element => {
      // console.log("putList ==" + JSON.stringify(element));
      this.putObject(buffer, element);
    });
  }

  /**
   * đẩy các mảng số
   * @param buffer
   * @param object
   */
  public static putNumberArray(
    buffer: DefinedBuffer,
    object: DfNumberArray
  ): void {
    // console.log(object.value);

    //lấy độ dài của list
    this.putSize(buffer, object.getSizeStoreLength(), object.getLength());

    let subType: DataType = object.getSubType();

    //kiểm tra từng loại để đẩy dữ liệu vào mảng
    if (subType === DataType.BYTE) {
      buffer.putBytes(object.value);
    } else if (subType == DataType.INT) {
      object.value.forEach(element => {
        buffer.putInt32(element);
      });
    } else if (subType == DataType.SHORT) {
      object.value.forEach(element => {
        buffer.putInt16(element);
      });
    }
  }

  public static putSize(buffer: DefinedBuffer, size: number, length: number) {
    // console.log(size + " = bytes.length ==" + length);
    if (size == 1) {
      buffer.putByte(new DfByte(length));
    } else if (size == 4) {
      buffer.putInteger(new DfInteger(length));
    } else {
      buffer.putShort(new DfShort(length));
    }
  }

  /**
   *
   * @param buffer lấy size của byte, trả về giá trị leng của mảng
   * @param size
   * @param length
   */
  public static getSize(buffer: DefinedBuffer, size: number): number {
    // console.log("getSize ==" + size);
    if (size == 1) {
      return buffer.getInt8();
    } else if (size == 4) {
      return buffer.getInt32();
    } else {
      return buffer.getInt16();
    }
  }

  /**
   * chuyển đổi mảng byte thành dữ liệu và đẩy vào mảng
   * @param buffer
   * @param object
   */
  public static deserializeList(buffer: DefinedBuffer, object: DfList<any>): void {
    //lấy độ dài của mảng
    let size = this.getSize(buffer, object.getSizeStoreLength());
    // console.log("độ dài của mảng ==" + size);
    //tạo mảng
    let item;
    let instance = this.newInstance(object.getItemInstance());
    for (let i = 0; i < size; i++) {
      item = this.deserializeObject(
        buffer,
        instance
      );
      // console.log("deserializeList clone", item.constructor.name);
      // let b = new item.constructor();
      // console.log("clone ========", b.dataType);
      // let clone = new (instance);
      //  this.clone(item);
      object.putValue(this.clone(item));
      // console.log(" deserializeList = " + object.value.length);
    }
  }

  public static deserializeNumberArray(
    buffer: DefinedBuffer,
    object: DfNumberArray
  ): void {

    //nếu nó là mảng cuối thì lấy toàn bộ đến cuối mảng
    if(object.isLastIndex){
      object.putValues(buffer.getLastBytes());
      // console.log("deserializeNumberArray == cuối mảng rồi");
      return;
    }

    //lấy độ dài của mảng
    let size = this.getSize(buffer, object.getSizeStoreLength());

    // console.log("độ dài của mảng ==" + size);
    let subType: DataType = object.getSubType();

    //kiểm tra từng loại để đẩy dữ liệu vào mảng
    if (subType === DataType.BYTE) {
      object.putValues(buffer.getBytes(size));
    } else if (subType == DataType.INT) {
      for(let i = 0; i < size; i++){
        object.putValue(buffer.getInt32());
      }
    } else if (subType == DataType.SHORT) {
      for(let i = 0; i < size; i++){
        object.putValue(buffer.getInt16());
      }
    }
  }

  /**
   *
   * @param arr phân tích 1 mảng byte thành đối tượng
   * @param object
   */
  public static deserializeObject(
    buffer: DefinedBuffer,
    object: Object
  ): Object {
    // console.log(object.constructor.name + " = ================");

    //kiểm tra loại object có phải là loại tự định nghĩa hay không
    if (object instanceof AbstractDefineType && !object.getIgnore()) {
      // console.log(object.constructor.name + " = " + JSON.stringify(object));

      object = this.getValue(buffer, object);
      // console.log(" clone object = " + object.constructor.name);
      return this.clone(object);
    }

    // sắp xếp trước
    //  let sortedObjects = this.sort(object);
    //  sortedObjects.forEach(element => {
    //    if (element instanceof AbstractDefineType && !element.getIgnore()) {
    //      this.setValue(buffer, element);
    //    } else{
    //     this.deserializeObject(buffer, element);
    //    }
    //  });

    //nếu là loại đối tượng chứa loại tự định nghĩa
    Object.keys(object).forEach(key => {
      // Log.e(key);

      //lấy đối tượng cấu hình mặc định
      let element = object[key];

      // Log.e("Element default: " + JSON.stringify(element));
      if (element instanceof AbstractDefineType && !element.getIgnore()) {
        object[key] = this.getValue(buffer, element);
      } else if (AbstractDefineType.isSerialize(element)) {
        console.log("isSerialize deserializeObject", JSON.stringify(element));
        this.deserializeObject(buffer, element);
      }
    });
    // Log.e("deserialize --------------------------------");
    // Log.e(JSON.stringify(object));
    return object;
  }

  public static getValue(
    buffer: DefinedBuffer,
    element: AbstractDefineType<any>
  ): AbstractDefineType<any> {
    let type = element.dataType;
    if (type == DataType.STRING) {
      //lấy độ dài
      let strLength = this.getSize(
        buffer,
        (<DfString>element).getSizeStoreLength()
      );

      // console.log("getValue DataType.STRING", strLength);

      //lấy giá trị
      return element.setValue(buffer.getString(strLength));
    } else if (type == DataType.INT) {
      return element.setValue(buffer.getInt32());
    } else if (type == DataType.BYTE) {
      return element.setValue(buffer.getInt8());
    } else if (type == DataType.SHORT) {
      return element.setValue(buffer.getInt16());
    } else if (type == DataType.LONG) {
      return element.setValue(buffer.getInt64());
    } else if (type == DataType.FLOAT) {
      return element.setValue(buffer.getFloat32());
    } else if (type == DataType.DOUBLE) {
      return element.setValue(buffer.getFloat64());
    } else if (type == DataType.BOOLEAN) {
      return element.setValue(buffer.getBool());
    } else if (type == DataType.LATLNG) {
      return element.setValue(buffer.getLatLng());
    } else if (element instanceof DfList) {
      this.deserializeList(buffer, <DfList<any>>element);
      return element;
    } else if (element instanceof DfNumberArray) {
      this.deserializeNumberArray(buffer, element);
      return element;
    }
  }

  /**
   * TODO: chưa xử lý được tạo đối tượng mới khi đối tượng được gán trong danh sách
   * vì vậy đối tượng trả về có format giống instance nhưng nó lại không phải là đối tượng của instance đó
   * @param element
   */
  private static newInstance(element: any): any {
    return element;
  }

   /**
   * tạo đối tượng mới với dữ liệu của thuộc tính cũ
   * nhưng nó ko phải là 1 đối tượng như thuộc tính cũ,
   * các method như đối tượng cũ sẽ ko sử dụng được
   * @param obj 
   */
  public static clone(obj) {
    // console.log("clone", obj)
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
   *
   * @param arr phân tích 1 mảng byte thành đối tượng
   * @param object
   */
  public static deserialize(arr: number[], object: Object): Object {
    var buffer = DefinedBuffer.wrap(arr);
    // Log.e("deserialize --------------------------------");
    // Log.e(JSON.stringify(object));
    return this.deserializeObject(buffer, object);
  }

  /**
   * đẩy số nguyên vào mảng byte
   * @param src
   * @param value
   * @param offset
   */
  public static putInt(src: number[], value: number, offset: number) {
    for (let i = 3; i >= 0; i--) {
      src[offset + i] = (value >> (8 * i)) & 0x00ff;
    }
  }

  public static getInt(bytes: number[], offset: number) {
    let value = 0;
    for (let i = 3; i > -1; i--) {
      value += (bytes[offset + i] & 0xff) << (8 * i);
    }
    return value;
  }

  public static getLong(bytes: number[], offset: number) {
    let m4byte = 0;
    for (let i = 7; i > 3; i--) {
      m4byte += (bytes[offset + i] & 0xff) << (8 * (i - 4));
    }

    //lấy giá trị của 4 byte thấp
    let l4byte = 0;
    for (let i = 3; i > -1; i--) {
      l4byte += (bytes[offset + i] & 0xff) << (8 * i);
    }

    return (m4byte << 32) + l4byte;
  }

  public putInt64(bytes: number[], value: number, offset: number): void {
    // for (let i = 7; i >= 0; i--) {
    // 	bytes[offset + i] = ((value >> (8 * i) & 0x00ff));
    // }

    for (let i = 0; i < 8; i++) {
      // console.log(`value: ${8 * i} = ${(value & 0xff)}`);
      bytes[offset + i] = value & 0xff;
      value >>>= 8;
    }
  }

  /**
   * lấy số short trong mảng
   * @param src
   * @param offset
   */
  public static getShort(src: number[], offset: number): number {
    return ((src[offset + 1] << 8) & 0xff00) | (src[offset] & 0xff);
  }
}

export default ByteHelper;
