import * as React from "react";
import { StyleSheet, View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";
import styles from "./res/styles";

interface Props {
  borderRadius?;
  btnStyle?:StyleProp<ViewStyle>;
  onPress?;
  activeOpacity?;
  textStyle?:StyleProp<TextStyle>;
  text?;
  disabled?;
}

interface State { }

export default class Button extends React.Component<Props, State> {
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={[
          styles.button,
          { borderRadius: this.props.borderRadius },
          this.props.btnStyle
        ]}
        onPress={this.props.onPress}
        activeOpacity={this.props.activeOpacity || 0.2}
      >
        {this.props.children || (
          <Text style={[styles.text, this.props.textStyle]}>
            {this.props.text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

