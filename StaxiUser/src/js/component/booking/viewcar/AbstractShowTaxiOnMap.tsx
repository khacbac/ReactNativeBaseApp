import * as React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
} from "react-native";

import ViewCarViewModel from "../../../viewmodel/booking/viewcar/ViewCarViewModel";
import ViewCarPage from "../../../viewmodel/booking/viewcar/ViewCarPage";
import ViewCarPresenter from "../../../viewmodel/booking/viewcar/ViewCarPresenter";
import {RippleBackground } from "../../../../module";
import BookingViewModel from "../../../viewmodel/booking/BookingViewModel";
import IWaitDriverView from "../../../viewmodel/booking/viewcar/IWaitDriverView";


export interface Props {
  bookingViewModel: BookingViewModel;
  page?: ViewCarPage;
  navigation;
}

export interface State {
  page: ViewCarPage;
  waitDriver: boolean;
}

export default class AbstractShowTaxiOnMap extends React.Component<Props, State>
  implements ViewCarPresenter {

  protected viewCarModel: ViewCarViewModel;

  constructor(props: Props) {
    super(props);
    // khởi tạo Presenter.
    this.props.bookingViewModel.hideHeader();
    this.viewCarModel = new ViewCarViewModel(this, this.props.bookingViewModel);
    this.viewCarModel.onInit();
    this.state = {
      page: ViewCarPage.WAIT_CAR,
      waitDriver: false,
    };
  }

  /** hiện thị giao diện  */
  showWaitCarLayout = (msg?: string) => {
    if (this.state.page == ViewCarPage.WAIT_CAR) {
      (this.refs.WaitDriverView as IWaitDriverView).showButton();
    } else {
      this._renderViewCarStatus(ViewCarPage.WAIT_CAR);
    }
  };

  /**
   * @override
   * @param isShow
   * Anmation sóng tỏa ra xung quanh đợi hãng gán xe.
   */
  public visibleAnimationWaitCar(isShow: boolean) {
    this.setState({
      waitDriver: isShow
    });

    let rippleAnim = this.refs.ripple as RippleBackground;
    if (!rippleAnim) return;

    if (isShow) {
      rippleAnim.startAnimation();
    } else {
      rippleAnim.stopAnimation();
    }
  }

  async retryBooking() {

    //tạo mới view model
    this.viewCarModel = new ViewCarViewModel(this, this.props.bookingViewModel);

    //inits
    await this.viewCarModel.onInit();

    //thiết lập lại giao diện
    this.setState({
      page: ViewCarPage.WAIT_CAR,
      waitDriver: false
    });

    //bắt đầu đặt lại cuốc
    this.viewCarModel.setContent();
  }

  public showLayout(page: ViewCarPage) {
    this._renderViewCarStatus(page);
  }

  _renderViewCarStatus = (oldPage: ViewCarPage) => {
    this.setState({ page: oldPage });
  };

  public renderViewCar = (page: ViewCarPage) => {
    return null;
  };

  componentDidMount() {
    this.viewCarModel.setContent();
  }

  componentWillUnmount() {
    this.viewCarModel.componentWillUnmount();
  }
}
