import BAMessage from "./BAMessage";
import { Utils, ByteHelper } from "..";
import LogFile from "../LogFile";
import ISentMessage from "./ISentMessage";
import NativeTcpModule from "./NativeTcpModule";
import MessageEvent from "./MessageEvent";

class Connection implements MessageEvent{
  private sessionKey: number[] = null;

  /**Buffer lưu trữ mang byte*/
  private tmpBuffer: number[];

  private static MESSAGE_HEADER_LENGTH = BAMessage.MESSAGE_HEADER.length;

  getSessionKey() {
    return this.sessionKey;
  }

  public setSessionKey(sessionKey: number[]) {
    this.sessionKey = sessionKey;
  }

  /**
   * gửi message kế thừa đối tượng ISentMessage lên server
   * @param message
   */
  public async sendMessage(message: ISentMessage, connectionID:number): Promise<Error> {
    //kiểm tra nếu không phải message ping thì kiểm tra và thêm message trong cuốc
    return this.sendBAMessage(new BAMessage(message), connectionID);
  }

  /**
   * gửi message lên server
   * @param baMessage
   */
  public async sendBAMessage(baMessage: BAMessage, connectionID:number): Promise<Error> {
    //kiểm tra nếu không phải message ping thì kiểm tra và thêm message trong cuốc
    let ret: { error?: Error; result: number[] } = baMessage.packetize(
      this.sessionKey
    );

    // console.log("sendBAMessage =====", ret);

    let sentMessage = baMessage.getWrapperData() as ISentMessage;
    let type = sentMessage.getSentMessageType();

    // console.log("sendMessage", ret);
    if (ret.error) {
      console.log(
        `sendMessage Lỗi: Type: ${type.getId()}, Error = ${ret.error.message ||
          ret.error}`
      );
      return Promise.reject(ret.error);
    } else {
      try {
        let state = await NativeTcpModule.sendRNMessage({
          data: this.arrayToString(ret.result),
          isFail: sentMessage.isReconnect(),
          type: type.getId(),
          connectionID: connectionID
        });
        // console.log("sendMessage state =====", this.arrayToString(ret.result));
        LogFile.logSentMessage(baMessage);

        return Promise.resolve(null);
      } catch (error) {
        // Alert.alert(error);
        return Promise.resolve(error);
      }
    }
  }

  private stringToArray(data: string): number[] {
    // console.log("stringToArray", data);
    let strings = data.split(",");
    let size = strings.length;
    let result: number[] = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = Number.parseInt(strings[i]);
    }
    return result;
  }

  private arrayToString(byte: number[]): string {
    return byte.join(",");
  }

  /**
   * Nhận và xử lý dữ liệu
   * @param bs
   */
  public parseReceivedData(data: string): BAMessage[] {
    let bs: number[] = this.stringToArray(data);

    //nếu mảng byte rỗng hoặc null thì bỏ qua
    if (!bs) return;

    // đẩy mảng byte vào buffer
    this.appendByte(bs);

    // Lặp để lấy vị trí các message
    let bsList: Array<number[]> = this.split(this.tmpBuffer);

    //Nếu không có hoặc không đủ package thì chờ lần sau
    if (!bsList) return;

    // xử lý mảng byte thành danh sách
    let packet: number[];
    let lastPacket: number[] = null;
    let ret: BAMessage[] = [];
    for (let i = 0; i < bsList.length; i++) {
      // copy mảng con của từng message
      packet = bsList[i];

      if (this.isChecksum(packet)) {
        ret.push(BAMessage.convert(packet, this.sessionKey));
      } else {
        lastPacket = packet;
      }
    }
    // gán lại bản tin cuối
    this.tmpBuffer = lastPacket;
    
    return ret;
  }

  public onUnpacketize(bs: number[]): BAMessage {
    let baMessage = BAMessage.convert(bs, this.sessionKey);
    return baMessage;
  }

  /**
   * hàm phân tích mảng byte đưa về thành các đoạn message
   * @param data
   * @return
   */
  public split(data: number[]): Array<number[]> {
    let listIndex: Array<number[]> = null;

    let startIndex = 0;

    while (true) {
      let header = this.indexHeader(data, startIndex);
      if (header < 0) break;

      //khởi tạo list
      if (!listIndex) {
        listIndex = new Array<number[]>();
      }

      let nextHeader = this.indexHeader(
        data,
        header + Connection.MESSAGE_HEADER_LENGTH
      );

      //nếu chỉ có 1 bản tin thì thoat luôn
      if (nextHeader == -1) {
        let length = data.length - header;
        let bs: number[] = new Array(length);
        Utils.arraycopy(data, header, bs, 0, length);
        listIndex.push(bs);
        break;
      }

      //nếu có nhiều bản tin thì chạy tiếp
      if (nextHeader > 0) {
        let length = nextHeader - header;
        let bs: number[] = new Array(length);
        Utils.arraycopy(data, header, bs, 0, length);
        listIndex.push(bs);
      }

      if (nextHeader < header) break;

      startIndex = nextHeader;
    }

    return listIndex;
  }

  /**
   * kiểm tra tính toàn vẹn của mảng byte
   *
   * @return
   */
  public isChecksum(bs: number[]): boolean {
    // nếu mảng byte chưa khởi tạo
    if (!bs) return false;

    // Nếu độ dài của mảng byte nhở hơn độ dài header
    let minMessageLength = BAMessage.MIN_MESSAGE_LENGTH;
    let length = bs.length;
    if (length < minMessageLength) {
      LogFile.d("isChecksum: Lỗi độ dài nhỏ hơn byte cho phép nhỏ nhất");
      return false;
    }

    //kiểm tra độ dài của bản tin có phù hợp hay không
    if (length < this.getDataLength(bs) + minMessageLength) {
      LogFile.d("isChecksum: Lỗi độ dài nhỏ hơn tổng dữ liệu cho phép");
      return false;
    }

    let result = 0;

    // lấy giá trị checksum
    let checksum = bs[length - 1] & 0xff;

    // lấy tổng số byte
    for (let i = 0; i < length - 1; i++) {
      result += bs[i] & 0xff;
    }

    // lấy 1 byte giá trị
    result &= 0xff;

    // LogFile.d("checksum: = " + checksum + ";result = " + result);

    let is = checksum == result;

    if (!is) {
      this.onChecksumError(bs);
    }

    return is;
  }

  public onChecksumError(bs: number[]) {
    LogFile.e("onChecksumError ==========");
    LogFile.logBinary(bs);
    LogFile.logBinary(this.sessionKey);
  }

  public getDataLength(pk: number[]): number {
    return ByteHelper.getInt(pk, BAMessage.MESSAGE_HEADER_LENGTH);
  }

  /**
   * Lấy index của header mảng byte trả về
   * @param bytes
   * @param startIndex
   * @return
   */
  public indexHeader(bytes: number[], startIndex: number) {
    if (Connection.MESSAGE_HEADER_LENGTH > bytes.length - 1) {
      return -1;
    }

    for (let i = startIndex; i < bytes.length; i++) {
      if (
        BAMessage.MESSAGE_HEADER[0] == (bytes[i] & 0xff) &&
        bytes.length - i >= Connection.MESSAGE_HEADER_LENGTH
      ) {
        let ismatch = true;
        for (let j = 1; j < Connection.MESSAGE_HEADER_LENGTH; j++) {
          if ((bytes[i + j] & 0xff) != BAMessage.MESSAGE_HEADER[j]) {
            ismatch = false;
            break;
          }
        }
        if (ismatch) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   * gán dữ liệu vào tem
   * @param bs
   */
  private appendByte(bs: number[]) {
    if (!this.tmpBuffer) {
      this.tmpBuffer = bs;
      return;
    }
    //
    //        LogFile.logBinary(bs);
    //        LogFile.logBinary(tmpBuffer);
    //        LogFile.e("tmpBuffer length: " + tmpBuffer.length + ";bs.length = " + bs.length);

    //nếu trong buffer còn dữ liệu
    let newbs: number[] = new Array(this.tmpBuffer.length + bs.length);

    //copy dữ liệu thừa vào mảng mới
    Utils.arraycopy(this.tmpBuffer, 0, newbs, 0, this.tmpBuffer.length);

    //copy dữ liệu mới vào mảng mới
    Utils.arraycopy(bs, 0, newbs, this.tmpBuffer.length, bs.length);

    //gán thành mảng mới
    this.tmpBuffer = newbs;

    //        LogFile.logBinary(tmpBuffer);
  }
}

//khải biển singleton
var ConnectionManager: Connection = ConnectionManager || new Connection();

export { ConnectionManager };
