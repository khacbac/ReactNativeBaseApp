import ScreenName from "../ScreenName";
import MainNavigation from "../MainNavigation";
import SplashActivity from "../component/splash/SplashActivity";
import UserActivity from "./component/user/UserActivity";
import WebHelper from "../component/help/WebHelper";
//điều hướng cho ứng dụng khi khởi tạo
const StaxiAppNavigator = {
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
export default StaxiAppNavigator;
