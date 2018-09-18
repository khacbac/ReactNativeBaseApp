import { ISearchViewPresenter } from "../../../../../viewmodel/search/autocomplete/ISearchViewPresenter";
import BAAddress from "../../../../../model/BAAddress";

export interface ISearchPresenterNewUI extends ISearchViewPresenter{
    handleDataSearch(baAddress: BAAddress);
    getNavigation();
    
    initFocusHistory();
    getCurrentFocusAddress();
}