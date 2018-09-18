import LogFile from "./LogFile";

class BitUtils {

	public static getBitToInt(bitState:IEnumBitState, src:number):number{
		return (src >> bitState.getBitPosition()) & (Math.pow(2, bitState.getBitNumber()) - 1);
	}
	
	/**
	 * gán giá trị vào bít cố định
	 * @param bitState: lưu thông số về vị trí bit và số lượng bit, null thì trả về giá trị 0
	 * @param dst: 
	 * @param src: giá trị để gán vào
	 * @return
	 */
	public static copy(bitState:IEnumBitState, dst:number, src:number):number{

        //Nếu không có đối tượng đẻ biết số lượng bit, và ví trí bít thì ko cập nhật
        if(bitState == null) return dst;

        //Nếu giá trị nhỏ hơn 0 thì không cần thiết lập lại bằng 0
		if(src < 0){
			LogFile.e("Giá trị truyền vào không phù hợp src = " + src + "; bitState.getBitPosition() = " + bitState.getBitPosition());
            src = 0;


        //Nếu giá trị vượt quá giá trị tối đa sơ với số lượng bit thì gán lại bằng giá trị max
		} else if(src >= Math.pow(2, bitState.getBitNumber())){
            LogFile.e("Giá trị truyền vào không phù hợp src = " + src + "; bitState.getBitPosition() = " + bitState.getBitPosition());
            src = Math.pow(2, bitState.getBitNumber());
        }
		
		//gán tất cả các bít còn lại bằng 0
		for (let i = bitState.getBitPosition(); i < bitState.getBitPosition() + bitState.getBitNumber(); i++) {
			dst &= ~(1 << i);
		}

        //gán lại giá trị
		dst |= (src << bitState.getBitPosition());
		
		return dst;
	}

    /**
     * kiểm tra có cờ trong trạng thái hay không
     * @param state
     * @param mark
     * @return
     */
	public static isFlag(state:number, mark:number):boolean{
	    return (state & mark) == mark;
    }

    /**
     * xóa cờ trong
     * @param state
     * @param mark
     * @return
     */
    public static removeFlag(state:number, mark:number):number{
        mark = ~mark;
        return (state & mark);
    }

    /**
     * thêm cờ vào trạng thái
     * @param state
     * @param mark
     * @return
     */
    public static addFlag(state:number, mark:number):number{
        return (state | mark);
    }

    
}

/**
     * Lớp interaface xử lý cho bit
     */
    interface IEnumBitState {

        /***
         * Lấy vị trí của bit
         * @return
         */
        getBitPosition():number;


        /**
         * Lấy số lượng bit
         * @return
         */
        getBitNumber():number;
    }

export default BitUtils;
export {IEnumBitState}