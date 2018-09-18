import * as React from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";


import AddressSuggest from "./AddressSuggest";
import BookingViewModel from "../../../../viewmodel/booking/BookingViewModel";
import AddressView from "../../../../component/booking/AddressView";
import StartMarker from "../../../../component/booking/home/StartMarker";
import SessionStore from "../../../../Session";
import BAAddress from "../../../../model/BAAddress";
import FocusAddress from "../../../../viewmodel/search/FocusAddress";
import SearchParams, { AddressRequestType } from "../../../../viewmodel/search/SearchParams";
import ScreenName from "../../../../ScreenName";
import SearchView from "../../../../component/search/SearchViewLib";
import { Utils } from "../../../../../module";
import strings from "../../../../../res/strings";
import colors from "../../../res/colors";
import images from "../../../res/images";
import { BookHomeViewType, CarTypeViewPresenter } from "../../../../viewmodel/booking/home/CarTypeViewModel";
import CarTypeViewModel from "./CarTypeViewModel";
import LankmarkNotSupport from "../../../../component/booking/home/LankmarkNotSupport";
const width = Dimensions.get("window").width;

interface Props {
  bookingViewModel: BookingViewModel;
  navigation?;
}

interface State {
  addressSuggest?: Array<any>;
  page: BookHomeViewType;
  bottomHeight: number;
}

/**
 * @author ĐvHiện
 * Created on 27/07/2018
 * @desc Màn hình home
 */
class BookingHomeView extends React.Component<Props, State>
  implements CarTypeViewPresenter {
  private carTypeViewModel: CarTypeViewModel;

  private startMarker: StartMarker;

  constructor(props: Props) {
    super(props);
    this.carTypeViewModel = new CarTypeViewModel(this, props.bookingViewModel);

    props.bookingViewModel.hideHeader();

    this.state = {
      addressSuggest: [],
      page: BookHomeViewType.LANDMARKK_NOT_SUPPORT,
      bottomHeight: 0,
    };

    SessionStore.updateChange = (srcAddress, dstAddress) => this.updateHistory(srcAddress, dstAddress);
  }

  componentDidMount() {
    this.carTypeViewModel.componentDidMount();
  }

  componentWillUnmount() {
    this.carTypeViewModel.componentWillUnmount();
  }


  public showView(page: BookHomeViewType) {
    this.setState({ page: page });
  }

  public setVehicleTypes(vehicleTypes, page?: BookHomeViewType) {
    //TODO: ko làm gì
  }

  public updateSuggestAddress(addresss: Array<any>) {
    if(this.refs.addressSuggestRef != null){
      (this.refs.addressSuggestRef as AddressSuggest).setAddressHistory(addresss);
    }
  };

  /* Cập nhật thời gian ước lượng cho xe gần nhất */
  public updateEstimateTimeMarker(time: string) {
    if (this.startMarker != null) {
      this.startMarker.updateTime(time);
    }
  }

  public updateViewSrcAddress(baAddress: string) {
    if (this.getSrcAddressView() == null) return;
    this.getSrcAddressView().setAddress(baAddress);
  }

  public getSrcAddressView():AddressView{
    return this.refs.srcAddressView as AddressView;
  }

  public getDstAddressView():AddressView{
    return this.refs.dstAddressView as AddressView;
  }

  public updateViewDstAddress(baAddress: string) {
    if (this.getDstAddressView() == null) return;
    this.getDstAddressView().setAddress(baAddress);
  }

  /**
   * click vào tìm kiếm
   * @param focusType
   */
  public toSearch(focusType: FocusAddress) {
    let searchParams = new SearchParams();
    searchParams.focusAddress = focusType;
    searchParams.srcAddress = this.carTypeViewModel.getBookTaxiModel().srcAddress;
    searchParams.dstAddress = this.carTypeViewModel.getBookTaxiModel().dstAddress;
    if (this.carTypeViewModel && this.carTypeViewModel.main) {
      searchParams.gpsLatLng = this.carTypeViewModel.main.getCurrentLatLng();
    }
    if (!Utils.isNull(this.carTypeViewModel.getBookTaxiModel().landmark)) {
      searchParams.requestType = this.carTypeViewModel.getBookTaxiModel().landmark.addressSource;
    } else {
      searchParams.requestType == AddressRequestType.GOOGLE;
    }

    this.props.navigation.navigate(ScreenName.SEARCH_ADDRESS, {
      [SearchView.SEARCH_PARAMS]: searchParams,
      onNavigateResult: (srcAddress: BAAddress, dstAddress?: BAAddress) =>
        this.update(srcAddress, dstAddress)
    });
  }

  public update(srcAddress: BAAddress, dstAddress?: BAAddress) {
    // console.log("update $$$$$$$$$$$$$$$$", srcAddress, dstAddress);
    // Cập nhật thông tin điểm đi
    this.carTypeViewModel.updateSourceAddressBySearch(srcAddress);

    if (!Utils.isNull(dstAddress) && !Utils.isEmpty(dstAddress.formattedAddress)
      && !Utils.isOriginLocation(dstAddress.location)) {
      // Cập nhật thông tin điểm đến
      this.carTypeViewModel.updateDstAddress(dstAddress);
      this.getDstAddressView().setInfo(dstAddress.formattedAddress, this.getDstRightIcon());

      // chuyển sang cofirm như app Grab
      this.carTypeViewModel.toConfirmBook();
    }
  }

  public updateHistory(srcAddress: BAAddress, dstAddress: BAAddress) {
    // this.update(srcAddress, FocusAddress.A_FOCUS);
    // this.update(dstAddress, FocusAddress.B_FOCUS);
    this.update(srcAddress, dstAddress);
    // this.carTypeViewModel.toConfirmBook();
  }

  private getDstRightIcon() {
    return this.carTypeViewModel.getBookTaxiModel().isValidDstAddress()
      ? images.ic_cancel
      : null;
  }

  // Xóa điểm đến, xóa marker điểm đến
  private clearDstAddress() {
    this.carTypeViewModel.removeEndMarker();
    this.carTypeViewModel.getBookTaxiModel().dstAddress = new BAAddress();
    this.getDstAddressView().setInfo(
      strings.search_address_to,
      this.getDstRightIcon()
    );
  }

  /**@override*/
  public updateEstimateTime(time: string) {

  }

  private renderView(page: BookHomeViewType) {
    switch (page) {
      case BookHomeViewType.LANDMARKK_NOT_SUPPORT:
        return (
          <LankmarkNotSupport
            bookingViewModel={this.props.bookingViewModel}
            navigation={this.props.navigation}
          />
        );
      default:
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View style={styles.addressLayout}>
              <AddressView
                ref="srcAddressView"
                address={this.carTypeViewModel.main.getDefaultSrcAddressName()}
                title={strings.book_address_from}
                leftIcon={images.ic_src_oval}
                rightIcon={images.ic_search_header}
                showRightSeperate
                onPress={() => {
                  this.toSearch(FocusAddress.A_FOCUS);
                }}
                onRightIconPress={() => {
                  this.toSearch(FocusAddress.A_FOCUS);
                }}
                editable={false}
              />

              <View style={{ backgroundColor: "#EEEEEE", height: 1, marginLeft: 40 }} />

              <AddressView
                ref="dstAddressView"
                address={this.carTypeViewModel.main.getDefaultDstAddressName()}
                rightIcon={this.getDstRightIcon()}
                rightStyle={{ tintColor: colors.colorSub }}
                title={strings.book_address_to}
                leftIcon={images.ic_dst_oval}
                onPress={() => {
                  this.toSearch(FocusAddress.B_FOCUS);
                }}
                style={{ marginTop: 0 }}
                onRightIconPress={() => this.clearDstAddress()}
                editable={false}
              />

              <View style={{ backgroundColor: colors.colorMain, width: 1, height: 20, marginLeft: 20, marginTop: 33, position: "absolute" }} />

              <View style={{ flex: 1, paddingLeft: 8, paddingRight: 8, flexDirection: "row" }}>
                <AddressSuggest
                  ref="addressSuggestRef"
                  carTypeViewModel={this.carTypeViewModel}
                  navigation={this.props.navigation}
                />
              </View>

            </View>
          </View>
        );
    }
  }

  render() {

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View style={{ width: width, alignItems: "flex-start", justifyContent: "flex-start", position: "absolute", zIndex: 2, top: 0 }}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.openDrawer();
          }} style={{
            width: 44,
            height: 44,
            margin: 12,
          }}>
            <Image
              source={images.ic_menu_home}
              resizeMode="contain"
              style={{
                width: 44,
                height: 44
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: width
          }}
        >
          <View style={{ width: width, flexDirection: "row", padding: 10, alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "white",
                borderColor: colors.colorWhiteMedium,
                borderWidth: 1,
                left: 0,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8
              }}
              onPress={() => { this.carTypeViewModel.clickMyLocation() }}
            >
              <Image
                source={images.ic_my_location}
                resizeMode="contain"
                style={{
                  width: 28,
                  height: 28,
                  padding: 8,
                  // tintColor: colors.colorGray
                }}
              />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              onPress={() => { this.carTypeViewModel.toConfirmBook() }}
              style={{ width: 56, height: 56, alignItems: 'flex-end', justifyContent: 'flex-end', right: 0 }}>
              <Image
                resizeMode='contain'
                source={images.book_bkg}
                style={{ width: 56, height: 56 }} />
            </TouchableOpacity>
          </View>

          {this.renderView(this.state.page)}
        </View>

        {/* ImageView marker center */}
        <Image
          source={images.ic_marker_start}
          style={{ width: 32, height: 32 }}
        />
      </View>
    );
  }
}

export default BookingHomeView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: 'white'
  },
  icon: {
    width: 48,
    height: 48,
  },
  addressLayout: {
    bottom: 0,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    shadowRadius: 5,
    width: '96%',
    marginLeft: "2%",
    marginRight: "2%",
    shadowColor: '#898989',
    shadowOpacity: 0.8,
    shadowOffset: { height: 2, width: 2 },
    height: 128,
    elevation: 3
  },
  overContainer: {
    position: 'absolute',
    flex: 1,
    display: 'flex',
    width: '100%',
    height: '100%',
  },
});
