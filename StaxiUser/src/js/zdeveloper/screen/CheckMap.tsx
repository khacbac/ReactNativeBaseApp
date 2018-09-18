import * as React from "react";

import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import strings from "../../../res/strings";
import { Text } from "../../../module";
import colors from "../../../res/colors";
import BackHeader from "../../../module/ui/header/BackHeader";

class CheckMap extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  private drawMarker() {}

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "green" }}>
        <BackHeader
          title="Kiểm tra các chức năng bản đồ"
          drawerOpen={() => this.props.navigation.goBack()}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "red"
          }}
          onPress={() => {
            this.drawMarker();
          }}
        >
          <Text
            style={{ fontSize: 18, color: "black", backgroundColor: "red" }}
          >
            Vẽ danh sách marker
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

export default CheckMap;
