import SearchParams, { AddressRequestType } from "../SearchParams";
import FocusAddress from "../FocusAddress";
import { Utils, LatLng, ToastModule } from "../../../../module";
import BAAddress from "../../../model/BAAddress";
import { ISearchViewPresenter } from "./ISearchViewPresenter";
import AddressHistoryDAO from "../../../sql/dao/AddressHistoryDAO";
import AddressItem from "./AddressItem";
import GoogleAutocompleteController from "../../../http/address/GoogleAutocompleteController";
import strings from "../../../../res/strings";

export default class SearchViewViewModel {
    /* Số địa chỉ đi gần đây, tối đa 3 địa chỉ */
    public static RECENT_NUM_COUNT: number = 5;
    /* Tổng số địa chỉ hiển thị, tối đa 10 địa chỉ */
    public static TEN_FIND_NUM_COUNT: number = 10;
    /* Tổng số địa chỉ hiển thị, tối đa 15 địa chỉ */
    public static TOTAL_FIND_NUM_COUNT: number = 15;
    
    protected mPresenter: ISearchViewPresenter;

    protected GOOGLE_KEY: string;
    
    protected searchParams: SearchParams;
    
    /** loại địa chỉ */
    protected initFocusAddress: FocusAddress;

    /** bán kính tìm kiếm */
    protected radius: number;

    /** Thông tin điểm đi */
    protected srcAddress: BAAddress;

    /** Thông tin điểm đến */
    protected dstAddress: BAAddress;

    /** vị trí gps */
    protected gpsLatLng: LatLng;

    /** loại api tìm kiếm */
    protected requestAddressType: AddressRequestType;

    protected isUnmounted: boolean = false;
    
    protected mAutoIncreaseSearchAIndex = 0;

    constructor(presenter: ISearchViewPresenter, searchParams: SearchParams, GOOGLE_KEY: string) {
        this.mPresenter = presenter;

        // Lấy các giá trị trong search param
        this.initSearchParam(searchParams);

        this.GOOGLE_KEY = GOOGLE_KEY;
    }

    private initSearchParam(searchParams: SearchParams) {
        this.searchParams = searchParams;

        this.initFocusAddress = this.searchParams.focusAddress;

        this.radius = this.searchParams.radius;

        this.srcAddress = this.searchParams.srcAddress;

        this.dstAddress = this.searchParams.dstAddress;

        this.requestAddressType = this.searchParams.requestType;

        this.gpsLatLng = this.searchParams.gpsLatLng
    }

    /** Xử lý khi component đã hoàn thành hiển thị */
    public async componentDidMount() {
        // AddressHistoryDAO.deleteAll();

        // Lấy danh sách điểm lưu trong lịch sử
        await this.initAddressHistoryLocal();

        // Lấy danh sách địa chỉ xung quanh
        await this.initNearAddress();
    }

    public componentWillUnmount() {
        this.isUnmounted = true;
    }

    /** lấy danh sách địa chỉ lưu trong db */
    protected async initAddressHistoryLocal() {
        // lấy danh sách điểm từ DB
        let addressHistories: AddressItem[] = await this.getAllAddressInDB();

        this.mPresenter.setMutipleState({
            historyAddress: addressHistories
        });
    }

    protected async getAllAddressInDB(): Promise<AddressItem[]> {
        // lấy danh sách điểm từ DB
        let addressHistories: AddressItem[] = await AddressHistoryDAO.getAllAddressHistorys();

        if (Utils.isNull(addressHistories)) addressHistories = [];
    
        // sort lại mảng, ưu tiên nhà - nơi làm việc - lịch sử
        addressHistories = addressHistories.sort((item1, item2) => {return item2.type - item1.type});

        return Promise.resolve(addressHistories);
    }

    /** Lấy danh sách địa chỉ xung quanh */
    protected initNearAddress() {
        // this.mPresenter.showDialogWaiting();

        // lấy địa chỉ xung quanh nếu tìm điểm đi
        this.requestGPSLocation(location => {
        this.gpsLatLng = location;
  
        if (Utils.isOriginLocation(this.gpsLatLng)) {
            // this.mPresenter.closeDialog();
            return;
        }
  
        // gọi request server lấy địa chỉ xung quanh
        GoogleAutocompleteController.requestNearAddress(1, this.gpsLatLng, this.GOOGLE_KEY)
        .then((ret: {requestID: number; response: any}) => {
          if (this.isComponentUnmounted()) return;
          
        //   this.mPresenter.closeDialog();
  
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
            // this.mPresenter.closeDialog();
        });
      });
    }

    /** Lấy tọa độ GPS của người dùng */
    public requestGPSLocation(callBack: Function) {
        //Nếu ko có vị trí gps
        this.gpsLatLng = this.searchParams.gpsLatLng;

        if (Utils.isNull(this.gpsLatLng) || Utils.isOriginLocation(this.gpsLatLng)) {
        this.retryGetGPSLocation((location: LatLng) => {
            if (callBack) {
            callBack(location);
            }

            if (Utils.isOriginLocation(location)) {
            // return Promise.reject();
            }

            // return Promise.resolve(location);
        });
        } else {
        // return Promise.resolve(gpsLatLng);
        if (callBack) {
            callBack(this.gpsLatLng);
        }
        }
    };

    /**
     * Thử lấy lại tọa độ gps thêm 1 lần nữa
     */
    private retryGetGPSLocation(callBack: Function) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            let location = new LatLng(position.coords.latitude, position.coords.longitude);

            if (callBack) {
            callBack(location);
            }
        }, error => {
            if (callBack) {
            callBack(null);
            }
        },);
    }

    public isComponentUnmounted(): boolean {
        return this.isUnmounted;
    }

    /** chọn tìm kiếm địa chỉ nào từ màn hình home */
    public getFocusAddressParam(): FocusAddress {
        return this.initFocusAddress;
    }

    /** loại api tìm kiếm: BA hoặc Google */
    public getRequestAddressTypeParam(): AddressRequestType {
        return this.requestAddressType;
    }

    /** Lấy tọa độ GPS */
    public getGpsParam(): LatLng {
        return this.gpsLatLng;
    }

    /** Lấy radius tìm kiếm */
    public getSearchRadiusParam(): number {
        return this.radius;
    }

    public getSrcAddress(): BAAddress {
        return this.srcAddress;
    }

    public setSrcAddress(address: BAAddress) {
        this.srcAddress = address;
    }

    public getDstAddress(): BAAddress {
        return this.dstAddress;
    }

    public setDstAddress(address: BAAddress) {
        this.dstAddress = address;
    }

    /** Lấy địa chỉ công ty */
    public getWorkingLocation(): AddressItem {
        let arrHistories: AddressItem[] = this.mPresenter.getLocalHistoryArray();
        if (Utils.isNull(arrHistories)) arrHistories = [];

        let item: AddressItem;
        for(let i = 0; i < arrHistories.length; i++) {
            item = arrHistories[i];
            if (item.predefinedValue === 2) return item;
        }

        return null;
    }
    
    /** Lấy địa chỉ nhà riêng */
    public getHomeLocation() {
        let arrHistories: AddressItem[] = this.mPresenter.getLocalHistoryArray();
        if (Utils.isNull(arrHistories)) arrHistories = [];

        let item: AddressItem;
        for(let i = 0; i < arrHistories.length; i++) {
            item = arrHistories[i];
            if (item.predefinedValue === 1) return item;
        }

        return null;
    }

    /** Xóa địa chỉ */
    public deleteAddress(addressItem: AddressItem) {
        if (Utils.isNull(addressItem)) {
            return;
        }

        this.mPresenter.showDialogWaiting();

        // xóa item địa chỉ lịch sử trong DB
        AddressHistoryDAO.deleteTo(parseInt(addressItem.id))
        .then(() => {
            this.mPresenter.closeDialog();

            let arrHistories: AddressItem[] = this.mPresenter.getLocalHistoryArray();
            if (Utils.isNull(arrHistories)) arrHistories = [];

            // xóa trong danh sách
            let address: AddressItem;
            for (let i = 0; i < arrHistories.length; i++) {
                address = arrHistories[i];

                if (address.id === addressItem.id) {
                    arrHistories.splice(i, 1);
                    break;
                }
            }

            this.mPresenter.setMutipleState({
                historyAddress: arrHistories
            });
        })
        .catch(() => {
            this.mPresenter.closeDialog();

            // nếu không request được địa chỉ
            ToastModule.show(strings.delete_history_point_failt);
        });
    }

    private async editHomeWorkLocationComplete() {
        // lấy danh sách điểm từ DB
        let addressHistories: AddressItem[] = await this.getAllAddressInDB();

        this.mPresenter.setMutipleState({
            historyAddress: addressHistories,
            isEditingHomeLocation: false,
            isEditingWorkLocation: false
        });
    }

    /** Thêm điểm yêu thích là nhà riêng */
    public editHomeAddress(baAddress: BAAddress) {
        let arrHistories: AddressItem[] = this.mPresenter.getLocalHistoryArray();
        if (Utils.isNull(arrHistories)) arrHistories = [];

        // Kiểm tra trong danh sách lịch sử đã có điểm nhà riêng chưa
        let temp: AddressItem;
        let idHomeAddress = -1;
        for (let i = 0; i < arrHistories.length; i++) {
            temp = arrHistories[i];

            // nếu điểm này là nhà riêng
            if (temp.predefinedValue == 1) {
                idHomeAddress = parseInt(temp.id);
                break;
            }
        }

        if (idHomeAddress > 0) {
            // nếu điểm đã có thì cập nhật
            AddressHistoryDAO.updateHomeLocation(idHomeAddress, baAddress)
            .then(() => {
                // reload lại danh sách lịch sử
                this.editHomeWorkLocationComplete();
            })
            .catch(() => {
                // bỏ qua
            })
        } else {
            // nếu chưa có thì lưu vào db
            AddressHistoryDAO.insertHomeLocation(baAddress)
            .then((number) => {
                // reload lại danh sách lịch sử
                this.editHomeWorkLocationComplete();
            })
            .catch((err) => {
                // bỏ qua
            });
        }
    }

    /** Thêm điểm yêu thích là nhà riêng */
    public editWorkAddress(baAddress) {
        let arrHistories: AddressItem[] = this.mPresenter.getLocalHistoryArray();
        if (Utils.isNull(arrHistories)) arrHistories = [];

        // Kiểm tra đã có điểm yêu thích nhà trước đó chưa
        let idWorkAddress = -1;
        let temp: AddressItem;
        for (let i = 0; i < arrHistories.length; i++) {
            temp = arrHistories[i];
            if (temp.predefinedValue == 2) {
                idWorkAddress = parseInt(temp.id);
                break;
            }
        }
        
        if (idWorkAddress > 0) {
            // cập nhật lại thông tin địa chỉ nơi làm việc
            AddressHistoryDAO.updateWorkLocation(idWorkAddress, baAddress)
            .then((number) => {
                // reload lại danh sách lịch sử
                this.editHomeWorkLocationComplete();
            })
            .catch(err => {
                // bỏ qua
            })
        } else {
            // lưu mới địa chỉ nơi làm việc
            AddressHistoryDAO.insertWorkLocation(baAddress)
            .then((number) => {
                // reload lại danh sách lịch sử
                this.editHomeWorkLocationComplete();
            })
            .catch((err) => {
                // bỏ qua
            });
        }
    }

    public requestDetailAddress(rowData: AddressItem): Promise<BAAddress> {
        // request location detail tới google
        return GoogleAutocompleteController.getDetailAddressInfoV2(this.GOOGLE_KEY, rowData.placeID);
    }

    /** Xử lý tìm địa chỉ autocomplete */
    public async searchAutocomplete(searchText: string) {//: Promise<AddressItem[]> {
        // tăng request id lên 1 đơn vị
        this.mAutoIncreaseSearchAIndex += 1;

        // {requestID: requestID, response: arrDataTemp}
        let ret = await GoogleAutocompleteController.requestAutoComplete(this.mAutoIncreaseSearchAIndex, this.gpsLatLng, 
        this.GOOGLE_KEY, searchText);

        // bỏ qua nếu khác id request
        if (ret.requestID !== this.mAutoIncreaseSearchAIndex) {
            // return Promise.reject(null);
            return;
        }

        let arrTemp = [];
        // lấy danh sách tìm kiếm online
        if (ret.response) {
            arrTemp = arrTemp.concat(ret.response);
        }

        // lấy data từ danh sách lịch sử nếu tên địa chỉ khớp với search text 
        let arrHistories: AddressItem[] = [...this.mPresenter.getLocalHistoryArray(), ...this.mPresenter.getFavoriteArray()];
        for (let i = 0; i < arrHistories.length; i++) {
            // if (i > SearchViewViewModel.RECENT_NUM_COUNT) {
            //     break;
            // }

            let item: AddressItem = arrHistories[i];
            if (Utils.isNull(item.name) && Utils.isNull(item.formattedAddress)) {
                continue;
            }
            
            // nếu text tìm kiếm có chứa trong địa chỉ từ lịch sử
            if (item.name.toLowerCase().includes(searchText) 
                || item.formattedAddress.toLowerCase().includes(searchText)) {
                arrTemp.unshift(item);
            }
        }

        // Lưu danh sách dữ liệu tìm kiếm theo từ khóa
        this.mPresenter.setMutipleState ({
            searchDataSource: arrTemp,
        });
    }

    public isValidDstAddress(): boolean {
        return !Utils.isNull(this.dstAddress) 
        && !Utils.isEmpty(this.dstAddress.formattedAddress) 
        && !Utils.isOriginLocation(this.dstAddress.location);
        // && !Utils.isEmpty(this.dstAddress.name);
    }
    
    public isValidSrcAddress(): boolean {
        return !Utils.isNull(this.srcAddress) 
        && !Utils.isEmpty(this.srcAddress.formattedAddress) 
        && !Utils.isOriginLocation(this.srcAddress.location);
        // && !Utils.isEmpty(this.srcAddress.name);
    }

    public isAddressExistsInArrayAddress(address: AddressItem, arrAddress: AddressItem[]): boolean {
        if (Utils.isNull(address) || Utils.isNull(arrAddress) || arrAddress.length <= 0) return false;
    
        let obj: AddressItem;
        for(let i = 0; i < arrAddress.length; i++) {
          obj = arrAddress[i];
          if (Utils.isNull(obj)) continue;
    
        //   if (obj.id === address.id 
        //         || obj.formattedAddress === address.formattedAddress
        //         || obj.placeID === address.placeID) {
            
          if (obj.formattedAddress === address.formattedAddress
            || (!Utils.isEmpty(obj.placeID) && !Utils.isEmpty(address.placeID) && obj.placeID === address.placeID)) {
            return true;
          }
        }
    
        return false;
      }
}