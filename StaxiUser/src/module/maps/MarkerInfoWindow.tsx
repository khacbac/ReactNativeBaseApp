import * as React from "react";

import { StyleSheet, Text } from "react-native";

import { Callout } from "react-native-maps";
import fonts from "../ui/res/dimen/fonts";


export interface Props {
  title: string;
}

export interface State {
  title: string;
}

class MarkerInfoWindow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || ""
    };
  }

  setTitle(text?: string) {  
    this.setState({ title: text || "" });
  }

  render() {
    return (
      <Callout>
        <Text style={{ fontSize: fonts.caption }}>
          {this.state.title}
        </Text>
      </Callout>
    );
  }

  /**
   * tạo đối tượng jsx
   * @param title
   */
  public static create(title?: string, referent?: Function) {
    return (
      <MarkerInfoWindow title={title} ref={ref => referent && referent(ref)} />
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 100
  }
});

export default MarkerInfoWindow;
