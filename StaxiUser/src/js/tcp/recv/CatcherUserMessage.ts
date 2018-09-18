import * as Type from "../../../module/js-serialize/DefinedType";

/**
 * Nhận phản hồi bản tin xe nhận đón
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class CatcherUserMessage {

	/* trạng thái xe online */
    public vehiclePlate: Type.DfString = Type.DfString.index(0);

}