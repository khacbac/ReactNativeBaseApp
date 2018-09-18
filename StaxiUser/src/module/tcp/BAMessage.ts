import { BAMessageType, CipherType } from "./BAMessageType";
import TCPUtils from "./TCPUtils";
import { DefinedBuffer, ByteHelper } from "..";
import TcpCallback from "./TcpCallBack";
import ISentMessage from "./ISentMessage";
import LogFile from "../LogFile";

class BAMessage {
  /**Độ dài của header*/
  public static LENGTH_HEADER_FIELD = 5;

  /**độ dài của message code*/
  public static LENGTH_MESSAGE_CODE = 4;

  /**Độ dài của thời gian gửi bản tin*/
  public static LENGTH_TIME_FIELD = 8;

  /**Độ dài của messageID*/
  public static LENGTH_ID_FIELD = 2;

  /**độ dài của bản tin dữ liệu*/
  public static LENGTH_LEN_FIELD = 4;

  /**độ dài check sum*/
  public static LENGTH_CHECKSUM_FIELD = 1;

  /**độ dài header cố định*/
  public static MESSAGE_HEADER_LENGTH =
    BAMessage.LENGTH_HEADER_FIELD +
    BAMessage.LENGTH_MESSAGE_CODE +
    BAMessage.LENGTH_TIME_FIELD +
    BAMessage.LENGTH_ID_FIELD;

  /**
   * Tổng độ dài các phần ngoài dữ liệu:
   * header + type + time + length + checksum + end
   * */
  public static MIN_MESSAGE_LENGTH =
    BAMessage.MESSAGE_HEADER_LENGTH +
    BAMessage.LENGTH_LEN_FIELD +
    BAMessage.LENGTH_CHECKSUM_FIELD;

  /**
   * Ký hiệu bắt đầu các msg
   */
  public static MESSAGE_HEADER: Array<number> = [
    "$".charCodeAt(0),
    "D".charCodeAt(0),
    "A".charCodeAt(0),
    "T".charCodeAt(0),
    "A".charCodeAt(0)
  ];

  public static MESSAGE_CODE = [0, 0, 0, 0];

  /**mã nhận dạng message*/
  public messageCode: number[];

  /** Thời gian gửi msg tính bằng milisecond*/
  public time = -1;

  public type: BAMessageType;

  /**độ dài dữ liệu*/
  public length: number;

  //nội dung dữ liệu
  private mCryptData: number[];

  private mNoCryptData: number[];

  /**Đối tượng nhận*/
  private receivedData: Object;

  /** Lưu trữ các đối tượng tạm*/
  public tag: Object;

  /**Lớp xử lý callback cho message*/
  private callback: TcpCallback;

  constructor(wrapData?: Object) {
    this.receivedData = wrapData;
  }

  /**
   * đóng gói đối tượng bản tin thành mảng byte
   * @param sessionKey
   */
  public packetize(sessionKey:number[]): {error?: Error, result:number[]}{
    try {
      //khởi tạo dữ liệu
      this.initDataPacketize(sessionKey);

      // console.log("packetize initDataPacketize success: ", sessionKey);

      // độ dài dữ liệu nhị phân
      let byteBuffer = DefinedBuffer.allocate(this.length);

      // Tạo Header
      byteBuffer.putBytes(BAMessage.MESSAGE_HEADER);

      //Mã nhận dạng bản tin
      byteBuffer.putBytes(this.messageCode);

      //Thời điểm gửi message theo giây
      let seconds = (this.time / 1000) | 0;
      byteBuffer.putInt64(seconds);
      // byteBuffer.putBytes([200, 108, 54, 91, 0, 0, 0, 0]);

      // let bs = byteBuffer.getByteBuffer();
      // let off = byteBuffer.getOffset();
      // LogFile.logBinary(bs);
      // console.log("Offset ==" + off);
      // let arr = [200, 108, 54, 91, 0, 0, 0, 0];
      // Utils.arraycopy(bs, off - 8, arr, 0, 8);
      // LogFile.logBinary(arr);

      // let byteBuffer2 = DefinedBuffer.allocate(8);
      // byteBuffer2.putInt64(1530294038);

      // LogFile.logBinary(byteBuffer2.getByteBuffer());

      // console.log((seconds) + " time send =" + ByteHelper.getLong(arr, 0));

      // let byteBuffer1 = DefinedBuffer.wrap(arr);
      // console.log(" byteBuffer1 =" + byteBuffer1.getInt64());

      //Lấy id của bản tin gửi đi
      byteBuffer.putInt16(this.type.getId());

      //put nội dung của message
      if (this.mCryptData != null) {
        //Tham số độ dài bản tin
        byteBuffer.putInt32(this.mCryptData.length);

        //Nội dung dữ liệu
        byteBuffer.putBytes(this.mCryptData);
      } else {
        byteBuffer.putInt32(0);
      }

      //Byte xác thực bằng checksum
      byteBuffer.putInt8(this.getCheckSum(byteBuffer.getBuffer()));

      //Format lại mảng byte trước khi gửi lên server C#, kiểu byte của C# là kiểu không dấu
      // byteBuffer.convertUnsignedBytes();

      //lấy dữ liệu buffer
      return {result:byteBuffer.getByteBuffer()};
    } catch (error) {
        return {error:error, result:null}
    }
  }

  /**
   * khởi tạo dữ liệu để đóng gói gửi lên server
   * @throws Exception
   */
  private initDataPacketize(sessionKey:number[]) {

    // console.log("packetize initDataPacketize ====== ", sessionKey);
    //số byte của message code
    this.messageCode = this.getMessageCode();

    let sentMessage = <ISentMessage>this.receivedData;

    this.type = sentMessage.getSentMessageType();

    // console.log("packetize initDataPacketize type====== ", this.type);

    //Thời điểm gửi message theo giây
    this.time = sentMessage.getSentTime();
    // console.log("time send =" + this.time);

    //chuyển đổi đối tượng thành mảng byte
    this.mNoCryptData = ByteHelper.serialize(sentMessage);

    // console.log("packetize initDataPacketize mNoCryptData====== ", this.mNoCryptData);

    //mảng byte đã mã hóa
    this.mCryptData = this.encode(this.mNoCryptData, sessionKey);

    // console.log("packetize initDataPacketize mCryptData====== ", this.mCryptData);

    //tổng số byte của message
    this.length = BAMessage.MIN_MESSAGE_LENGTH;
    if (this.mCryptData != null) {
      this.length += this.mCryptData.length;
    }
  }

  public static convert(bytes: number[], sessionKey:number[]): BAMessage {
    let message = new BAMessage();
    message.unpacketize(bytes, sessionKey);
    return message;
  }

  /**
   * chuyển đổi mảng byte thành đối tượng
   * @param bytes
   * @return
   * @throws Exception
   */
  public unpacketize(bytes: number[], sessionKey:number[]): BAMessage {
    if (bytes == null) return null;

    let buffer = DefinedBuffer.wrap(bytes);

    //bỏ qua 5 byte header
    let header = buffer.getBytes(BAMessage.LENGTH_HEADER_FIELD);
    // console.log("Header: ", header);
    // buffer.moveTo(BAMessage.LENGTH_HEADER_FIELD);

    //lấy message code
    this.messageCode = buffer.getBytes(BAMessage.LENGTH_MESSAGE_CODE);
    // console.log("messageCode: ", this.messageCode);

    //lấy thời điểm gửi message từ server
    this.time = buffer.getInt64() * 1000;

    // console.log("this.time: ", this.time);

    //lấy id của bản tin
    this.type = BAMessageType.getMessageType(buffer.getInt16());
    if(!this.type){
      console.log("Lỗi loại bản tin", this.type);
      this.type = new BAMessageType(-1);
    }

    //Nếu không có lớp để chuyển mảng byte thành đối tượng thì bỏ qua
    if (this.type.getReceivedInstance() == null) {
      console.log(
        "Thiếu lớp nhận lưu dữ liệu trả về của loại message: " + this.type
      );
      return null;
    }

    //lấy độ dài của bản tin
    this.length = buffer.getInt32();

    //nếu có dữ liệu thì sẽ chuyển thành đối tượng
    if (this.length != 0) {
      //lấy nội dung của bản tin
      this.mCryptData = buffer.getBytes(this.length);

      // LogFile.logBinary(this.mCryptData);

      //dữ liệu giải mã
      this.mNoCryptData = this.decode(this.mCryptData, sessionKey);

      // LogFile.logBinary(this.mNoCryptData);

      //chuyển đổi mảng byte thành đối tượng
      this.receivedData = ByteHelper.deserialize(
        this.mNoCryptData,
        this.type.getReceivedInstance()
      );
    }

    return this;
  }

  /**
   * Giải mã mảng byte theo sessionkey
   *
   * @param data
   * @return
   */
  protected decode(data: number[], sessionKey:number[]): number[] {
    if (this.type.getCipherType() == CipherType.SESSION_KEY) {
      if (!sessionKey) {
        throw new Error(
          "Lỗi reset mất sessionkey khi gửi bản tin, yêu cầu relogin lại để có sesionkey"
        );
      }
      return TCPUtils.tcpDecodeMsg(
        this.messageCode,
        data,
        sessionKey
      );
    } else {
      return TCPUtils.tcpDecodeLogin(this.messageCode, data);
    }
  }

  protected encode(data: number[], sessionKey:number[]): number[] {
    if (this.type.getCipherType() == CipherType.SESSION_KEY) {

      if (!sessionKey) {
        throw new Error(
          "Lỗi reset mất sessionkey khi gửi bản tin, yêu cầu relogin lại để có sesionkey:" + this.getWrapperData().constructor.name
        );
      }

      return TCPUtils.tcpEncodeMsg(
        data,
        sessionKey,
        this.messageCode
      );
    } else {
      return TCPUtils.tcpEncodeLogin(data, this.messageCode);
    }
  }

  /**
   * Độ dài dữ liệu của msg
   */
  private getMessageCode(): number[] {
    // return Utils.nextBytes(BAMessage.LENGTH_MESSAGE_CODE);
    return BAMessage.MESSAGE_CODE;
  }

  /**
   * Lấy check sum của dữ liệu
   * @param bs
   * @return
   */
  public getCheckSum(bs: number[]): number {
    let result = 0;
    if (bs != null) {
      for (let i = 0; i < bs.length - 1; i++) {
        result += bs[i];
      }
    }
    result &= 0xff;
    return result;
  }

  /**
   * kiểm tra tính toàn vẹn của mảng byte
   *
   * @return
   */
  public isChecksum(bs: number[]): boolean {
    if (bs == null || bs.length < 24) return false;

    let result = 0;

    // lấy giá trị checksum
    let checksum = bs[bs.length - 1] & 0xff;

    // lấy tổng số byte
    for (let i = 0; i < bs.length - 1; i++) {
      result += bs[i];
    }
    result &= 0xff;

    return checksum == result;
  }

  /**
   * Lấy mảng dữ liệu không được mã hóa
   * @return
   */
  public getNoCryptData(): number[] {
    return this.mNoCryptData;
  }

  public setWrapperData(obj) {
    this.receivedData = obj;
  }

  public getWrapperData() {
    return this.receivedData;
  }

  /**
   * lấy mảng dữ liệu có mã hóa
   * @return
   */
  public getCryptData(): number[] {
    return this.mCryptData;
  }

  public getCallback() {
    return this.callback;
  }

  public setCallback(callback: TcpCallback) {
    this.callback = callback;
  }
}
export default BAMessage;
