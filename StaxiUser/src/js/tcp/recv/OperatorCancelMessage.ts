import { DfByte, DfBoolean, DfString } from "../../../module";
import SubStep from "../../constant/SubStep";

/**
 * Nhận phản hồi bản tin điều hành từ chối cuốc(không có xe nhận đón)
 * @author ĐvHiện
 * Created on 16/07/2018
 */
export default class OperatorCancelMessage {

    /* Điều hành hủy cuốc */
	public static OPERATOR_CANCEL = 1;

	/* Lái xe báo nhỡ cuốc */
	public static DRIVER_MISSTRIP = 2;

	/* Lái xe hủy cuốc */
	public static DRIVER_CANCEL = 4;

	/* Không cho phép người dùng đặt lại trong khoảng thời gian cấu hình */
	public static OPERATOR_DISPATCHING = 7;

	/** Loại hủy */
	public cancelType:DfByte = DfByte.index(0);

	/** Cho phép người dùng đặt lại hay không */
	public retryable:DfBoolean = DfBoolean.index(1);

	/** Nội dung thông báo hủy cuốc */
    public message:DfString = DfString.index(2);
    
    constructor(cancelType:SubStep, retry?:boolean, msg?:string){
        this.cancelType.setValue(cancelType);
        this.retryable.setValue(retry||false);
        this.message.setValue(msg||"");
    }
}