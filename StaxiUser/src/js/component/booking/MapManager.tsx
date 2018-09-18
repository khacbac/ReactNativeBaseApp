import * as React from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-24 09:26:20
 * @modify date 2018-07-24 09:26:20
 * @desc [đối tượng này nên được khởi tạo khi map đã onMapReady]
 */
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import {
  Location,
  Utils,
  MarkerOptions,
  PolylineOptions,
  PolygonOptions,
  PaddingMap,
  LifeComponent
} from "../../../module";
import images from "../../../res/images";
import MapUtils from "../../../module/maps/MapUtils";
import AnimatedMarker from "../../../module/maps/AnimatedMarker";
import colors from "../../../module/ui/res/colors";
import LogFile from "../../../module/LogFile";

interface State {
  /** danh sách marker */
  markerOptions: MarkerOptions[];

  /** các điểm vẽ polily*/
  polylines: PolylineOptions[];

  showsUserLocation: boolean;

  /** marker bắt đầu */
  startMarkerOption: MarkerOptions;

  /** marker kết thúc */
  endMarkerOption: MarkerOptions;
}

export interface Props {
  onMapReady:Function;
  initialRegion: Function;
  onRegionChangeComplete?:Function;
}

export default class MapManager extends LifeComponent<Props, State> {
  public static DEFAULT_PADDING = {
    top: 200,
    right: 60,
    bottom: 200,
    left: 60
  };

  private map: MapView;

  constructor(props) {
    super(props);
    this.state = {
      markerOptions: [],
      polylines: [],
      showsUserLocation: true,
      endMarkerOption: null,
      startMarkerOption: null
    };
  }

  private updateMarkers(markers: MarkerOptions[]) {
    this.setState({ markerOptions: markers });
  }

  private getMarkers() {
    return this.state.markerOptions;
  }

  public setMap(map: MapView) {
    this.map = map;
  }

  /* Move camera về trung tâm và set lại zoom mặc định theo app */
  public moveCenterCamera(latLng: Location, duration?: number) {
    // console.log(`test_move_map_0__${latLng}`);
    if (this.map == null) return;

    /* Nếu không có vị trí */
    if (latLng == null) return;
    /* vị trí tâm xích đạo */
    if (latLng.latitude == 0 || latLng.longitude == 0) {
      return;
    }

    //move về tâm bản đồ
    // console.log("moveCenterCamera == duration", duration)
    this.map.animateToCoordinate(
      latLng,
      duration == undefined ? 500 : duration
    );
  }

  /* Zoom bound theo danh sách bản đồ */
  public newLatLngBounds(
    coordinates?: LatLng[],
    padding?:
      | number
      | { top: number; right: number; bottom: number; left: number }
  ) {
    // console.log(
    //   `test_move_map_1__${coordinates}_padding: ${JSON.stringify(padding)}`
    // );
    if (coordinates === undefined || coordinates.length === 0) return;

    if (this.map == null) return;

    let pad;
    if (typeof padding === "number") {
      pad = { top: padding, right: padding, bottom: padding, left: padding };
    } else {
      pad = padding || MapManager.DEFAULT_PADDING;
    }

    // console.log("newLatLngBounds", pad);

    //zoom bản đồ
    this.map.fitToCoordinates(coordinates, {
      edgePadding: pad,
      animated: true
    });
  }

  /* Xóa sạch bản đồ */
  clear() {
    //thiết lập lại state
    // console.log("clear %%%%%%%%%%%%%%%%%%%%%");
    this.setState({
      markerOptions: [],
      polylines: [],
      startMarkerOption: null,
      endMarkerOption: null
    });
  }

  /**
   * thêm 1 mảng các marker
   * hạn chế mảng dữ liệu quá lớn
   * @param markerOptions
   */
  public addMarkers(markerOptions: MarkerOptions[]): MarkerOptions[] {
    //kiểm tra danh sách khi add
    if (markerOptions == null || markerOptions.length == 0) return null;

    //lọc đối tượng null
    let filter = markerOptions.filter(item => item != null);

    //kiểm tra danh sách khi add
    if (filter == null || filter.length == 0) return null;

    //gán đối tượng bản đồ
    let copy = [];
    filter.forEach((item: MarkerOptions) => {
      copy.push(item);
    });

    let oldMarkers = this.getMarkers();

    //nếu danh sách chưa khởi tạo thì khởi tạo
    if (oldMarkers == null) oldMarkers = new Array<MarkerOptions>();

    //loại bỏ các đối tượng null hoặc undefined
    let index = -1;

    //thêm đối tượng mới vào mảng
    oldMarkers.forEach(item => {
      //kiểm tra có marker tồn tại trong mảng không
      index = filter.findIndex(el => {
        return el.getKey() === item.getKey();
      });
      if (index < 0) {
        copy.push(item);
      }
    });

    //thêm vào state bản đồ
    this.updateMarkers(copy);

    return filter;
  }

  /**
   * thiết lập lại marker mới
   */
  public setMarkers(
    markerOptions: MarkerOptions[] | MarkerOptions
  ): MarkerOptions[] {
    //kiểm tra danh sách khi add
    if (markerOptions == null || markerOptions == undefined) return null;

    let filter: MarkerOptions[];
    if (Array.isArray(markerOptions)) {
      //nếu rỗng thì bỏ qua
      if (markerOptions.length == 0) {
        this.updateMarkers(markerOptions);
        return null;
      }

      //lọc đối tượng null
      filter = markerOptions.filter(item => item != null);
    } else {
      //nếu 1 marker thì tạo đối tượng để update
      filter = new Array<MarkerOptions>();
      filter.push(markerOptions);
    }

    //thêm vào state bản đồ
    this.updateMarkers(filter);
    return filter;
  }

  /**
   * xóa marker
   * @param keys
   */
  public removeMarkers(keys: any[]) {
    // console.log("this.markers keys %%%%%%%==", keys);

    //kiểm tra danh sách khi add
    if (keys == null || keys.length == 0) return;

    // console.log("this.markers %%%%%%%==", this.markers);
    let oldMarkers = this.getMarkers();

    //nếu danh sách chưa khởi tạo thì khởi tạo
    if (oldMarkers == null || oldMarkers.length == 0) return;

    let copy = [];
    let index;

    // console.log("", oldMarkers);

    //thêm đối tượng mới vào mảng
    oldMarkers.forEach(item => {
      //kiểm tra có marker tồn tại trong mảng không
      index = keys.findIndex(el => {
        // console.log("item.getKey() %%%%%%%==", item.getKey() + " = " + el);
        return el === item.getKey();
      });

      // console.log("index %%%%%%", index);

      //thêm các đối tượng không thuộc trong mảng xóa
      if (index < 0) {
        copy.push(item);
      }
    });

    // console.log("copy %%%%%%", copy);

    //thêm vào state bản đồ
    this.updateMarkers(copy);
  }

  /**
   * xóa toàn bộ
   */
  public removeAllMarkers() {
    //thêm vào state bản đồ
    this.updateMarkers([]);
  }

  /**
   * xóa marker
   * @param keys
   */
  public removeMarkerOptions(keys: MarkerOptions[]) {
    // console.log("this.markers keys %%%%%%%==", keys);

    //kiểm tra danh sách khi add
    if (keys == undefined || keys == null || keys.length == 0) return;

    //bỏ qua các trường null
    keys = keys.filter(item => item != null);

    // console.log("this.markers %%%%%%%==", this.markers);
    let oldMarkers = this.getMarkers();

    //nếu danh sách chưa khởi tạo thì khởi tạo
    if (oldMarkers == null || oldMarkers.length == 0) return;

    let copy = [];
    let index;

    // console.log("", oldMarkers);

    //thêm đối tượng mới vào mảng
    oldMarkers.forEach(item => {
      //kiểm tra có marker tồn tại trong mảng không
      index = keys.findIndex(el => {
        // console.log("item.getKey() %%%%%%%==", item.getKey() + " = " + el);
        return el.getKey() === item.getKey();
      });

      // console.log("index %%%%%%", index);

      //thêm các đối tượng không thuộc trong mảng xóa
      if (index < 0) {
        copy.push(item);
      }
    });

    // console.log("copy %%%%%%", copy);

    //thêm vào state bản đồ
    this.updateMarkers(copy);
  }

  /**
   * xóa 1 marker
   * @param markerOption
   */
  public removeMarkerOption(markerOption: MarkerOptions) {
    this.removeMarkerOptions([markerOption]);
  }

  /**
   * xóa 1 marker
   * @param keys
   */
  public removeMarker(keys: any) {
    this.removeMarkers([keys]);
  }

  /**
   * thêm 1 marker
   * @param markerOption
   */
  public addMarker(markerOption: MarkerOptions): MarkerOptions {
    // console.log("addMarker %%", markerOption);

    let ret = this.addMarkers([markerOption]);

    if (ret == null || ret.length == 0) return null;

    return ret[0];
  }

  public setMyLocationEnabled(isEnable: boolean) {
    this.setState({showsUserLocation:isEnable});
  }

  public setPadding(padding: PaddingMap) {}

  /**
   * vẽ polygon lên bản đồ
   * @param polygonOptions
   */
  public addPolygons(polygonOptions: PolygonOptions[]): PolygonOptions[] {
    if (polygonOptions == null || polygonOptions.length == 0) return null;

    //loại bỏ các đối tượng null hoặc undefined
    let arr: PolygonOptions[] = [];
    polygonOptions.forEach(item => {
      if (item != null) {
        arr.push(item);
      }
    });

    //thêm vào state bản đồ
    // this.mapPresenter.setPolygons(arr);

    return arr;
  }

  /**
   * thêm polyline
   * @param polylineOptions
   * @returns: trả về key của polyline, -1 nếu ko vẽ
   */
  public addPolylines(polylineOptions: PolylineOptions[]): PolylineOptions[] {
    if (polylineOptions == null || polylineOptions.length == 0) return null;

    //loại bỏ các đối tượng null hoặc undefined
    let arr: PolylineOptions[] = [];
    polylineOptions.forEach(item => {
      if (item != null) {
        arr.push(item);
      }
    });

    //thêm vào state bản đồ
    this.setState(prevState => ({
      polylines: [...prevState.polylines, ...arr]
    }));

    return arr;
  }

  public addPolyline(polylineOption: PolylineOptions): PolylineOptions {
    let ret = this.addPolylines([polylineOption]);
    if (ret == null || ret.length == 0) return null;
    return ret[0];
  }

  public removePolyline() {
    this.setState({
      polylines: []
    });
  }

  /**
   * vẽ điểm đi
   */
  public drawStartMarker(src: LatLng | MarkerOptions): MarkerOptions {
    //nếu là loại markeroption rồi thì vẽ luôn
    if (src instanceof MarkerOptions) {
      this.setState({ startMarkerOption: src });
      return src;
    }

    //vẽ điểm đi
    if (!Utils.isOriginLocation(src)) {
      let markerOption = new MarkerOptions();
      markerOption.icon(images.ic_marker_start_uri);
      markerOption.position(src);
      this.setState({ startMarkerOption: markerOption });
      return markerOption;
    }
    return null;
  }

  /**
   * di chuyển marker => nếu chưa có marker được vẽ thì trả về null
   * @param src
   * @param duration
   */
  public moveStartMarker(src: LatLng, duration?: number): MarkerOptions {
    let option = this.state.startMarkerOption;
    if (option != null) {
      let marker = this.getAnimatedMarkerRef(option.getKey());
      marker.move(src, duration || 500);
    }
    return option;
  }

  public getAnimatedMarkerRef(ref: string): AnimatedMarker {
    if (ref == null || ref == undefined) return null;

    let obj = this.refs[ref];
    if (obj != null) return obj as AnimatedMarker;
    return null;
  }

  public getStartMarker(): MarkerOptions {
    return this.state.startMarkerOption;
  }

  public removeStartMarker() {
    this.setState({ startMarkerOption: null });
    return true;
  }

  public drawEndMarker(dstLatLng): MarkerOptions {
    //vẽ điểm đến
    if (!MapUtils.isOriginLocation(dstLatLng)) {
      let markerOption = new MarkerOptions();
      markerOption.icon(images.ic_marker_end_uri);
      markerOption.position(dstLatLng);
      this.setState({ endMarkerOption: markerOption });
      return markerOption;
    }

    return null;
  }

  public removeEndMarker() {
    this.setState({ endMarkerOption: null });
  }

  /**
   * map đã sắn sàng làm việc
   */
  private onMapReady() {
    //nếu map chưa khởi tạo thì bỏ qua
    if (this.refs.mapView == null) {
      LogFile.e("onMapReady mapView is null");
      return;
    }

    this.map = this.refs.mapView as MapView;

    //xử lý giao diện khi map đã ready
    this.props.onMapReady && this.props.onMapReady(this);
  }

  render() {
    return (
      <MapView
        ref="mapView"
        style={styles.mapContainer}
        provider="google"
        showsUserLocation={false}
        showsMyLocationButton={false}
        initialRegion={this.props.initialRegion && this.props.initialRegion()}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        onMapReady={() => this.onMapReady()}
        onRegionChangeComplete={region => this.props.onRegionChangeComplete && this.props.onRegionChangeComplete(region)}
        minZoomLevel = {10}
        maxZoomLevel = {20}
      >
        {/* vẽ điểm bắt đầu*/}
        {this.state.startMarkerOption != null ? (
          <AnimatedMarker
            ref={this.state.startMarkerOption.getKey()}
            key={this.state.startMarkerOption.getKey()}
            id={this.state.startMarkerOption.getKey()}
            coordinate={this.state.startMarkerOption.getPosition()}
            onPress={() =>
              this.state.startMarkerOption.onPress && this.state.startMarkerOption.onPress()
            }
            image={this.state.startMarkerOption.getIcon()}
            style={this.state.startMarkerOption.style}
          >
            {this.state.startMarkerOption.viewsAsMarker}
          </AnimatedMarker>
        ) : null}

        {/* vẽ điểm kết thúc*/}
        {this.state.endMarkerOption ? (
          <AnimatedMarker
            key={this.state.endMarkerOption.getKey()}
            id={this.state.endMarkerOption.getKey()}
            coordinate={this.state.endMarkerOption.getPosition()}
            onPress={() =>
              this.state.endMarkerOption.onPress &&
              this.state.endMarkerOption.onPress()
            }
            image={this.state.endMarkerOption.getIcon()}
          />
        ) : null}

        {this.state.markerOptions.length > 0 &&
          this.state.markerOptions.map((markerOption: MarkerOptions) => (
            <AnimatedMarker
              ref={markerOption.getKey()}
              id={markerOption.getKey()}
              key={markerOption.getKey()}
              coordinate={markerOption.getPosition()}
              rotation={markerOption.getRotation()}
              onPress={() => markerOption.onPress && markerOption.onPress()}
              image={images.ic_car_traking_uri}
            >
              {markerOption.viewsAsMarker}
            </AnimatedMarker>
        ))}
          
        {/* vẽ đường giữa 2 điểm */}
        {this.state.polylines.length > 0 &&
          this.state.polylines.map((polylineOption: PolylineOptions) => (
            <Polyline
              key={polylineOption.key}
              coordinates={polylineOption.coordinates}
              strokeColor={polylineOption.strokeColor}
              fillColor={polylineOption.fillColor}
              strokeWidth={polylineOption.strokeWidth}
            />
          ))}
      </MapView>
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
  addressLayout: {
    width: "97%",
    backgroundColor: "transparent",
    marginTop: 6,
    position: "absolute",
    shadowRadius: 5
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
  },
  alertPopupText: {
    color: colors.colorRed,
    fontSize: 18,
    fontWeight: "bold",
    alignContent: "center"
  }
});
