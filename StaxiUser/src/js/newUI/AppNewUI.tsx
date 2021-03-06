/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-08-23 10:48:46
 * @modify date 2018-08-23 10:48:46
 * @desc [Màn hình đầu vào cho ứng dụng]
 */

import * as React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { createStackNavigator } from "react-navigation";
import { PlatformOS } from "../../module";
import colors from "../../res/colors";
import ScreenName from "../ScreenName";
import StaxiAppNavigator from "./StaxiAppNavigator";

class AppNewUI extends React.Component {
  render() {
    return (
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          paddingTop: PlatformOS.ios() ? 20 : 0,
          backgroundColor: colors.colorMain
        }}
      >
        <StatusBar
          barStyle="light-content"
        />
        <Navigator
          screenProps={{
            lancher: null
          }}
        />
      </SafeAreaView>
    );
  }
}

//điều hướng cho ứng dụng khi khởi tạo
const Navigator = createStackNavigator(
  {
    ...StaxiAppNavigator
  },
  {
    headerMode: "none",
    initialRouteName: ScreenName.LOAD_APP
  }
);

export default AppNewUI;
