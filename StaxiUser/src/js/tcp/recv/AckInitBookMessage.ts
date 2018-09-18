import { DfBoolean, DfString, DfInteger } from "../../../module";

/**
 * Nhận phản hồi bản tin đặt xe
 * Created on 16/07/2018
 */
export default class AckInitBookMessage {

    /* Trạng thái thành công hay không */
	public initBookStatus:DfBoolean = DfBoolean.index(0);

	/* Mã quốc khách */
	public bookCode:DfString = DfString.index(1);

	/* Nội dung thông báo lỗi */
	public msg:DfString = DfString.index(2);

	/* Số phút timeout hãng vừa đặt */
	public timeOutSeconds:DfInteger = DfInteger.index(3);
}