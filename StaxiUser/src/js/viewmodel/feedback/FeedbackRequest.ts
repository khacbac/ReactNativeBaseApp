import { DfBoolean, DfString } from "../../../module";
class FeedbackRequest {
    /* số điện thoại */
    public phoneNumber: DfString = DfString.index(1);

     /* mật khẩu */
     public password: DfString = DfString.index(2);

    /* tiêu đề */
    public title: DfString = DfString.index(3);

    /* nội dung */
    public content: DfString = DfString.index(4);

}

export default FeedbackRequest;