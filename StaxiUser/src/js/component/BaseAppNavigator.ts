import ScreenName from "../ScreenName";
import MainNavigation from "../MainNavigation";
import SplashActivity from "./splash/SplashActivity";
import UserActivity from "./user/UserActivity";
import WebHelper from "./help/WebHelper";
//điều hướng cho ứng dụng khi khởi tạo
const BaseAppNavigator = {
  [ScreenName.LOAD_APP]: {
    screen: SplashActivity
  },
  [ScreenName.USER_ACTIVITY]: {
    screen: UserActivity
  },
  [ScreenName.MAIN_NAVIGATION]: {
    screen: MainNavigation
  },
  [ScreenName.WEBHELPER]: {
    screen: WebHelper
  }
};

export default BaseAppNavigator;
