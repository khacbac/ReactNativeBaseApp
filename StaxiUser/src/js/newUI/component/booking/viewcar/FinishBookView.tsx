import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
  Text,
  Button,
  Image,
  CircleImage,
  NativeLinkModule,
  Utils
} from "../../../../../module";
import DriverInfo from "../../../../model/DriverInfo";
import VehicleInfo from "../../../../model/VehicleInfo";
import ViewCarViewModel from "../../../../viewmodel/booking/viewcar/ViewCarViewModel";
import FinishViewModel from "../../../../viewmodel/booking/viewcar/FinishViewModel";
import BookTaxiModel from "../../../../viewmodel/booking/BookTaxiModel";
import newImages from "../../../res/images";
import strings from "../../../../../res/strings";
import colors from "../../../res/colors";

export interface Props {
  viewCarViewModel: ViewCarViewModel;
}

export default class FinishBookView extends React.Component<Props> {
  private driverInfo: DriverInfo;
  private vehicleInfo: VehicleInfo;
  private finishViewModel: FinishViewModel;

  private rModel: BookTaxiModel;
  private driverAvatar: CircleImage;

  constructor(props: Props) {
    super(props);
    this.rModel = this.props.viewCarViewModel.getBookTaxiModel();
    this.finishViewModel = new FinishViewModel(props.viewCarViewModel);
    this.driverInfo = this.rModel.driverInfo;
    this.vehicleInfo = this.rModel.vehicleInfo;
  }

  _onFinish = async () => {
    // Hiển  thị màn hình Rating.
    this.finishViewModel.onPressDoneBooking();
  };

  _touchingOnPhone() {
    NativeLinkModule.openDialPhone(this.driverInfo.phone);
  }

  componentDidMount() {
    // Avatar lái xe
    if (
      this.rModel.driverInfo.avatarLink != null &&
      !Utils.isEmpty(this.rModel.driverInfo.avatarLink)
    ) {
      this.driverAvatar.setImageReview(this.rModel.driverInfo.avatarLink);
      this.driverAvatar.setTintColor(null);
    } else {
      this.driverAvatar.setImageRes(newImages.ic_user_menu);
      this.driverAvatar.setTintColor(colors.colorMain);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topViewContainer}>
          <View style={{ alignItems: "center" }}>
            <CircleImage
              ref={ref => (this.driverAvatar = ref)}
              source={newImages.ic_user_defatlt}
              size={72}
              tintColor={colors.colorMain}
            />

            <View style={styles.rateContainer}>
              <View style={styles.rateContent}>
                <Image source={newImages.ic_star} imgStyle={styles.starImg} />
                <Text
                  text={
                    this.driverInfo.rating
                      ? this.driverInfo.rating.toFixed(1)
                      : "5.0"
                  }
                  textStyle={styles.txtRateCount}
                />
              </View>
            </View>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text text={this.driverInfo.name} textStyle={styles.txtUserName} />
            <Text
              text={`Số xe: ${this.vehicleInfo.carNo} - ${
                this.vehicleInfo.vehiclePlate
              }`}
              textStyle={{ fontSize: 14, color: colors.colorGray }}
            />
          </View>
          <TouchableOpacity onPress={() => this._touchingOnPhone()}>
            <View style={{ alignItems: "center" }}>
              <CircleImage
                source={newImages.ic_confirm_hotline}
                tintColor={colors.colorGreen}
              />
              <Text
                text={strings.btn_call_driver}
                textStyle={{ fontSize: 14, color: colors.colorGreen }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <Button
            text={strings.btn_complete}
            btnStyle={styles.btnFinish}
            textStyle={{
              color: colors.colorWhiteFull
            }}
            onPress={this._onFinish}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorWhiteFull,
    padding: 8,
    borderRadius: 8
  },
  topViewContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rateContainer: {
    position: "absolute",
    bottom: 0,
    left: 5,
    right: 5
  },
  rateContent: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    borderWidth: 1,
    borderColor: colors.colorGray,
    width: "100%",
    backgroundColor: colors.colorWhiteFull,
    justifyContent: "center",
    paddingVertical: 2,
    alignItems: "center"
  },
  starImg: {
    width: 16,
    height: 16,
    tintColor: colors.colorSub
  },
  txtRateCount: {
    fontWeight: "bold",
    color: colors.colorSub,
    fontSize: 16,
    marginLeft: 10
  },
  txtUserName: {
    fontWeight: "bold",
    color: colors.colorBlackFull,
    fontSize: 20
  },
  bottomContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  btnFinish: {
    flex: 1,
    borderRadius: 8,
    height: 44,
    backgroundColor: colors.colorMain
  }
});
