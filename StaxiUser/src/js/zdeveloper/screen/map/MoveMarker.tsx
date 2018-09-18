import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

import MapView, {
  Polyline,
  AnimatedRegion
} from "react-native-maps";
import MapManager, {
  MapPresenter
} from "../../../component/booking/MapManager";
import {
  MarkerOptions,
  PolylineOptions,
  PolygonOptions,
  Text,
  LatLng,
} from "../../../../module";
import colors from "../../../../res/colors";
import images from "../../../../res/images";
import AnimatedMarker from "../../../../module/maps/AnimatedMarker";
import UUID from "../../../../module/utils/UUID";

interface PropsMarker {}

interface StateMarker {}

interface Props {}

interface State {
  // position: LatLng;
  rotation: number;
  coordinate: AnimatedRegion;
}
export default class MoveMarker extends React.Component<Props, State>
  implements MapPresenter {
  private mapView: MapView;

  private mapManager: MapManager;

  private isMapReady: boolean = false;

  private latLngs: LatLng[];

  private index: number = 0;

  private marker: {key:string, lats:LatLng[], index:number}[] = new Array();

  private intervalTimerID: number;

  constructor(props) {
    super(props);

    this.latLngs = this._getListLatLng();

    this.state = {
      rotation: 0,
      coordinate: new AnimatedRegion({
        latitude: this.latLngs[0].latitude,
        longitude: this.latLngs[0].longitude,
        latitudeDelta: 0.00002,
        longitudeDelta: 0.00002
      })
    };

    this.marker.push({key:UUID.generate(), lats:this.latLngs, index:0});
    this.marker.push({key:UUID.generate() + "123", lats:this.latLngs.slice().reverse(), index:0});
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimerID);
  }

  private getRegion() {
    //trả về region mặc định
    return {
      latitude: 20.974121,
      longitude: 105.846447,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    };
  }

  private _getListLatLng(): LatLng[] {
    let datas: LatLng[] = [];

    datas.push(new LatLng(20.974065, 105.846721));
    datas.push(new LatLng(20.974293, 105.846115));
    datas.push(new LatLng(20.974386, 105.845718));
    datas.push(new LatLng(20.974799, 105.845836));
    datas.push(new LatLng(20.97519, 105.846126));
    datas.push(new LatLng(20.975678, 105.846265));
    datas.push(new LatLng(20.975793, 105.845889));
    datas.push(new LatLng(20.97602, 105.84591));
    datas.push(new LatLng(20.976107, 105.845557));
    datas.push(new LatLng(20.976305, 105.845106));
    datas.push(new LatLng(20.976458, 105.844567));
    datas.push(new LatLng(20.976756, 105.843803));
    datas.push(new LatLng(20.976996, 105.843039));
    datas.push(new LatLng(20.977444, 105.841896));
    datas.push(new LatLng(20.976854, 105.841271));
    datas.push(new LatLng(20.976989, 105.840936));
    datas.push(new LatLng(20.978942, 105.840929));
    datas.push(new LatLng(20.981416, 105.841052));
    datas.push(new LatLng(20.98298, 105.84108));
    datas.push(new LatLng(20.982975, 105.840436));
    datas.push(new LatLng(20.982156, 105.840315));
    datas.push(new LatLng(20.981808, 105.840259));
    datas.push(new LatLng(20.980896, 105.839894));
    datas.push(new LatLng(20.980688, 105.839765));
    datas.push(new LatLng(20.980513, 105.839733));
    datas.push(new LatLng(20.980568, 105.8384));
    datas.push(new LatLng(20.980508, 105.83799));
    datas.push(new LatLng(20.980866, 105.837982));
    datas.push(new LatLng(20.982055, 105.837977));
    datas.push(new LatLng(20.982776, 105.837972));
    datas.push(new LatLng(20.982761, 105.836784));
    datas.push(new LatLng(20.983597, 105.836741));
    datas.push(new LatLng(20.982971, 105.834873));
    datas.push(new LatLng(20.98395, 105.834641));
    datas.push(new LatLng(20.983762, 105.833517));
    datas.push(new LatLng(20.98429, 105.833496));
    datas.push(new LatLng(20.984323, 105.83267));
    datas.push(new LatLng(20.985014, 105.832675));
    datas.push(new LatLng(20.985011, 105.83227));
    datas.push(new LatLng(20.985532, 105.8319));
    datas.push(new LatLng(20.985252, 105.831533));
    datas.push(new LatLng(20.984951, 105.831353));
    datas.push(new LatLng(20.985156, 105.830497));
    datas.push(new LatLng(20.985304, 105.830207));
    datas.push(new LatLng(20.985482, 105.83007));
    datas.push(new LatLng(20.985101, 105.829523));

    return datas;
  }

  /**
   * map đã sắn sàng làm việc
   */
  private onMapReady(mapView: MapView) {
    //nếu map chưa khởi tạo thì bỏ qua
    if (mapView == null) {
      return;
    }

    if (this.mapManager == null)
      this.mapManager = new MapManager(this, mapView);

    this.mapManager.setMap(mapView);

    this.isMapReady = true;
  }

  public setMarkers(markers: MarkerOptions[]) {}

  public drawStartMarker(markers: MarkerOptions) {}

  public drawEndMarker(markers: MarkerOptions) {}

  removePolylines() {}
  removeStartMarker() {}
  removeEndMarker() {}
  getStartMarkerOption() {
    return new MarkerOptions();
  }

  public getMarkers() {
    return [];
  }

  public clear() {}

  public setPolygons(polygonOptions: PolygonOptions[]) {}

  public setPolylines(polylineOptions: PolylineOptions[]) {}

  private _getStartCustomMarker(): any {
    return null;
  }

  private _startAnimationMoveMarker() {
    if (!this.isMapReady) {
      return;
    }

    this.index = 0;
    const TIME_OUT = 3100;
    this.marker.forEach((item) =>{
      this.intervalTimerID = setInterval(() => {
        if (item.index >= item.lats.length) {
          return;
        }
        item.index = item.index + 1;
        // get next latlng
        let nextLnLg = item.lats[item.index];
        // for(let i = 0; i < 5; i++) {
        (this.refs[item.key] as AnimatedMarker).rotateAndMove(nextLnLg);
        // }
      }, TIME_OUT);
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={ref => (this.mapView = ref)}
          style={styles.mapContainer}
          provider="google"
          showsUserLocation={false}
          showsMyLocationButton={false}
          initialRegion={this.getRegion()}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          onMapReady={() => this.onMapReady(this.mapView)}
        >

          {this.marker.map(item => {
            return (<AnimatedMarker
              ref={item.key}
              id= {item.key}
              key = {item.key}
              coordinate={{
                latitude: item.lats[0].latitude,
                longitude: item.lats[0].longitude
              }}
              image={images.ic_car_traking_uri}
              anchor={{ x: 0.5, y: 0.5 }}
            />);
          })}

          <Polyline
            coordinates={this.latLngs}
            strokeColor={colors.colorSub}
            strokeWidth={3}
          />
        </MapView>
        {this.index <= 0 && (
          <View style={[styles.overContainer, { bottom: 0 }]}>
            {/* View xác nhận địa chỉ */}
            <TouchableOpacity onPress={() => this._startAnimationMoveMarker()}>
              <View style={styles.confirmAddressBtn}>
                <Text
                  text="Move marker theo lộ trình"
                  textStyle={{ fontSize: 18, color: colors.colorSub }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject
  },

  overContainer: {
    position: "absolute",
    // flex: 1,
    display: "flex",
    width: Dimensions.get("window").width,
    justifyContent: "center"
  },
  confirmAddressBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colorWhiteFull,
    margin: 8,
    borderColor: colors.colorSub,
    borderRadius: 2,
    borderWidth: 0.5,

    shadowColor: colors.colorBlackFull,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2
  }
});
