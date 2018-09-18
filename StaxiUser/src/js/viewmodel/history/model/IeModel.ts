
import { HistoryParser } from "../HistoryResponse";
import History from "../../../sql/bo/History";

interface IeFinish {

    successSynDataFromHTTP(historyParses: Array<HistoryParser>): void;

    errorSynDataFromHTTP(): void;

    successDeleteItemHistory(historyParses: Array<HistoryParser>): void

    errorDeleteItemHistory(): void
}

interface IeModel {
    callToSynDataFromHTTP(availableList: Array<History>, ieFinish: IeFinish): void

    // deleteItemHistory(IDItemDeleted:string[], availableList: Array<History>, ieFinish: IeFinish): void
}

export { IeModel, IeFinish };