import LogFile from "../LogFile";

export default class TCPUtils {
  /**
   * Mã hóa bản tin login
   * @param data
   * @return Một cặp gồm dữ liệu đã mã hóa và msgcode
   */
  public static tcpEncodeLogin(data, k) {
    // console.log("tcpEncodeLogin --------------")
    let ret = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      if (i % 4 == 0) ret[i] = data[i] ^ k[2];
      if (i % 4 == 1) ret[i] = data[i] ^ k[0];
      if (i % 4 == 2) ret[i] = data[i] ^ k[1];
      if (i % 4 == 3) ret[i] = data[i] ^ k[3];
    }
    //ret = PosChangeEncode(ret);
    ret = this.PosChangeEncode(ret);
    return ret;
  }

  /**
   * Giải mã bản tin login
   * @param data
   * @return
   */
  public static tcpDecodeLogin(k, data) {
    // console.log("tcpDecodeLogin --------------")
    if (data == null || data.length == 0) {
      return null;
    }

    let tmp = this.PosChangeDecode(data);
    let ret = new Array(tmp.length);

    for (let i = 0; i < data.length; i++) {
      if (i % 4 == 0) ret[i] = tmp[i] ^ k[2];
      if (i % 4 == 1) ret[i] = tmp[i] ^ k[0];
      if (i % 4 == 2) ret[i] = tmp[i] ^ k[1];
      if (i % 4 == 3) ret[i] = tmp[i] ^ k[3];
    }

    return ret;
  }

  /**
   * Mã hóa một bản tin bình thường trong TCP
   * @return
   */
  public static tcpEncodeMsg(
    data: number[],
    sessionKey: number[],
    k: number[]
  ) {
    if (data == null || data.length == 0) {
      return null;
    }
    
    let key = new Array(sessionKey.length);
    // LogFile.logBinary(sessionKey);
    //Tao khoa
    for (let i = 0; i < key.length; i++) {
      if (i % 3 == 0) key[i] = sessionKey[i] ^ k[1];
      if (i % 3 == 1) key[i] = sessionKey[i] ^ k[0];
      if (i % 3 == 2) key[i] = sessionKey[i] ^ k[3];
    }

    let ret = new Array(data.length);
    //ma ban tin
    for (let i = 0; i < data.length; i++) {
      ret[i] = data[i] ^ key[i % key.length];
    }

    // LogFile.logBinary(ret);

    ret = this.PosChangeEncode(ret);
    return ret;
  }

  /**
   * Giải mã một bản tin thông thường trong TCP
   * @param data
   * @param sessionKey
   * @return
   */
  public static tcpDecodeMsg(
    k: number[],
    data: number[],
    sessionKey: number[]
  ) {
    if (data == null || data.length == 0) {
      return data;
    }
    let tmp = this.PosChangeDecode(data);
    let ret = new Array(tmp.length);

    let key = new Array(sessionKey.length);
    //Tao khoa
    for (let i = 0; i < key.length; i++) {
      if (i % 3 == 0) key[i] = sessionKey[i] ^ k[1];
      if (i % 3 == 1) key[i] = sessionKey[i] ^ k[0];
      if (i % 3 == 2) key[i] = sessionKey[i] ^ k[3];
    }
    //giai ma ban tin
    for (let i = 0; i < data.length; i++) {
      ret[i] = tmp[i] ^ key[i % key.length];
    }
    return ret;
  }

  /**
   * Trộn một mảng byte
   * @param data
   * @return
   */
  private static PosChangeEncode(data: number[]) {
    if (data.length == 1) {
      return data;
    }

    let len = data.length;
    let ret = new Array(len);
    let start = (len / 2)|0;

    for (let i = 0; i < start; i++) {
      ret[i] = data[start - i - 1];
    }

    for (let j = start; j < len; j++) {
      ret[j] = data[len - (j - start + 1)];
    }

    return ret;
  }

  /**
   * Trộn một mảng byte
   * @param data
   * @return
   */
  private static PosChangeDecode(data: number[]) {
    if (data.length == 1) {
      return data;
    }

    let len = data.length;
    // console.log("PosChangeDecode", len);
    let ret = new Array(len);
    // console.log(ret);
    let start = (len / 2)|0;
    // console.log("start ==", start);

    for (let i = start - 1; i >= 0; i--) {
      ret[i] = data[start - i - 1];
    }

    for (let j = len - 1; j >= start; j--) {
      ret[j] = data[len - 1 - j + start];
    }
    return ret;
  }
}
