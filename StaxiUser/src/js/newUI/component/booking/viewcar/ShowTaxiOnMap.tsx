import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import AbstractShowTaxiOnMap, {
  Props
} from "../../../../component/booking/viewcar/AbstractShowTaxiOnMap";
import ViewCarPage from "../../../../viewmodel/booking/viewcar/ViewCarPage";
import WaitDriverView from "./WaitDriverView";
import FinishBookView from "./FinishBookView";
import DriverView from "./DriverView";
import colors from "../../../res/colors";
import AddressView from "../../../../component/booking/AddressView";
import strings from "../../../../../res/strings";
import newImages from "../../../res/images";
import { RippleBackground } from "../../../../../module";
const { width, height } = Dimensions.get("window");

export default class ShowTaxiOnMap extends AbstractShowTaxiOnMap {
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
        return (
          <WaitDriverView
            viewCarViewModel={this.viewCarModel}
            ref="WaitDriverView"
          />
        );
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View style={styles.container}>
          <View style={styles.addressLayout}>
            <AddressView
              address={
                this.viewCarModel.getBookTaxiModel().srcAddress.formattedAddress
              }
              title={strings.book_address_from}
              titleStyle={{
                color: colors.colorMain
              }}
              leftIcon={newImages.ic_oval}
              leftIconStyle={{ tintColor: colors.colorMain }}
              editable={false}
            />

            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.colorWhiteMedium
              }}
            />

            {this.viewCarModel.getBookTaxiModel().isValidDstAddress() ? (
              <AddressView
                address={
                  this.viewCarModel.getBookTaxiModel().dstAddress
                    .formattedAddress
                }
                title={strings.book_address_to}
                titleStyle={{
                  color: colors.colorSub
                }}
                leftIcon={newImages.ic_oval}
                leftIconStyle={{ tintColor: colors.colorSub }}
                editable={false}
                style={{ marginTop: 6 }}
              />
            ) : null}
          </View>

          {this.renderViewCar(this.state.page)}
        </View>

        {/* Anmation sóng tỏa ra xung quanh đợi hãng gán xe. */}
        {this.state.waitDriver && (
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
          />
        )}

        {/* View trên top block tương tác */}
        {this.state.waitDriver && (
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - 200,
              opacity: 0,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 12,
    marginBottom: 12,
    position: "absolute",
    backgroundColor: colors.colorWhiteFull,
    bottom: 0,
    borderRadius: 8,
    elevation: 3
  },
  addressLayout: {
    width: width - 20,
    backgroundColor: "transparent",
    shadowRadius: 5,
    borderRadius: 8
  }
});
