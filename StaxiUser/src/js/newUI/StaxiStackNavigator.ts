// Home menu trái
import HistoryHome from "./component/history/HistoryHome";
import DetailHistory from "./component/history/DetailHistory";
import DetailTrackingLog from "../component/history/DetailTrackingLog";
import ScreenName from "../ScreenName";
import BookTaxiActivity from "./component/booking/BookTaxiActivity";
import PromotionScreen from "./component/promotion/Promotion";
import FeedbackHome from "../component/feedback/FeedbackHome";
import AboutHome from "../component/about/AboutHome";
import ProfileScreen from "./component/user/ProfileScreen";
import HelpHome from "../component/help/HelpHome";
import WebHelper from "../component/help/WebHelper";
import ScheduleFragment from "../component/booking/confirm/ScheduleFragment";
import DebugList from "../zdeveloper/DebugActivity";
import SearchViewNewUI from "./component/search/autocomplete/SearchViewNewUI";

const StaxiStackNavigator = {
  [ScreenName.BOOKING]: {
    screen: BookTaxiActivity
  },
  [ScreenName.HISTORY]: {
    screen: HistoryHome
  },
  [ScreenName.DETAIL_HISTORY]: {
    screen: DetailHistory
  },
  [ScreenName.PROMOTION]: {
    screen: PromotionScreen
  },
  [ScreenName.FEEDBACK]: {
    screen: FeedbackHome
  },
  [ScreenName.ABOUT]: {
    screen: AboutHome
  },
  [ScreenName.SEARCH_ADDRESS]: {
    screen: SearchViewNewUI
  },
  [ScreenName.PROFILE]: {
    screen: ProfileScreen
  },
  [ScreenName.DEBUG_DEV]: {
    screen: DebugList
  },
  [ScreenName.HELP]: {
    screen: HelpHome
  },
  [ScreenName.WEBHELPER]: {
    screen: WebHelper
  },
  [ScreenName.TRACKING_HISTORY]: {
    screen: DetailTrackingLog
  },
  [ScreenName.SCHEDULE_FRAGMENT]: {
    screen: ScheduleFragment
  }
}

export default StaxiStackNavigator;