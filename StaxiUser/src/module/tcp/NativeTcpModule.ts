import { NativeModules } from "react-native";
export default class NativeTcpModule{

  public static TCP_IP = NativeModules.NativeTcpModule.TCP_IP;

  public static TCP_PORT = NativeModules.NativeTcpModule.TCP_PORT;


  /**
   * Key nhận sự kiện từ tcp đẩy xuống RN
   */
  public static TCP_EVENT_KEY = NativeModules.NativeTcpModule.TCP_EVENT_KEY;

  /**
   * Loại sự kiện đẩy xuống
   */
  public static TCP_EVENT_KEY_TYPE = NativeModules.NativeTcpModule.TCP_EVENT_KEY_TYPE;

  /**
   * key nhận dữ liệu
   */
  public static TYPE_RECV_MSG = NativeModules.NativeTcpModule.TYPE_RECV_MSG;

  /**
   * key gửi dữ liệu
   */
  public static TYPE_SENT_MSG = NativeModules.NativeTcpModule.TYPE_SENT_MSG;

  /**
   * key gửi dữ liệu duy trì kết nối
   */
  public static TYPE_KEEP_ALIVE = NativeModules.NativeTcpModule.TYPE_KEEP_ALIVE;

  /**
   * key trạng thái kết nối
   */
  public static TYPE_CONNECTION_STATE = NativeModules.NativeTcpModule.TYPE_CONNECTION_STATE;

  /**
   * key yêu cầu kết nối lại
   */
  public static TYPE_RECONNECT_SERVER = NativeModules.NativeTcpModule.TYPE_RECONNECT_SERVER;

  /**
   * kết thúc nhận dữ liệu
   */
  public static TYPE_FINISH_RECV = NativeModules.NativeTcpModule.TYPE_FINISH_RECV;

  /**
   * trạng thái
   */
  public static TCP_STATE = NativeModules.NativeTcpModule.TCP_STATE;

  /**
   * dữ liệu
   */
  public static TCP_DATA = NativeModules.NativeTcpModule.TCP_DATA;

  /**
   * key tham số lưu trữ thời gian delay
   */
  public static TCP_DELAY_THREAD = NativeModules.NativeTcpModule.TCP_DELAY_THREAD;

  public static attachModuleToActivity() {
      return NativeModules.NativeTcpModule.attachModuleToActivity();
  }
  /**
     * thực hiện kết nối tcp và run thread nhận dữ liệu
     *
     * @param ip
     * @param port
     * @param promise: luôn trả về true, yêu cầu đợi kết nối
     */
  public static connectAndStartRecvThread(ip:string, port:number, bookId:number){
    return NativeModules.NativeTcpModule.connectAndStartRecvThread(ip, port, bookId);
  }

   /**
     * thực hiện kết nối tcp và run thread nhận dữ liệu
     *
     * @param ip
     * @param port
     * @param promise: luôn trả về true, yêu cầu đợi kết nối
     */
    public static connect(bookId:number){
      return NativeModules.NativeTcpModule.connect(bookId);
    }

  /**
   * cho phép chạy tiến trình gửi dữ liệu duy trì kết nối
   * @param isEnable 
   */ư
  public static enableKeepAlive(isEnable:boolean){
    return NativeModules.NativeTcpModule.enableKeepAlive(isEnable);
  }

  /**
   * ngắt kết nối tcp
   */
  public static disconnect(){
    return NativeModules.NativeTcpModule.disconnect();
  }

  /**
   * gửi dữ liệu lên server
   * @param readableMap 
   */
  public static sendRNMessage(readableMap:{type:number, data:string, isFail:boolean, connectionID: number}){
    return NativeModules.NativeTcpModule.sendRNMessage(readableMap);
  }

  public static getModule(){
      return NativeModules.NativeTcpModule;
  }
}
