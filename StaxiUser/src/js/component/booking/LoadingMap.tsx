import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import colors from "../../../res/colors";
export default class LoadingMap extends React.Component {
  render() {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator size="large" color={colors.colorMain} />
      </View>
    );
  }
}
