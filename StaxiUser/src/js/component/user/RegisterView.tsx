import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

import {
  CheckBox,
  Button,
  HorizontalIconInput,
  HorizontalIconTextButton,
  Utils,
  Text,
} from "../../../module";

import colors from "../../../res/colors";
import strings from "../../../res/strings";
import images from "../../../res/images";
import UserModelView, { RegisterCode } from "../../viewmodel/user/UserModelView";
import BackHeader from "../../../module/ui/header/BackHeader";
import fonts from "../../../res/fonts";
import dimens from "../../../res/dimens";
import WithTextInput from "../../../module/ui/WithTextInput";
import Language from "../../../module/model/Language";
import { NativeAppModule } from "../../../module";
import User from "../../sql/bo/User";
import SharedCache from "../../constant/SharedCache";
import ConfigParam from "../../constant/ConfigParam";
import Constants from "../../constant/Constants";
import SessionStore from "../../Session";
import ITextInput from "../../../module/ui/model/ITextInput";


interface Props {
  userModelView: UserModelView;
}

interface State {}

export default class RegisterView extends React.Component<Props, State> {

  protected user: User;

  protected userModelView: UserModelView;

  /** ngôn ngữ*/
  protected language;

  protected checkbox: CheckBox;

  constructor(props: Props) {
    super(props);

    this.userModelView = props.userModelView;

    //lấy thông tin user tồn tại
    this.user = this.userModelView.getUser();
    
    this.language = SessionStore.language || Language.VN;

    console.log(
      `test_input_RegisterView:${JSON.stringify(this.user)}__${this.language}`
    );
  }

  protected isCheck(): boolean {
    if (this.checkbox == null) return false;

    return this.checkbox.isCheck();
  }

  protected getPhoneView(){
    return this.refs.phoneView as ITextInput;
  }

  protected getEmailView(){
    return this.refs.emailView as ITextInput;
  }

  protected getRefView(){
    return this.refs.refView as ITextInput;
  }

  protected getNameView(){
    return this.refs.nameView as ITextInput;
  }

  async _onRegister() {
    this.userModelView._onRegister(this.getPhoneView(), this.getEmailView(), this.getNameView(), this.getRefView(), this.isCheck(), this.language);
    
  }

  async _gotoValidateScreen() {
    this.userModelView.gotoValidateScreen(this.getPhoneView(), this.getEmailView(), this.isCheck());
  }

  async _onChangeLang(lang: Language) {
    this.userModelView._onChangeLang(this.language, lang);
  }

  render() {
    console.log(`test_input_register_view_`);
    return (
      <WithTextInput>
        <View style={styles.container}>
          <BackHeader
            title={strings.user_register_title}
            drawerBack={() => this.userModelView.handleBackButton()}
            inputStyle={styles.text}
          />

          <HorizontalIconInput
            ref="phoneView"
            container={{
              marginTop: dimens.register_margin_top_txtPhone,
              marginLeft: dimens.register_margin_txtPhone,
              marginRight: dimens.register_margin_txtPhone
            }}
            value={this.user.phone || ""}
            borderRadius={0}
            keyboardType="phone-pad"
            placeholder={strings.accounts_user_hint_phone}
            icon={images.ic_phone}
            inputStyle={styles.text}
            maxLength={12}
            iconStyle = {{tintColor: colors.colorMain}}
          />

          <HorizontalIconInput
            ref="nameView"
            container={{
              marginTop: 0,
              marginLeft: dimens.register_margin_txtPhone,
              marginRight: dimens.register_margin_txtPhone
            }}
            value={this.user.name || ""}
            placeholder={strings.user_name_default}
            borderRadius={0}
            icon={images.ic_person}
            // onChangeText={text => {
            //   this.setState({
            //     name: text
            //   });
            // }}
            inputStyle={styles.text}
            maxLength={30}
            iconStyle = {{tintColor: colors.colorMain}}
          />

          <HorizontalIconInput
            ref="emailView"
            container={{
              marginTop: 0,
              marginLeft: dimens.register_margin_txtPhone,
              marginRight: dimens.register_margin_txtPhone
            }}
            value={this.user.email || ""}
            placeholder={strings.user_email_default}
            borderRadius={0}
            keyboardType="email-address"
            icon={images.ic_mail}
            // onChangeText={text => {
            //   this.setState({
            //     email: text
            //   });
            // }}
            inputStyle={styles.text}
            iconStyle = {{tintColor: colors.colorMain}}
          />

          {ConfigParam.MODULE_REFERENCE_CODE && (
            <HorizontalIconInput
              container={{
                marginTop: 0,
                marginLeft: dimens.register_margin_txtPhone,
                marginRight: dimens.register_margin_txtPhone
              }}
              value={this.user.refIDtemp || ""}
              placeholder={strings.user_refcode_default}
              borderRadius={0}
              icon={images.ic_sale}
              inputStyle={styles.text}
              // onChangeText={text => {
              //   this.setState({
              //     reference: text
              //   });
              // }}
              maxLength={8}
              autoCapitalize={"characters"}
              ref="refView"
              iconStyle = {{tintColor: colors.colorMain}}
            />
          )}

          <TouchableOpacity
            style={styles.containerAgree}
            onPress={() => this.userModelView.toPolicy()}
          >
            <CheckBox
              size={dimens.register_height_check_agree}
              color={colors.colorMain}
              container={{
                marginLeft: dimens.register_margin_check_agree,
                justifyContent: "center"
              }}
              isCheck={this.user.isCheckRule || true}
              ref={ref => (this.checkbox = ref)}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text
                textStyle={{
                  marginLeft: dimens.register_margin_txtPhone,
                  fontSize: fonts.text_size
                }}
                text={strings.accounts_term_of_used + " "}
              />
              <Text
                textStyle={{
                  color: colors.colorMain,
                  fontSize: fonts.text_size
                }}
                text={strings.accounts_term_of_used_link}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.containerLang}>
            <HorizontalIconTextButton
              container={{
                backgroundColor: "transparent",
                justifyContent: "center",
                borderBottomWidth: 0
              }}
              textStyle={{
                color:
                  this.language == Language.VN
                    ? colors.colorMain
                    : colors.colorGray,
                fontWeight: "bold",
                fontSize: fonts.text_size
              }}
              iconStyle={{
                width: dimens.register_icon_lang_size,
                height: dimens.register_icon_lang_size
              }}
              text={strings.language_vi_label}
              border={0}
              borderColor="transparent"
              icon={images.ic_setting_flagvn}
              onPress={() => {
                this._onChangeLang(Language.VN);
              }}
            />

            <HorizontalIconTextButton
              container={{
                backgroundColor: "transparent",
                justifyContent: "center",
                borderBottomWidth: 0
              }}
              textStyle={{
                color:
                  this.language == Language.EN
                    ? colors.colorMain
                    : colors.colorGray,
                fontWeight: "bold",
                fontSize: fonts.text_size
              }}
              iconStyle={{
                width: dimens.register_icon_lang_size,
                height: dimens.register_icon_lang_size
              }}
              text={strings.language_en_label}
              border={0}
              borderColor="transparent"
              icon={images.ic_setting_flagen}
              onPress={() => {
                this._onChangeLang(Language.EN);
              }}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.btnFooter}>
              <Button
                btnStyle={{
                  backgroundColor: colors.colorMain,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: dimens.borderRadius
                }}
                text={strings.user_register_title}
                textStyle={{ color: "white" }}
                borderRadius={dimens.borderRadius}
                onPress={() => {
                  this._onRegister();
                }}
              />

              <Button
                btnStyle={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: dimens.register_margin_top_txtPhone,
                  marginBottom: dimens.register_margin_txtPhone,
                  borderWidth: dimens.border_width,
                  borderRadius: dimens.borderRadius,
                  borderColor:
                    this.user.phone === "" ? colors.colorGray : colors.colorSub
                }}
                text={strings.accounts_user_active_has_code}
                textStyle={{
                  color:
                    this.user.phone === "" ? colors.colorGray : colors.colorSub
                }}
                activeOpacity={this.user.phone === "" ? 1 : 0.2}
                borderRadius={0}
                onPress={() => {
                  this._gotoValidateScreen();
                }}
              />
            </View>
          </View>
        </View>
      </WithTextInput>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  containerAgree: {
    marginLeft: dimens.register_margin_txtPhone,
    marginRight: dimens.register_margin_txtPhone,
    marginBottom: dimens.register_margin_txtPhone,
    marginTop: dimens.register_margin_top_cbx,
    flexDirection: "row"
  },
  containerLang: {
    // paddingLeft: 4,
    margin: dimens.register_margin_txtPhone,
    flexDirection: "row"
  },
  text: {
    fontSize: fonts.text_size
  },
  txtTitle: {
    borderColor: "grey",
    padding: dimens.register_margin_txtPhone
  },
  txtContent: {
    padding: dimens.register_margin_txtPhone
  },
  footer: {
    flex: 1,
    marginLeft: dimens.register_margin_txtPhone,
    marginRight: dimens.register_margin_txtPhone
  },
  btnFooter: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  }
});
