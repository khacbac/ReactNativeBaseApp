import * as React from "react";

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import IMAGES from '../../../../res/images';
import COLORS from '../../../../res/colors';
import STRINGS from '../../../../res/strings';

import { Text, Utils, NativeAppModule, LatLng, LifeComponent } from '../../../../module';
import BAAddress from '../../../model/BAAddress';

import MapView from 'react-native-maps';
import { withNavigationFocus } from 'react-navigation';
import SearchMapViewModel from "../../../viewmodel/search/geocoding/SearchMapViewModel";
import { ISearchMapPresenter } from "../../../viewmodel/search/geocoding/ISearchMapPresenter";
import AddressDetailView from "./AddressDetailView";

interface Props {
  navigation;
  screenProps;
  isFocused;
}

interface State {
  currentAddress: BAAddress;
}
class MapSearchTabViewLib extends LifeComponent<Props, State> implements ISearchMapPresenter{
  protected mSearchMapViewModel: SearchMapViewModel;

  private mMapView: MapView;

  /** Cờ trạng thái có đang request địa chỉ */
  private isRequesting: boolean = false;

  constructor(props) {
    super(props);

    this.mSearchMapViewModel = new SearchMapViewModel(this, props.screenProps.searchParams, NativeAppModule.KEY_MAP);

    this.state = {
      currentAddress: new BAAddress(),
    };
  }

  /**
   * React Navigation emits events to screen components that subscribe to them:

    willBlur - the screen will be unfocused
    willFocus - the screen will focus
    didFocus - the screen focused (if there was a transition, the transition completed)
    didBlur - the screen unfocused (if there was a transition, the transition completed)
   */
  componentDidMount() {
    super.componentDidMount();

    this.props.navigation.addListener('didFocus', this._onFocus);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    this.props.navigation.removeListener('didFocus', this._onFocus);
  }

  _onFocus = () => {
    // Không cho phép hiển thị button search trên toolbar
    this.props.screenProps.SearchHome.setAllowShowSearchView(false);
  };

  /** @override */
  public updateAddress(baAddress: BAAddress, requestCoordinate: LatLng) {
    this.setState({
      currentAddress: baAddress,
    });

    let formattedAddress: string = baAddress ? baAddress.formattedAddress : "";
    this.setAddressViewRequestingState(false, formattedAddress);

    this.isRequesting = false;
  }

  /** @override */
  public onGetGPSLocationError() {
    this.mSearchMapViewModel.showToastMsg(STRINGS.gps_network_not_get_location);
  }

  /** Xử lý khi move map complete */
  protected onRegionChangeComplete(region) {
    // region: {longitudeDelta: 0.00474918633697996, latitudeDelta: 0.005578822171674602,
    // longitude: 105.84227560088038, latitude: 20.997476214550915}
    // console.log('============================= on region changeeeeeeeeeeeeeeeeee')

    if (!this.isMouted) {
      return;
    }

    // Lưu trạng thái đang request địa chỉ
    this.isRequesting = true;

    // đổi text trạng thái đang loadding địa chỉ
    this.setAddressViewRequestingState(true, null);

    // Gọi hàm lấy địa chỉ từ server
    this.mSearchMapViewModel.onRegionChangeComplete(region);
  }

  /** Gửi địa chỉ tới màn hình home và back về */
  protected onConfirmAddressButtonClicked() {
    if (this.isRequesting) {
      this.mSearchMapViewModel.showToastMsg(STRINGS.address_loadding);
      return;
    }

    if (!this.state.currentAddress) {
      this.mSearchMapViewModel.showToastMsg(STRINGS.no_address);
      return;
    }

    this.props.screenProps.setAddress(this.state.currentAddress);
  }

  /** Set trạng thái đang load địa chỉ */
  protected setAddressViewRequestingState(isRequesting: boolean, currentAddress: string) {
    let addressDetail = this.refs.AddressDetailOverMapRefs as AddressDetailView;

    if (Utils.isNull(addressDetail)) return;
    
    addressDetail.setInfo(isRequesting, currentAddress);
  }

  _getMainView() {
    return (
      <View style={styles.container}>
        {/* map view */}
        <MapView
          ref={(ref) => { this.mMapView = ref }}
          style={styles.mapContainer}
          provider="google"
          showsUserLocation={true}
          initialRegion={{
            latitude: this.mSearchMapViewModel.getInitMapLocation().latitude,
            longitude: this.mSearchMapViewModel.getInitMapLocation().longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
          }
          onRegionChangeComplete={region => {
            this.onRegionChangeComplete(region);
          }}
        />
        {/* View chọn địa chỉ nổi ở trên map */}
        <AddressDetailView
          ref="AddressDetailOverMapRefs"
          focusAddress={this.mSearchMapViewModel.getFocusAddress()}
          isShowHeader={true}
        />

        {/* View button gps va nut xac nhan dia chi */}
        <View style={[styles.overContainer, { bottom: 0, }]}>
          {/* View button GPS */}
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flex: 1,
              marginRight: 8,
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

          {/* View xác nhận địa chỉ */}
          <TouchableOpacity onPress={() => this.onConfirmAddressButtonClicked()}>
            <View style={styles.confirmAddressBtn}>
              <Text
                text={STRINGS.search_address_to_confirm.toUpperCase()}
                textStyle={{ fontSize: 18, color: COLORS.colorSub }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* View marker center */}
        <View
          style={[
            styles.overContainer,
            {
              width: 0,
              height: '100%',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Image
            source={this.mSearchMapViewModel.getImageCenterSource()}
            style={{ width: 32, height: 32, marginBottom: 32 }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this._getMainView()}
        {/* <Text text="Map search"/> */}
      </View>
    );
  }
}

export default withNavigationFocus(MapSearchTabViewLib);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overContainer: {
    position: 'absolute',
    // flex: 1,
    display: 'flex',
    width: Dimensions.get('window').width,
    justifyContent: 'center'
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  confirmAddressBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.colorWhiteFull,
    margin: 8,
    borderColor: COLORS.colorSub,
    borderRadius: 2,
    borderWidth: 0.5,

    shadowColor: COLORS.colorBlackFull,
    shadowOffset: { width: 2, height: 2 },
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
