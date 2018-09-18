import CallBackType from "./CallbackType";
import BAMessage from "./BAMessage";

export default interface TcpCallBack {
  callback(callbackType: CallBackType, message: BAMessage);
}
