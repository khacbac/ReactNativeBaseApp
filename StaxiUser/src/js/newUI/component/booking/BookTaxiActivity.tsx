/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 11:50:49
 * @modify date 2018-07-18 11:50:49
 * @desc [Lớp xử lý giao diện chung cho màn hình đặt xe]
 */
import * as React from "react";

import BookingHomeView from "./home/BookingHomeView";
import AbstractBookTaxiActivity from "../../../component/booking/AbstractBookTaxiActivity";
import ConfirmBookView from "./confirm/ConfirmBookView";
import ShowTaxiOnMap from "./viewcar/ShowTaxiOnMap";
import { Region } from "react-native-maps";
import RatingBookView from "./rating/RatingBookView";

class BookTaxiActivity extends AbstractBookTaxiActivity {
  constructor(props) {
    super(props);
  }

  protected getBookingHomeView() {
    return (
      <BookingHomeView
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getConfirmBookView() {
    return (
      <ConfirmBookView
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getShowTaxiOnMap() {
    return (
      <ShowTaxiOnMap
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getRatingBookView() {
    return <RatingBookView bookingViewModel={this.bookingVM} />;
  }

  protected onRegionChangeCompleted(region: Region) {
    this.bookingVM.onRegionChangeCompleted(region);
  }

  renderHeader() {
    return null;
  }
}

export default BookTaxiActivity;
