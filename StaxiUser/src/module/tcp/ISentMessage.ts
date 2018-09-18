import { BAMessageType } from "./BAMessageType";

export default interface ISentMessage{

    /*** Loại message gửi */
    getSentMessageType():BAMessageType;
  
    /*** thời gian gửi */
    getSentTime():number;
  
    /** lấy trạng thái xử lý khi bản tin  */
    isReconnect():boolean;
  }