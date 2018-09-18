import * as Type from "../../../module/js-serialize/DefinedType";
/**
 * Nhận phản hồi bản tin xe nhận đón
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class InviteMessage {

	/* Thông tin biển số xe nhận đón */
    public vehiclePlate: Type.DfString = Type.DfString.index(0);

}