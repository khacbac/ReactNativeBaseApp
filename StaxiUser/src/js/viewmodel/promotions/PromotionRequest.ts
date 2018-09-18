import { DfString } from "../../../module";

class PromotionRequest {
    /* số điện thoại */
    public phoneNumber: DfString = DfString.index(1);

     /* password */
     public password: DfString = DfString.index(2);

}

export default PromotionRequest;