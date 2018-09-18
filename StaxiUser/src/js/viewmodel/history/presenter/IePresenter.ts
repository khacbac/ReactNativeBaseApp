import History from "../../../sql/bo/History";


export default interface IePresenter {

    initiateSectionWhenEmpty(): void;

    getLocalList(): Promise<History[]>;

    callToSynDataFromHTTP(list: Array<any>): void;

    deleteItemHistory(itemId, availableList): void;
    notifyDeleteSuccess(): void;
    notifyDeleteFail(): void;
}