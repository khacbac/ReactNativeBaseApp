import * as React from "react";

import { StyleSheet, View, TouchableOpacity, Platform, Image } from "react-native";
import colors from "../../../../res/colors";
import { Text, PlatformOS } from "../../../../module";
import strings from "../../../../res/strings";

import ImageCust from "../../../../module/ui/Image"
import images from "../../../../res/images";
import Svg, { Image as SvgImage} from "react-native-svg";
import fonts from "../../../../module/ui/res/dimen/fonts";
import ScreenUtils from "../../../../module/ui/res/dimen/ScreenUtils";

export enum StateCar {
  NoCar,
  AvailableCar
}

export interface Props {
  time?: string;
  textContent?: string;
  onPress?: Function;
}

export interface State {
  time: string;
  textContent: string;
}

class StartMarker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let init = props.textContent
      ? props.textContent
      : this.props.time == ""
        ? strings.title_marker_center_no_car
        : strings.book_selecter_address_btn;
    this.state = {
      time: this.props.time || "",
      textContent: init
    };
  }

  /* thời gian xe đến, time = -1 thì k có xe, sẽ hiển thị warning thay thế */
  updateTime(time) {
    if (time == -1) {
      this.setState({
        time: time,
        textContent: strings.title_marker_center_no_car
      });
    } else {
      this.setState({
        time: time,
        textContent: strings.book_selecter_address_btn
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.time === nextState.time) return false;
    return true;
  }

  updateTextContent(text) {
    this.setState({ textContent: text });
  }

  imageIcon = (imageName: string, w: number, h: number) => {
    if (PlatformOS.ios()) {
      return <ImageCust source={{ uri: imageName }} imgStyle={{ width: w, height: h, tintColor: null }} />
    } else {
      return (
        <Svg width={w} height={h}>
          <SvgImage width="100%" height="100%" href={{ uri: imageName }} />
        </Svg>
      );
    }
  };

  imageMarker = () => {
    if (Platform.OS == 'ios') {
      let dimension:{w:number, h:number} = ScreenUtils.convertValueByIosDpi({w:22, h:22}, {w:32, h:32});
      return <Image source={images.ic_marker_start_uri} style={{width:dimension.w, height:dimension.h}} />
    } else {
      let dimension:{w:number, h:number} = ScreenUtils.convertValueByDpi({w:16, h:16}, {w:20, h:20}, {w:24, h:24}, {w:32, h:32}, {w:48, h:48});
      // LogFile.e("imageMarker ", JSON.stringify(dimension));
      return (
        <Svg width={dimension.w} height={dimension.h}>
          <SvgImage width="100%" height="100%" href={images.ic_marker_start_uri} />
        </Svg>
      );
    }
  };


  render() {
    return (
      <TouchableOpacity
        style={{ flexDirection: "column", alignItems: "center" }}
        onPress={() => { }}
      >
        <View style={styles.container}>
          <View style={styles.time}>
            {this.state.time == "" ? (
              this.imageIcon("ic_warning", 22, 22)
            ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70%"
                  }}
                >
                  <Text
                    text={this.state.time}
                    numberOfLines={2}
                    textStyle={{
                      fontSize: 13,
                      color: colors.white,
                      fontWeight: "bold"
                    }}
                  />
                  <Text
                    text={strings.book_comfirm_minute_lable}
                    numberOfLines={2}
                    textStyle={{
                      fontSize: 10,
                      color: colors.white,
                      fontWeight: "bold"
                    }}
                  />
                </View>
              )}
          </View>
          <View style={styles.content}>
            <Text
              text={this.state.textContent}
              textStyle={{ fontSize: fonts.body_2 }}
            />
          </View>
          <View style={styles.arrow}>
            {this.imageIcon("ic_arrow_right", 18, 18)}
          </View>
        </View>
        {this.imageMarker()}
      </TouchableOpacity>
    );
  }

  /** tạo UI giao diện */
  public static create(callback: Function) {
    return <StartMarker ref={(ref) => callback && callback(ref)} />;
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 32,
    borderRadius: 7,
    backgroundColor: colors.colorMain,
    flexDirection: "row",
    alignSelf: "center"
  },
  time: {
    width: 32,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colorMain,
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7
  },
  content: {
    padding: 4,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center"
  },
  arrow: {
    width: 22,
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
    alignItems: "center"
  }
});

export default StartMarker;
