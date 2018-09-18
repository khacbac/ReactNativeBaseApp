/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:29:31
 * @modify date 2018-07-17 03:29:31
 * @desc [giao tiếp giữa giao diện ViewCar và modelView]
 */
import ViewCarPage from "./ViewCarPage";

export default interface ViewCarPresenter {
  showWaitCarLayout(msg?: string);
  showLayout(page: ViewCarPage);
  visibleAnimationWaitCar(isShow: boolean);
  retryBooking();
}
