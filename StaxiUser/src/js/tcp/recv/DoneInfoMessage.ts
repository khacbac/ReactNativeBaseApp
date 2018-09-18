import * as Type from "../../../module/js-serialize/DefinedType";
import DoneInfo from "./DoneInfo";
/**
 * Nhận phản hồi bản tin hoàn thành cuốc xe
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class DoneInfoMessage {

	/* ID cuốc */
    public bookID: Type.DfString = Type.DfString.index(0);

	/* Thông tin phí cuốc đi */
    public doneInfo: DoneInfo = DoneInfo.index(1);

}