import IePresenter from "./IePresenter";
import Model from '../model/Model';
import { IeFinish, IeModel } from "../model/IeModel";
import IeHistory from "../view/IeHistory";
import { HistoryParser } from "../HistoryResponse";
import History from "../../../sql/bo/History";
import strings from "../../../../res/strings";
import HistoryOnlineDAO from "../../../sql/dao/HistoryOnlineDAO";
// import HistoryJsonDAO from "../../../../sql/dao/HistoryOnlineDAO";

class Presenter implements IePresenter, IeFinish {

    public ieModel: IeModel;
    public ieHistory: IeHistory;

    public localList:History[];
    public serverList:History[];

    constructor(ieHistory: IeHistory) {
        this.ieModel = new Model();
        this.ieHistory = ieHistory;
        this.localList = [];
    }

    /**
     * @Override
     */
    public initiateSectionWhenEmpty(): void {
        let sections = [{
            title: strings.history_not_booking,
            data: []
        }]
        this.ieHistory.setSections(sections);
        // this.deleteDataBase();
    }

    /**
     * @Override
     */
    public async getLocalList = () : Promise<History[]> => {
        return  HistoryOnlineDAO.getAvailableHistoriesByJson();
    }

    /**
     * @Override
     */
    public callToSynDataFromHTTP(availableList): void {
        console.log("call to sync from http");
        this.ieHistory.setRefresh(true);
        this.ieModel.callToSynDataFromHTTP(availableList, this);
    }

    /**
     * @Override
     */
    public deleteItemHistory(itemID): void {
        // cập nhật vào db
        HistoryOnlineDAO.updateDeleteItem(itemID)
        .then(()=>{

            // cập nhật mảng history
            // console.log("delete history start ", this.localList);
            for (var i = 0; i < this.localList.length; i++) {
                let element = this.localList[i];
                if (element.bookCode === itemID) {
                    this.localList.splice(i, 1);
                    // console.log("delete history item ....", itemID)
                    break;
                }
            }
            // console.log("delete history end ", this.localList);

            this.successDeleteItemHistory();
            // console.log("delete history ", this.localList);

            // cập nhật view
            if(this.localList.length == 0)
                this.ieHistory.setMutipleState({emptyHistory:true})
            else {
                let sections = this.groupHistoryList(this.localList);
                this.ieHistory.setMutipleState({
                    list: this.localList,
                    sections: sections,
                    refreshing:false
                })
            }
            
            // request lên server

            //lấy ra các lịch sử cuốc đã xoá (deleted = 1)
            // HistoryJsonDAO.getDisableHistoriesByJson()
            // .then((list)=>{
            //     var listIDDeleted : string[] = [];
            //     list.forEach(element => {
            //         listIDDeleted.push(element.bookCode);
            //     });
            //     // console.log("deleteIDs ", listIDDeleted);
            //     this.ieModel.deleteItemHistory(listIDDeleted, this.localList, this);
            // })
            // .catch(()=>{

            // })

        })
        .catch(()=>{
            this.ieHistory.notifyDeleteFail();
        })
        
    }

    public groupHistoryList = (list): Array<any> => {

        let groupByDate = {}

        for (let idex = 0; idex < list.length; idex++) {
            const element = list[idex];
            const dateFormat = element.dateFormat;

            if (!groupByDate[dateFormat]) {
                groupByDate[dateFormat] = []
            }

            groupByDate[dateFormat].push(element)
        }

        let groupByTitle = []
        for (const date in groupByDate) {
            if (groupByDate.hasOwnProperty(date)) {
                const elements = groupByDate[date];
                groupByTitle.push({ title: date, data: elements })
            }
        }

        return groupByTitle
    }

    // ========================================== Success Callback ====================================== //

    /**
     * @Override
     */
    public successSynDataFromHTTP(historyParses: Array<HistoryParser>): void {
        this.ieHistory.setRefresh(false);
        //xoá những cuốc deleted = true ở DB
        HistoryOnlineDAO.deleteWhereDeleteTrue();
        //this.localList = historyParses.map(item=>HistoryParser.getHistory(item))
        // let instances = historyParses.map(item => HistoryParser.getHistory(item))
        // console.log("list response ", instances);
        // this.ieHistory.setMutipleState({
        //     list: instances,
        //     sections: this.groupHistoryList(instances),
        // })
        //cập nhật vào DB
        this.insertResponseToDB(historyParses);
    }

    /**
     * @Override
     */
    public errorSynDataFromHTTP(): void {
        this.ieHistory.setRefresh(false);
    }

    /**
     * @Override
     */
    public successDeleteItemHistory(): void {
        //this.ieHistory.setRefresh(false);
        // this.deleteDataBase();
        //this.insertResponseToDB(historyParses);
        this.notifyDeleteSuccess();
    }

    /**
     * @Override
     */
    public errorDeleteItemHistory(): void {
        this.ieHistory.setRefresh(false);
        this.notifyDeleteFail();
    }

    public notifyDeleteSuccess(): void{
        this.ieHistory.notifyDeleteSuccess();
    }

    
    public notifyDeleteFail(): void{
        this.ieHistory.notifyDeleteFail();
    }

    private insertResponseToDB = (historyParses) => {
        let instances = historyParses.map(item => HistoryParser.getHistory(item))
        // console.log("insert to DB ", instances);

        if (instances.length > 0) {
            HistoryOnlineDAO.insertToJsonTable(instances, this.localList)
                .then(() => {
                    // console.log("update history view");
                    this.updateListHistoryView();
                })
                .catch(err => {
                    // console.log("insert db error")
                });
        }else{
            if(this.localList.length == 0){
                this.ieHistory.setEmptyHistory(true);
            }
        }
    }

    private updateListHistoryView = ()=>{
        HistoryOnlineDAO.getAvailableHistoriesByJson()
        .then((list) => {
            // console.log("update list history ", list);
            this.localList = list
            if(list.length == 0){
                this.ieHistory.setMutipleState({emptyHistory: true});
            }else{
                this.ieHistory.setMutipleState({
                    list: list,
                    sections: this.groupHistoryList(list),
                    emptyHistory: false,
                })
            }
        })
        .catch(err => {
            // console.log("update list history error")
            this.ieHistory.setEmptyHistory(true);
        });
    }

    private deleteDataBase = () => {
        HistoryOnlineDAO.deleteJsonTable()
            .then(() => {
                // console.log("deleteDataBase thành công");
            })
            .catch(err => {
                // console.log("deleteDataBase lỗi", err);

            });
    }
}

export default Presenter;