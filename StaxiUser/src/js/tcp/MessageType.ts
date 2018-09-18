import AckLoginMessage from "./recv/AckLoginMessage";
import AckInitBookMessage from "./recv/AckInitBookMessage";
import CarsInfoMessage from "./recv/CarsInfoMessage";
import InviteMessage from "./recv/InviteMessage";
import CatcherUserMessage from "./recv/CatcherUserMessage";
import AckReloginMessage from "./recv/AckReloginMessage";
import AckPingMessage from "./recv/AckPingMessage";
import DoneInfoMessage from "./recv/DoneInfoMessage";
import AckDeviceTokenMessage from "./recv/AckDeviceTokenMessage";
import AckClientCancelMessage from "./recv/AckClientCancelMessage";
import ServerViewCarMessage from "./recv/ServerViewCarMessage";
import OperatorDispatchingMessage from "./recv/OperatorDispatchingMessage";
import ChangeDriverMessage from "./recv/ChangeDriverMessage";
import OperatorCancelMessage from "./recv/OperatorCancelMessage";
import AckDriverMissedMessage from "./recv/AckDriverMissedMessage";
import AckCommandInfoMessage from "./recv/AckCommandInfoMessage";
import { BAMessageType, CipherType, PriorityType } from "../../module/tcp/BAMessageType";


class MessageType {

  public static UNKNOW = BAMessageType.add(-1);

	/* Đăng nhập */
	public static LOGIN = BAMessageType.add(1201, null, CipherType.NOT_SESSION_KEY);

	/* Đặt cuốc */
	public static INIT_BOOK = BAMessageType.add(1202);

	/* Gặp xe */
	public static CATCHED_CAR = BAMessageType.add(1203);

	/* Yêu cầu vị trí bằng UDP */
	public static CLIENT_REQUEST_CAR_INFO = BAMessageType.add(7801, null, CipherType.NONE);

	/* Message duy trì trạng thái */
	public static PING = BAMessageType.add(1205, null, CipherType.SESSION_KEY, PriorityType.MAINTAIN_CONNECTION);

	/* Message gửi TokenID đến server */
  	public static 	DEVICE_TOKEN = BAMessageType.add(1206);

	/* Khách hàng hủy cuốc */
	public static CLIENT_CANCEL = BAMessageType.add(1251);

	/* Đăng nhập lại */
	public static RELOGIN = BAMessageType.add(1252, null, CipherType.NOT_SESSION_KEY);

	/* Xác nhận lái xe nhầm khách */
	public static DRIVER_MISSED = BAMessageType.add(1254);

	public static COMMAND_INFO = BAMessageType.add(1255, null, CipherType.NOT_SESSION_KEY);

	/* Đăng nhập lại */
	public static RELOGIN_V2 = BAMessageType.add(1252, null, CipherType.NOT_SESSION_KEY);

	/* Nhận phản hỏi khi login */
	public static ACK_LOGIN = BAMessageType.add(2101, () =>new AckLoginMessage(), CipherType.NOT_SESSION_KEY);

	/* Nhận phản hồi khi initbook */
	public static ACK_INIT_BOOK = BAMessageType.add(2102, () =>new AckInitBookMessage());

	/* Nhận thông tin lái xe */
	public static CARS_INFO = BAMessageType.add(2105, () =>new CarsInfoMessage());

	/* Nhận mời khách */
	public static INVITE = BAMessageType.add(2106, () =>new InviteMessage());

	/* Gặp xe */
	public static CATCHER_USER = BAMessageType.add(2107, () =>new CatcherUserMessage());

	/* Nhận khi relogin */
	public static ACK_RELOGIN = BAMessageType.add(2108, () =>new AckReloginMessage(), CipherType.NOT_SESSION_KEY);

	/* Nhận message duy trì từ kết nối của server */
	public static ACK_PING = BAMessageType.add(2109, () =>new AckPingMessage(), CipherType.SESSION_KEY, PriorityType.MAINTAIN_CONNECTION);

	/* Nhận bản tin Done từ driver */
	public static DONE_INFO = BAMessageType.add(2110, () =>new DoneInfoMessage());

	/* Nhận bản tin Done từ driver */
	public static ACK_DEVICE_TOKEN = BAMessageType.add(2111, () =>new AckDeviceTokenMessage());

	/* Nhận bản tin ACK client cancel */
	public static ACK_CLIENT_CANCEL = BAMessageType.add(2114, () =>new AckClientCancelMessage());

	/* Nhận bản tin viewcar */
	public static TCP_SERVER_VIEW_CAR = BAMessageType.add(2115, () =>new ServerViewCarMessage());

	/* Nhận bản tin đếm ngược từ server */
	public static OPERATOR_DISPATCHING = BAMessageType.add(2116, () =>new OperatorDispatchingMessage());

	/* Nhận bản tin ResetSource */
	public static CHANGE_DRIVER = BAMessageType.add(2117, () =>new ChangeDriverMessage());

	/* Điều hành hủy */
	public static OPERATOR_CANCEL = BAMessageType.add(2151, () =>new OperatorCancelMessage(OperatorCancelMessage.OPERATOR_CANCEL));

	/* Xác nhận lái xe nhầm khách */
	public static ACK_DRIVER_MISSED = BAMessageType.add(2154, () =>new AckDriverMissedMessage());

	/* Nhận phản hồi CommandInfo */
  public static ACK_COMMAND_INFO = BAMessageType.add(2155, () =>new AckCommandInfoMessage(), CipherType.NOT_SESSION_KEY);
}

//khởi tạo đối tượng message type
// var MessageType: Type = MessageType || new Type();


//public các đối tượng
export {CipherType, MessageType };
