import PromotionCode from "./PromotionCode";
import PromotionResponse from "./PromotionResponse";
import { requestByObject, MethodName } from "../../http/HttpHelper";
import PromotionRequest from "./PromotionRequest";
import SessionStore from "../../Session";

async function getPromotions(): Promise<[PromotionCode]>  {
    let request = new PromotionRequest();
    request.phoneNumber.setValue(SessionStore.getUser().phone);
    request.password.setValue(SessionStore.getUser().password)
    try{
        let response: PromotionResponse = await requestByObject(
            MethodName.GetSaleOffCode,
            request,
            new PromotionResponse()
        );
        return Promise.resolve(response.promotions.toArray() as [PromotionCode]);
    }catch (error) {
        return Promise.reject(error);
    }
}

export {getPromotions};

// export enum StateData {
// 	EmptyData = 0,
// 	FillData = 1
// }
