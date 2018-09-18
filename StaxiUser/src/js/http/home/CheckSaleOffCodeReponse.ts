import { DfByte, DfString, DfInteger } from "../../../module";

/**
	 * Lớp nội nhận thông tin khuyến mại
	 * 
	 * @author BacHK.
	 */
class CheckSaleOffCodeReponse {
    public status: DfByte = DfByte.index(0);

    public saleDetail: DfString = DfString.index(1);

    public moneySale: DfInteger = DfInteger.index(2);
}

export default CheckSaleOffCodeReponse;