import { ISearchPresenterNewUI } from "./presenter/ISearchViewPresenterNewUI";
import SearchViewViewModel from "../../../../viewmodel/search/autocomplete/SearchViewViewModel";
import SearchParams from "../../../../viewmodel/search/SearchParams";
import { Utils, LatLng, ToastModule } from "../../../../../module";
import BAAddress from "../../../../model/BAAddress";

import STRINGS from "../../../../../res/strings";
import AddressItem from "../../../../viewmodel/search/autocomplete/AddressItem";
import GoogleAutocompleteController from "../../../../http/address/GoogleAutocompleteController";
import AddressHistoryDAO from "../../../../sql/dao/AddressHistoryDAO";

export default class SearchViewViewModelNewUI extends SearchViewViewModel {
    
    private isRequestAddressToGoogle: boolean = false;

    constructor(presenter: ISearchPresenterNewUI, searchParams: SearchParams, GOOGLE_KEY: string) {
        super(presenter, searchParams, GOOGLE_KEY);
    }

    public async componentDidMount() {
        // Focus input address khi mới mở ra
        this.getPresenter().initFocusHistory();

        // Lấy danh sách điểm lưu trong lịch sử
        await this.initAddressHistoryLocal();

        // Lấy danh sách địa chỉ xung quanh
        await this.initNearAddress();
    }

    public getPresenter(): ISearchPresenterNewUI {
        return this.mPresenter as ISearchPresenterNewUI;
    }

    /**
     * @override 
     * Khởi tạo danh sách địa chỉ local, lấy từ DB
     **/
    protected async initAddressHistoryLocal() {
        // lấy danh sách điểm từ DB
        let addressHistories: AddressItem[] = await AddressHistoryDAO.getAllAddressHistorys();
        
        if (Utils.isNull(addressHistories) || addressHistories.length <= 0) {
        return;
        }
        
        // sắp xếp danh sách vừa lấy từ db, ưu tiên yêu thích
        await addressHistories.sort((a: AddressItem, b: AddressItem) => {
        if (a.favorited || b.favorited) return -1;

        return 1;
        });

        let arrFavorite: AddressItem[] = []; // danh sách điểm yêu thích
        let arrHistories: AddressItem[] = []; // danh sách điểm lịch sử
        let address: AddressItem;
        for(let i = 0; i < addressHistories.length; i++) {
        address = addressHistories[i];
        
        // nếu là điểm yêu thích
        if (address.favorited) {
            address.type = AddressItem.NEAR_BY;
            arrFavorite.push(address);
        } else {
            arrHistories.push(address);
        }
        }

        // lưu data lấy được
        this.mPresenter.setMutipleState({
        historyAddress: arrHistories,
        favoriteAddress: arrFavorite,
        });
    }

    /** Tìm địa chỉ xung quanh vị trí của user */
    protected async initNearAddress() {
        // lấy địa chỉ xung quanh nếu tìm điểm đi
        this.requestGPSLocation(location => {
            this.gpsLatLng = location;

            if (Utils.isOriginLocation(this.gpsLatLng)) {
                return;
            }

            // gọi request server lấy địa chỉ xung quanh
            GoogleAutocompleteController.requestNearAddress(1, this.gpsLatLng, this.GOOGLE_KEY)
            .then((ret: {requestID: number; response: any}) => {
                if (this.isComponentUnmounted()) return;

                let arrDataTemp = [];

                // lấy kết quả địa chỉ xung quanh, lấy tối đa 15 địa chỉ
                if (!Utils.isNull(ret.response) && ret.response.length > 0) {
                for (let i = 0; i < ret.response.length; i++) {
                    if (i >= SearchViewViewModel.TOTAL_FIND_NUM_COUNT) {
                    break;
                    }

                    let ai: AddressItem = ret.response[i];
                    ai.id = i + "";
                    arrDataTemp.push(ai);
                }
                }
                
                // lưu vào state
                this.mPresenter.setMutipleState({
                nearAddress: arrDataTemp,
                });
            })
            .catch((ret: {requestID: number; error: any}) => {
            });
        });
    }

    /**
     * Trở lại màn hình trước và gửi dữ liệu kèm theo
     * @param {*} baAddress
     */
    public backWithAddress(baAddress: BAAddress, dstAddress: BAAddress) {
        // gán text vị trí ghim nếu điểm đi không có địa chỉ
        if (this.isValidSrcAddress() 
        && (baAddress.formattedAddress === STRINGS.no_address || 
            (Utils.isEmpty(baAddress.formattedAddress) && Utils.isEmpty(baAddress.name)))) {
        baAddress.formattedAddress = STRINGS.book_search_latlng_point
        baAddress.name = STRINGS.book_search_latlng_point
        }
        
        // gán text vị trí ghim nếu điểm đến không có địa chỉ
        if (this.isValidDstAddress() 
        && (dstAddress.formattedAddress === STRINGS.no_address || 
            (Utils.isEmpty(dstAddress.formattedAddress) && Utils.isEmpty(dstAddress.name)))) {
        dstAddress.formattedAddress = STRINGS.book_search_latlng_point
        dstAddress.name = STRINGS.book_search_latlng_point
        }

        // callback cho màn hình home
        this.getPresenter().getNavigation().state.params.onNavigateResult(
        baAddress, dstAddress
        );

        this.backWithoutAddress();
    }

    /**
     * Trở lại màn hình trước
     */
    public backWithoutAddress() {
        this.getPresenter().getNavigation().goBack();
    }

    /** Xử lý khi click icon thêm điểm yêu thích */
    public handleClickFavoriteButton(rowData: AddressItem) {
        if (this.isComponentUnmounted()) return;

        // nếu địa chỉ này đang yêu thích => xóa điểm yêu thích
        if (rowData.favorited == true && !Utils.isNull(rowData.id) && !Utils.isEmpty(rowData.id + "")) {
            this.deleteFavoritePoint(rowData);
        } else {
            this.addFavoritePoint(rowData);
        }
    }

    /** Thêm điểm yêu thích */
    public addFavoritePoint(rowData: AddressItem) {
        // nếu điểm yêu thích là dữ liệu có từ trước thì k cần request google lấy tọa độ => thêm điểm yêu thích luôn
        if (rowData.type !== AddressItem.GOOGLE) {
            this._insertFavoritePoint(rowData);
            return;
        }

        // nếu điểm yêu thích là kết quả tìm kiếm google thì phải request lấy latlng
        this.mPresenter.showDialogWaiting();
        GoogleAutocompleteController.getDetailAddressInfoV2(this.GOOGLE_KEY, rowData.placeID)
        .then(baAddress => {
        this.mPresenter.closeDialog();

        let addressItem: AddressItem = new AddressItem();
        addressItem.id = rowData.id;
        addressItem.name = baAddress.name;
        if (baAddress.location) {
            addressItem.location = new LatLng(baAddress.location.latitude, baAddress.location.longitude);
        }
        addressItem.formattedAddress = baAddress.formattedAddress;
        addressItem.createTime = new Date().getTime();
        addressItem.placeID = rowData.placeID;
        addressItem.type = AddressItem.NEAR_BY;
        addressItem.favorited = true;
        addressItem.predefinedValue = 0;
        addressItem.count = 0;
        
        // cập nhật lại danh sách dữ liệu tìm kiếm -> active điểm yêu thích đã chọn
        let arrSearch: AddressItem[] = this.mPresenter.getSearchAddressArray();
        if (Utils.isNull(arrSearch)) arrSearch = [];
        let isUpdate: boolean = false;
        for (let i = 0; i < arrSearch.length; i++) {
            if(arrSearch[i].placeID === rowData.placeID) {
            arrSearch[i].favorited = true;
            isUpdate = true;
            break;
            }
        }

        if (isUpdate) {
            this.mPresenter.setMutipleState({
            searchDataSource: arrSearch,
            });
        }
        
        // lưu điểm này vào db
        this._insertFavoritePoint(addressItem);
        })
        .catch(err => {
        // đóng dialog wait và thông báo khi thêm điểm yêu thích thất bại
        this.mPresenter.closeDialog();
        ToastModule.show(STRINGS.add_favorite_point_failt);
        });
    }

    /** Xử lý thêm điểm yêu thích vào db */
    private _insertFavoritePoint(data: AddressItem) {
        let rowData: AddressItem = AddressItem.clone(data);
        
        // chuyển trạng thái sang yêu thích
        rowData.favorited = true;

        // thêm điểm yêu thích, lưu vào db
        AddressHistoryDAO.insertFavoriteAddress(rowData)
        .then((data) => {
        let isUpdate: boolean = false;
        let isHas: boolean = false;

        // thêm điểm yêu thích vào danh sách điểm yêu thích nếu chưa có
        let arrFavorites: AddressItem[] = this.mPresenter.getFavoriteArray();
        if (Utils.isNull(arrFavorites)) arrFavorites = [];

        for (let i = 0; i < arrFavorites.length; i++) {
            if(arrFavorites[i].id === rowData.id || arrFavorites[i].formattedAddress === rowData.formattedAddress) {
            arrFavorites[i].favorited = true;
            isUpdate = true;
            isHas = true;
            break;
            }
        }

        // thêm vào nếu điểm này không tồn tại trong ds điểm yêu thích
        if (!isHas) {
            arrFavorites.unshift(rowData);
            isUpdate = true;
        }

        if (isUpdate) {
            this.mPresenter.setMutipleState({
            favoriteAddress: arrFavorites,
            });
        }
        })
        .catch(err => {});
    }

    /** Xóa điểm yêu thích */
    public deleteFavoritePoint(rowData: AddressItem) {
        // xóa điểm yêu thích trong db
        AddressHistoryDAO.deleteFavoriteAddress(parseInt(rowData.id))
        .then(() => {
            // nếu xóa trong db thành công thì thực hiện xóa trong danh sách địa chỉ yêu thích
            let isUpdate: boolean = false;

            // Xóa điểm yêu thích trong danh sách điểm yêu thích
            let arrFavorites: AddressItem[] = this.mPresenter.getFavoriteArray();
            if (Utils.isNull(arrFavorites))  arrFavorites = [];
            for(let i = 0; i < arrFavorites.length; i++) {
                if (arrFavorites[i].id == rowData.id) {
                arrFavorites.splice(i, 1);
                isUpdate = true;
                break;
                }
            }

            // nếu có điểm bị xóa => cập nhật lại state
            if (isUpdate) {
                this.mPresenter.setMutipleState({
                    favoriteAddress: arrFavorites
                });
            }
        })
        .catch(err => {});
    }
    
    /** Xử lý khi click vào item address view */
    public handleClickGoogleAddress(rowData: AddressItem) {
        if (this.isRequestAddressToGoogle) return;

        this.isRequestAddressToGoogle = true;
        
        // nếu item là địa chỉ đã có trước đó: near address, history
        if (rowData.type !== AddressItem.GOOGLE) {
            let baAddress = new BAAddress();
            baAddress.name = rowData.name;
            baAddress.formattedAddress = rowData.formattedAddress;
            baAddress.location = rowData.location;

            this.isRequestAddressToGoogle = false;
            this.getPresenter().handleDataSearch(baAddress);
            return;
        }

        // request location detail tới google
        this.mPresenter.showDialogWaiting();
        GoogleAutocompleteController.getDetailAddressInfoV2(this.GOOGLE_KEY, rowData.placeID)
        .then(async baAddress => {
            this.isRequestAddressToGoogle = false;
            this.mPresenter.closeDialog();

            // trường hợp tìm kiếm bình thường, trả địa chỉ tìm được về màn hình trước
            this.getPresenter().handleDataSearch(baAddress);
        })
        .catch(err => {
            this.mPresenter.closeDialog();
            this.isRequestAddressToGoogle = false;
            
            // nếu không request được địa chỉ
            ToastModule.show(STRINGS.no_address);
        });
    }
}