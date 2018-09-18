import { NetInfo, ConnectionInfo, ConnectionType } from "react-native";
import OnNetworkListener from "./OnNetworkListener";
import LogFile from "../LogFile";

export default class NetworkManager {
  /** key nhận sự kiện */
  private static EVENT_NAME = "connectionChange";

  /** đối tượng callback trả về khi có kết nối*/
  private onNetworkListener: OnNetworkListener;

  constructor(onNetworkListener?: OnNetworkListener) {
    this.setOnNetworkListener(onNetworkListener);
  }

  /**
   * bắt đầu start
   */
  start() {
    NetInfo.addEventListener(
      NetworkManager.EVENT_NAME,
      this.handleConnectivityChange.bind(this)
    );
  }

  /**
   * thiết lập đối tượng lắng nghe
   * @param onNetworkListener
   */
  public setOnNetworkListener(onNetworkListener?: OnNetworkListener) {
    this.onNetworkListener = onNetworkListener;
  }

  /**
   * xóa đối tượng lắng nghe
   */
  public removeEventListener() {
    if (this.onNetworkListener != null) {
      console.log("NetworkManager removeEventListener start >>>>>>>>>>>");

      NetInfo.removeEventListener(
        NetworkManager.EVENT_NAME,
        this.handleConnectivityChange.bind(this)
      );
    }
  }

  /**
   * xử lý lắng nghe trạng thái mạng
   * @param result
   */
  private handleConnectivityChange(result: ConnectionInfo | ConnectionType) {
    if (this.onNetworkListener == null) {
      LogFile.log(
        "handleConnectivityChange this.onNetworkListener nnull ",
        result
      );
      return;
    }

    let ret: ConnectionInfo;

    //kiểm tra loại kết quả
    if (result != undefined) {
      //nếu là loại ConnectionInfo
      if (result.hasOwnProperty("type")) {
        ret = <ConnectionInfo>result;
      } else {
        ret = {type:<ConnectionType>result, effectiveType: "unknown"};
      }
    }else{
      ret = {type:"none", effectiveType: "unknown"};
    }

    // console.log("handleConnectivityChange ret", ret);
    if (ret.type == "wifi" || ret.type == "cell") {
      this.onNetworkListener.onNetConnected(ret);
    } else {
      this.onNetworkListener.onNetDisconnected(ret);
    }
  }

  /**
   * lấy thông tin kết nối mạng
   */
  public static getConnectionInfo(): Promise<ConnectionInfo> {
    return NetInfo.getConnectionInfo();
  }

  /**
   * trả về trạng thái kết nối của mạng
   */
  public static isConnected(): Promise<boolean> {
    return NetInfo.isConnected.fetch();
  }
}
