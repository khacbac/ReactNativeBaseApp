import MethodName from "../../http/MethodName";
import { requestByObject } from "../../http/HttpHelper";

import { Utils, Dialog, ToastModule, PairAlert, NativeAppModule, DfShort, DfString, DfByte, DfLong, ITextInput } from "../../../module";
import User from "../../sql/bo/User";
import UserDAO from "../../sql/dao/UserDAO";
import strings from "../../../res/strings";
import SharedCache from "../../constant/SharedCache";
import Constants from "../../constant/Constants";
import ScreenName from "../../ScreenName";
import SessionStore from "../../Session";
import ConfigParam from "../../constant/ConfigParam";
import Language from "../../../module/model/Language";

export interface UserPresenter {
  getDialog(): Dialog;
  setState(obj);
}

export default class UserModelView {
  protected presenter: UserPresenter;

  protected navigation;

  protected user: User;

  constructor(presenter: UserPresenter, navigation?) {
    this.presenter = presenter;
    this.navigation = navigation;

    //lấy user đang lưu trữ trong session
    this.user = new User();
    this.user.clone(SessionStore.getUser());
  }

  public getUser() {
    return this.user;
  }

  showDialogWaiting() {
    this.presenter.getDialog().showWaitingDialog("");
  }

  showToastMsg(msg, onClosed?) {
    // this.getDialog().showToast(msg, onClosed);
    ToastModule.show(msg);

    onClosed && onClosed();
  }

  closeDialog() {
    this.presenter.getDialog().dissmiss();
  }

  toValidateScreen(newUser) {
    //Cập nhật lại user sau khi validate thành công
    this.user = newUser;
    this.presenter.setState({ screen: UserPage.VERIFY });
  }

  toHomeScreen = () => {
    this.navigation.replace(ScreenName.MAIN_NAVIGATION);
  };

  toRegisterScreen = () => {
    this.presenter.setState({ screen: UserPage.REGISTER });
  };

  toSplashScreen = () => {
    this.navigation.replace(ScreenName.LOAD_APP);
  };

  toPolicy = () => {
    this.navigation.navigate(ScreenName.WEBHELPER, {
      uri: strings.term_of_user_url,
      title: strings.accounts_term_of_used_link
    });
  };

  public async doRegister(
    phoneNumber: string,
    email: string,
    fullName: string,
    checkedRule: boolean,
    userLang: number,
    reference?: string
  ): Promise<{ code: number; user?: User; str: String }> {
    let genUUID = Utils.genUUID();
    let inputNaCode = "84";
    let request = new RegisterRequest();
    request.language.setValue(userLang);
    request.uuid.setValue(genUUID);
    request.phoneNumber.setValue(phoneNumber);
    request.name.setValue(fullName);
    request.email.setValue(email);
    request.reference.setValue(Utils.isNull(reference) ? "" : reference);
    request.countryCode.setValue(inputNaCode);

    // Thực hiện request
    try {
      let response: RegisterResponse = await requestByObject(
        MethodName.Register,
        request,
        new RegisterResponse()
      );

      console.log("response------------------------------------------");
      console.log(`doRegister: ${response}`);

      // Kiểm tra nếu không có dữ liệu đồng bộ thì bỏ qua
      let res = response.registerCode.value;
      let serverTime = response.time;

      let msg;
      let user = new User();
      switch (res) {
        case RegisterCode.normal:
          msg = strings.user_register_message_one;
          user.phone = phoneNumber;
          user.name = fullName;
          user.email = email;
          user.refID = response.reference.value;
          user.refIDtemp = reference;
          user.isActive = true;
          user.createDate = new Date().getTime();
          user.uuid = genUUID;
          user.naCode = inputNaCode;
          user.isCheckRule = checkedRule;
          user.liftbanTime = new Date().getTime();
          // chèn thông tin người dùng vào database
          user.userId = await UserDAO.insert(user);

          //Giới hạn 5 phút cho nhập mã kích hoạt
          let date = new Date();
          date.setMinutes(date.getMinutes() + 5);

          SharedCache.setSmsWaitTime(date.getTime())
            .then(boolean => {})
            .catch(err => {});

          SessionStore.setUser(user);
          break;
        case RegisterCode.justSend:
          msg = strings.user_register_message_two;
          user.phone = phoneNumber;
          user.name = fullName;
          user.email = email;
          user.refID = response.reference.value;
          user.refIDtemp = reference;
          // user.isActive = false;
          user.createDate = new Date().getTime();
          user.uuid = genUUID;
          user.naCode = inputNaCode;
          user.isCheckRule = checkedRule;

          SessionStore.setUser(user);
          break;
        case RegisterCode.temporaryLock:
          if (this.isBan(serverTime.value)) {
            msg = strings.user_register_message_four;
          } else {
            //Cập nhật lại khi có hàm format date
            msg =
              strings.user_register_message_four +
              " " +
              Utils.formatDateTime(serverTime.value);
          }
          break;
        case RegisterCode.permanentLock:
          if (this.isBan(serverTime.value)) {
            msg = strings.user_register_message_four;
          } else {
            //Cập nhật lại khi có hàm format date
            msg =
              strings.user_register_message_four +
              " " +
              Utils.formatDateTime(serverTime.value);
          }
          break;
        case RegisterCode.wrongInfo:
          msg = strings.user_register_message_five;
          break;
        case RegisterCode.numberTooManyAttempt:
          msg = strings.user_register_message_six;
          break;
        case RegisterCode.phoneTooManyAttempt:
          msg = strings.user_register_message_sevent;
          break;
        case RegisterCode.abNormal:
          if (!response.message.value) {
            msg = response.message.value;
          } else {
            msg = strings.user_create_message_eight;
          }
          break;
        case RegisterCode.ruleViolence:
          if (this.isBan(serverTime.value)) {
            msg = strings.user_create_message_nine;
          } else {
            //Cập nhật lại khi có hàm format date
            msg =
              strings.user_create_message_nine_sub +
              " " +
              Utils.formatDateTime(
                serverTime.value * Constants.UNIT_SECONDS_PER_MILLISECONDS -
                  Constants.DELTA_TIME_SERVER
              );
          }
          break;
        case RegisterCode.invalidReference:
          msg = strings.user_register_teen;
          break;
        default:
          msg = strings.register_code_unknown;
          break;
      }

      return Promise.resolve({
        code: RegisterCode.normal,
        user: user,
        str: msg
      });
    } catch (error) {
      console.log(`err__ ${error.message || error}`);
      return Promise.reject(error);
    }
  }

  //Nếu trả về là true là khoá, false thì thiết lập thời gian chờ
  private isBan(time: number): Boolean {
    return time <= 0;
  }

  public async updateTempReg(name: string, email: string, refTmp: string) {
    let id = await UserDAO.updateInfoUserTemp(name, email, refTmp);
  }

  public async doValidate(
    user: User,
    verifyCode: string
  ): Promise<{ status: number; str: String }> {
    let pass = Utils.createKeys(20, 30);
    let request = new ValidateRequest();
    request.verifyCode.setValue(verifyCode);
    request.countryCode.setValue(user.naCode);
    request.phone.setValue(user.phone);
    request.password.setValue(pass);
    request.UUID.setValue(user.uuid);
    console.log(request);

    console.log("do_validate: " + JSON.stringify(user));
    // Thực hiện request
    try {
      let response: ValidateResponse = await requestByObject(
        MethodName.Validate,
        request,
        new ValidateResponse()
      );

      //Update to DB
      // console.log(`request_validate: ${JSON.stringify(response)}`);

      let res = response.status.value;
      let msg = "";
      if (response.status.value == ValidateCode.error) {
        msg = strings.user_create_input_error;
      } else if (
        response.status.value == ValidateCode.new ||
        response.status.value == ValidateCode.exist
      ) {
        let email = "", name = "", avartar = "";
        if (response.status.value == ValidateCode.exist) {
          email = response.email.value;
          name = response.name.value;
          avartar = response.avartar.value;
        }

        await UserDAO.updateInfoUser(pass, email, name, avartar);
        
        //Thiết lập lại session
        user.email = email;
        user.name = name;
        user.password = pass;
        SessionStore.setUser(user);

      } else {
        msg = strings.user_create_input_error;
      }

      return Promise.resolve({ status: response.status.value, str: msg });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  handleBackButton() {
    PairAlert.get()
      .setTitle(strings.alert_dialog_title)
      .setMessage(strings.exit_app_confirm)
      .setNegativeText(strings.btn_dismiss)
      .setNegativePress(() => console.log("cancel"))
      .setPositiveText(strings.btn_ok)
      .setPositivePress(() =>NativeAppModule.stopApp("Stop app"))
      .show();

    return true;
  }

  public async validateForm(phoneView:ITextInput, emailView:ITextInput, isCheck:boolean) {
    let ret = await NativeAppModule.isEnableNetwork();
    let email = emailView.getText();

    if (!ret) {
      this.showToastMsg(strings.invalid_network);
      return false;
    }

    let phone = phoneView.getText();

    if (!phone) {
      this.showToastMsg(strings.user_register_phone_empty, () => {
        phoneView.focus();
      });
      return false;
    }

    if (!Utils.isValidPhone(phone)) {
      this.showToastMsg(strings.accounts_pattern_phone, () => {
        phoneView.focus();
      });
      return false;
    }
    if (email !== "") {
      if (!Utils.isValidEmail(email)) {
        this.showToastMsg(strings.accounts_pattern_email, () => {
          emailView.focus();
        });
        return false;
      }
    }
    if (!isCheck) {
      this.showToastMsg(strings.accounts_term_of_used_error);
      return false;
    }
    return true;
  }

  async gotoValidateScreen(phoneView:ITextInput, emailView:ITextInput, isCheck:boolean) {
    let phone = Utils.trimPhone(phoneView.getText());
    let name = Utils.trimPhone(emailView.getText());

    if (await this.validateForm(phoneView, emailView, isCheck)) {
      if (ConfigParam.MODULE_INPUT_NAME_RIGISTER && Utils.isEmpty(name)) {
        this.showToastMsg(strings.user_register_name_empty);
      } else if (Utils.isEmpty(phone)) {
        this.showToastMsg(strings.user_register_phone_empty);
      } else if (this.user.phone !== phone) {
        this.showToastMsg(strings.user_register_message_phone_change);
      } else {
        this.toValidateScreen(this.user);
      }
    }
  }

  async _onRegister(phoneView:ITextInput, emailView:ITextInput, nameView:ITextInput, refView:ITextInput, isCheck:boolean, language) {
    let phone = Utils.trimPhone(phoneView.getText());
    let email = emailView.getText() || "";
    let refCode = refView.getText() || "";
    let name = nameView.getText() || "";

    //Cập nhật thông tin user
    this.user.phone = phone;
    this.user.email = email;
    this.user.refID = refCode;
    this.user.refIDtemp = refCode;
    this.user.name = name;

    if (await this.validateForm(phoneView, emailView, isCheck)) {
      let waitTime = await SharedCache.getSmsWaitTime();
      let diff = new Date().getTime() - waitTime;

      if (this.user.phone === phone && diff < Constants.START_ACTIVE_TIME) {
        this.toValidateScreen(this.user);
        //Cập nhật lại tên, email, mã giới thiệu khi chưa đăng ký thành công
        this.updateTempReg(name, email, refCode);
      } else {
        this.showDialogWaiting();
        this
          .doRegister(
            phone,
            email,
            name,
            isCheck,
            language,
            refCode
          )
          .then((ret: { code: number; user: User; str: String }) => {
            this.closeDialog();
            //hiện thông báo
            this.showToastMsg(ret.str);

            if (
              ret.code === RegisterCode.normal ||
              ret.code === RegisterCode.justSend
            ) {
              //chuyển sang validate
              this.toValidateScreen(ret.user);
            }
          })
          .catch(err => {
            this.closeDialog();
            this.showToastMsg(strings.not_connected_server);
          });
      }
    }
  }

  async _onChangeLang(oldlang: Language, newlang: Language) {
    //Cập nhật session và db lang
    if (oldlang == newlang) return;
    //cập nhật ngôn ngữ
    SessionStore.language = newlang;
    //thực hiện thay đổi ngôn ngữ
    await SharedCache.setLanguage(newlang);

    //chưa xử lý kết quả trả khi ko lưu được ngôn ngữ
    //Khởi động lại app
    this.toSplashScreen();
  }
}

export enum UserPage {
  REGISTER,
  VERIFY
}

export enum RegisterCode {
  normal = 1, // Bình thường, Server đã nhận, kiểm tra xong và sẽ gửi sms
  justSend = 2, // Mới gửi sms, chưa xác thực, yêu cầu kiểm tra code cũ hoặc chờ thêm
  temporaryLock = 3, // Tài khoản đang bị tạm khóa, chưa được phép kích hoạt lại.
  permanentLock = 4, // Số điện thoại đã bị khóa, xin mời đăng ký bằng số khác.
  wrongInfo = 5, // Thông tin số điện thoại hoặc email sai.
  numberTooManyAttempt = 6, // Số điện thoại đã kích hoạt quá nhiều lần trong 24h qua
  phoneTooManyAttempt = 7, // Thiết bị đã gửi kích hoạt quá nhiều trong 24h
  abNormal = 8, // Lỗi bất thường
  ruleViolence = 9, // Lỗi khoá tài khoản
  invalidReference = 10, // Lỗi mã giới thiệu nhập không đúng
}

export class RegisterRequest {
  /* ngôn ngữ*/
  public language: DfShort = DfShort.index(1);

  /* số điện thoại */
  public phoneNumber: DfString = DfString.index(2);

   /* email */
   public email: DfString = DfString.index(3);

  /* tên đăng nhập */
  public name: DfString = DfString.index(4);

  /* mã khuyến mại */
  public reference: DfString = DfString.index(5);

  /* device ID */
  public uuid: DfString = DfString.index(6);

  /* mã nước */
  public countryCode: DfString = DfString.index(7);

}


export class RegisterResponse {
  /* trạng thái đăng ký */
  public registerCode: DfByte = DfByte.index(1);

  /* thông báo lỗi */
  public message: DfString = DfString.index(2);

  /* nếu bị khoá thì trả về thời gian bị khoá tới bao giờ */
  public time: DfLong = DfLong.index(3);

  /* mã khuyến mãi */
  public reference: DfString = DfString.index(4);
}

export enum ValidateCode {
  error = 0, //lỗi
  new = 1, //tạo mới
  exist = 2, //kích hoạt lại
  codeTimeout = 3, //mã quá hạn sử dụng
}

export class ValidateRequest {
  /* mã kích hoạt */
  public verifyCode: DfString = DfString.index(1);

  /* mã nước */
  public countryCode: DfString = DfString.index(2);

  /* số điện thoại */
  public phone: DfString = DfString.index(3);

  /* mật khẩu */
  public password: DfString = DfString.index(4);

  /* uuid */
  public UUID: DfString = DfString.index(5);
}

export class ValidateResponse {
  /* trạng thái validate */
  public status: DfByte = DfByte.index(1);

  /* email */
  public email: DfString = DfString.index(2);

  /* tên đăng nhập */
  public name: DfString = DfString.index(3);

  /* avartar */
  public avartar: DfString = DfString.index(4);
}