import BAMessage from "../../../../module/tcp/BAMessage";
import User from "../../../sql/bo/User";
import ReloginMessage from "../../../tcp/sent/ReloginMessage";
import BookedStep from "../../../constant/BookedStep";
import { ConnectionManager } from "../../../../module";
import ViewCarViewModel from "./ViewCarViewModel";
import SessionStore from "../../../Session";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:27:57
 * @modify date 2018-07-17 03:27:57
 * @desc [Xử lý khi mất kết nối]
 */

export default class ProcessRelogin {

  private bMessage: BAMessage;
  
  public killRelogin() {

  }
  public start(viewCarVM: ViewCarViewModel) {
    let user: User = SessionStore.getUser();
    let reloginMessage: ReloginMessage;
    if (
      viewCarVM.getBookTaxiModel().state ==
      BookedStep.CLIENT_CANCEL
    ) {
      reloginMessage = new ReloginMessage();
    } else {
      reloginMessage = new ReloginMessage();
      reloginMessage.bookID.setValue(
        viewCarVM.getBookTaxiModel().bookCode
      );
    }
    reloginMessage.phone.setValue(user.phone);
    reloginMessage.password.setValue(user.password);
    reloginMessage.isRestartApp.setValue(
      ConnectionManager.getSessionKey() == null
    );
    viewCarVM.sendBAMessage(reloginMessage);
  }
}
