import * as React from 'react';

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import COLORS from '../../../../../res/colors';
import STRINGS from '../../../../../res/strings';
import IMAGES from '../../../res/images';

import {
  Text,
  LatLng,
  Utils,
  ToastModule,
  NativeAppModule,
  LifeComponent,
} from '../../../../../module';
import FocusAddress from '../../../../viewmodel/search/FocusAddress';
import BAAddress from '../../../../model/BAAddress';

import MapView, { Region } from 'react-native-maps';
import SearchParams from '../../../../viewmodel/search/SearchParams';
import AddressDetailView from '../../../../component/search/map/AddressDetailView';
import SearchMapViewModel from '../../../../viewmodel/search/geocoding/SearchMapViewModel';
import { ISearchMapPresenter } from '../../../../viewmodel/search/geocoding/ISearchMapPresenter';

interface Props {
  screenProps;
  onBackFromMapView;
  onConfirmAddress;
}

interface State {
  currentAddress: BAAddress;
  isMoveMap: boolean;
}
export default class MapSearchTabViewNewUI extends LifeComponent<Props, State> implements ISearchMapPresenter{
  protected mSearchMapViewModel: SearchMapViewModel;
  
  private mMapView: MapView;

  private isRequesting: boolean = false;

  constructor(props) {
    super(props);

    this.mSearchMapViewModel = new SearchMapViewModel(this, this.getSearchParams(props.screenProps), NativeAppModule.KEY_MAP);

    this.state = {
      currentAddress: new BAAddress(),
      isMoveMap: false,
    };
  }

  private getSearchParams(screenProps): SearchParams {
    let searchParams: SearchParams = new SearchParams();

    searchParams.focusAddress = screenProps.focusAddress;
    searchParams.radius = screenProps.radius;
    searchParams.requestType = screenProps.requestBAType;
    searchParams.gpsLatLng = screenProps.gpsLocation;
    searchParams.srcAddress = screenProps.srcAddress;
    searchParams.dstAddress = screenProps.dstAddress;

    return searchParams;
  }

  componentWillReceiveProps(newProp) {
    this.mSearchMapViewModel.initSearchParam(this.getSearchParams(newProp.screenProps));
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  /** @override */
  public updateAddress(baAddress: BAAddress, requestCoordinate: LatLng) {
    if (Utils.isNull(baAddress)) {
      baAddress = new BAAddress();
      baAddress.location = requestCoordinate;
      baAddress.name = STRINGS.book_search_latlng_point;
      baAddress.formattedAddress = STRINGS.book_search_latlng_point;
    }

    this.setState({
      currentAddress: baAddress,
    });

    let formattedAddress: string = baAddress ? baAddress.formattedAddress : "";
    this._setAddressViewRequestingState(false, formattedAddress);

    this.isRequesting = false;
  }

  /** @override */
  public onGetGPSLocationError() {
    this.mSearchMapViewModel.showToastMsg(STRINGS.gps_network_not_get_location);
  }

  private _getConfirmButtonText(): string {
    if (this.mSearchMapViewModel.getFocusAddress() === FocusAddress.A_FOCUS) {
      return STRINGS.search_address_to_confirm_from;
    } else {
      return STRINGS.search_address_to_confirm_to;
    }
  }

  private _getConfirmButtonBackground() {
    if (this.mSearchMapViewModel.getFocusAddress() === FocusAddress.A_FOCUS) {
      return COLORS.colorMain;
    } else {
      return COLORS.colorSub;
    }
  }

  public _onRegionChangeComplete(region) {
    // region: {longitudeDelta: 0.00474918633697996, latitudeDelta: 0.005578822171674602,
    // longitude: 105.84227560088038, latitude: 20.997476214550915}

    if (!this.isMouted) {
      return;
    }
    
    if (this.state.isMoveMap === true) {
      this.setState({
        isMoveMap: false,
      });
    }

    // Lưu trạng thái đang request địa chỉ
    this.isRequesting = true;

    // đổi text trạng thái đang loadding địa chỉ
    this._setAddressViewRequestingState(true, null);

    // Gọi hàm lấy địa chỉ từ server
    this.mSearchMapViewModel.onRegionChangeComplete(region);
  }

  /**
   * Hiển thị toast message
   * @param {*} msg
   */
  showToastMsg(msg) {
    ToastModule.show(msg);
  }

  /** Gửi địa chỉ tới màn hình home và back về */
  _sendAddressToHome() {
    if (this.state.isMoveMap === true) {
      return;
    }

    if (this.isRequesting === true) {
      this.showToastMsg(STRINGS.address_loadding);
      return;
    }

    if (Utils.isNull(this.state.currentAddress) 
      || Utils.isEmpty(this.state.currentAddress.formattedAddress)
      || Utils.isOriginLocation(this.state.currentAddress.location)) {
      this.showToastMsg(STRINGS.no_address);
      return;
    }

    this.props.onConfirmAddress(this.state.currentAddress, this.mSearchMapViewModel.getFocusAddress());
  }

  _setAddressViewRequestingState(isRequesting: boolean, currentAddress: string) {
    let addressDetail = this.refs
      .AddressDetailOverMapRefs as AddressDetailView;

    if (Utils.isNull(addressDetail)) return;

    addressDetail.setInfo(isRequesting, currentAddress);
  }

  /**
   * Xử lý nhấn back icon
   */
  _onBackPressIcon = () => {
    this.props.onBackFromMapView();
  }

  private onHandleRegionChange = (region: Region) => {
    if (this.state.isMoveMap === true) {
      return;
    }

    this.setState({
      isMoveMap: true
    });
  }

  _getMainView() {
    return (
      <View style={styles.container}>
        {/* map view */}
        <MapView
          ref={(ref) => { this.mMapView = ref }}
          style={styles.mapContainer}
          provider="google"
          showsUserLocation={false}
          initialRegion={{
            latitude: this.mSearchMapViewModel.getInitMapLocation().latitude,
            longitude: this.mSearchMapViewModel.getInitMapLocation().longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onRegionChange={this.onHandleRegionChange}
          onRegionChangeComplete={region => {
            this._onRegionChangeComplete(region);
          }}
        />

        {/* Icon back */}
        <View style={{width: Dimensions.get('window').width, alignItems: 'flex-start', justifyContent: 'center'}}>
          <TouchableOpacity onPress={this._onBackPressIcon}>
            <Image
              source={IMAGES.ic_back_home}
              resizeMode="contain"
              style={{
                width: 42,
                height: 42,
                margin: 12,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* View button gps va nut xac nhan dia chi */}
        <View style={[styles.overContainer, {bottom: 0}]}>
          {/* View button GPS */}
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flex: 1,
              paddingRight: 16,
            }}
          >
            <TouchableOpacity style={styles.gpsBtn} onPress={() => { this.mSearchMapViewModel.moveToGPSLocation(this.mMapView) }}>
              <Image
                source={IMAGES.ic_my_location}
                resizeMode="contain"
                style={{
                  width: 28,
                  height: 28,
                  padding: 8,
                }}
              />
            </TouchableOpacity>
          </View>
          
          {/* View hiển thị địa chỉ */}
          <AddressDetailView
            ref="AddressDetailOverMapRefs"
            focusAddress={this.mSearchMapViewModel.getFocusAddress()}
            isShowHeader={false}
            containerStyle={{
              height: 40,
              justifyContent: 'center',
              marginTop: 8,
              marginBottom: 6,
              marginLeft: 16,
              marginRight: 16,
              borderRadius: 32,
              backgroundColor: COLORS.colorWhiteFull,
              shadowColor: COLORS.colorBlackFull,
              shadowOffset: {width: 2, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 2,
              flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingBottom: 8
            }}
            iconOvalStyle={{
              width: 16, height: 16, marginLeft: 16
            }}
            textAddress={{
              color: '#1C1C1C', flex: 1
            }}
          />

          {/* View xác nhận địa chỉ */}
          <TouchableOpacity onPress={() => this._sendAddressToHome()}>
            <View style={[styles.confirmAddressBtn, {backgroundColor: this.state.isMoveMap 
              ? COLORS.colorDarkLight : this._getConfirmButtonBackground(),}]}>
              <Text
                text={this._getConfirmButtonText().toUpperCase()}
                textStyle={{fontSize: 18, color: COLORS.colorWhiteFull}}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* View marker center */}
        <View
          style={[
            styles.overContainer,
            {
              width: 32,
              height: '100%',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Image
            source={this.mSearchMapViewModel.getImageCenterSource()}
            style={{width: 32, height: 32, marginBottom: 32}}
          />
        </View>
      </View>
    );
  }

  render() {
    return <View style={{flex: 1}}>{this._getMainView()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  overContainer: {
    position: 'absolute',
    // flex: 1,
    display: 'flex',
    width: Dimensions.get('window').width,
    justifyContent: 'center',
  },
  addressTextContainer: {
    flexDirection: 'row',
    borderColor: COLORS.colorGrayLight,
    borderWidth: 0.5,
    borderRadius: 2,
    paddingBottom: 2,
    paddingTop: 2,
    margin: 8,
    backgroundColor: COLORS.colorWhiteFull,
    alignItems: 'center',

    shadowColor: COLORS.colorBlackFull,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  confirmAddressBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 4,

    shadowColor: COLORS.colorBlackFull,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  gpsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderColor: COLORS.colorWhiteMedium,
    marginBottom: 6,
    marginLeft: 34,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8
  },
});
