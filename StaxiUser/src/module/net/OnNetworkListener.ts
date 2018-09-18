import { ConnectionInfo } from "react-native";

export default interface OnNetworkListener{

    /**trạng thái kết nối mạng */
    onNetConnected(type?:ConnectionInfo);

    /**
     * ngắt kết nối
     * @param option 
     */
   onNetDisconnected(type?:ConnectionInfo);

}