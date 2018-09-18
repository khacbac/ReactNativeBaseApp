// Home menu trái
import FeedbackHome from "./feedback/FeedbackHome";
import AboutHome from "./about/AboutHome";
import WebHelper from "./help/WebHelper";
import HelpHome from "./help/HelpHome";
import HistoryHome from "./history/HistoryHome";
import ProfileScreen from "./user/ProfileScreen";
import Promotion from "./promotion/Promotion";
import SearchViewLib from "./search/SearchViewLib";
import ScheduleFragment from "./booking/confirm/ScheduleFragment";
import DetailHistory from "./history/DetailHistory";
import DetailTrackingLog from "./history/DetailTrackingLog";
import ScreenName from "../ScreenName";
import DebugList from "./../zdeveloper/DebugActivity";
import BookTaxiActivity from "./booking/BookTaxiActivity";

const BaseStackNavigator = {
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
    screen: Promotion
  },
  [ScreenName.FEEDBACK]: {
    screen: FeedbackHome
  },
  [ScreenName.ABOUT]: {
    screen: AboutHome
  },
  [ScreenName.SEARCH_ADDRESS]: {
    screen: SearchViewLib
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

export default BaseStackNavigator;