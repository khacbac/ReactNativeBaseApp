import HelpResponse from "./HelpResponse";
import MethodName from "../../http/MethodName";
import { requestByObject } from "../../http/HttpHelper";
import HelperRes from "./HelperRes";

async function getHelper(): Promise<HelperRes[]>  {

    try{
        let response: HelpResponse = await requestByObject(
            MethodName.GetCustomerHelper,
            '',
            new HelpResponse()
        );
        return Promise.resolve(response.helpers.toArray());
    }catch (error) {
        return Promise.reject(error);
    }
}

export {getHelper}