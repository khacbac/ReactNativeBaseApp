import NativeEventProcess from "../base/NativeEventProcess";
import { NativeTcpModule } from "..";
import OnTcpEventListener from "./OnTcpEventListener";
import BAMessage from "./BAMessage";
import { ConnectionManager } from "./ConnectionManager";
import Utils from "../Utils";
import LogFile from "../LogFile";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-08-17 01:45:07
 * @modify date 2018-08-17 01:45:07
 * @desc [Lớp xử lý lắng nghe sự kiện tcp]
*/
export default class TcpEventProcess extends NativeEventProcess{

    private listener:OnTcpEventListener;

    /**
     * thực hiện lắng nghe
     */
    public startTcpEvent(listener:OnTcpEventListener, context?: any){

        this.listener = listener;

        this.setListener(event => {
            
            if(this.listener == null || this.isRemoved) return;

            //nếu kết nối không thành công thì hủy sự kiện
            let data = event.TCP_DATA;
            //kiểm tra các event trả về
            if (event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_SENT_MSG) {
              this.listener.onSentMessage(data);
            } else if (event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_RECV_MSG) {
              //thực hiện xử lý dữ liệu nhận
              let baMessage: BAMessage[] = ConnectionManager.parseReceivedData(
                data
              );
              if (!Utils.isNull(baMessage)) {
                //xử lý trên tưng message
                baMessage.forEach(item => {
                  //xủ lý message nhận
                  this.listener.onRecvMessage(item);
                });
              } else {
                LogFile.e("TcpEventProcess Lỗi phân tích dữ liệu tcp", baMessage);
              }
            } else if (
              event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_KEEP_ALIVE
            ) {
                this.listener.onKeepAlive();
            } else if (
              event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_CONNECTION_STATE
            ) {
                this.listener.onConnectionState(data);
            } else if (
              event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_FINISH_RECV
            ) {
                this.listener.onFinish(data);
            } else if (
              event.TCP_EVENT_KEY_TYPE == NativeTcpModule.TYPE_RECONNECT_SERVER
            ) {
                this.listener.onReconnectServer(data);
            }
          },
          context
        );
    }

    public getModule(){
        return NativeTcpModule.getModule();
    }
  
    /** phân loại sự kiện */
    public getEventType(): string{
      return NativeTcpModule.TCP_EVENT_KEY;
    }

    removeEmitterSubscription(){
      super.removeEmitterSubscription();
    }
}
