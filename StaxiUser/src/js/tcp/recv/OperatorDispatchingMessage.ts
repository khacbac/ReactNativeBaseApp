import * as Type from "../../../module/js-serialize/DefinedType";
/**
 * Nhận phản hồi bản tin chờ hãng gán xe
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class OperatorDispatchingMessage {

	/* Thời gian timeout giảm dần theo bước nhảy */
    public duration: Type.DfInteger = Type.DfInteger.index(0);

	/* Tổng thời gian timeout */
    public totalTime: Type.DfInteger = Type.DfInteger.index(1);

    /* Nội dung thông báo */
    public content: Type.DfString = Type.DfString.index(2);

}