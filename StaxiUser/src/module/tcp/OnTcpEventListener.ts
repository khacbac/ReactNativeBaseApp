import BAMessage from "./BAMessage";
import NetworkInfoState from "../model/NetworkInfoState";

export default interface OnTcpEventListener{

    /** bắt đầu xử lý gửi nhận */
    onStart(option?:Object);

    /** dữ liệu gửi lên server thành công hay không */
    onSentMessage(option?:Object);

    /** dữ liệu nhận về từ server */
    onRecvMessage(message: BAMessage);

    /** Xử lý duy trì kết nối
     * @returns: true: nếu sử dụng để gửi Ping, false: thì bỏ qua
    */
    onKeepAlive(option?:Object):boolean;

    /** xử lý kết nối */
    onConnectionState(state: NetworkInfoState, option?:Object);

    /** kết thúc tcp */
    onFinish(option?:Object);

    /** xử lý kết nối lại*/
    onReconnectServer(state: NetworkInfoState);
}