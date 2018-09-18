import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "../../../../../module";
import Constants from "../../../../constant/Constants";
import ViewCarViewModel from "../../../../viewmodel/booking/viewcar/ViewCarViewModel";
import strings from "../../../../../res/strings";
import colors from "../../../res/colors";

export interface Props {
  viewCarViewModel: ViewCarViewModel;
  message?: string;
}

interface State {
  message: string;
  isShowButton: boolean;
}

export default class WaitDriverView extends React.Component<Props, State> {
  private viewCarViewModel: ViewCarViewModel;

  constructor(props: Props) {
    super(props);
    this.viewCarViewModel = this.props.viewCarViewModel;
    //hiện thị thông báo
    let message = strings.book_receive_taxi_note_2;
    message = message.replace(
      Constants.STRING_ARGS,
      props.viewCarViewModel.getBookTaxiModel().company.reputation
    );

    this.state = {
      message: props.message || message,
      isShowButton: this.viewCarViewModel.getBookTaxiModel().isStart()
    };
  }

  componentDidMount() {}

  _cancelBook() {
    if (this.viewCarViewModel) {
      this.viewCarViewModel.askUserForCancel();
    }
  }

  public showButton() {
    this.setState({ isShowButton: true });
  }

  public hideButton() {
    this.setState({ isShowButton: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text text={this.state.message} textStyle={styles.txtWaitCar} />
        {this.state.isShowButton && (
          <View style={styles.btnContainer}>
            <Button
              text={strings.book_cancel_btn}
              btnStyle={styles.btnCancel}
              textStyle={{
                color: colors.colorWhiteFull
              }}
              onPress={() => this._cancelBook()}
            />
            <View style={{ width: 10 }} />
            <Button
              text={strings.book_invite_meet_car_btn}
              btnStyle={styles.btnBook}
              textStyle={{
                color: colors.colorWhiteFull
              }}
              disabled={true}
              activeOpacity={1}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "96%",
    backgroundColor: colors.colorWhiteFull,
    padding: 8,
    borderRadius: 8
  },
  txtWaitCar: {
    fontStyle: "italic",
    fontSize: 16,
    color: colors.colorDarkLight,
    paddingLeft: 8,
    paddingRight: 8
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  btnCancel: {
    flex: 1,
    borderRadius: 8,
    // height: 46,
    backgroundColor: colors.colorSub
  },
  btnBook: {
    flex: 1,
    borderRadius: 8,
    // height: 46,
    backgroundColor: colors.colorGrayLight
  }
});
