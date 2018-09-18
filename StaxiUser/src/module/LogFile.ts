import BAMessage from "./tcp/BAMessage";
import { Utils, FileModule } from ".";
import ISentMessage from "./tcp/ISentMessage";
import {
  ISerialize,
  AbstractDefineType,
  DataType,
  DfList,
  DfNumberArray
} from "./js-serialize/DefinedType";
import StringBuilder from "./model/StringBuilder";
import { PriorityType } from "./tcp/BAMessageType";
import { AsyncStorage, Platform } from "react-native";
import PlatformOS from "./PlatformOS";
var RNFS = require("react-native-fs");

class LogFile {
  private static QUEUE_SIZE = 1;

  private static fileName;

  private static pathFile;

  private static folderName;

  private static isAndroid = PlatformOS.isAndroid();

  public static buffer: Array<string> = new Array<string>();

  public static initialize(folderName) {
    this.folderName = folderName;
  }

  /**
   * Log dạng binary dữ liệu
   */
  public static logBinary(b: Array<number>): void {
    if (!b) {
      console.log("logBinary dữ liệu b = undefined");
      return;
    }

    if (b.length <= 0) {
      console.log("logBinary dữ liệu b.length = " + b.length);
      return;
    }

    var s = new String("{" + (b[0] & 0xff));
    var size = b.length;
    for (var i = 1; i < size; i++) {
      s = s.concat(", ");
      s = s.concat("" + (b[i] & 0xff));
    }
    s = s.concat("};");

    // hiện thị log
    console.log(s);
  }

  /**
   * Hiện thị giá trị bít trong byte
   * @param num
   */
  public static logBitSet(num: number) {
    let sb = [];

    for (let i = 0; i < 32; i++) {
      sb.push((num & 1) == 1 ? 1 : 0);
      num >>= 1;
      if ((i + 1) % 8 == 0) {
        sb.push(" ");
      }
    }
    this.e(sb.reverse().toString());
  }

  /**
   *
   * @param b log bit
   */
  public static bit(value: number) {
    this.e((value >>> 0).toString(2));
  }

  public static e(message?: any, ...optionalParams: any[]): void {
    //lưu log file
    this.writeLog(message, optionalParams);
  }

  public static log(message?: any, ...optionalParams: any[]): void {
    //lưu log file
    this.e(message, optionalParams);
  }

  public static d(value: any): void {
    console.debug(value);
  }

  /**
   * Hiện thị message
   *
   * @param message
   */
  public static logReceivedMessage(message: BAMessage) {
    if (message == null) return;

    //những bản tin looper thì ko cần log
    if (message.type.getPriorityType() == PriorityType.MAINTAIN_CONNECTION) {
      return;
    }

    // this.e("logReceivedMessage", message.type.getId().toString() +
    // " - " +
    // message.type.getReceivedInstance().constructor.name);

    let builder = new StringBuilder();
    builder.append(
      message.type.getId().toString() +
        " - " +
        message.type.getReceivedInstance().constructor.name
    );

    builder.append("[");
    builder.append(Utils.formatDateTime(message.time));
    builder.append("]");
    builder.append(this.parseMessage(message.getWrapperData()));

    this.e(builder.toString());
  }

  /**
   * Hiện thị message
   *
   * @param message
   */
  public static logSentMessage(message: BAMessage) {
    if (message == null) return;

    let sentMessage = <ISentMessage>message.getWrapperData();

    //những bản tin looper thì ko cần log
    if (
      sentMessage.getSentMessageType().getPriorityType() ==
      PriorityType.MAINTAIN_CONNECTION
    ) {
      return;
    }

    let builder = new StringBuilder();
    // this.e("logSentMessage", sentMessage.getSentMessageType().getId() +
    // " - " +
    // sentMessage.constructor.name);
    builder.append(
      sentMessage.getSentMessageType().getId() +
        " - " +
        sentMessage.constructor.name
    );
    builder.append("[");
    builder.append(Utils.formatDateTime(new Date().getTime()));
    builder.append("]");
    builder.append(this.parseMessage(sentMessage));

    this.e(builder.toString());
  }

  public static parseMessage(instance, log?: StringBuilder): StringBuilder {
    if (!instance) return new StringBuilder("NULL");

    log = log || new StringBuilder();

    try {
      //sắp xếp và lấy giá trị của đối tượng
      let objs = this.sort(instance);

      //   console.log("parseMessage instance", objs);
      log.append("{");
      objs.forEach(value => {
        this.appendFields(log, value);
      });
      log.append("}");
    } catch (e) {
      this.e("", e);
    }

    return log;
  }

  private static appendFields(log: StringBuilder, value) {
    if (value == null) {
      log.append("NULL, ");
      return;
    }

    //thêm index bản tin
    if (AbstractDefineType.isSerialize(value)) {
      log.append("[");
      log.append(value.propertyIndex.toString());
      log.append("]=>");
    }
    //nếu loại tự định nghĩa
    if (AbstractDefineType.instanceOf(value)) {
      //kiểm tra loại object có phải là loại tự định nghĩa hay không
      this.logDefineType(log, value);
      log.append(",");
      return;
    }

    //gọi lại nếu là đối tượng khác
    this.parseMessage(value, log);
    log.append(",");
  }

  public static logDefineType(
    log: StringBuilder,
    element: AbstractDefineType<any>
  ) {
    // console.log("logDefineType", element)
    if (!element || element.value === "undefined") {
      log.append("undefined");
      return;
    }

    let type = element.dataType;

    if (AbstractDefineType.isBaseDataType(element)) {
      log.append(element.value.toString());
      return;
    }

    if (type == DataType.LATLNG) {
      log.append(element.value.toString());
      return;
    }

    if (element instanceof DfList) {
      element.value.forEach(element => {
        this.appendFields(log, element);
      });
      return;
    }

    if (element instanceof DfNumberArray) {
      let arr = [];
      element.value.forEach(element => {
        arr.push(element);
      });
      log.append("[" + arr.join(",") + "]");
      return;
    }

    this.appendFields(log, element);
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

  private static isObject(val) {
    if (val === null) {
      return false;
    }
    return typeof val === "function" || typeof val === "object";
  }

  public static parseObject(
    message: any,
    optionalParams?: any[]
  ): { message: string; prefix?: string } {
    let object;
    let prefix;
    if (optionalParams != null) { // && optionalParams.length > 0) {
      object = optionalParams;
      prefix = JSON.stringify(message);
    } else {
      if (message == null) return { message: "Đối tượng null", prefix: "" };

      object = JSON.stringify(message);
      prefix = "";
    }

    if (Array.isArray(object)) {
      message = "[";
      let index = 0;
      let data;
      object.forEach(item => {
        data = this.parseObject(item);
        message += `[${index}] => [${data.message}], `;
        index += 1;
      });
      message = message.substring(0, message.length - 2);
      message = message + "]";
      return { message: message, prefix: prefix };
    } else if (this.isObject(object)) {
      prefix =
        message.constructor.name != "String"
          ? message.constructor.name + " =>" + prefix
          : prefix;
      if (AbstractDefineType.isSerialize(message)) {
        message = this.parseMessage(message).toString();
      } else {
        message = JSON.stringify(object);
        console.log("nó là đối tượng message", message);
      }
      return { message: message, prefix: prefix };
    } else {
      return { message: JSON.stringify(object), prefix };
    }
  }

  private static writeLog(message: any, optionalParams: any[]) {
    let time = this.formatDateTime(new Date());

    let obj = this.parseObject(message, optionalParams);

    //thêm vào queue
    let s = `[${time}] [${obj.prefix || ""}] => ${obj.message} \r\n`;

    //hiện thị log ở console
    if (__DEV__) {
      //log thông tin
      console.log(s);
    }

    this.buffer.push(s);

    //lưu file khi có 2 mẫu
    this.saveFile(__DEV__ ? 1 : this.QUEUE_SIZE);
  }

  public static formatDateTime(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  }

  public static saveFile(queue?: number) {
    //lưu file khi có 2 mẫu
    if (
      (!LogFile.isAndroid && this.pathFile === undefined) ||
      this.buffer.length >= (queue || 1)
    ) {
      if (this.buffer.length == 0) return;

      let strings: string[] = this.buffer.slice();

      // console.log("writeLog $$$$$$$$", strings.length);
      this.buffer.length = 0;

      //lưu file khi có 2 mẫu
      this.save(strings);
    }
  }

  /**
   * Lưu chuỗi vào file
   *
   * @param buffer
   */
  private static async save(buffer: string[]) {
    // console.log("save $$$$$$$$", buffer.length);

    try {
      let str = "";
      buffer.map(s => {
        str += s;
      });

      //nếu android thì ghi lên native
      if (LogFile.isAndroid) {
        await FileModule.writeLog(str);
        return;
      }

      if (this.pathFile === undefined) {
        this.pathFile = await this.createFile();
      }
      // write the file
      // await RNFS.writeFile(this.pathFile, str, "utf8");
      await RNFS.write(this.pathFile, str, undefined, "utf8");
      // console.log("FILE WRITTEN!");
    } catch (error) {
      console.log("LogFile Save", error);
    }
  }

  private static async createFile(): Promise<string> {
    try {
      //tạo folder
      let pathFolder =
        (Platform.OS == "android"
          ? RNFS.ExternalStorageDirectoryPath
          : RNFS.LibraryDirectoryPath) +
        "/" +
        (this.folderName || "Staxi");

      //tạo thư mục để logfile
      let isExistent = await RNFS.exists(pathFolder);
      if (!isExistent) {
        await RNFS.mkdir(pathFolder);
      }

      console.log("createFile#### Staxi not exists", pathFolder);

      //tạo thư mục theo ngày của log
      pathFolder +=
        "/" + Utils.formatDateTime(new Date().getTime(), "dd_MM_yyyy");

      isExistent = await RNFS.exists(pathFolder);
      if (!isExistent) {
        // console.log("createFile#### Staxi Date not exists", pathFolder);
        await RNFS.mkdir(pathFolder);
      }

      console.log("createFile this.pathFolder", pathFolder);

      //nếu chưa tồn tài thì lấy tên file được lưu trữ
      if (this.fileName === undefined) {
        this.fileName = await this.getPathFileLog();
      }

      // console.log("createFile this.fileName after AsyncStorage", this.fileName);

      //tạo file
      if (this.fileName != undefined) {
        //kiểm tra tên file có cùng ngày không, nếu không thì tạo file mới
        let subFileName = this.fileName.substring(6, 16);
        //                Log.d("","subFileName = " + subFileName);

        // console.log("createFile this.subFileName", subFileName);

        if (!subFileName === this.folderName) {
          this.fileName = await this.createFileName();
        }
      } else {
        this.fileName = await this.createFileName();
      }

      this.pathFile = pathFolder + "/" + this.fileName;

      // if (!RNFS.exists(this.pathFile)) {
      //   console.log("createFile#### this.pathFile not exists", this.pathFile);
      //   await RNFS.tocu(this.pathFile);
      // }

      console.log("pathFile ==", this.pathFile);

      return Promise.resolve(this.pathFile);
    } catch (error) {
      console.log("LogFile createFile", error);

      this.pathFile = null;

      Promise.reject(error);
    }
  }

  //tạo filename nếu chưa có
  private static async createFileName() {
    let fileName: string =
      Utils.formatDateTime(new Date().getTime(), "HH_mm_dd_MM_yyyy") + ".txt";

    // console.log("createFileName ==", fileName);

    //Lưu tên logFile
    try {
      await AsyncStorage.setItem("PathFileLog", fileName);
    } catch (error) {
      console.log("setPathFileLog", error);
    }
    // console.log("createFileName 1==", fileName);

    return Promise.resolve(fileName);
  }

  /** lấy tên file */
  public static getPathFileLog() {
    try {
      return AsyncStorage.getItem("PathFileLog");
    } catch (error) {
      console.log("getPathFileLog", error);
      Promise.resolve(null);
    }
  }
}

export default LogFile;
