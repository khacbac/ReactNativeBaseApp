import * as React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
} from "react-native";

import WaitDriverView from "./WaitDriverView";
import DriverView from "./DriverView";
import FinishBookView from "./FinishBookView";
import ViewCarPage from "../../../viewmodel/booking/viewcar/ViewCarPage";
const { width, height } = Dimensions.get("window");

import AbstractShowTaxiOnMap, {Props} from "./AbstractShowTaxiOnMap";
import AddressView from "../AddressView";
import strings from "../../../../res/strings";
import colors from "../../../../res/colors";
import images from "../../../../res/images";
import { ButtonIconOnMap, RippleBackground } from "../../../../module";


export default class ShowTaxiOnMap extends AbstractShowTaxiOnMap{

  constructor(props: Props) {
    super(props);
  }

  renderViewCar = (page: ViewCarPage) => {
    switch (page) {
      case ViewCarPage.VIEW_CAR:
        return <DriverView viewCarViewModel={this.viewCarModel} />;
      case ViewCarPage.FINISH:
        return <FinishBookView viewCarViewModel={this.viewCarModel} />;
      default:
        return <WaitDriverView viewCarViewModel={this.viewCarModel} ref="WaitDriverView" />;
    }
  };

  render() {
    return <View style={{ justifyContent: "space-between", height: "100%", width: "100%", alignItems: "center" }}>
      <View style={styles.addressLayout}>
        <AddressView
          address={this.viewCarModel.getBookTaxiModel().srcAddress.formattedAddress}
          title={strings.book_address_from}
          titleStyle={{
            color: colors.colorMain
          }}
          leftIcon={images.ic_oval}
          leftIconStyle={{ tintColor: colors.colorMain }}
          editable={false} />

        {this.viewCarModel
          .getBookTaxiModel()
          .isValidDstAddress() ?
          <AddressView
            address={this.viewCarModel.getBookTaxiModel().dstAddress.formattedAddress}
            title={strings.book_address_to}
            titleStyle={{
              color: colors.colorSub
            }}
            leftIcon={images.ic_oval}
            leftIconStyle={{ tintColor: colors.colorSub }}
            editable={false}
            style={{ marginTop: 6 }} />
          : null}
      </View>

      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
          <ButtonIconOnMap
            onPress={() => this.viewCarModel.actionIconOnMap()}
          />

        </View>
        {this.renderViewCar(this.state.page)}
      </View>

      {/* Anmation sóng tỏa ra xung quanh đợi hãng gán xe. */}
      {this.state.waitDriver &&
        <RippleBackground
          ref="ripple"
          rippleContainer={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
        />}

      {/* View trên top block tương tác */}
      {this.state.waitDriver &&
        <View
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height - 200,
            opacity: 0,
            position: "absolute",
            justifyContent: "center",
            alignItems: "center"
          }}
        />}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    // backgroundColor: colors.colorWhiteFull,
    bottom: 0,
    width: width,
    padding: 10
  },
  addressLayout: {
    width: width - 20,
    backgroundColor: "transparent",
    marginTop: 6,
    shadowRadius: 5,
    position: "absolute"
  }
});