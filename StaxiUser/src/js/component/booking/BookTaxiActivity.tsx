/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 11:50:49
 * @modify date 2018-07-18 11:50:49
 * @desc [Lớp xử lý giao diện chung cho màn hình đặt xe]
 */

import * as React from "react";

import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import {
  Dialog,
  AlertModel,
  AlertLayout,
  LifeComponent,
  Header
} from "../../../module";

import BookingViewModel, {
  FragmentMap,
  HeaderType,
  BookHomePresenter
} from "../../viewmodel/booking/BookingViewModel";


import BookingHomeView from "./home/BookingHomeView";
import ConfirmBookView from "./confirm/ConfirmBookView";
import ShowTaxiOnMap from "../booking/viewcar/ShowTaxiOnMap";
import RatingBookView from "../booking/rating/RatingBookView";
import AbstractBookTaxiActivity from "./AbstractBookTaxiActivity";

class BookTaxiActivity extends AbstractBookTaxiActivity {

  constructor(props) {
    super(props);
  }

  protected getBookingHomeView(){
    return (
      <BookingHomeView
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getConfirmBookView(){
    return (
      <ConfirmBookView
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getShowTaxiOnMap(){
    return (
      <ShowTaxiOnMap
        bookingViewModel={this.bookingVM}
        navigation={this.props.navigation}
      />
    );
  }

  protected getRatingBookView(){
    return <RatingBookView bookingViewModel={this.bookingVM} />;
  }
}

export default BookTaxiActivity;