import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import uicolors from './res/colors';
import uifonts from './res/dimen/fonts';
import {LifeComponent} from '../..';

interface Props {
  ellipsizeMode?;
  numberOfLines?;
  textStyle?;
  text?;
  style?;
}

interface State {
  text: string;
  textStyle?;
}

export default class CusText extends LifeComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.children || this.props.text,
    };
  }

  /**
   * TODO: chưa sử dụng
   * @param text
   * @param callback
   */
  public setText(text: string, callback?: Function) {
    if (text !== this.state.text) {
      this.setState({text: text}, () => callback && callback());
    }
  }

  setTextStyle(newTextStyle) {
    this.setState({textStyle: newTextStyle});
  }

  public getText(): string {
    return (
      (this.props.children instanceof String &&
        this.props.children.toString()) ||
      this.state.text
    );
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    return (
      <Text
        ellipsizeMode={this.props.ellipsizeMode}
        numberOfLines={this.props.numberOfLines}
        style={[styles.text, this.props.style || this.props.textStyle]}
      >
        {this.props.children || this.state.text}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: uicolors.colorDark,
    fontSize: uifonts.text_size,
    textAlignVertical: 'center',
  },
});
