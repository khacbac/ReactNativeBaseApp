import * as React from 'react';

import SearchViewViewModelNewUI from "./SearchViewModelNewUI";
import { ISearchPresenterNewUI } from "./presenter/ISearchViewPresenterNewUI";
import { NativeAppModule, Utils, Dialog, Text } from "../../../../../module";
import AddressItem from "../../../../viewmodel/search/autocomplete/AddressItem";
import FocusAddress from "../../../../viewmodel/search/FocusAddress";
import SearchHeaderNewUI from './view/SearchHeaderNewUI';
import BAAddress from '../../../../model/BAAddress';

import COLORS from "../../../../../res/colors";
import STRINGS from "../../../../../res/strings";
import SearchResultRowNewUI from './view/SearchResultRowNewUI';
import { Keyboard, View, FlatList, StyleSheet } from 'react-native';
import MapSearchTabViewNewUI from '../map/MapSearchTabViewNewUI';

interface Props {
    navigation;
  }
  
interface State {
  searchText: string;
  // Danh sách điểm xung quanh
  nearAddress: AddressItem[];
  // Danh sách lịch sử điểm đi gần đây
  historyAddress: AddressItem[];
  // Danh sách điểm yêu thích
  favoriteAddress: AddressItem[];
  // Thông tin tìm kiếm khi nhập text
  searchDataSource: AddressItem[];
  // Lưu trạng thái đang focus vào input nào
  focusTextInput: FocusAddress;
  // Trạng thái có đang hiển thị layout map
  isShowMapLayout: boolean;
}
  
export default class SearchViewNewUI extends React.Component<Props, State> implements ISearchPresenterNewUI {
public static SEARCH_PARAMS = 'searchParams';

private AUTOCOMPLETE_TIME_DELAY: number = 500;

private mSearchViewViewModel: SearchViewViewModelNewUI;

private mSearchHeader: SearchHeaderNewUI;

/** thời gian delay trước khi tìm kiếm khi nhập text */
private _searchSrcAddressTimeOut;

private _searchDstAddressTimeOut;

constructor(props) {
  super(props);

  const {params} = props.navigation.state;
  this.mSearchViewViewModel = new SearchViewViewModelNewUI(this, params.searchParams, NativeAppModule.KEY_MAP);

  this.state = {
    searchText: '',
    focusTextInput: this.mSearchViewViewModel.getFocusAddressParam(),
    historyAddress: [],
    favoriteAddress: [],
    nearAddress: [],
    searchDataSource: [],
    isShowMapLayout: false,
  };
  
  this._searchSrcAddressTimeOut = null;
  this._searchDstAddressTimeOut = null;
}

componentWillUnmount() {
  this.mSearchViewViewModel.componentWillUnmount();
}

componentDidMount() {
  this.mSearchViewViewModel.componentDidMount();
}

componentDidUpdate() {
  // this.initFocusHistory();
}

/**
 * @override 
 * Focus vào ô nhập text tương ứng 
 */
public initFocusHistory() {
  setTimeout(() => {
    if (this.mSearchHeader) {
      if (this.state.focusTextInput === FocusAddress.A_FOCUS) {
        this.mSearchHeader.setSrcTextInputFocus();
      } else if (this.state.focusTextInput === FocusAddress.B_FOCUS) {
        this.mSearchHeader.setDstTextInputFocus();
      }
    }
  }, 300);
}

/** @override */
public setMutipleState(state: any) {
  this.setState(state);
}

/** @override */
public getNavigation() {
  return this.props.navigation;
}

/** @override */
public getCurrentFocusAddress() {
  return this.state.focusTextInput;
}

/** @override */
public getLocalHistoryArray() {
  return this.state.historyAddress;
}

/** @override */
public getFavoriteArray() {
  return this.state.favoriteAddress;
}

/** @override */
public getNearAddressArray() {
  return this.state.nearAddress;
}

/** @override */
public getSearchAddressArray() {
  return this.state.searchDataSource;
}

/** 
 * @override
 * Xử lý khi có data address mới
 */
public handleDataSearch(baAddress: BAAddress) {
  if (this.getCurrentFocusAddress() === FocusAddress.A_FOCUS) {
    this.mSearchViewViewModel.setSrcAddress(baAddress);
    if (this.mSearchHeader) {
      this.mSearchHeader.setSrcTextInputText(baAddress.formattedAddress);
      this.mSearchHeader.setDstTextInputFocus();
    }

    return;
  }

  this.mSearchViewViewModel.backWithAddress(this.mSearchViewViewModel.getSrcAddress(), baAddress);
}

/** Xử lý click back icon của màn hình search */
private _onPressBackIcon = () => {
  this.mSearchViewViewModel.backWithAddress(this.mSearchViewViewModel.getSrcAddress(), this.mSearchViewViewModel.getDstAddress());
}

/** Xử lý click map icon trên header */
private _onPressMapIcon = () => {
  this.setState({
    isShowMapLayout: true
  });
}

/** Xử lý khi nhấn back từ màn hình map */
public onBackFromMapView = (callback?) => {
  this.setState({
    isShowMapLayout: false
  }, () => {
    if (callback) {
      callback();
    }
  });
}

/** Xử lý khi nhấn confirm địa chỉ từ màn hình map: gán địa chỉ và ẩn view map */
public onConfirmAddressFromMapView = (baAddress: BAAddress, focusAddress: FocusAddress) => {
  if (Utils.isNull(baAddress) || Utils.isEmpty(baAddress.formattedAddress)) {
    return;
  }

  this.onBackFromMapView(() => {
    this.handleDataSearch(baAddress);
  })
}

/**
 * Xử lý click icon thêm địa chỉ đến trên header
 */
private _onPressAddToAddress = () => {
}

/** Clear timeout delay request autocomplete */
private _cleartCurrentTimeOut() {
  if (this._searchSrcAddressTimeOut) {
    clearTimeout(this._searchSrcAddressTimeOut);
    this._searchSrcAddressTimeOut = null;
  }

  if (this._searchDstAddressTimeOut) {
    clearTimeout(this._searchDstAddressTimeOut);
    this._searchDstAddressTimeOut = null;
  }
}

/** Xử lý khi user nhập text tìm địa chỉ đi */
private handleOnAddressTextChange = (searchText) => {
  // bỏ qua nếu component đã unmount
  if (this.mSearchViewViewModel.isComponentUnmounted()) {
    return;
  }

  // xóa timeout delay cũ
  this._cleartCurrentTimeOut();

  // Gọi hàm lấy địa chỉ từ server
  this._searchSrcAddressTimeOut = setTimeout(() => {
    if (this.mSearchViewViewModel.isComponentUnmounted()) {
      return;
    }
    
    // xóa timeout hiện tại
    this._cleartCurrentTimeOut();

    // gọi tìm kiếm autocomplete
    this.mSearchViewViewModel.searchAutocomplete(searchText);
    
    // gọi hàm lấy dữ liệu autocomplete
  }, this.AUTOCOMPLETE_TIME_DELAY);
}

/** Xử lý khi thay đổi focus textinput address view */
private _onTextInputFocus = (focusAddress: FocusAddress) => {
  if (focusAddress === FocusAddress.A_FOCUS) {
    if (this.mSearchHeader) {
      // reset địa chỉ đến nếu có địa chỉ.
      if (this.mSearchViewViewModel.isValidDstAddress()) {
        this.mSearchHeader.setDstTextInputText(this.mSearchViewViewModel.getDstAddress().formattedAddress);
      } else {
        this.mSearchHeader.setDstTextInputText("");
      }
    }
  } else if (focusAddress === FocusAddress.B_FOCUS && this.mSearchViewViewModel.isValidSrcAddress()) {
    if (this.mSearchHeader) {
      this.mSearchHeader.setSrcTextInputText(this.mSearchViewViewModel.getSrcAddress().formattedAddress);
    }
  }

  this.setState({
    searchDataSource: [],
    focusTextInput: focusAddress
  });
}

public getDialog(): Dialog {
  return this.refs.dialog as Dialog;
}

/**
 * @override
 */
public showDialogWaiting() {
    this.getDialog().showWaitingDialog(STRINGS.address_loadding);
}

/**
 * @override
 */
public closeDialog() {
    this.getDialog()._closeDialog();
}

/** Merge danh sách điểm lịch sử với danh sách điểm xung quanh */
private mergeArrayFavoritesWithNearAddress(): AddressItem[] {
  let arrFavorites: AddressItem[] = this.state.favoriteAddress;
  if (Utils.isNull(arrFavorites)) arrFavorites = [];

  let arrNearAddresses: AddressItem[] = this.state.nearAddress;
  if (Utils.isNull(arrNearAddresses)) arrNearAddresses = [];
  
  let arrDataTemp: AddressItem[] = [...arrFavorites];

  let address: AddressItem;
  for (let i = 0; i < arrNearAddresses.length; i++) {
    address = arrNearAddresses[i];

    // nếu đã tồn tại trong danh sách điểm yêu thích thì bỏ qua => tránh nhân bản địa chỉ
    if (this.mSearchViewViewModel.isAddressExistsInArrayAddress(address, arrFavorites)) {
      continue;
    }

    // thêm vào danh sách dữ liệu
    arrDataTemp.push(address);
  }

  return arrDataTemp;
}

/** Merge danh sách điểm lịch sử với danh sách điểm yêu thích */
public mergeArrayFavoritesWithHistoritesAddress(): AddressItem[] {
  let arrFavorites: AddressItem[] = this.state.favoriteAddress;
  if (Utils.isNull(arrFavorites)) arrFavorites = [];

  let arrHistories: AddressItem[] = this.state.historyAddress;
  if (Utils.isNull(arrHistories)) arrHistories = [];
  
  let arrDataTemp: AddressItem[] = [...arrFavorites];

  let address: AddressItem;
  for (let i = 0; i < arrHistories.length; i++) {
    address = arrHistories[i];

    // nếu đã tồn tại trong danh sách điểm yêu thích thì bỏ qua => tránh nhân bản địa chỉ
    if (this.mSearchViewViewModel.isAddressExistsInArrayAddress(address, arrFavorites)) {
      continue;
    }

    // thêm vào danh sách dữ liệu
    arrDataTemp.push(address);
  }

  return arrDataTemp;
}

/** Có cho phép hiển thị danh sách địa chỉ xung quanh */
private _isEnableShowInitSrcAddressData(): boolean {
  let arrAddress: AddressItem[] = this.mergeArrayFavoritesWithNearAddress();
  // cho phép hiển thị dữ liệu khởi tạo địa chỉ đi khi không có dữ liệu tìm kiếm và có dữ liệu khởi tạo
  return this.state.focusTextInput === FocusAddress.A_FOCUS 
  && (Utils.isNull(this.state.searchDataSource) || this.state.searchDataSource.length <= 0)
  && (!this.mSearchHeader
    || Utils.isEmpty(this.mSearchHeader.getSrcText())  
    || this.mSearchHeader.getSrcText() === this.mSearchViewViewModel.getSrcAddress().formattedAddress)
  && !Utils.isNull(arrAddress) && arrAddress.length > 0;
}

/** Có cho phép hiển thị danh sách địa chỉ lịch sử */
private _isEnableShowInitDstAddressData(): boolean {
  let arrAddress: AddressItem[] = this.mergeArrayFavoritesWithHistoritesAddress();
  // cho phép hiển thị dữ liệu khởi tạo địa chỉ đến khi không có dữ liệu tìm kiếm và có dữ liệu khởi tạo
  return this.state.focusTextInput === FocusAddress.B_FOCUS  
  && (Utils.isNull(this.state.searchDataSource) || this.state.searchDataSource.length <= 0)
  && (!this.mSearchHeader 
    || Utils.isEmpty(this.mSearchHeader.getDstText())  
    || this.mSearchHeader.getDstText() === this.mSearchViewViewModel.getDstAddress().formattedAddress)
  && !Utils.isNull(arrAddress) && arrAddress.length > 0;
}

/** Có cho phép hiển thị danh sách địa chỉ từ tìm kiếm */
private _isEnableShowSearchData(): boolean {
  return !Utils.isNull(this.state.searchDataSource) && this.state.searchDataSource.length > 0;
}

/** Có cho phép hiển thị thông báo không tìm thấy địa chỉ */
private _isEnableShowNotResult(): boolean {
  // return false;
  return !this._isEnableShowSearchData()
    && !this._isEnableShowInitDstAddressData()
    && !this._isEnableShowInitDstAddressData()
    && this.mSearchHeader 
    && ((this.state.focusTextInput === FocusAddress.A_FOCUS 
      && this.mSearchHeader.getSrcText() !== this.mSearchViewViewModel.getSrcAddress().formattedAddress
      && !Utils.isEmpty(this.mSearchHeader.getSrcText()))
    || (this.state.focusTextInput === FocusAddress.B_FOCUS 
      && this.mSearchHeader.getDstText() !== this.mSearchViewViewModel.getDstAddress().formattedAddress
      && !Utils.isEmpty(this.mSearchHeader.getDstText())))
}

/**
 * Xử lý khi nhấn vào item kết quả tìm kiếm
 */
private _onPressSeachResultItem = (rowData: AddressItem) => {
  this.mSearchViewViewModel.handleClickGoogleAddress(rowData);
}

/** Xử lý khi click icon thêm điểm yêu thích */
private onPressSearchRowRightImage = (rowData: AddressItem) => {
  this.mSearchViewViewModel.handleClickFavoriteButton(rowData);
}

/**
 * Hàm render dòng dữ liệu của flatlist
 */
private _renderSearchDataRow(rowData: AddressItem) {
  return (
    <SearchResultRowNewUI
    data={rowData}
    onPressSearchResultItem={() => {
      Keyboard.dismiss();
      this._onPressSeachResultItem(rowData);
    }}
    onPressRightImage={() => {this.onPressSearchRowRightImage(rowData)}}
  />);
};

/**
 * Hàm render view tìm kiếm địa chỉ autocomplete
 */
private _renderSearchView() {
  let arrAddress: AddressItem[] = [];

  // Có cho phép hiển thị danh sách địa chỉ lịch sử
  let isEnableShowInitDstAddressData: boolean = this._isEnableShowInitDstAddressData();
  if (isEnableShowInitDstAddressData) {
    arrAddress = this.mergeArrayFavoritesWithHistoritesAddress();
  }
  
  // Có cho phép hiển thị danh sách địa chỉ xung quanh
  let isEnableShowInitSrcAddressData: boolean = this._isEnableShowInitSrcAddressData();
  if (isEnableShowInitSrcAddressData) {
    arrAddress = this.mergeArrayFavoritesWithNearAddress();
  }
  
  // Có cho phép hiển thị danh sách địa chỉ tìm kiếm
  let isEnableShowSearchData: boolean = this._isEnableShowSearchData();
  if (isEnableShowSearchData) {
    arrAddress = this.state.searchDataSource;
  }
  
  let isEnableShowNotResult: boolean = this._isEnableShowNotResult();

  return (
    <View style={{flex: 1}}>
      <SearchHeaderNewUI 
        ref={ ref => {
          this.mSearchHeader = ref;
        }}
        onPressBackIcon={this._onPressBackIcon} 
        onPressMapIcon={this._onPressMapIcon} 
        onPressAddToAddress={this._onPressAddToAddress}
        initSrcFormatedAddress={this.mSearchViewViewModel.getSrcAddress().formattedAddress}
        initDstFormatedAddress={this.mSearchViewViewModel.getDstAddress().formattedAddress}
        onSrcAddressTextChange={this.handleOnAddressTextChange}
        onDstAddressTextChange={this.handleOnAddressTextChange}
        onTextInputFocus={this._onTextInputFocus}
      />

      {/*  Content container */}
      <View style={{flex: 1, backgroundColor: '#EEEEEE', padding: 8}}>
        {/* Thông báo không có địa chỉ nào tìm thấy với từ khóa đó */}
        {isEnableShowNotResult ? 
          (
            // Thông báo không có kết quả phù hợp với từ khóa tìm kiếm
            <View style={[styles.subContainer, {justifyContent: 'center', alignItems: 'center'}]}>
              <Text text={STRINGS.no_search_result} textStyle={{textAlign: 'center'}} />
            </View>
          )
          :
          // danh sách dữ liệu
          (arrAddress && arrAddress.length > 0) ?
            (<View style={styles.subContainer}>
              <FlatList
                data={arrAddress}
                extraData={[arrAddress, this.props]}
                renderItem={({item}) => this._renderSearchDataRow (item)}
                keyExtractor={(item, index) => `${item.id}`}
                keyboardShouldPersistTaps={'handled'}
              />
            </View>)
            :
            null
        }
      </View>

      {/* Dialog chờ */}
      <Dialog
        visible={false}
        ref="dialog"
      />
    </View>
  );
}

/** Hàm render view tìm kiếm trên map */
_renderMapView() {
  return (
    <MapSearchTabViewNewUI
      onBackFromMapView={this.onBackFromMapView}
      onConfirmAddress={this.onConfirmAddressFromMapView}
      screenProps={{
        focusAddress: this.state.focusTextInput,
        radius: this.mSearchViewViewModel.getSearchRadiusParam(),
        srcAddress: this.mSearchViewViewModel.getSrcAddress(),
        dstAddress: this.mSearchViewViewModel.getDstAddress(),
        gpsLocation: this.mSearchViewViewModel.getGpsParam(),
        requestBAType: this.mSearchViewViewModel.getRequestAddressTypeParam(),
        GOOGLE_KEY: NativeAppModule.KEY_MAP,
      }}
    />
  );
}

render() {
  return <View style={styles.container}>
    {this.state.isShowMapLayout ? this._renderMapView() : this._renderSearchView()}
  </View>;
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: COLORS.colorWhiteFull,
},
subContainer: {
  padding: 8,
  borderColor: COLORS.colorGrayLight,
  borderWidth: 0.5,
  borderRadius: 2,
  backgroundColor: COLORS.colorWhiteFull,
  shadowColor: COLORS.colorBlackFull,
  shadowOffset: {width: 2, height: 2},
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 2,
},
});