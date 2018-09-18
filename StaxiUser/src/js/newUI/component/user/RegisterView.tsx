import * as React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


import images from "../../res/images";
import strings from "../../../../res/strings";
import { WithTextInput, HorizontalIconInput, Image, CheckBox, Text, HorizontalIconTextButton, Button, ITextInput } from "../../../../module";
import Language from "../../../../module/model/Language";
import fonts from "../../../../res/fonts";
import dimens from "../../../../res/dimens";
import colors from "../../res/colors";
import ConfigParam from "../../../constant/ConfigParam";
import { RegisterStyles } from "../../../../../../app/styles";
import HorizontalIconInputG from "../../widget/HorizontalIconInputG";
import UserModelView from "../../../viewmodel/user/UserModelView";
import SessionStore from "../../../Session";
import User from "../../../sql/bo/User";



interface Props {
  userModelView: UserModelView;
}

interface State {}

export default class RegisterView extends React.Component<Props, State>{

  protected user: User;

  protected userModelView: UserModelView;

  /** ngôn ngữ*/
  protected language;

  protected checkbox: CheckBox;


  constructor(props) {
    super(props);

    this.userModelView = props.userModelView;

    //lấy thông tin user tồn tại
    this.user = this.userModelView.getUser();
    
    this.language = SessionStore.language || Language.VN;
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
    //console.log(`test_input_register_view_`);
    return (
      <WithTextInput>
        <View style={RegisterStyles.container}>
          {/* <BackHeader
            title={strings.user_register_title}
            drawerBack={() => this.handleBackButton()}
            inputStyle={RegisterStyles.text}
          /> */}

          {/* <View style={{width:'100%', backgroundColor:'grey'}}> */}
          
          <Image resizeMode="stretch" source={images.logo_hoz}
            imgStyle={RegisterStyles.logo} />
          {/* </View> */}

          <HorizontalIconInputG
            iconStyle={{
              width:dimens.register_icon_phone_size, 
              height:dimens.register_icon_phone_size,
              marginHorizontal: dimens.register_margin_phone,
            }}
            ref="phoneView"
            value={this.user.phone || ''}
            borderRadius={0}
            keyboardType="phone-pad"
            placeholder={strings.accounts_user_hint_phone}
            icon={images.tel}
            // onChangeText={text => {
            //   this.setState({
            //     phone: text
            //   });
            // }}
            maxLength={12}
          />

          {/* <HorizontalIconInput
            ref={(ref) => {
              console.log(`test_input_register_view_phone`);
              this.phoneView = ref;
            }}
            container={{
              marginTop: dimens.register_margin_top_txtPhone,
              marginLeft: dimens.register_margin_txtPhone,
              marginRight: dimens.register_margin_txtPhone,
              backgroundColor:"green",
              height:dimens.register_height_txtPhone,
            }}
            iconStyle={RegisterStyles.horizontalIconInput_iconStyle}
            inputStyle={{
              marginRight: (dimens.size_icon_input + dimens.margin_horizontal_icon_input * 2) * -1,
              fontSize: fonts.text_size,
              borderWidth: dimens.border_width,
              borderRadius: dimens.borderRadius,
              backgroundColor:"yellow",
              height:dimens.register_height_item_txtPhone,
            }}
            value={this.user.phone || ''}
            borderRadius={0}
            keyboardType="phone-pad"
            placeholder={strings.accounts_user_hint_phone}
            icon={images.tel}
            // onChangeText={text => {
            //   this.setState({
            //     phone: text
            //   });
            // }}
            maxLength={12}
          /> */}

          <HorizontalIconInputG
            ref="nameView"
            value={this.user.name || ''}
            placeholder={strings.user_name_default}
            borderRadius={0}
            icon={images.user}
            // onChangeText={text => {
            //   this.setState({
            //     name: text
            //   });
            // }}
            maxLength={30}
          />

          <HorizontalIconInputG
            ref="emailView"
            value={this.user.email || ''}
            placeholder={strings.user_email_default}
            borderRadius={0}
            keyboardType="email-address"
            icon={images.email}
            // onChangeText={text => {
            //   this.setState({
            //     email: text
            //   });
            // }}
          />

          {ConfigParam.MODULE_REFERENCE_CODE && <HorizontalIconInputG
            value={this.user.refIDtemp || ''}
            placeholder={strings.user_refcode_default}
            borderRadius={0}
            icon={images.promotion03}
            // onChangeText={text => {
            //   this.setState({
            //     reference: text
            //   });
            // }}
            maxLength={8}
            autoCapitalize={'characters'}
            ref="refView"
          />}

          <TouchableOpacity style={RegisterStyles.containerAgree} onPress={() => this.userModelView.toPolicy()}>
            <CheckBox
              size={dimens.register_height_check_agree}
              color={colors.colorMain}
              container={RegisterStyles.checkbox_container}
              isCheck={this.user.isCheckRule || true}
              ref={ref => this.checkbox = ref}
              viewStyle={RegisterStyles.checkbox_viewStyle}
            />
            <View style={{ alignItems: "center", justifyContent: "center", flexDirection: 'row', }}>
              <Text textStyle={RegisterStyles.container_text_agree_1} text={strings.accounts_term_of_used + " "} />
              <Text textStyle={RegisterStyles.container_text_agree_2} text={strings.accounts_term_of_used_link} />
            </View>
          </TouchableOpacity>

          <View style={RegisterStyles.containerLang}>
            <HorizontalIconTextButton
              container={RegisterStyles.horizontalIconTextButton_vi_container}
              textStyle={{
                color: this.language == Language.VN ? colors.colorMain : colors.colorGray,
                fontWeight: "bold",
                fontSize: fonts.text_size,
                flex: 0.8,
              }}
              iconStyle={RegisterStyles.horizontalIconTextButton_vi_iconStyle}
              text={strings.language_vi_label}
              border={0}
              borderColor="transparent"
              icon={images.ic_setting_flagvn}
              onPress={() => {
                this._onChangeLang(Language.VN);
              }}
            />

            <HorizontalIconTextButton
              container={RegisterStyles.horizontalIconTextButton_vi_container}
              textStyle={{
                color: this.language == Language.EN ? colors.colorMain : colors.colorGray,
                fontWeight: "bold",
                fontSize: fonts.text_size,
                flex: 0.8

              }}
              iconStyle={RegisterStyles.horizontalIconTextButton_vi_iconStyle}
              text={strings.language_en_label}
              border={0}
              borderColor="transparent"
              icon={images.ic_setting_flagen}
              onPress={() => {
                this._onChangeLang(Language.EN);
              }}
            />
          </View>

          <View style={RegisterStyles.footer}>
            <View style={RegisterStyles.btnFooter}>
              <Button
                btnStyle={{
                  backgroundColor: colors.colorMain,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: dimens.borderRadius,
                }}
                text={strings.user_register_title.toUpperCase()}
                textStyle={{ color: "white" }}
                // borderRadius={dimens.borderRadius}
                onPress={() => {
                  this._onRegister();
                }}
              />

              <Button
                btnStyle={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: dimens.register_margin_top_btn_footer,
                  marginBottom: dimens.register_margin_top_btn_footer,
                  borderWidth: dimens.border_width,
                  borderRadius: dimens.borderRadius,
                  borderColor: this.user.phone === '' ? colors.colorGray : colors.colorSub
                }}
                text={strings.accounts_user_active_has_code.toUpperCase()}
                textStyle={{ color: this.user.phone === '' ? colors.colorGray : colors.colorSub, }}
                activeOpacity={this.user.phone === '' ? 1 : 0.2}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   containerAgree: {
//     marginLeft: dimens.register_margin_txtPhone,
//     marginRight: dimens.register_margin_txtPhone,
//     marginBottom: dimens.register_margin_txtPhone,
//     marginTop: dimens.register_margin_top_cbx,
//     flexDirection: "row",
//   },
//   containerLang: {
//     // backgroundColor:'red',
//     // paddingLeft: 4,
//     margin: dimens.register_margin_txtPhone,
//     flexDirection: "row",
//   },
//   text: {
//     fontSize: fonts.text_size,
//     borderWidth: dimens.border_width,
//     borderRadius: dimens.borderRadius,
//     // borderColor: "grey",
//     // padding: dimens.register_padding_txtPhone ,
//   },
//   txtContent: {
//     padding: dimens.register_margin_txtPhone
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
//   },
//   //Input
//   horizontalIconInput_container_phone:{
//     marginTop: dimens.register_margin_top_txtPhone,
//     marginLeft: dimens.register_margin_txtPhone,
//     marginRight: dimens.register_margin_txtPhone,
//   },
//   horizontalIconInput_container_name:{
//     marginTop: 0,
//     marginLeft: dimens.register_margin_txtPhone,
//     marginRight: dimens.register_margin_txtPhone,
//   },
//   horizontalIconInput_iconStyle:{
//     tintColor: null
//   },
//   //Agree
//   checkbox_container:{
//     marginLeft: dimens.register_margin_check_agree,
//     justifyContent: 'center',
//   },
//   checkbox_viewStyle:{
//     borderRadius : dimens.borderRadius
//   },
//   container_text_agree:{
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: 'row', 
//   },
//   container_text_agree_1:{
//     marginLeft: dimens.register_margin_txtPhone,
//     fontSize: fonts.text_size, 
//   },
//   container_text_agree_2:{
//     color: colors.colorMain,
//     fontSize: fonts.text_size 
//   },
//   //Lang
//   horizontalIconTextButton_vi_container:{
//     backgroundColor: "transparent",  
//     justifyContent: 'center', 
//     borderBottomWidth: 0,
//   },
//   horizontalIconTextButton_vi_iconStyle:{
//     width: dimens.register_icon_lang_size,
//     height: dimens.register_icon_lang_size,
//     marginHorizontal: dimens.register_icon_margin_lang,
//   },
// });

