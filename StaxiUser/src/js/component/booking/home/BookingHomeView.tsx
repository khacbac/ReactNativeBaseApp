/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-11 02:22:00
 * @modify date 2018-09-11 02:22:00
 * @desc [Xử lý giao diện cho màn hình home và confirm]
*/
import * as React from "react";



import {
  StyleSheet,
  View,
  Dimensions
} from "react-native";

import BookingViewModel from "../../../viewmodel/booking/BookingViewModel";
import AddressView from "../AddressView";
import strings from "../../../../res/strings";
import images from "../../../../res/images";
import colors from "../../../../res/colors";
import CarTypeViewModel, {
  CarTypeViewPresenter,
  BookHomeViewType
} from "../../../viewmodel/booking/home/CarTypeViewModel";
import LankmarkNotSupport from "./LankmarkNotSupport";
import CarTypeView from "./CarTypeView";
import BAAddress from "../../../model/BAAddress";
import SearchParams, { AddressRequestType } from "../../../viewmodel/search/SearchParams";
import ScreenName from "../../../ScreenName";
import { ButtonIconOnMap, Utils } from "../../../../module";
import SearchViewLib from "../../search/SearchViewLib";
import FocusAddress from "../../../viewmodel/search/FocusAddress";
import Constants from "../../../constant/Constants";
const { width, height } = Dimensions.get("window");

interface Props {
  bookingViewModel: BookingViewModel;
  navigation?;
}

interface State {
  vehicleTypes?: Function;
  page: BookHomeViewType;
}

class BookingHomeView extends React.Component<Props, State>
  implements CarTypeViewPresenter {
  private carTypeViewModel: CarTypeViewModel;

  /** địa chỉ đi*/
  private srcAddressView: AddressView;

  /** địa chỉ đến*/
  private dstAddressView: AddressView;

  /** đối tượng loại xe */
  private carTypeView: CarTypeView;

  // private startMarker: StartMarker;

  constructor(props: Props) {
    super(props);
    this.carTypeViewModel = new CarTypeViewModel(this, props.bookingViewModel);
    props.bookingViewModel.showMenuHeader();

    this.state = {
      vehicleTypes: () =>[],
      page: BookHomeViewType.LANDMARKK_NOT_SUPPORT,
    };
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

  updateSuggestAddress(suggestAddress?: Array<any>){}

  public setVehicleTypes(vehicleTypes, page?: BookHomeViewType) {
    // Kiểm tra view nếu đã tồn tại rồi thì chỉ update loai xe nếu có
    if (this.carTypeView != undefined) {
      this.carTypeView.updateVehicles(vehicleTypes);
    } else {
      this.setState({ page: page, vehicleTypes: () => vehicleTypes });
    }
  }
  

  /**
   * cập nhật địa chỉ đi
   * @param formattedAddress 
   */
  public updateViewSrcAddress(formattedAddress: string) {
    if(this.srcAddressView == null) return;
    this.srcAddressView.setAddress(formattedAddress);
  }

  /**
   * cập nhật địa chỉ đến
   * @param baAddress 
   */
  public updateViewDstAddress(formattedAddress: string) {
    if(this.dstAddressView == null) return;
    this.dstAddressView.setInfo(formattedAddress, this.getDstRightIcon());
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
          <CarTypeView
            ref={ref => {
              this.carTypeView = ref;
            }}
            carTypeViewModel={this.carTypeViewModel}
            navigation={this.props.navigation}
            vehicleTypes={this.state.vehicleTypes && this.state.vehicleTypes()}
          />
        );
    }
  }

  /**
   * click vào tìm kiếm
   * @param focusType
   */
  public toSearch(focusType: FocusAddress) {
    let baAddress;

    if (focusType == FocusAddress.B_FOCUS) {
      baAddress = this.carTypeViewModel.getBookTaxiModel().dstAddress;
    } else {
      baAddress = this.carTypeViewModel.getBookTaxiModel().srcAddress;
    }

    let searchParams = new SearchParams();
    searchParams.focusAddress = focusType;
    // tọa độ địa chỉ trước đây
    if (baAddress) {
      searchParams.gpsLatLng = baAddress.location;
    }
    // nếu tọa độ 0,0 thì lấy tọa độ gps
    if (Utils.isOriginLocation(searchParams.gpsLatLng)) {
      searchParams.gpsLatLng = this.carTypeViewModel.main.getCurrentLatLng();
    }
    if (this.carTypeViewModel && this.carTypeViewModel.main) {
      searchParams.gpsLatLng = this.carTypeViewModel.main.getCurrentLatLng();
    }
    if (!Utils.isNull(this.carTypeViewModel.getBookTaxiModel().landmark)) {
      searchParams.requestType = this.carTypeViewModel.getBookTaxiModel().landmark.addressSource;
    } else {
      searchParams.requestType == AddressRequestType.GOOGLE;
    }

    this.props.navigation.navigate(ScreenName.SEARCH_ADDRESS, {
      [SearchViewLib.SEARCH_PARAMS]: searchParams,
      onNavigateResult: (newAddress, focusType) =>
        this.update(newAddress, focusType)
    });
  }

  /**
   * Xử lý khi back từ trang tìm kiếm địa chỉ
   * @param {*} baAddress
   * @param {*} focusType
   */
  public update(baAddress: BAAddress, focusType: FocusAddress) {
    if (!baAddress) {
      return;
    }
    if (focusType == FocusAddress.A_FOCUS) {
      //cập nhật model
      this.carTypeViewModel.updateSourceAddressBySearch(baAddress);

    } else if (focusType == FocusAddress.B_FOCUS) {
      //cập nhật model
      this.carTypeViewModel.updateDstAddress(baAddress);
    }
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
    this.dstAddressView.setInfo(
      strings.search_address_to,
      this.getDstRightIcon()
    );
  }

  render() {

    return (
      <View
        style={{
          justifyContent: "space-between",
          height: "100%",
          alignItems: "center",
          width: "100%"
        }}
      >
        <View style={styles.addressLayout}>
          <AddressView
            ref={ref => {
              this.srcAddressView = ref;
            }}
            address={this.carTypeViewModel.main.getDefaultSrcAddressName()}
            title={strings.book_address_from}
            titleStyle={{
							color:colors.colorMain
						}}
            leftIcon={images.ic_oval}
						leftIconStyle={{ tintColor: colors.colorMain }}
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

          <AddressView
            ref={ref => {
              this.dstAddressView = ref;
            }}
            address={this.carTypeViewModel.main.getDefaultDstAddressName()}
            rightIcon={this.getDstRightIcon()}
            rightStyle={{ tintColor: colors.colorSub }}
            title={strings.book_address_to}
            titleStyle={{
							color:colors.colorSub
						}}
						leftIcon={images.ic_oval}
						leftIconStyle={{ tintColor: colors.colorSub }}
            onPress={() => {
              this.toSearch(FocusAddress.B_FOCUS);
            }}
            style={{ marginTop: 6 }}
            onRightIconPress={() => this.clearDstAddress()}
            editable={false}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: width,
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
        >
          <ButtonIconOnMap
            onPress={() => this.carTypeViewModel.clickMyLocation()}
          />
          
          {this.renderView(this.state.page)}
        </View>

        {/* View marker center */}
        {/* <View
          style={[
            styles.overContainer,
            {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Image
            source={this.getImageCenterSource()}
            style={{ width: 32, height: 32, marginBottom: 32 }}
          />
        </View> */}
      </View>
    );
  }
}

export default BookingHomeView;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    backgroundColor: "white"
  },
  carTypeBkg: {
    width: "100%",
    height: 144,
    shadowColor: "#898989",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  carTypeSubBtn: {
    width: "94%",
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "white",
    shadowColor: "#898989",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    borderWidth: 1,
    borderColor: "#CCCCCC"
  },
  icon: {
    width: 48,
    height: 48
  },
  addressLayout: {
    width: width - 20,
    // borderRadius: 8,
    backgroundColor: "transparent",
    marginTop: 6,
    shadowRadius: 5,
    position: "absolute"
  },
  overContainer: {
    position: "absolute",
    flex: 1,
    display: "flex",
    width: "100%",
    height: "100%"
  }
});
