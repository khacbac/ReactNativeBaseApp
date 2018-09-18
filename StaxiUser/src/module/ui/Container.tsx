import * as React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import BackHeader from "./header/BackHeader";
import fonts from "./res/dimen/fonts";
import MenuHeader from "./header/MenuHeader";
import PlatformOS from "../PlatformOS";

interface Props {
  navigation?;

  /** nếu hiện thị header thì hiện thị menu hay back */
  isMenu?: boolean;

  /** có hiện thị header hay không */
  isHeader?: boolean;

  style?;

  /** Tiêu đề header khi hiện thị*/
  title?: string;
}
export class Container extends React.Component<Props> {

  private isMouted: false;

  render() {
    if (PlatformOS.ios()) return <ContainerIOS {...this.props} />;
    return <ContainerAndroid {...this.props} />;
  }
}

class ContainerIOS extends React.Component<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ContainerAndroid {...this.props} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

class ContainerAndroid extends React.Component<Props> {
  private renderHeader() {
    if (!this.props.isHeader) return null;

    if (this.props.isMenu) {
      return (
        <MenuHeader
          title={this.props.title}
          drawerOpen={() =>
            this.props.navigation && this.props.navigation.openDrawer()
          }
        />
      );
    } else {
      return (
        <BackHeader
          title={this.props.title}
          drawerBack={() => {
            this.props.navigation && this.props.navigation.goBack(null);
          }}
        />
      );
    }
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
        <TouchableWithoutFeedback
          style={[styles.container, this.props.style]}
          onPress={Keyboard.dismiss}
        >
          {this.props.children}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  text: {
    fontSize: fonts.text_size
  }
});
export default Container;
