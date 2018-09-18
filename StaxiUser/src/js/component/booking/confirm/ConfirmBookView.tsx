/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-20 05:48:40
 * @modify date 2018-07-20 05:48:40
 * @desc [Lớp xác nhận đặt xe]
 */

import * as React from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  EmitterSubscription,
} from "react-native";
import {
  Button,
  HorizontalIconTextButton,
  Text,
  Image,
  Utils,
  ButtonIconOnMap,
  PlatformOS
} from "../../../../module";
import BookingViewModel from "../../../viewmodel/booking/BookingViewModel";
import ConfirmBookModel from "../../../viewmodel/booking/confirm/ConfirmBookModel";
import BookTaxiModel from "../../../viewmodel/booking/BookTaxiModel";
import AddressView from "../AddressView";
import BAAddress from "../../../model/BAAddress";

import fonts from "../../../../res/fonts";
import dimens from "../../../../res/dimens";
import strings from "../../../../res/strings";
import images from "../../../../res/images";
import colors from "../../../../res/colors";
import SessionStore from "../../../Session";
import ConfirmBookPresenter from "../../../viewmodel/booking/confirm/ConfirmBookPresenter";

const { width, height } = Dimensions.get("window");

interface Props {
  bookingViewModel: BookingViewModel;
  navigation;
}

interface State {
  estimate: string;
  distance: string;
  taxiTypeName: string;
  vehicleWithPrice: Array<any>;
  focusInput: boolean;
  // mã khuyến mại
  promotion: string;
  promotionColor: string;
  // thời gian đặt lịch.
  mTimeSchedule: string;
  // hiển thị ước lượng.
  showEstimate: boolean;
  // Focus TextInput điểm đón
  autoSrcFocus: boolean;

  // srcAddress: string
}

class ConfirmBookView extends React.Component<Props, State> implements ConfirmBookPresenter {
  public bookingViewModel: BookingViewModel;

  public bookTaxiModel: BookTaxiModel;

  public confirmBookModel: ConfirmBookModel;

  private animatedValue: Array<any>;

  /** địa chỉ đi*/
  private srcAddressView: AddressView;

  /** địa chỉ đến*/
  private dstAddressView: AddressView;

  /** mã khuyến mãi */
  private promotionIconTextButton: HorizontalIconTextButton;

  /** mã ghi chú */
  private commentIconTextButton: HorizontalIconTextButton;

  /** mã loại xe */
  private taxiTypeIconTextButton: HorizontalIconTextButton;

  /** mã đặt lịch */
  private timeScheduleIconTextButton: HorizontalIconTextButton;

  private keyboardDidHideListener: EmitterSubscription;

  /** chiều cao của layout top: bao gồm 2 giao diện địa chỉ*/
  private topHeight: number;

  /** chiều cao của layout bottom: thông tin confirm*/
  private bottomHeight: number;

  constructor(props) {
    super(props);
    this.bookingViewModel = this.props.bookingViewModel;
    this.bookTaxiModel = this.bookingViewModel.getBookTaxiModel();
    this.confirmBookModel = new ConfirmBookModel(this, this.bookingViewModel);
    this.bookingViewModel.showBackHeader("", () =>
      this.confirmBookModel.clickHeaderBack()
    );

    this.animatedValue = [];
    this.animatedValue[0] = new Animated.Value(0);
    this.animatedValue[1] = new Animated.Value(0);
    this.animatedValue[2] = new Animated.Value(0);

    this.state = {
      estimate: "",
      distance: "",
      taxiTypeName: this.bookTaxiModel.getVehicleType().getName(),
      vehicleWithPrice: [],
      focusInput: true,
      // mã khuyến mại
      promotion: strings.book_confirm_promotion,
      promotionColor: colors.colorGray,
      // thời gian đặt lịch.
      mTimeSchedule: SessionStore.isScheduleBooking() ? strings.alarm_was_schedule_booking : strings.book_alarm_waiting_title,
      // hiển thị ước lượng.
      showEstimate: false,
      // điểm đón.
      autoSrcFocus: false
    };
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.confirmBookModel.componentWillUnmount();
  }

  // Keyboard hide.
  private _keyboardDidHide = (): void => {
    this._clearSrcAddressFocus();
  };

  /**
   * @override
   * Khởi tạo giá trị thông tin đặt lịch.
   */
  public initialScheduleInfo(mTimeSchedule: string): void {
    // this.setState({ mTimeSchedule: mTimeSchedule });
    if (this.timeScheduleIconTextButton != null)
      this.timeScheduleIconTextButton.setText(mTimeSchedule);
  }

  // action tạo animation cho right icon view bảng giá ước lượng.
  animate() {
    this.animatedValue[0].setValue(0);
    this.animatedValue[1].setValue(0);
    this.animatedValue[2].setValue(0);

    Animated.sequence([
      Animated.timing(this.animatedValue[0], {
        toValue: 1,
        duration: 0
      }),
      Animated.timing(this.animatedValue[1], {
        toValue: 1,
        duration: 500
      }),
      Animated.timing(this.animatedValue[2], {
        toValue: 1,
        duration: 500
      })
    ]).start(() => this.animate());
  }

  /**
   * @override
   * Cập nhật view ước lượng,khoảng cách.
   */
  public updateEstimateInfo(estimate: string, taxiTypeName: string): void {
    this.setState({
      estimate: estimate
      // taxiTypeName: taxiTypeName,
    });

    // Cập nhật lại tên loại xe đã chọn.
    if (this.taxiTypeIconTextButton != null)
      this.taxiTypeIconTextButton.setText(taxiTypeName);
  }

  /**
   * @override
   * Xử lý khi chọn thời gian đặt lịch.
   */
  public setConfirmSchedule = (mTimeSchedule: string) => {
    // this.setState({ mTimeSchedule });
    if (this.timeScheduleIconTextButton != null)
      this.timeScheduleIconTextButton.setText(mTimeSchedule);
  };

  public updateViewSrcAddress(baAddress?: BAAddress) {
    if (this.srcAddressView == null) {
      return;
    }

    if (Utils.isNull(baAddress)) {
      this.srcAddressView.setInfo(strings.no_address, null);
      return;
    }
    this.bookTaxiModel.srcAddress = baAddress;
    this.srcAddressView.setAddress(baAddress.formattedAddress);
  }

  /**
   * @override
   * Màn hình chi tiết đặt lịch.
   */
  // public showScheduleFragment() {
  // 	this.bookingViewModel.showDialogFragment(<ScheduleFragment confirmBookModel={this.confirmBookModel} />)
  // }

  /**
   * @override
   * Ước lượng giá và lộ trình.
   */
  public estimatePrice = (
    isShowEstimate: boolean,
    estimates: string,
    distanceAB: string,
    dstAddress: BAAddress
  ): void => {
    if (isShowEstimate) {
      this.animate();
    }

    this.setState({
      showEstimate: isShowEstimate,
      estimate: estimates,
      distance: distanceAB
    });

    let dstFormatAddress = dstAddress.formattedAddress;
    if (Utils.isEmpty(dstFormatAddress)) {
      dstFormatAddress = strings.search_address_to;
    }

    if (this.dstAddressView != null)
      this.dstAddressView.setInfo(
        dstFormatAddress,
        isShowEstimate ? images.ic_cancel : null
      );
  };

  // Lấy icon cho loại xe với name
  getIconCar = iconName => {
    let arr = Object.keys(images);
    let item;
    for (let i = 0; i <= arr.length; i++) {
      item = arr[i];
      if (iconName === item) {
        return images[item];
      }
    }
  };

  // Cho phép nhập lại edittext
  _focusAddressEdit() {
    let selection;
    // let selectionAddress = " " + this.srcAddressView.getAddress();
    // this.srcAddressView.setAddress(selectionAddress, () => {
    // Focus vào sau số nhà nếu có
    if (
      !this.srcAddressView.isFocusInput() &&
      this.bookTaxiModel.srcAddress.fields[BAAddress.NUMBER] != null &&
      !(this.bookTaxiModel.srcAddress.fields[BAAddress.NUMBER] === "")
    ) {
      selection = {
        start: this.bookTaxiModel.srcAddress.fields[BAAddress.NUMBER].length
      };
    } else {
      if (PlatformOS.ios()) {
        selection = { start: 1 };
      } else {
        selection = { start: 0 };
      }
    }
    this.srcAddressView.setEditable(true, true, selection);
    // })
  }

  // Xóa focus trên text input.
  _clearSrcAddressFocus() {
    // this.srcAddressView.setAddress(this.srcAddressView.getAddress());
    this.srcAddressView.setEditable(false, false);
  }

  getRightIcon() {
    return this.bookTaxiModel.isValidDstAddress() ? images.ic_cancel : null;
  }

  /**
   * @override
   * Hiển thị mã khuyến mại  
   */
  public setPromotionText(): void {
    let pmTxt = this.bookTaxiModel.isValidPromotion() ? this.bookTaxiModel.promotion : strings.book_confirm_promotion;
    let pmTxtColor = this.bookTaxiModel.isValidPromotion() ? colors.colorBlackFull : colors.colorGray;
    if (this.promotionIconTextButton != null) {
      this.promotionIconTextButton.setText(pmTxt);
      this.promotionIconTextButton.setTextStyle({
        color: pmTxtColor
      });
    }
  }

  getTopHeight(): number {
    return this.topHeight || 100;
  }

  getBottomHeight(): number {
    return this.bottomHeight || 200;
  }

  /**
   * @override
   * Hiển thị ghi chú.
   */
  public setConfirmNoteText(): void {
    if (this.commentIconTextButton == null) return;
    if (this.bookTaxiModel.isValidComment()) {
      this.commentIconTextButton.setText(this.bookTaxiModel.comment);
      this.commentIconTextButton.setTextStyle({ color: colors.colorBlackFull });
    } else {
      this.commentIconTextButton.setText(strings.book_notes_hint_button);
      this.commentIconTextButton.setTextStyle({ color: colors.colorGray });
    }
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        {/* <View style={{
			width: width,
			// borderRadius: 8,
			// backgroundColor: "transparent",
			marginTop: dimens.address_view_padding_container,
			position: 'absolute',
		}}>


		</View> */}
        <View style={styles.addressLayout} onLayout={(evt => this.topHeight = evt.nativeEvent.layout.height)}>
          <AddressView
            ref={ref => {
              this.srcAddressView = ref;
            }}
            style={{
              borderWidth: dimens.dimen_zero,
            }}
            address={this.confirmBookModel.rModel.srcAddress.formattedAddress}
            rightIcon={images.ic_edit}
            showRightSeperate={false}
            title={strings.book_address_from}
            titleStyle={{
              color: colors.colorMain
            }}
            leftIcon={images.ic_oval}
            leftIconStyle={{ tintColor: colors.colorMain }}
            editable={false}
            disabled={true}
            onPress={() => this._focusAddressEdit()}
            onRightIconPress={() => this._focusAddressEdit()}
            onChangeText={(text) => this.srcAddressView.setAddress(text)}
            onSubmitEditing={() => this._clearSrcAddressFocus()}
          />

          <View
            style={{ height: dimens.border_width, marginLeft: dimens.dimen_fourty, backgroundColor: colors.colorGrayLight }}
          />

          <AddressView
            ref={ref => {
              this.dstAddressView = ref;
            }}
            style={{
              borderWidth: dimens.dimen_zero,
              // marginTop: dimens.address_view_padding_container
            }}
            rightIcon={this.getRightIcon()}
            onRightIconPress={() => this.confirmBookModel.estimateDstRightIconClick()}
            showRightSeperate={false}
            rightStyle={{ tintColor: colors.colorSub }}
            address={this.confirmBookModel.main.getDefaultDstAddressName()}
            title={strings.book_address_to}
            titleStyle={{
              color: colors.colorSub
            }}
            leftIcon={images.ic_oval}
            leftIconStyle={{ tintColor: colors.colorSub }}
            editable={false}
          />
        </View>

        <View style={{ position: 'absolute', bottom: 0, width: width }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
            <ButtonIconOnMap
              onPress={() => this.confirmBookModel.actionLocationBtn()}
            />

          </View>
          <View style={styles.container} onLayout={(evt => this.topHeight = evt.nativeEvent.layout.height)}>
            {/* estimate view */}
            {this.state.showEstimate && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.confirmBookModel.actionEstmateDialog();
                  }}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: dimens.promotion_space_button,
                    borderWidth: 0,
                    borderBottomWidth: dimens.divider,
                    borderBottomColor: colors.colorGrayLight,
                    marginLeft: dimens.confirm_book_view_padding_left,
                    marginRight: dimens.confirm_book_view_padding_left,
                  }}
                >
                  <Image
                    source={images.ic_estimation_large}
                    imgStyle={{
                      marginHorizontal: dimens.margin_horizontal_icon_input,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      text={this.state.estimate}
                      textStyle={{
                        fontSize: fonts.body_2,
                        color: colors.colorDarkMain
                      }}
                    />
                    <Text
                      text={strings.distance + this.state.distance}
                      textStyle={{
                        fontSize: fonts.body_2,
                        color: colors.colorDarkMain
                      }}
                    />
                  </View>

                  {/* right animation */}
                  <View style={{ height: dimens.confirm_book_view_animate_icon_width, width: dimens.confirm_book_view_animate_icon_height, alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.Image
                      source={images.anim_book_one}
                      style={{
                        // marginHorizontal: 8,
                        tintColor: null,
                        width: dimens.size_icon_input,
                        height: dimens.size_icon_input,
                        position: 'absolute',
                        opacity: this.animatedValue[0],
                      }}
                    />

                    <Animated.Image
                      source={images.anim_book_two}
                      style={{
                        // marginHorizontal: 8,
                        tintColor: null,
                        width: dimens.size_icon_input,
                        height: dimens.size_icon_input,
                        position: 'absolute',
                        opacity: this.animatedValue[1],
                      }}
                    />

                    <Animated.Image
                      source={images.anim_book_three}
                      style={{
                        // marginHorizontal: 8,
                        tintColor: null,
                        width: dimens.size_icon_input,
                        height: dimens.size_icon_input,
                        position: 'absolute',
                        opacity: this.animatedValue[2],
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {/* view indicator */}
                {/* <View style={styles.indicatorLeft} /> */}
              </View>
            )}

            {/* promotion and note view */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                {/* Mã khuyến mại */}
                <HorizontalIconTextButton
                  ref={ref => {
                    this.promotionIconTextButton = ref;
                  }}
                  text={this.state.promotion}
                  textStyle={{
                    color: this.state.promotionColor,
                  }}
                  container={{
                    backgroundColor: colors.colorWhiteFull,
                    marginLeft: dimens.promotion_space_button,
                    borderBottomWidth: dimens.divider,
                    borderBottomColor: colors.colorGrayLight,
                  }}
                  iconStyle={{
                    tintColor: colors.colorMain,
                  }}
                  icon={images.ic_sale}
                  onPress={() => this.confirmBookModel.actionPromotionCodeBtn()}
                />
                {/* <View style={styles.indicatorLeft} /> */}
              </View>

              <View style={{ width: dimens.promotion_space_button }} />

              {/* Thêm ghi chú */}
              <View style={{ flex: 1 }}>
                <HorizontalIconTextButton
                  ref={ref => {
                    this.commentIconTextButton = ref;
                  }}
                  text={strings.book_notes_hint_button}
                  textStyle={{ color: colors.colorGray }}
                  container={{
                    backgroundColor: colors.colorWhiteFull,
                    marginRight: dimens.promotion_space_button,
                    borderBottomWidth: dimens.divider,
                    borderBottomColor: colors.colorGrayLight,
                  }}
                  iconStyle={{
                    tintColor: colors.colorMain,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  icon={images.ic_edit}
                  onPress={() => this.confirmBookModel.actionNotesBtn()}
                />
                {/* <View style={styles.indicatorRight} /> */}
              </View>
            </View>

            {/* car type and book timer view */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                {/* Loại xe */}
                <HorizontalIconTextButton
                  ref={ref => {
                    this.taxiTypeIconTextButton = ref;
                  }}
                  text={this.state.taxiTypeName}
                  textStyle={{
                    color: colors.colorBlackFull,
                  }}
                  container={{
                    backgroundColor: colors.colorWhiteFull,
                    marginLeft: dimens.promotion_space_button,
                    borderBottomWidth: dimens.divider,
                    borderBottomColor: colors.colorGrayLight,
                  }}
                  iconStyle={{
                    resizeMode: 'contain',
                    tintColor: colors.colorMain,
                  }}
                  icon={images.ic_menu_book}
                />
                {/* <View style={styles.indicatorLeft} /> */}
              </View>

              <View style={{ width: dimens.promotion_space_button }} />

              {/* Đặt lịch */}
              <View style={{ flex: 1 }}>
                <HorizontalIconTextButton
                  ref={ref => {
                    this.timeScheduleIconTextButton = ref;
                  }}
                  text={this.state.mTimeSchedule}
                  textStyle={{
                    color: colors.colorBlackFull,
                  }}
                  container={{
                    backgroundColor: colors.colorWhiteFull,
                    marginRight: dimens.promotion_space_button,
                    borderBottomWidth: dimens.divider,
                    borderBottomColor: colors.colorGrayLight,
                  }}
                  iconStyle={{
                    tintColor: colors.colorMain,
                  }}
                  icon={images.ic_alarm}
                  onPress={() => this.confirmBookModel.actionConfirmScheduleBtn()}
                />
                {/* <View style={styles.indicatorRight} /> */}
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              paddingLeft: dimens.confirm_book_view_padding_left,
              paddingRight: dimens.confirm_book_view_padding_left,
              paddingTop: dimens.confirm_book_view_padding_bot,
              paddingBottom: dimens.confirm_book_view_padding_bot,
            }}>
              <Button
                text={strings.btn_call}
                btnStyle={styles.btnCall}
                textStyle={[styles.btnCallTxt]}
                onPress={() => this.confirmBookModel.actionCall()}
              />
              <View style={{ width: dimens.promotion_space_button }} />
              <Button
                text={strings.book_taxi_btn}
                btnStyle={styles.btnBook}
                textStyle={[styles.btnBookTxt]}
                onPress={() => this.confirmBookModel.actionBooking((this.srcAddressView as AddressView).getAddress())}
              />
            </View>
          </View>

        </View>
      </View>
    );
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    this.confirmBookModel.componentDidMount();

  }
}

export default ConfirmBookView;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    alignItems: "center"
  },
  container: {
    flex: 1,
    // position: "absolute",
    backgroundColor: colors.colorWhiteFull,
    // backgroundColor: 'red',
    // bottom: 0,
    width: width,
    elevation: 5
  },
  indicatorLeft: {
    height: 1,
    backgroundColor: colors.colorGray,
    marginRight: 5,
    marginLeft: 10
  },
  indicatorRight: {
    height: 1,
    backgroundColor: colors.colorGray,
    marginRight: 10,
    marginLeft: 5
  },
  btnCall: {
    flex: 1,
    borderColor: colors.colorSub,
    backgroundColor: colors.colorWhiteFull,
    alignItems: "center",
    borderWidth: dimens.border_width,
    borderRadius: dimens.borderRadius,
    paddingVertical: dimens.btn_padding_confirm_vertical
  },
  btnCallTxt: {
    color: colors.colorSub,
    fontWeight: "bold"
  },
  btnBook: {
    flex: 1,
    borderColor: colors.colorMain,
    backgroundColor: colors.colorMain,
    alignItems: "center",
    borderWidth: dimens.border_width,
    borderRadius: dimens.borderRadius,
    paddingVertical: dimens.btn_padding_confirm_vertical
  },
  btnBookTxt: {
    color: colors.colorWhiteFull,
    fontWeight: "bold"
  },
  addressLayout: {
    // width: width - 20,
    width: width,
    // borderRadius: 8,
    backgroundColor: colors.colorWhiteFull,
    // marginTop: dimens.address_view_padding_container,
    position: "absolute",
    elevation: 5
  },
  addressView: {
    width: "100%",
    // flex:1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: colors.colorWhiteFull,
    borderColor: colors.colorGrayLight,
    borderWidth: dimens.border_width,
    paddingVertical: 2
    // paddingLeft: 10,
  },
  iconNext: {
    width: dimens.size_icon_input,
    height: dimens.size_icon_input,
    marginHorizontal: 10,
    tintColor: null
  },
  iconMenu: {
    width: dimens.size_icon_input_28,
    height: dimens.size_icon_input_28,
    tintColor: colors.colorMain
  }
});
