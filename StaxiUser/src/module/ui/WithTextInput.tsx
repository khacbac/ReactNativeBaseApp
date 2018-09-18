import * as React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PlatformOS from "../PlatformOS";

interface Props {
  
}
export class WithTextInput extends React.Component<Props>{
  render() {
    if (PlatformOS.ios())
      return <WithTextInputIOS>{this.props.children}</WithTextInputIOS>;
    return <WithTextInputAndroid>{this.props.children}</WithTextInputAndroid>;
  }
}

export class WithTextInputIOS extends React.Component<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            {this.props.children}
          </TouchableWithoutFeedback>
          {/* {this.props.children} */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export class WithTextInputAndroid extends React.Component<Props> {
  render() {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
      >
        {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
export default WithTextInput;
