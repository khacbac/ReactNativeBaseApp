import * as Type from "../../../module/js-serialize/DefinedType";
/**
 * Nhận phản hồi bản tin Driver nhỡ khách
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class AckDriverMissedMessage {

	/* Trạng thái thành công hay không */
    public status: Type.DfBoolean = Type.DfBoolean.index(0);

}