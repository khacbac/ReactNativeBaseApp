/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-16 03:59:38
 * @modify date 2018-07-16 03:59:38
 * @desc [Lớp trả về khi gửi ping lên server để duy trì kết nối]
*/

import { DfByte } from "../../../module";

export default class AckPingMessage {
	/** Trạng thái cuốc hiện tại ở server */
	public serverStep:DfByte = DfByte.index(0);
	
}