/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:50:47
 * @modify date 2018-07-10 02:50:47
 * @desc [bản tin giữ kết nối]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import {DfLatLng, LatLng} from "../../../module/js-serialize/DefinedType";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import { MessageType } from "../MessageType";

export default class PingMessage extends AbstractSentMessage {

  /*** vị trí người dùng */
  public latlng: DfLatLng = DfLatLng.index(0);

  public updateLocation(lat: number, lng: number){
		this.latlng.setLatLng(lat, lng);
  }
  
  public update(latlng:LatLng){
		this.latlng.set(latlng);
	}

  public getSentMessageType(): BAMessageType {
    return MessageType.PING;
  }
}
