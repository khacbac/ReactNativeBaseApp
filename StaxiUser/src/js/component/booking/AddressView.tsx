/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 03:32:46
 * @modify date 2018-07-18 03:32:46
 * @desc [Lớp hiện thị địa chỉ]
 */

import * as React from "react";

import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import { Text, TextInput } from "../../../module";

import colors from "../../../res/colors";
import fonts from "../../../res/fonts";
import dimens from "../../../res/dimens";

export interface State {
  address: string;
  rightIcon?: any;
  editable?: boolean;
  focusAddress?: boolean;
  visible?: boolean;
}

export interface Props {
  title: string;
  titleStyle?: any;
  address: string;
  leftIcon?: any;
  leftIconStyle?: any;
  rightIcon?: any;
  onRightIconPress?: Function;
  rightStyle?: any;
  showRightSeperate?: boolean;
  style?: any;
  onPress?: Function;
  editable?: boolean;
  onChangeText?: Function;
  onSubmitEditing?: Function;
  visible?: boolean;
  disabled?: boolean;
  onTouchEnd?: any;
  contentStyle?: any;
}

class AddressView extends React.Component<Props, State> {

  private addressInput: TextInput;
  private addressTextView: Text;

  constructor(props: Props) {
    super(props);
    this.state = {
      address: props.address,
      rightIcon: props.rightIcon,
      editable: props.editable,
      focusAddress: false,
      visible: this.props.visible !== undefined ? this.props.visible : true
    };
  }

  public setVisibility(visible) {
    this.setState({ visible });
  }

  // Lấy địa chỉ.
  public getAddress(): string {
    return this.state.address;
  }

  // Set trạng thái cho phép chỉnh sửa.
  public setEditable(isEdit: boolean, isFocus: boolean, selection?: Object) {
    this.setState({
      editable: isEdit,
      focusAddress: isFocus
    }, () => {
      if (isFocus) {
        this.addressInput && this.addressInput.setFocus(selection)
      } else {
        this.addressInput.unFocus();
      }
    });
  }

  // Kiểm tra focus address input.
  public isFocusInput(): boolean {
    return this.addressInput && this.addressInput.isFocus();
  }

  /**
   * cập nhật view
   * @param address
   * @param rightIcon
   */
  public setInfo(address: string, rightIcon?) {
    // console.log("this.state.rightIcon", rightIcon);
    this.setState({ address: address, rightIcon: rightIcon }, () => {
      this.addressInput && this.addressInput.setText(address);
      this.addressTextView && this.addressTextView.setText(address);
    });
  }

  public setAddress(address: string) {
    this.setState({ address: address }, () => {
      this.addressInput && this.addressInput.setText(address);
      this.addressTextView && this.addressTextView.setText(address);
    });
  }

  _onPress = () => {
    // if (!this.props.enableSearch) return;
    this.props.onPress && this.props.onPress();
  };

  /**
   * hiện thị giao diện icon phải
   */
  renderRightIcon() {
    if (this.state.rightIcon == null) return null;

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.onRightIconPress && this.props.onRightIconPress()
        }
      >
        <Image
          resizeMode="contain"
          style={[
            styles.iconMenu,
            { tintColor: colors.colorMain, padding: 4 },
            this.props.rightStyle
          ]}
          source={this.state.rightIcon}
        />
      </TouchableOpacity>
    );
  }

  /**
   * hiện thị giao diện divider giữa text và icon phải
   */
  private renderRightSeperate() {
    if (!this.props.showRightSeperate || this.state.rightIcon == null)
      return null;
    return (
      <View
        style={{
          height: "80%",
          width: dimens.border_width,
          backgroundColor: colors.colorMain
        }}
      />
    );
  }

  render() {
    return (
      // <TouchableOpacity disabled={this.props.disabled} onPress={() => this._onPress()}>
      <View >
        {this.state.visible &&
          (<View style={[styles.addressView, this.props.style]}>
            {this.props.leftIcon != undefined && (
              <Image
                resizeMode="contain"
                style={[styles.iconNext, this.props.leftIconStyle]}
                source={this.props.leftIcon}
              />
            )}
            <View
              onTouchEnd={() => this._onPress()}
              style={[{
                flex: 1,
                justifyContent: "center",
                // paddingTop: 3
              }, this.props.contentStyle]}
            >
              {/* <Text
                text={this.props.title}
                textStyle={[
                  {
                    color: colors.colorGrayDark,
                    fontSize: fonts.body_2,
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  this.props.titleStyle
                ]}
              /> */}
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <TextInput
                  ref={ref => {
                    this.addressInput = ref
                  }}
                  value={this.state.address}
                  inputStyle={{
                    color: colors.colorBlackFull,
                    fontSize: fonts.body_2,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    borderWidth: 0,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  inputContainer={{
                    position: 'absolute',
                    alignItems: 'center',
                    opacity: this.state.focusAddress ? 1 : 0,
                    // backgroundColor: 'red'
                  }}
                  // autoFocus={true}
                  numberOfLines={1}
                  editable={this.state.editable}
                  onChangeText={this.props.onChangeText}
                  onSubmitEditing={this.props.onSubmitEditing}
                />

                <View style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  opacity: this.state.focusAddress ? 0 : 1,
                }}>
                  <Text
                    ref={ref => {
                      this.addressTextView = ref
                    }}
                    text={this.state.address}
                    textStyle={{
                      color: colors.colorBlackFull,
                      fontSize: fonts.body_2,
                      // position: 'absolute',
                      // width: '100%',
                      // height: '100%',
                      // backgroundColor: 'yellow',
                      // opacity: this.state.focusAddress ? 0 : 1
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                </View>
              </View>
            </View>

            {/* hiện thị divider */}
            {this.renderRightSeperate()}

            {/* Hiện thị icon right */}
            {this.renderRightIcon()}
          </View>)}


      </View>
    );
  }
}

export default AddressView;

const styles = StyleSheet.create({
	addressView: {
		width: '100%',
		height: 42,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 2,
		// backgroundColor: colors.colorWhiteFull,
		// backgroundColor: "red",
		// borderColor: colors.colorGrayLight,
		// borderWidth: dimens.border_width,
		paddingVertical: 2,
	},
	icon: {
		width: dimens.size_icon_input,
		height: dimens.size_icon_input,
		marginRight: 8,
	},
	iconNext: {
		width: dimens.add_left_icon_width,
		height: dimens.add_left_icon_height,
		marginHorizontal: 10,
	},
	iconMenu: {
		width: dimens.size_icon_input_32,
    height: dimens.size_icon_input_32,
		tintColor: colors.colorMain,
	},
});
