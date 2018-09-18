import { IeModel, IeFinish } from "./IeModel";
import HistoryRequest from "../HistoryRequest";
import { HistoryResponse, HistoryParser } from "../HistoryResponse";
import HistoryJsonDAO from "../../../sql/dao/HistoryOnlineDAO";
import History from "../../../sql/bo/History";
import SessionStore from "../../../Session";
import { DfString } from "../../../../module";
import MethodName from "../../../http/MethodName";
import { requestByObject } from "../../../http/HttpHelper";

class Model implements IeModel {

    /**
     * @Override
     */
    public callToSynDataFromHTTP(availableList: Array<History>, ieFinish: IeFinish): void {
        console.log("call to sync data from http");
        HistoryJsonDAO.getDisableHistoriesByJson()
        .then((listDeleted) => {
            var deletedID = [];
            listDeleted.forEach(element => {
                deletedID.push(element.bookCode);
            });
            this.makeRemoteRequest(availableList, deletedID)
            .then((response) => {
                console.log("sync data success", response);
                ieFinish.successSynDataFromHTTP(response);
            })
            .catch((err) => {
                ieFinish.errorSynDataFromHTTP();
                console.log("err_history " + (err.message || err))
            });
        })
        .catch(()=>{

        })
        
    }

    /**
     * @Override
     */
    // public deleteItemHistory(IDItemDeleted: string[], availableList: Array<History>, ieFinish: IeFinish): void {
    //     this.makeRemoteRequest(availableList, IDItemDeleted)
    //         .then((response) => {
    //             ieFinish.successDeleteItemHistory(response, availableList);
    //         })
    //         .catch(error => {
    //             ieFinish.errorDeleteItemHistory();
    //         })
    // }

    private makeRemoteRequest = (list: Array<History>, idItemDeleted:string[]): Promise<Array<HistoryParser>> => {
        let user = SessionStore.getUser()
        let phone = user.phone
        let pw = user.password

        let recentTime = 0
        if (list.length > 0) {
            recentTime = list[0].bookTime
        } else {

        }
        console.log("make remote request ")
        return this.doSyncData(phone, pw, recentTime, [], idItemDeleted);
    };

    /* Thực hiện đồng bộ dữ liệu */
    public async doSyncData(phoneNumber: string, password: string, recentBookTime: number, updateIDs: string[], deleteIDs: string[]): Promise<Array<HistoryParser>> {
        let request = new HistoryRequest();
        request.phoneNumber.setValue(phoneNumber);
        request.password.setValue(password)
        request.recentBookTime.setValue(recentBookTime)
        updateIDs.forEach(element => {
            request.updateIDs.putValue(new DfString(element));
        });
        deleteIDs.forEach(element => {
            request.deleteIDs.putValue(new DfString(element));
        });

        console.log("History request")
        console.log(request);
        // Thực hiện request
        try {
            let response: HistoryResponse = await requestByObject(
                MethodName.OnlineHistory,
                request,
                new HistoryResponse()
            );
            console.log("History Response", response);
            return Promise.resolve(response.listHistory.toArray());

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export default Model;