/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-05 01:21:32
 * @modify date 2018-09-05 01:21:32
 * @desc [Header cho ứng dụng]
 */

import * as React from "react";
import MenuHeader from "./MenuHeader";
import BackHeader from "./BackHeader";

interface Props {
  onPress?: Function;
  title?: string;
  headerType?: number;
  style?: any;
}

interface State {
  headerType: number;
  title: string;
}

export enum HeaderType {
  NONE,
  BACK,
  MENU
}

class Header extends React.Component<Props, State> {
  private onPress: Function;
  constructor(props) {
    super(props);
    this.onPress = this.props.onPress;
    this.state = {
      headerType: this.props.headerType || HeaderType.NONE,
      title: this.props.title || ""
    };
  }

  setHeader(headerType: HeaderType, title?: string, onPress?: Function) {
    this.onPress = onPress;
    this.setState({
      headerType: headerType || HeaderType.NONE,
      title: title || ""
    });
  }

  setTitle(title: string) {
    this.setState({
      title: title || ""
    });
  }

  setHeaderType(headerType: HeaderType) {
    this.setState({
      headerType: headerType || HeaderType.NONE
    });
  }

  setOnPress(onPress: Function) {
    this.onPress = onPress;
  }

  private onPressMenu() {
    this.onPress && this.onPress();
  }

  render() {
    switch (this.state.headerType) {
      case HeaderType.MENU:
        return (
          <MenuHeader
            title={this.state.title}
            drawerOpen={() => this.onPressMenu()}
          />
        );
      case HeaderType.BACK:
        return (
          <BackHeader
            title={this.state.title}
            drawerBack={() => this.onPressMenu()}
          />
        );
      default:
        return null;
    }
  }
}

export default Header;
