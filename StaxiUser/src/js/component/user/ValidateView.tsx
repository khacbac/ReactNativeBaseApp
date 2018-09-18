import * as React from "react";
import { StyleSheet, View} from "react-native";

import {
  Button,
  HorizontalIconInput,
  Utils,
  Text,
} from "../../../module";

import colors from "../../../res/colors";

import strings from "../../../res/strings";
import images from "../../../res/images";
import SharedCache from "../../constant/SharedCache";
import fonts from "../../../module/ui/res/dimen/fonts";
import dimens from "../../../module/ui/res/dimen/dimens";
import dimensChild from "../../../res/dimens";
import WithTextInput from "../../../module/ui/WithTextInput";
import BackHeader from "../../../module/ui/header/BackHeader";
import User from "../../sql/bo/User";
import ConfigParam from "../../constant/ConfigParam";
import { NativeAppModule } from "../../../module";
import UserModelView from "../../viewmodel/user/UserModelView";
import SessionStore from "../../Session";

interface Props {
  userModelView: UserModelView;
}

interface State {
  timer: string;
  activeColor: string;
}
export default class ValidateView extends React.Component<Props, State> {

  protected codeView: HorizontalIconInput;
  /** để xử lý timeout */
  protected timer: number;

  protected userModelView: UserModelView;

  protected user: User;

  protected isResendCode: boolean = false;

  protected remainTime: number = 0;

  constructor(props) {
    super(props);
    this.state = {
      timer: strings.user_verify_try_btn,
      activeColor: colors.colorGray,
    };
    this.timer = null;
    
    this.userModelView = this.props.userModelView;
    this.user = this.userModelView.getUser();
  }

  handleBackButton() {
    this.props.userModelView.toRegisterScreen();
  }

  componentDidMount() {
    this.__refreshTimerWaiting();
  }

  __refreshTimerWaiting() {
    SharedCache.getSmsWaitTime()
      .then((expireTime: number) => {
        //Lấy thời gian chờ từ ShareCache
        let calRemainTime = ((expireTime - new Date().getTime()) / 1000) | 0;

        this.remainTime = calRemainTime;

        if (this.remainTime < 0) {
          this.setState({
            activeColor: colors.colorSub
          });
        } else {
          this.setState({
            activeColor: colors.colorGray,
          });
        }

        //Start Timer
        this.startTimer();
      })
      .catch(err => {
        console.log(err);
      });
  }

  __formatText() {
    var hour, min, sec, textHour, textMin, textSecond;
    hour = (this.remainTime / (24 * 60)) | 0;
    min = (this.remainTime / 60) | 0;
    sec = this.remainTime % 60 | 0;

    textHour = min < 10 ? "0" + hour : hour;
    textMin = min < 10 ? "0" + min : min;
    textSecond = sec < 10 ? "0" + sec : sec;

    if (this.remainTime > 0) {
      this.setState({
        timer: `${
          strings.user_verify_try_btn_time
          } ${textHour}:${textMin}:${textSecond}`
      });
    } else {
      this.setState({ timer: strings.user_verify_try_btn });
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.remainTime = this.remainTime - 1;
      if (this.remainTime < 0) {
        this.isResendCode = true;
        this.setState({
          timer: strings.user_verify_try_btn,
          activeColor: colors.colorSub
        });
        this.__removeTimer();
      } else {
        this.setState({
          activeColor: colors.colorGray,
        });
        this.__formatText();
      }
    }, 1000);
  }

  componentWillMount() {
    this.__removeTimer();
  }

  componentWillUnmount() {
    this.__removeTimer();
  }

  __removeTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  async _onValidate() {
    let oldUser = this.user;
    let inputCode = String(this.codeView.getTextInput().getText());
    let validate = await this._validateForm(inputCode);

    if (validate) {
      this.userModelView
        .doValidate(oldUser, inputCode)
        .then((ret: { status: number; str: String }) => {
          if (ret == null) {
            this.userModelView.showToastMsg(strings.alert_not_connect_server);
            return;
          }
          if (ret.str === "") {
            //Thiết lập waiting time về 0 khi đăng nhập thành công
            SharedCache.setSmsWaitTime(0);
            this.userModelView.toHomeScreen();
          } else {
            this.codeView.focus();
            this.userModelView.showToastMsg(ret.str);
          }
        })
        .catch(err => {
          this.userModelView.showToastMsg(strings.alert_not_connect_server);
        });
    } else {
      this.codeView.focus();
    }

  }

  async _onResendCode() {
    let ret = await NativeAppModule.isEnableNetwork();
    if (this.remainTime > 0) {
      return;
    }

    if (ret) {
      //TODO: gán mã giới thiệu
      let reference: string = ConfigParam.MODULE_REFERENCE_CODE ? this.user.refID : "";
      this.userModelView
        .doRegister(
          this.user.phone,
          this.user.email,
          this.user.name,
          this.user.isCheckRule,
          SessionStore.language,
          reference
        )
        .then((ret: { code: number; user: User; str: String }) => {
          if (ret == null) {
            this.userModelView.showToastMsg(strings.alert_not_connect_server);
            return;
          }
          this.userModelView.showToastMsg(ret.str);
          //Chuyển tới màn hình validate
          if (ret.user.phone) {
            this.isResendCode = true;
            this.userModelView.toValidateScreen(ret.user);
            this.__refreshTimerWaiting();
          }
        })
        .catch(err => {
          this.userModelView.showToastMsg(strings.alert_not_connect_server);
        });
    } else {
      this.userModelView.showToastMsg(strings.not_connected_server);
    }
  }

  async _validateForm(inputCode) {
    let ret = await NativeAppModule.isEnableNetwork();
    if (!ret) {
      this.userModelView.showToastMsg(strings.invalid_network);
      return false;
    }

    if (!Utils.isNumber(inputCode) || inputCode.length != 4) {
      this.codeView.focus();
      this.userModelView.showToastMsg(strings.accounts_pattern_verify_code);
      return false;
    }

    return true;
  }

  protected focusCode(ref) {
    if (ref == null || this.codeView != undefined) {
      return;
    }

    this.codeView = ref;
  }

  render() {
    return (
      <WithTextInput>
        <View style={styles.container}>
          <BackHeader
            title={strings.user_verify_title}
            drawerBack={() => this.handleBackButton()}
            inputStyle={styles.text}
          />

          <Text
            textStyle={{
              fontSize: fonts.h6_20,
              fontWeight: "bold",
              color: colors.colorGrayDark,
              paddingBottom: dimensChild.register_margin_top_txtPhone,
              paddingTop: dimensChild.validate_padding_top_phone_number,
              textAlign: "center"
            }}
            text={this.user.phone}
          />

          <HorizontalIconInput
            ref={(ref) => {
              this.focusCode(ref)
            }}
            container={{
              margin: dimensChild.register_margin_txtPhone,
              borderWidth: dimens.border_width,
              paddingRight: dimensChild.validate_padding_right_txt_code,
              borderRadius: dimens.borderRadius,
              borderColor: colors.colorGrayLight
            }}
            // onChangeText={text => {
            //   this.setState({ inputText: text });
            // }}
            icon={images.ic_key}
            keyboardType="phone-pad"
            iconStyle={{ tintColor: colors.colorMain }}
            placeholder={strings.accounts_user_verify_code}
            inputStyle={styles.text}
            maxLength={4}
            autoFocus={true}
          />

          <Text textStyle={{ margin: dimensChild.register_margin_txtPhone, textAlign: "center" }} text={strings.accounts_user_active_status} />

          <View style={styles.footer}>
            <View style={styles.btnFooter}>
              <Button
                btnStyle={{
                  backgroundColor: colors.colorMain,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 0,
                  borderRadius: 0,
                }}
                text={strings.book_confirm_title}
                textStyle={{ color: "white", }}
                borderRadius={0}
                onPress={() => {
                  this._onValidate();
                }}
              />

              <Button
                btnStyle={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: dimensChild.register_margin_top_txtPhone,
                  marginBottom: dimensChild.register_margin_txtPhone,
                  borderWidth: dimens.border_width,
                  borderRadius: dimens.borderRadius,
                  borderColor: this.state.activeColor
                }}
                text={this.state.timer}
                textStyle={{ color: this.state.activeColor, }}
                borderRadius={0}
                onPress={() => this._onResendCode()}
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
  },
  text: {
    fontSize: fonts.text_size,
  },
  footer: {
    flex: 1,
    marginLeft: dimensChild.register_margin_txtPhone,
    marginRight: dimensChild.register_margin_txtPhone
  },
  btnFooter: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  }
});
