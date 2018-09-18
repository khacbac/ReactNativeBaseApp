import * as Type from "../../../module/js-serialize/DefinedType";
/**
 * Nhận phản hồi bản tin conection
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class KeepAliveMessage {

	/* Trạng thái server */
    public serverStep:Type.DfByte = Type.DfByte.index(0);

}