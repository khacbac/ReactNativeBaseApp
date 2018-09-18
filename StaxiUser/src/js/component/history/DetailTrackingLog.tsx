import * as React from 'react';
import {
  SafeAreaView, StyleSheet, View, Platform
} from 'react-native';
import MapUtils from '../../../module/maps/MapUtils';
import MenuHeader from '../../../module/ui/header/MenuHeader';
import strings from '../../../res/strings';
import images from '../../../res/images';
import { MarkerOptions, PolylineOptions } from '../../../module';
import MapView, { MarkerAnimated, Polyline } from 'react-native-maps';

export interface Props {
  navigation: any
};
export interface State {

  /** các điểm vẽ polily*/
  polylines: PolylineOptions[];

  /** marker bắt đầu */
  startMarkerOption: MarkerOptions;

  /** marker kết thúc */
  endMarkerOption: MarkerOptions;
};


class DetailTrackingLog extends React.Component<Props, State> {
  private startOption: MarkerOptions;
  private endOption: MarkerOptions;
  private polylinesOption: PolylineOptions;

  constructor(props) {
    console.log("open track log");
    super(props);

    this.onCreate();
    this.state = {
      polylines: [],
      startMarkerOption: null,
      endMarkerOption: null,
    };
  }

  onCreate() {

    // let trackLog= "yfh_Coj`eS_@R??Wf@If@Gf@Gf@Kz@Kf@If@KRGR????????????G?G?Q?m@S??]SCSFg@Lg@N{@Lg@P{@N{@NSJSES??G???????????????????????????????????????]?W???_AS??o@Si@Sw@Sm@Sg@?K?USQ?I?O?S???????????????aBg@W?YSgCg@??W?S?c@S??q@SQ?USO?O?S?QSS?[SS?A?????????????????????QSA???u@S??o@S{ASa@SQ?????????????";
    // trackLog = "io__Csc`eS?S??FR??I???D???????????B???E???ESDR????MS??B?HR??F?m@S??P?RR????D?????m@S??T?F?????@R????H?F???B?C???@?E???@?C???ISK???XRY???V?G???J?_@?L???DS?R??W?RS??Y?XR??ESC???I?TR??D?B???G?D?????CSA???@RB???B?e@???N?H???@?@???MSMRb@???[g@??Xf@G?A???D?ES??US\R??RRGS??S?I???";
    // let polylines = MapUtils.decodePolyline(trackLog);
    let polylines = MapUtils.decodePolyline(this.props.navigation.getParam('tracklog'));

    let startOption: MarkerOptions;
    //vẽ điểm đi
    if (polylines && polylines.length > 0) {
      var iconMarkerStart = images.ic_marker_start_uri;

      startOption = new MarkerOptions();
      startOption.icon(iconMarkerStart);
      startOption.position({ latitude: polylines[0].latitude, longitude: polylines[0].longitude });
    }
    this.startOption = startOption;
    let endOption: MarkerOptions;
    //vẽ điểm đến
    if (polylines && polylines.length > 1) {
      endOption = new MarkerOptions();
      var iconMarkerEnd = images.ic_marker_end_uri;

      endOption.icon(iconMarkerEnd);
      endOption.position({ latitude: polylines[polylines.length - 1].latitude, longitude: polylines[polylines.length - 1].longitude });
    }
    this.endOption = endOption;


    //vẽ polylines
    if (polylines && polylines.length > 0) {
      let options = new PolylineOptions();
      options.coordinates = polylines;
      options.fillColor = "rgba(255,0,0,0.5)";
      options.strokeColor = "#F00";
      options.strokeWidth = 1;
      this.polylinesOption = options;
    }

  }

  componentDidMount() {
    
  }

  public setPolylines(polylineOptions: PolylineOptions[]) {
    this.setState(prevState => ({
      polylines: [...prevState.polylines, ...polylineOptions]
    }));
  }
  public drawStartMarker(markers: MarkerOptions) {
    // console.log("drawStartMarker %%%%%%%%%%%%%%%%%%%%%");
    this.setState({ startMarkerOption: markers });
  }

  public drawEndMarker(markers: MarkerOptions) {
    // console.log("drawEndMarker %%%%%%%%%%%%%%%%%%%%%");
    this.setState({ endMarkerOption: markers });
  }

  private getRegion() {
    //nếu có region truyền vào
    let location = this.startOption.getPosition()

    //trả về region mặc định
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    };
  }


  /**
   * map đã sắn sàng làm việc
   */
  private onMapReady() {
    this.drawStartMarker(this.startOption);
    this.drawEndMarker(this.endOption);
    this.setPolylines([this.polylinesOption]);
  }

  render() {
    // let polylines = MapUtils.decodePolyline(this.props.navigation.getParam('data').tracklog);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MenuHeader
          title={strings.title_detail_history}
          drawerOpen={() => { this.props.navigation.goBack() }}
          isBack
        />
        <View style={{ flex: 1, alignItems: "center" }}>
          {/*bản đồ*/}
          <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            provider="google"
            showsUserLocation={false}
            showsMyLocationButton={false}
            region={this.getRegion()}
            loadingEnabled={true}
            loadingIndicatorColor="#666666"
            loadingBackgroundColor="#eeeeee"
            onMapReady={() => this.onMapReady()}
          >
            {/* vẽ điểm bắt đầu*/}
            {this.state.startMarkerOption ? (
              <MarkerAnimated
                key={this.state.startMarkerOption.getKey()}
                coordinate={this.state.startMarkerOption.getPosition()}
                onPress={() =>
                  this.state.startMarkerOption.onPress &&
                  this.state.startMarkerOption.onPress()
                }
                image={this.state.startMarkerOption.getIcon()}
              >
                {this.state.startMarkerOption.viewsAsMarker}
              </MarkerAnimated>
            ) : null}

            {/* vẽ điểm bắt đầu*/}
            {this.state.endMarkerOption ? (
              <MarkerAnimated
                key={this.state.endMarkerOption.getKey()}
                coordinate={this.state.endMarkerOption.getPosition()}
                onPress={() =>
                  this.state.endMarkerOption.onPress &&
                  this.state.endMarkerOption.onPress()
                }
                image={this.state.endMarkerOption.getIcon()}
              />
            ) : null}

            {/* vẽ đường giữa 2 điểm */}
            {this.state.polylines.length > 0 &&
              this.state.polylines.map(
                (polylineOption: PolylineOptions) => (
                  <Polyline
                    key={polylineOption.key}
                    coordinates={polylineOption.coordinates}
                    strokeColor={polylineOption.strokeColor}
                    fillColor={polylineOption.fillColor}
                    strokeWidth={polylineOption.strokeWidth}
                  />
                )
              )}
          </MapView>
        </View>
      </SafeAreaView>
    )
  }
}

export default DetailTrackingLog;