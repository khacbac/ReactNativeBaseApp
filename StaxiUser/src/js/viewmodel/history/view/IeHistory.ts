import History from "../../../sql/bo/History";


interface IeHistory {

    setList(list: Array<History>): void;

    setSections(sections: Array<any>): void;

    setRefresh(refreshing: boolean): void;

    setEmptyHistory(emptyHistory: boolean): void;

    setMutipleState(state: any): void;

    notifyDeleteSuccess(): void;

    notifyDeleteFail(): void;

}

export default IeHistory;