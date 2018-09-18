/**
 * Hiện tại có những hạn chế
 * đã có thời gian timeout => nhưng khi có kết quả vẫn chạy lệnh timeout => sẽ check sau
 *
 */
import ContentType from './ContentType';
import MethodType from './MethodType';
import {ByteHelper, Utils} from '..';
var gBase64 = require('base-64');

class ErrorHttp {
  public message: string;
  constructor(message?: string) {
    this.message = message;
  }
}

export default class HttpUtils {
  static HTTP_OK = 200;
  static REQ_PARAM = 'Param';

  static TIMEOUT = (url, timeout = 10000) =>
    new Promise((resolve, reject) => {
      // let startTime = new Date().getTime();
      setTimeout(() => {
        resolve(new ErrorHttp('Timeout: Kết nối với server quá lâu'));
      }, timeout);
    });

  static httpController(
    url: string,
    param: Object,
    contentType: ContentType,
    methodType = MethodType.POST
  ) {
    let data = this.formatData(param, contentType);
    return fetch(url, {
      method: methodType,
      headers: this.formatHeader(contentType),
      body: data,
    });
  }

  /**
   * thực hiện format header
   * @param contentType
   */
  static formatHeader(contentType: ContentType) {
    //nếu không có loại nội dung thì gán giá trị mặc định
    if (!contentType) contentType = ContentType.BYTE_ENCODING;

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      TypeHeader: contentType.toString(),
    };
  }

  /**
   *
   * @param param thực hiện format đối tượng
   * @param contentType
   */
  static formatData(param: Object, contentType: ContentType): string {
    if (contentType == ContentType.JSON) return JSON.stringify(param);
    return JSON.stringify({Param: param});
  }

  /**
   *
   * @param buffer chuyển đổi mảng byte thành base64
   */
  static arrayBufferToBase64(buffer): string {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // return window.btoa(binary)=> chỉ dùng được khi kết nối debug;
    return gBase64.encode(binary);
  }

  /**
   * chuyển đổi chuỗi base 64 thành mảng byte
   * @param responseBase64
   */
  static base64ToBuffer(responseBase64: string): Array<number> {
    // LogFile.e("base64ToBuffer : " + responseBase64);

    //chuyển từ base64 sang chuỗi => chỉ dùng được khi kết nối debug
    // let str = window.atob(base64);

    let str = gBase64.decode(responseBase64);
    // LogFile.e("base64ToBuffer: " + str);

    //chuyển chuỗi thành mảng byte
    let binary: number[] = [];
    for (let i = 0; i < str.length; i++) {
      binary[i] = str.charCodeAt(i);
    }
    // Log.b(binary);
    return binary;
  }

  static requestPost(
    url: string,
    request: Object,
    contentType: ContentType
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpController(url, request, contentType)
        .then(response => {
          if (response.status == this.HTTP_OK) {
            let json = response.json();
            if (json instanceof Promise) {
              json
                .then(res => {
                  resolve(res);
                })
                .catch(err => {
                  reject(new Error(err.toString()));
                });
            } else {
              resolve(json);
            }
          } else {
            reject(new Error(response.statusText));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** xử lý request với timeout mặc định là 10s */
  static promisePost(
    url: string,
    request: Object,
    contentType: ContentType,
    timeout = 10000
  ) {
    return Promise.race([
      this.requestPost(url, request, contentType),
      this.TIMEOUT(url, timeout),
    ]);
  }

  static promisePostWithTimeout(
    url: string,
    request: Object,
    contentType: ContentType,
    timeout = 10000
  ):Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.race([
        this.requestPost(url, request, contentType),
        this.TIMEOUT(url, timeout),
      ])
        .then(ret => {
          if (ret instanceof ErrorHttp) {
            reject(new Error(ret.message));
          }else{
            resolve(ret);
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * request dữ liệu với đầu vào là chuỗi json
   * @param  url : api gửi lên server
   * @param request : đối tượng request gửi lên server
   */
  static fetchByJson(url: string, request: any, timeout?: number) {
    return this.promisePostWithTimeout(url, request, ContentType.JSON, timeout);
  }

  /**
   * request dữ liệu với đầu vào là mảng byte
   * @param url : api gửi lên server
   * @param request : đối tượng request gửi lên server
   * @param response : đối tượng trả về
   * @returns: trả về là một promissi
   */
  static async fetchByObject<T>(
    url: string,
    request: Object,
    response: T,
    timeout?: number
  ): Promise<T> {
    try {
      //chuyển đổi đối tượng thành mảng byte
      let arr = ByteHelper.serialize(request);

      //mã hóa dữ liệu
      arr = this.httpEnCodeV2(arr);

      //nếu là mảng byte thì thực hiện
      // Log.b(arr);
      let base64 = this.arrayBufferToBase64(arr);

      //gửi thông tin lên server => trả về dữ liệu base64
      var resBase64 = await this.promisePostWithTimeout(
        url,
        base64,
        ContentType.BYTE_ENCODING,
        timeout
      );

      //giải mã base64
      arr = this.base64ToBuffer(resBase64);

      //giải mã hóa riêng
      arr = this.httpDeCodeV2(arr);

      //chuyển mảng byte thành đối tượng
      ByteHelper.deserialize(arr, response);

      return Promise.resolve(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * mã hóa dữ liệu
   * @param p
   */
  static httpEnCodeV2(p: number[]): number[] {
    let a, c, e;
    a = Utils.getRandomInt(6) + 10;
    c = Utils.getRandomInt(6) + 10;

    let f: number[] = Utils.nextBytes(a);
    let g: number[] = Utils.nextBytes(c);
    let k: number[];

    if (a >= c) {
      k = [a];
      let i = 0;
      for (; i < c; i++) {
        k[i] = f[i] ^ g[i];
      }
      for (; i < a; i++) {
        k[i] = f[i];
      }
    } else {
      k = [c];
      let i = 0;
      for (; i < a; i++) {
        k[i] = f[i] ^ g[i];
      }
      for (; i < c; i++) {
        k[i] = g[i];
      }
    }
    e = p.length;

    let q = a + c + e + 6;
    let s = 0;
    if (q < 128) {
      s = 133 - q;
    }
    let l = s + q;

    let b = new Array<number>(l);

    b[0] = a;
    ByteHelper.putInt(b, e, 1);
    b[5] = c;
    let o = 6;
    for (let j = 0; j < a; j++) {
      b[o + j] = f[j];
    }
    o += a;
    for (let j = 0; j < c; j++) {
      b[o + j] = g[j];
    }
    o += c;
    let t = k.length;
    for (let j = 0; j < e; j++) {
      b[o + j] = p[j] ^ k[j % t];
    }
    o += e;
    if (s > 0) {
      b[o] = s;
      o += 1;
      let r = Utils.nextBytes(s);
      for (let j = 0; j < s - 1; j++) {
        b[o + j] = r[j];
      }
    }
    return b;
  }
  /**
   * Giải mã dữ liệu qua http
   * @param text
   * @return
   */
  static httpDeCodeV2(b: number[]): number[] {
    let c, e, f;
    c = b[0];
    f = ByteHelper.getShort(b, 1);
    e = b[5];
    let a = 6;
    let g = new Array<number>(c);
    for (let j = 0; j < c; j++) {
      g[j] = b[6 + j];
    }
    a += c;
    let h = new Array<number>(e);
    for (let j = 0; j < e; j++) {
      h[j] = b[a + j];
    }
    a += e;

    let k;
    if (c >= e) {
      k = new Array<number>(c);
      let i = 0;
      for (; i < e; i++) {
        k[i] = g[i] ^ h[i];
      }
      for (; i < c; i++) {
        k[i] = g[i];
      }
    } else {
      k = new Array<number>(e);
      let i = 0;
      for (; i < c; i++) {
        k[i] = g[i] ^ h[i];
      }
      for (; i < e; i++) {
        k[i] = h[i];
      }
    }
    //int off = k1l + k2l + 4;
    let m = k.length;
    let d = new Array<number>(f);
    for (let j = 0; j < f; j++) {
      d[j] = b[a + j] ^ k[j % m];
    }
    return d;
  }
}
