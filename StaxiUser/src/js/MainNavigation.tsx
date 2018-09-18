/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-20 10:55:24
 * @modify date 2018-07-20 10:55:24
 * @desc [Giao diện điều hướng các các màn hình khi đặt taxi]
 */

import * as React from "react";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import MainMenu from "./MainMenu";
import ScreenName from "./ScreenName";
import { MainStackNavigator } from "../../../app/AppConfig";

const Navigator = createStackNavigator(
  {
    ...MainStackNavigator
  },
  {
    headerMode: "none",
    initialRouteName: ScreenName.BOOKING
  }
);

// Khởi tạo menu trái cấp I
const MainNavigation = createDrawerNavigator(
  {
    Navigator: {
      screen: Navigator
    }
  },
  {
    initialRouteName: "Navigator",
    drawerPosition: "left",
    contentComponent: props => <MainMenu navigatorProps={props} />,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

interface Props {
  navigation?;
}

interface State {
  drawerLockMode;
}

class MainNavigator extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      drawerLockMode: "unlocked"
    };
  }

  updateDrawerLockMode(lockMode) {
    this.setState({
      drawerLockMode: lockMode
    });
  }

  unlockDrawer() {
    this.setState({
      drawerLockMode: "unlocked"
    });
  }

  lockDrawer() {
    this.setState({
      drawerLockMode: "locked-closed"
    });
  }

  /**
   * screenProps: props bắt buộc để truyền param xuống navigation
   * drawerLockMode: bắt buộc sử dụng để khóa màn hinh
   */
  render() {
    return (
      <MainNavigation
        screenProps={{
          drawerLockMode: this.state.drawerLockMode,
          mainNavigation: this,
          navigation: this.props.navigation
        }}
      />
    );
  }
}

export default MainNavigator;
