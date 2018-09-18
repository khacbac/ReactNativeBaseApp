import { DfList } from "../../../module";
import PromotionCode from "./PromotionCode";

class PromotionResponse{    
	public promotions: DfList<PromotionCode> = new DfList(new PromotionCode(), 1);
}
export default PromotionResponse;