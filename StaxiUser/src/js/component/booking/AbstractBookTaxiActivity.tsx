/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 11:50:49
 * @modify date 2018-07-18 11:50:49
 * @desc [Lớp xử lý giao diện chung cho màn hình đặt xe]
 */

import * as React from "react";

import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Platform
} from "react-native";

import { Dialog, AlertLayout, LifeComponent, Header } from "../../../module";

import BookingViewModel, {
  FragmentMap,
  HeaderType,
  BookHomePresenter
} from "../../viewmodel/booking/BookingViewModel";

import BookedStep from "../../constant/BookedStep";
import colors from "../../../res/colors";
import strings from "../../../res/strings";
import { Region } from "react-native-maps";
import LogFile from "../../../module/LogFile";
import LoadingMap from "./LoadingMap";
import AnimatedMarker from "../../../module/maps/AnimatedMarker";
import MapManager from "./MapManager";
import SessionStore from "../../Session";

export interface State {
  layout: JSX.Element;
}

export interface Props {
  navigation: any;
}

export default class AbstractBookTaxiActivity
  extends LifeComponent<Props, State>
  implements BookHomePresenter {
  protected bookingVM: BookingViewModel;

  constructor(props) {
    super(props);

    this.initBookingViewModel();
    //kiểm tra page active
    //nếu có book đang hoạt động thì vào màn hình view car luôn
    let activePage: FragmentMap;
    if (this.bookingVM.getBookTaxiModel().state >= BookedStep.INITBOOK) {
      activePage = FragmentMap.SHOW_TAXI;
    } else {
      activePage = FragmentMap.LOADING;
    }

    this.state = {
      layout: this.renderView(activePage)
    };
  }

  protected initBookingViewModel() {
    this.bookingVM = new BookingViewModel(this);
  }

  public getNavigation() {
    return this.props.navigation;
  }

  /*** lấy đối tượng dialog */
  public getDialog(): Dialog {
    return this.refs.dialog as Dialog;
  }

  /**
   * hiện thị giao diện
   * @param {*} page
   */
  showFragment(fragmentMap: FragmentMap) {
    this.setState({ layout: this.renderView(fragmentMap) });
  }

  private getRegion() {
    // console.log("test_move_map_get_region");
    // if (this.bookingVM.getBookTaxiModel().isTouchMoveMap) { return; }
    //nếu có region truyền vào
    let location =
      this.bookingVM.getCurrentLatLng() ||
      SessionStore.getLastBookAddress().location;

    //trả về region mặc định
    return (
      this.bookingVM.moveRegion || {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
      }
    );
  }

  /**
   * vùng thay đổi
   */
  protected onRegionChangeCompleted(region: Region) {
    // this.bookingVM.onRegionChangeCompleted(region);
  }

  /**
   * map đã sắn sàng làm việc
   */
  private onMapReady(mapManager: MapManager) {
    // console.log("onMapReady ====================");
    //nếu map chưa khởi tạo thì bỏ qua
    if (mapManager == null) {
      LogFile.e("onMapReady MapManager is null");
      return;
    }
    //xử lý giao diện khi map đã ready
    this.bookingVM.onMapReady(mapManager);
  }

  componentDidMount() {
    super.componentDidMount();
    this.bookingVM.componentDidMount();
  }

  /**
   * lấy đối tượng tham chiếu
   * @param ref
   */
  public getAnimatedMarkerRef(ref: string): AnimatedMarker {
    if (ref == null || ref == undefined) return null;

    let obj = this.refs[ref];
    if (obj != null) return obj as AnimatedMarker;
    return null;
  }

  /**
   * show header
   * @param type
   */
  public showHeader(type: HeaderType, title?: string) {
    title = title || strings.home_screen_title;
    let onPress;
    if (type == HeaderType.MENU) {
      onPress = () => this.props.navigation.openDrawer();
    } else if (type == HeaderType.BACK) {
      onPress = () => this.onBackPressed();
    }
    if (this.refs.headerRef != null) {
      (this.refs.headerRef as Header).setHeader(type, title, onPress);
    }
  }

  private onBackPressed() {
    this.bookingVM.showFragment(FragmentMap.BOOK_HOME);
  }

  componentWillUnmount() {
    this.bookingVM.componentWillUnmount();
  }

  private renderView(page: FragmentMap) {
    // console.log("renderView .page ====", page);
    switch (page) {
      case FragmentMap.BOOK_HOME:
        return this.getBookingHomeView();
      case FragmentMap.CONFIRM_HOME:
        return this.getConfirmBookView();
      case FragmentMap.SHOW_TAXI:
        return this.getShowTaxiOnMap();
      case FragmentMap.RATING:
        return this.getRatingBookView();
      default:
        return <LoadingMap />;
    }
  }

  protected getBookingHomeView() {
    return null;
  }

  protected getConfirmBookView() {
    return null;
  }

  protected getShowTaxiOnMap() {
    return null;
  }

  protected getRatingBookView() {
    return null;
  }

  public getAlertLayout(): AlertLayout {
    return this.refs.alertLayoutRef as AlertLayout;
  }

  protected renderHeader() {
    return (
      <Header
        ref="headerRef"
        headerType={HeaderType.MENU}
        title={strings.home_screen_title}
        onPress={() => this.props.navigation.openDrawer()}
      />
    );
  }

  render() {
    // console.log("this.state.isStartMarker ===", this.state.isStartMarker);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/*giao diện header*/
            this.renderHeader()
          }

          {/*nội dung*/}
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.bookingVM.getBookTaxiModel().setTouchMoveMap(true);
            }}
            style={{ flex: 1 }}
          >
            <View style={styles.container}>
              {/*bản đồ*/}
              <MapManager
                // style={styles.mapContainer}
                initialRegion={() => this.getRegion()}
                onMapReady={mapManager => this.onMapReady(mapManager)}
                onRegionChangeComplete={region =>
                  this.onRegionChangeCompleted(region)
                }
              />
              {/*nội dung trên bản đồ*/}
              <View style={styles.content}>
                <View style={styles.alertPopup}>
                  <AlertLayout ref="alertLayoutRef" />
                </View>

                {/* Nội dụng của footer */}
                <View style={{ flex: 1 }}>
                  {this.state.layout}
                </View>
              </View>

              {/*View dùng để touch menu trên bản đồ*/}
              <View style={styles.mapDrawerOverlay} />
            </View>
          </TouchableWithoutFeedback>

          {/* common dialog */}
          <Dialog ref="dialog"/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  icon: {
    width: 24,
    height: 24
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject
  },

  content:
    Platform.OS === "android"
      ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        alignItems: "center"
      }
      : {
        position: "absolute",
        height: "100%",
        alignItems: "center"
      },
  mapDrawerOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.0,
    height: "100%",
    width: 10
  },
  alertPopup: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.colorDark,
    opacity: 0.7,
    alignItems: "center",
    justifyContent: "center"
  }
});
