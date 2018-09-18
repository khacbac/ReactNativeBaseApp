import * as Type from "../../../module/js-serialize/DefinedType";
import { ISerialize } from '../../../module';
/**
 * Nhận phản hồi bản tin hoàn thành cuốc xe
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class DoneInfo implements ISerialize {

    /* Tiền cước chuyến đi */
    public money: Type.DfFloat = Type.DfFloat.index(0);

    /* Số km di chuyển */
    public totalKm: Type.DfFloat = Type.DfFloat.index(1);

    /* Thời gian chờ */
    public waitTime: Type.DfFloat = Type.DfFloat.index(2);

    /* Tiền cước chờ */
    public waitMoney: Type.DfFloat = Type.DfFloat.index(3);

    /* Tiền phụ phí */
    public moneyExtend: Type.DfFloat = Type.DfFloat.index(4);

    /* Tiền khuyến mại */
    public moneySale: Type.DfFloat = Type.DfFloat.index(5);

    public propertyIndex: number;

    constructor(index?: number) {
        this.propertyIndex = index;
    }

    public static index(index: number): DoneInfo {
        return new DoneInfo(index);
    }
}