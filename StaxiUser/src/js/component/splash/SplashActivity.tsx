/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-20 10:48:19
 * @modify date 2018-07-20 10:48:19
 * @desc [Lớp khởi tạo dữ liệu cho toàn bộ ứng dụng]
 */

import * as React from "react";

import { Image, Alert } from "react-native";

import SplashViewModel, { SplashType } from "../../viewmodel/splash/SplashViewModel";
import LogFile from "../../../module/LogFile";
import ScreenName from "../../ScreenName";
import images from "../../../res/images";


interface Props {
  navigation: any;
  screenProps;
}

class SplashActivity extends React.Component<Props> {

  /** view model */
  private model:SplashViewModel;

  // Hàm khởi tạo
  constructor(props) {
    super(props);
  }

  // Xử lý ngay sau khởi tạo
  componentDidMount() {

    // console.log("SplashScreen #######################");
    this.model = new SplashViewModel();

    this.model.componentDidMount(this.props.navigation)
      .then((ret: SplashType) => {
        if (ret === SplashType.REGISTRY) {
          // Vào màn hình home
          this.props.navigation.replace(ScreenName.MAIN_NAVIGATION);
        } else if (ret === SplashType.NOT_REGISTRY) {
          this.props.navigation.replace(ScreenName.USER_ACTIVITY);
        }
      })
      .catch(err => {
        LogFile.e("SplashActivity", err);
        Alert.alert("Đồng bộ dữ liệu không thành công");
      });
  }

  componentWillUnmount(){
    this.model.componentWillUnmount();
    this.model = null;
  }

  render() {
    return (
      <Image
        style={{ width: "100%", height: "100%" }}
        resizeMode="stretch"
        source={images.splash_screen}
      />
    );
  }
}

export default SplashActivity;
