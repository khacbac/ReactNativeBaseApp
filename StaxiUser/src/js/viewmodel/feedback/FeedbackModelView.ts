import FeedbackRequest from './FeedbackRequest'
import { FeedbackResponse } from './FeedbackResponse';
import { requestByObject, MethodName } from '../../http/HttpHelper';
import SessionStore from '../../Session';

async function sendFeedback(title: string, content: string): Promise<{status:boolean}> {
    let request = new FeedbackRequest();
    console.log("info session " + SessionStore.getUser().phone + "," + SessionStore.getUser().password);
    request.phoneNumber.setValue(SessionStore.getUser().phone);
    request.password.setValue(SessionStore.getUser().password);
    request.title.setValue(title);
    request.content.setValue(content);
    try{
        console.log("request feedback");
        let response: FeedbackResponse = await requestByObject(
            MethodName.AppFeedback,
            request,
            new FeedbackResponse()
        );
        console.log("response feedback " + response.status);
        return Promise.resolve({status:response.status.value});
    }catch (error) {
        console.log(error.message || error);
        return Promise.reject(error);
    }
}

export {sendFeedback}