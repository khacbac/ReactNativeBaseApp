import { DfInteger, DfString } from "../../../module";

class HelperRes {
    // Loại trợ giúp
    public HelperType: DfInteger = DfInteger.index(1);
    // Tiêu đề tiếng Anh
    public TitleEN: DfString = DfString.index(2);
    // Tiêu đề tiếng Việt
    public TitleVI: DfString = DfString.index(3);
    // Link trợ giúp tiếng Anh
    public LinkEN: DfString = DfString.index(4);
    // Link trợ giúp tiếng Việt
    public LinkVI: DfString = DfString.index(5);
}

export default HelperRes;