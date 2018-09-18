import { ISerialize, DfBoolean, DfString } from "../../../module";

export default class CancelInfo implements ISerialize{


    public propertyIndex:number;

    /** Cho phép người dùng đặt lại hay không */
	public retryable:DfBoolean = DfBoolean.index(0);

	/** Nội dung thông báo hủy cuốc */
	public message:DfString = DfString.index(1);

    constructor(index?:number){
        this.propertyIndex = index;
    }
}