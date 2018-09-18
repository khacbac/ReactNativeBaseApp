import HelperRes from "./HelperRes";
import { DfList } from "../../../module/js-serialize/DefinedType";

class HelpResponse{    
	public helpers: DfList<HelperRes> = new DfList(new HelperRes(), 1);
}
export default HelpResponse;