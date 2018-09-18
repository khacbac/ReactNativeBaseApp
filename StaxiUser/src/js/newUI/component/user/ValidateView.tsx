import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";


import ValidateViewLibs from "../../../component/user/ValidateView"

import strings from "../../../../res/strings";
import { WithTextInput, Image, Text, HorizontalIconInput, Button } from "../../../../module";
import images from "../../res/images";
import dimens from "../../../../res/dimens";
import fonts from "../../../../res/fonts";
import colors from "../../res/colors";
import { ValidateStyles, RegisterStyles } from "../../../../../../app/styles";
import HorizontalIconInputG from "../../widget/HorizontalIconInputG";

export default class ValidateView extends ValidateViewLibs {

  constructor(props) {
    super(props);
    // this.state = {
    //   timer: strings.user_verify_try_btn,
    //   activeColor: colors.colorGray,
    // };
  }

  render() {
    return (
      <WithTextInput>
        <View style={ValidateStyles.container}>
          {/* <BackHeader
            title={strings.user_verify_title}
            drawerBack={() => this.handleBackButton()}
            inputStyle={styles.text}
          /> */}

          <View style={{ width: "100%", height: "40%" }}>
            <TouchableOpacity style={ValidateStyles.btnBack} onPress={() => this.handleBackButton()}>
              <Image source={images.ic_back_home} imgStyle={{ width: 50, height: 50, tintColor: null }} />
            </TouchableOpacity>

            <Text textStyle={{ margin: dimens.register_margin_txtPhone, textAlign: "center" }} text={strings.accounts_user_active_status} />

            <Text
              textStyle={{
                fontSize: fonts.h6_20,
                fontWeight: "bold",
                color: colors.colorGrayDark,
                textAlign: "center"
              }}
              text={this.user.phone}
            />

            <HorizontalIconInputG
              ref={(ref) => {
                this.focusCode(ref)
              }}
              container={ValidateStyles.containerInput}
              // inputStyle={ValidateStyles.text}
              //iconStyle={{ tintColor: colors.colorGray }}

              icon={images.ic_validate_key}
              keyboardType="phone-pad"
              placeholder={strings.accounts_user_verify_code}
              maxLength={4}
              autoFocus={true}
            />

          </View>

          <View style={{width: "100%", height: "35%"}}>
            <Image resizeMode="center" source={images.logo_hoz_white}
              imgStyle={{
                // backgroundColor:'red',
                width: '100%',
                height:90,
                tintColor: null,
                position:"absolute",
                bottom:0
              }} />
          </View>

          <View style={{
            width: "100%", height: "25%", alignItems: "center", paddingLeft: dimens.register_padding_container,
            paddingRight: dimens.register_padding_container,
          }}>
            <View style={{ width: "100%", height: "50%", alignItems: "center", justifyContent: 'center' }}>
              <Text textStyle={{ textAlign: "center" }} text={strings.account_validate_not_receive} />
              <Button
                btnStyle={{
                  width: "80%",
                  // height: 40,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: null
                }}
                text={this.state.timer}
                textStyle={{ color: colors.colorMain, textAlign: 'center' }}
                borderRadius={0}
                onPress={() => this._onResendCode()}
              />
            </View>

            <Button
              btnStyle={{
                width: "100%",
                backgroundColor: colors.colorMain,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
                bottom: dimens.register_margin_top_btn_footer,
                // marginBottom: dimens.register_margin_top_btn_footer,
                borderWidth: 0,
                borderRadius: dimens.borderRadius,
              }}
              text={strings.book_confirm_title.toUpperCase()}
              textStyle={{ color: 'white' }}
              borderRadius={0}
              onPress={() => {
                this._onValidate();
              }}
            />

          </View>

        </View>
      </WithTextInput>
    );
  }
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white"
//   },
//   containerInput: {
//     marginTop: 20,
//     marginLeft: '8%',
//     marginRight: '8%'
//   },
//   text: {
//     fontSize: fonts.text_size,
//     borderWidth: 1,
//     borderColor: colors.colorGrayLight,
//     borderRadius: 8,
//     height: 45
//   },
//   footer: {
//     flex: 1,
//     marginLeft: dimens.register_margin_txtPhone,
//     marginRight: dimens.register_margin_txtPhone
//   },
//   btnFooter: {
//     bottom: 0,
//     position: "absolute",
//     width: "100%"
//   }
// });
