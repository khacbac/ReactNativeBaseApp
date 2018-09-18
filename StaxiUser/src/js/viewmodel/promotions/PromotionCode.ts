import { DfString, DfInteger, DfLong, DfBoolean } from "../../../module";

/*code for app */
class PromotionCode {

    // Tên khuyến mại
    public name: DfString = DfString.index(1);
    // Mã khuyến mại
    public code: DfString = DfString.index(2);
    // Tiền được khuyến mại
    public money: DfInteger = DfInteger.index(3);
    // Thời gian kết thúc
    public timeEnd: DfLong = DfLong.index(4);
    // Tình trạng sử dụng
    public isUsed: DfBoolean = DfBoolean.index(5);
    // Số lần sử dụng
    public count: DfInteger = DfInteger.index(5);
}

export default PromotionCode;