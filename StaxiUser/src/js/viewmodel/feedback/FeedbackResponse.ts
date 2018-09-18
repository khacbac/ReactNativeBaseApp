import { DfBoolean } from "../../../module";

class FeedbackResponse {
    /* trạng thái phản hồi */
    public status: DfBoolean = DfBoolean.index(1);
}

export {
    FeedbackResponse
};