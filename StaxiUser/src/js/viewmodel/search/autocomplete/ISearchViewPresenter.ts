export interface ISearchViewPresenter {
    showDialogWaiting();
    closeDialog();

    setMutipleState(state: any);
    
    getLocalHistoryArray();
    getFavoriteArray();
    getNearAddressArray();
    getSearchAddressArray();
}