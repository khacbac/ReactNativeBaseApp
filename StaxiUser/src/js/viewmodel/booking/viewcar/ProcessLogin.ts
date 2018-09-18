/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:31:11
 * @modify date 2018-07-17 03:31:11
 * @desc [Lớp xử lý login tài khoản]
 */

import CountDownTimer from "../../../../module/utils/CountDownTimer";
import LoginMessage from "../../../tcp/sent/LoginMessage";
import { NativeAppModule } from "../../../../module";
import { ConnectionManager, UnitAlert } from "../../../../module";
import ViewCarViewModel from "./ViewCarViewModel";
import LogFile from "../../../../module/LogFile";
import strings from "../../../../res/strings";
import BAMessage from "../../../../module/tcp/BAMessage";
import BookedStep from "../../../constant/BookedStep";
import ReloginMessage from "../../../tcp/sent/ReloginMessage";
import User from "../../../sql/bo/User";
import SessionStore from "../../../Session";

export default class ProcessLogin{
  public static TIMEOUT_RETRY_LOGIN = 10 * 1000;

  public static TIME_RETRY_LOGIN = 6 * ProcessLogin.TIMEOUT_RETRY_LOGIN;

  public isLoginSuccessful = false;

  public viewCarVM: ViewCarViewModel;

  private retryLogin: CountDownTimer;

  constructor(viewCarVM: ViewCarViewModel) {
    this.viewCarVM = viewCarVM;
  }

  //@Overidi
  public start() {
    this.isLoginSuccessful = false;
    if (this.viewCarVM.getBookTaxiModel().isStart()) {
      this.retryLogin = new RetryLogin(this);
      this.retryLogin.start();
      console.log("ProcessLogin retryLogin####");
    } else {
      this.retryLogin = new RetryRelogin(this);
      this.retryLogin.start();
    }
    return this;
  }

  relogin() {
    if(this.retryLogin != null) this.retryLogin.cancel();
    this.retryLogin = new RetryRelogin(this);
    this.retryLogin.start();
  }

  public connectedFailServer() {
    LogFile.e(
      "ProcessLogin",
      "connectedFailServer Session.get().isBooking() = " +
        SessionStore.isBooking()
    );

    // Hủy tiến trình login
    this.cancel();

    // Nếu không phải đang đăt xe thì hủy không thông báo lỗi
    if (!SessionStore.isBooking()) return;

    // AbstractDialog dialog = new SimpleDialog(main,
    //     R.string.not_connected_server_retry_book);
    // mShowTaxiOnMap.showBookingErrorAlert(dialog);
    this.viewCarVM.showBookingErrorAlert(
      UnitAlert.get().setMessage(strings.not_connected_server_retry_book)
    );

    this.viewCarVM.bookingViewModel.closeDialog()
  }

  /* Gán trạng thái và ngắt threadk */
  public cancel() {
    LogFile.e(
      "ProcessLogin",
      "cancel: isLoginSuccessful = " + this.isLoginSuccessful
    );

    // Nếu đã hủy rồi thì bỏ qua
    if (this.isLoginSuccessful) return;

    this.isLoginSuccessful = true;

    // Hủy login nếu cóLogFile.e(
    if (this.retryLogin != null) {
      this.retryLogin.cancel();
    }
  }
}

class RetryLogin extends CountDownTimer {
  private process: ProcessLogin;

  private bMessage: BAMessage;
  constructor(process: ProcessLogin) {
    super(ProcessLogin.TIME_RETRY_LOGIN, ProcessLogin.TIMEOUT_RETRY_LOGIN);
    this.process = process;

    let user = SessionStore.getUser();
    this.bMessage = new BAMessage();
    this.bMessage.setWrapperData(
      new LoginMessage(user.phone, user.password, NativeAppModule.VERSION_CODE)
    );

    console.log("RetryLogin ####", this.bMessage);
  }

  public onTick(millisUntilFinished: number) {
    // Login đã hoàn thành
    if (this.process.isLoginSuccessful) {
      LogFile.e(
        "Sai trạng thái khi khởi tạo cuốc:" + this.process.isLoginSuccessful
      );
      return;
    }

    // Trạng thái cuốc đã được khởi tạo thì ko xử lý
    if (this.process.viewCarVM.getBookTaxiModel().state != BookedStep.START) {
      LogFile.e(
        "Sai trạng thái khi khởi tạo cuốc:" +
          this.process.viewCarVM.getBookTaxiModel().state
      );
      return;
    }

    this.process.viewCarVM.sendBAMessage(this.bMessage);
  }

  onFinish() {
    this.process.connectedFailServer();
  }
}

class RetryRelogin extends CountDownTimer {

  private process: ProcessLogin;

  private bMessage: BAMessage;

  constructor(process: ProcessLogin) {
    super(ProcessLogin.TIME_RETRY_LOGIN, ProcessLogin.TIMEOUT_RETRY_LOGIN);
    this.process = process;

    // Tạo đối tượng relogin
    this.bMessage = new BAMessage();
    let reloginMessage: ReloginMessage;
    if (
      this.process.viewCarVM.getBookTaxiModel().state ==
      BookedStep.CLIENT_CANCEL
    ) {
      reloginMessage = new ReloginMessage();
    } else {
      reloginMessage = new ReloginMessage();
      reloginMessage.bookID.setValue(
        this.process.viewCarVM.getBookTaxiModel().bookCode
      );
    }
    let user: User = SessionStore.getUser();
    reloginMessage.phone.setValue(user.phone);
    reloginMessage.password.setValue(user.password);
    reloginMessage.isRestartApp.setValue(
      ConnectionManager.getSessionKey() == null
    );
    this.bMessage.setWrapperData(reloginMessage);
  }
  public onTick(millisUntilFinished: number) {
    console.log("RetryRelogin ####", this.bMessage);
    this.process.viewCarVM.sendBAMessage(this.bMessage);
  }

  onFinish() {
    this.process.connectedFailServer();
  }
}
