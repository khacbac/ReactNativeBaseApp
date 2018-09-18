import * as React from "react";

import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Keyboard,
} from 'react-native';

import IMAGES from '../../../../res/images';
import COLORS from '../../../../res/colors';
import STRINGS from '../../../../res/strings';

import {Text, LatLng, Utils, NativeAppModule} from '../../../../module';

import BAAddress from '../../../model/BAAddress';
import AddressItem from '../../../viewmodel/search/autocomplete/AddressItem';
import { withNavigationFocus } from 'react-navigation';
import FocusAddress from "../../../viewmodel/search/FocusAddress";
import SearchViewViewModel from "../../../viewmodel/search/autocomplete/SearchViewViewModel";
import { ISearchViewPresenter } from "../../../viewmodel/search/autocomplete/ISearchViewPresenter";
import SearchResultRowView from "./SearchResultRowView";
import FavoriteLocationView from "./FavoriteLocationView";

interface Props {
  navigation;
  screenProps;
  isFocused;
  focusAddress: FocusAddress;
}

interface State {
  searchDataSource: AddressItem[]; // danh sách địa chỉ từ tìm kiếm
  nearAddress: AddressItem[]; //danh sách địa chỉ xung quanh
  historyAddress: AddressItem[]; // danh sách địa chỉ từ lịch sử
  gpsLocation: LatLng;
  isEditingHomeLocation: boolean;
  isEditingWorkLocation: boolean;
}
class SearchAutoCompleteViewLib extends React.Component<Props, State> implements ISearchViewPresenter {
  protected mSearchViewViewModel: SearchViewViewModel;

  private _searchText: string = "";

  constructor (props) {
    super (props);

    this.mSearchViewViewModel = new SearchViewViewModel(this, props.screenProps.searchParams, NativeAppModule.KEY_MAP);

    this.state = {
      searchDataSource: [],
      nearAddress: [],
      historyAddress: [],
      gpsLocation: new LatLng(21.028998, 105.852492),
      isEditingHomeLocation: false,
      isEditingWorkLocation: false
    };
  }
  
  componentDidMount() {
    this.props.navigation.addListener('didFocus', this._onFocus);

    this.mSearchViewViewModel.componentDidMount();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('didFocus', this._onFocus);
    
    this.mSearchViewViewModel.componentWillUnmount();
  }

  _onFocus = () => {
    // Cho phép hiển thị button search trên toolbar
    this.props.screenProps.SearchHome.setAllowShowSearchView(true);
  };

  componentWillReceiveProps(nextProps) {
    // bỏ qua nếu component đã unmount
    if (this.mSearchViewViewModel.isComponentUnmounted()) return;

    // bỏ qua nếu search text không thay đổi
    if (nextProps.screenProps.searchText === this._searchText) {
      return;
    }
    
    // lưu tạm
    this._searchText = nextProps.screenProps.searchText;

    // nếu search text rỗng thì không tìm kiếm, reset dữ liệu tìm kiếm google
    if (Utils.isEmpty(this._searchText)) {
      this.setState({
        searchDataSource: []
      })
      return;
    }

      // gọi tìm kiếm autocomplete
    this.mSearchViewViewModel.searchAutocomplete(this._searchText);
  }

  /** @override */
  public setMutipleState(state: any) {
    this.setState(state);
  }

  /** @override */
  public getLocalHistoryArray() {
    return this.state.historyAddress;
  }
  
  /** @override */
  public getFavoriteArray() {
    return [];
  }
  
  /** @override */
  public getNearAddressArray() {
    return this.state.nearAddress;
  }
  
  /** @override */
  public getSearchAddressArray() {
    return this.state.searchDataSource;
  }
  
  /** @override */
  public showDialogWaiting() {
    this.props.screenProps.SearchHome.showDialogWaiting();
  }

  /** @override */
  public closeDialog() {
    this.props.screenProps.SearchHome.closeDialog();
  }

  /** Có đang trong trạng thái edit địa chỉ nhà riêng, công ty */
  private isEditFavoriteLocation(): boolean {
    return this.state.isEditingHomeLocation || this.state.isEditingWorkLocation;
  }

  private sendDataToHomeScreen(baAddress: BAAddress) {
    this.props.screenProps.setAddress (baAddress);
  }

  /** Xử lý khi nhấn vào 1 item address: near address, history address */
  public _onPressAddressItem = rowData => {
    if (Utils.isNull(rowData)) return;

    let baAddress = new BAAddress();
    baAddress.name = rowData.name;
    baAddress.formattedAddress = rowData.formattedAddress;
    baAddress.location = rowData.location;

    // Xử lý khi đang chọn điểm yêu thích: nhà hoặc công ty
    if (this.isEditFavoriteLocation()) {
      if (this.state.isEditingHomeLocation) {
        this.mSearchViewViewModel.editHomeAddress(baAddress);
      } else if (this.state.isEditingWorkLocation) {
        this.mSearchViewViewModel.editWorkAddress(baAddress);
      }
      
      // xóa text search header
      this.props.screenProps.SearchHome.clearSearchText();

      return;
    }

    // Không request chi tiết với địa chỉ xung quanh, vì dữ liệu đã đầy đủ
    this.sendDataToHomeScreen(baAddress);
  };

  /** Hàm render row item cho flatlist  */
  public _renderHistoryRow = (rowData) => {
    return (
      <SearchResultRowView
        data={rowData}
        onPressRightImage={() => {
          if (this.mSearchViewViewModel.isComponentUnmounted()) return;

          this.mSearchViewViewModel.deleteAddress(rowData);
        }}
        onPressSearchResultItem={() => {
          this._onPressAddressItem (rowData);
        }}
      />
    );
  }

  /** Xử lý khi click vào row item danh sách tìm kiếm autocomplete */
  public _onPressGoogleAddressItem = async rowData => {
    this.showDialogWaiting();
    
    // nếu đang edit điểm yêu thích nhà riêng hoặc công ty
    if (this.isEditFavoriteLocation()) {
      let baAddress = new BAAddress ();

      // nếu đây là dữ liệu có sẵn location thì k request detail
      if (rowData.type !== AddressItem.GOOGLE) {
        baAddress.name = rowData.name;
        baAddress.formattedAddress = rowData.formattedAddress;
        baAddress.location = rowData.location;
      } else {
        // request lấy chi tiết của địa chỉ online
        baAddress = await this.mSearchViewViewModel.requestDetailAddress(rowData);
      }

      if (!Utils.isNull(baAddress)) {
        if (this.state.isEditingHomeLocation) {
          await this.mSearchViewViewModel.editHomeAddress(baAddress);
        } else if (this.state.isEditingWorkLocation) {
          await this.mSearchViewViewModel.editWorkAddress(baAddress);
        }
        
        // xóa text search header
        this.props.screenProps.SearchHome.clearSearchText();
      }
      
      this.closeDialog();
      return;
    }

    //----------------- Trường hợp còn lại: Không phải sửa điểm yêu thích mà chọn địa chỉ để về home

    // nếu item là địa chỉ có đầy đủ thông tin thì không cần request
    if (rowData.type !== AddressItem.GOOGLE) {
      let baAddress = new BAAddress();
      baAddress.name = rowData.name;
      baAddress.formattedAddress = rowData.formattedAddress;
      baAddress.location = rowData.location;
      
      this.closeDialog();
      this.sendDataToHomeScreen(baAddress);
      return;
    }

    // Trường hợp còn lại, địa chỉ không đủ thông tin thì phải request detail tới google
    let baAddress: BAAddress = await this.mSearchViewViewModel.requestDetailAddress(rowData);
    this.closeDialog();
    if (!Utils.isNull(baAddress)) {
      this.sendDataToHomeScreen(baAddress);
    }
  }

  /** Hàm render row item của flatlist hiển thị dữ liệu tìm kiếm của google */
  public _renderRowGoogleResult = (rowData) => {
    return (
      <SearchResultRowView
        data={rowData}
        onPressSearchResultItem={() => {
          Keyboard.dismiss();
          this._onPressGoogleAddressItem (rowData);
        }}
      />
    );
  }

  private getSubAddressHistories(arr): AddressItem[] {
    if (Utils.isNull(arr) || arr.length == 0) return [];

    let arrTemp: AddressItem[] = [];
    let focusAddress: FocusAddress = this.mSearchViewViewModel.getFocusAddressParam();
    for(let i = 0; i < arr.length; i++) {
      if (focusAddress === FocusAddress.A_FOCUS && i >= SearchViewViewModel.RECENT_NUM_COUNT) {
        break;
      }
      
      if (focusAddress === FocusAddress.B_FOCUS && i >= SearchViewViewModel.TOTAL_FIND_NUM_COUNT) {
        break;
      }

      if (i >= SearchViewViewModel.TEN_FIND_NUM_COUNT) {
        break;
      }

      arrTemp.push(arr[i]);
    } // for

    return arrTemp;
  }

  /** Merge danh sách điểm lịch sử với danh sách địa chỉ xung quanh */
  public _mergeNearWithHistoryAddress(): AddressItem[] {
    let arrHistories: AddressItem[] = this.getLocalHistoryArray();
    if (Utils.isNull(arrHistories)) arrHistories = [];
    arrHistories = this.getSubAddressHistories(arrHistories);

    let arrNearAddress: AddressItem[] = this.getNearAddressArray();
    if (Utils.isNull(arrNearAddress)) arrNearAddress = [];
    
    let arrDataTemp: AddressItem[] = [...arrHistories];

    let address: AddressItem;
    for (let i = 0; i < arrNearAddress.length; i++) {
      address = arrNearAddress[i];

      // nếu đã tồn tại trong danh sách điểm lịch sử thì bỏ qua => tránh nhân bản địa chỉ
      if (this.mSearchViewViewModel.isAddressExistsInArrayAddress(address, arrHistories)) {
        continue;
      }

      // thêm vào danh sách dữ liệu
      arrDataTemp.push(address);
    }

    return arrDataTemp;
  }

  private _mergeSearchWithHistoryAddress(): AddressItem[] {
    // lấy data từ danh sách lịch sử nếu tên địa chỉ khớp với search text 
    let arrHistories: AddressItem[] = [];
    let item: AddressItem;
    for (let i = 0; i < this.state.historyAddress.length; i++) {
      item = this.state.historyAddress[i];
      if (Utils.isNull(item.name) && Utils.isNull(item.formattedAddress)) {
        continue;
      }
      
      // nếu text tìm kiếm có chứa trong địa chỉ từ lịch sử
      if (item.name.toLowerCase().includes(this.props.screenProps.searchText) 
        || item.formattedAddress.toLowerCase().includes(this.props.screenProps.searchText)) {
          arrHistories.push(item);
      }
    }
    arrHistories = this.getSubAddressHistories(arrHistories);

    let arrSearch: AddressItem[] = [];
    for (let i = 0; i < this.state.searchDataSource.length; i++) {
      item = this.state.searchDataSource[i];

      if (Utils.isNull(item.name) && Utils.isNull(item.formattedAddress)) {
        continue;
      }
      
      // nếu đã tồn tại trong danh sách điểm lịch sử thì bỏ qua => tránh nhân bản địa chỉ
      if (this.mSearchViewViewModel.isAddressExistsInArrayAddress(item, arrHistories)) {
        continue;
      }

      arrSearch.push(item);
    }

    return [...arrHistories, ...arrSearch];
  }

  /** Hàm render view của màn hình này */
  private _getMainView() {
    const {screenProps} = this.props;

    // Cờ trạng thái có hiển thị layout điểm yêu thích 
    const isShowHeader = !this.state.isEditingHomeLocation 
                            && !this.state.isEditingWorkLocation 
                            && Utils.isEmpty(screenProps.searchText);

    const nearAddressArray: AddressItem[] = this._mergeNearWithHistoryAddress();
    const searchAddressArray: AddressItem[] = this._mergeSearchWithHistoryAddress();

    return (
      <View style={styles.container}>
        {/* Địa điểm yêu thích */}
        {isShowHeader &&
        <FavoriteLocationView
          homeLocationData={this.mSearchViewViewModel.getHomeLocation()}
          homeWorkingData={this.mSearchViewViewModel.getWorkingLocation()}
          onPressAddHome={() => {
            this.setState({
              isEditingHomeLocation: true
            })
          }}
          onPressAddWorking={() => {
            this.setState({
              isEditingWorkLocation: true
            })
          }}
          onPressItem={(rowData) => {
            this._onPressAddressItem(rowData);
          }}
        />}

      {/* Lịch sử, địa chỉ gần đây */}
      <View style={[styles.containerSub, {flex: 1}]}>
        {/* Header */}
        {isShowHeader &&  
          <Text text={STRINGS.profile_address_history_title.toUpperCase ()} textStyle={styles.textHeader} />
        }

        {/* Danh sách lịch sử, địa chỉ gần đây */}
        <FlatList
          style={{flex: 1}}
          data={nearAddressArray}
          extraData={[nearAddressArray, this.props]}
          renderItem={({item}) => this._renderHistoryRow (item)}
          // keyExtractor={(item, index) => `${index}`}
          keyExtractor={(item, index) => `${item.id}`}
          keyboardShouldPersistTaps={'handled'}
        />

        {/* Icon power by google */}
        <View style={{backgroundColor: COLORS.colorWhiteFull, height: 32, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{height: 32, width: 100}}
            resizeMode="center"
            source={IMAGES.powered_by_google}
          />
        </View>

        {/* View nổi ở trên, chứa danh sách tìm kiếm khi nhập text vào */}
        {!Utils.isEmpty(screenProps.searchText) && 
          <View
          style={[
            styles.overContainer,
            {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.colorWhiteFull
            },
          ]}>
            {/* Text thông báo không có kết quả nào được tìm thấy */}
            {(Utils.isNull(searchAddressArray) || searchAddressArray.length <= 0) &&
              <Text
              text={STRINGS.no_search_result}
              textStyle={[styles.textHeader, {
                flex: 1, margin: 20, width: '100%', height: '100%', textAlign: 'center'
              }]} />
            }
            
            {/* Danh sách kết quả tìm đường */}
            {(!Utils.isNull(searchAddressArray) && searchAddressArray.length > 0) &&
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                style={{flex: 1, width: '100%', height: '100%'}}
                data={searchAddressArray}
                extraData={[searchAddressArray, this.props]}
                renderItem={({item}) => this._renderRowGoogleResult (item)}
                // keyExtractor={(item, index) => `${index}`}
                keyExtractor={(item, index) => `${item.id}`}
              />
            }
            
            {/* Icon power by google */}
            <View style={{backgroundColor: COLORS.colorWhiteFull, height: 32, 
                  justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{height: 32, width: 100}}
                resizeMode="center"
                source={IMAGES.powered_by_google}
              />
            </View>
          </View>
        }
      </View>
    </View>
    );
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this._getMainView()}
      </View>
    );
  }
}

export default withNavigationFocus(SearchAutoCompleteViewLib);

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
    paddingRight: 8,
  },
  containerSub: {
    flexDirection: 'column',
    marginTop: 4,
    marginBottom: 4,
  },
  textHeader: {
    color: COLORS.grayDarkSub,
    fontSize: 17,
  },
  //   Favorite =======================
  overContainer: {
    flexDirection: 'column',
    position: 'absolute',
    flex: 1,
    display: 'flex',
    width: '100%',
    height: '100%',
  },
});
