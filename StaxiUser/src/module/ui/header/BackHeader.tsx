import * as React from "react";

import {
  TouchableOpacity,
  StatusBar,
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp
} from "react-native";

import color from "../../../res/colors";
import images from "../../../res/images";
import dimens from "../res/dimen/dimens";
import fonts from "../res/dimen/fonts";

interface Props {
  drawerBack?: Function;
  title?: string;
  inputStyle?;
  style?: StyleProp<ViewStyle>;
}

interface State {}

class BackHeader extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ width: "100%" }}>
        <View
          style={[
            {
              width: "100%",
              padding: dimens.padding_back_header,
              backgroundColor: color.colorMain,
              flexDirection: "row",
              alignItems: "center"
            },
            this.props.style
          ]}
        >
          <TouchableOpacity onPress={() => this.props.drawerBack()}>
            <Image
              source={images.ic_arrow_back}
              resizeMode="contain"
              style={{
                width: dimens.size_icon_back_header,
                height: dimens.size_icon_back_header
              }}
            />
          </TouchableOpacity>

          <Text style={[styles.input, this.props.inputStyle]}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    color: "white",
    fontSize: fonts.text_size,
    padding: dimens.padding_back_header,
    fontWeight: "bold"
  }
});

export default BackHeader;
