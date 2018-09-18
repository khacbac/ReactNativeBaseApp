import * as React from "react";
import {
  AnimatedRegion,
  MarkerAnimated,
  Point,
  LatLng
} from "react-native-maps";
import { Platform } from "react-native";
import LifeComponent from "../ui/LifeComponent";
import SphericalUtil from "./SphericalUtil";
import PlatformOS from "../PlatformOS";
import ActionsManagerWrapper from "../utils/ActionsManagerWrapper";
import Utils from "../Utils";
interface Props {
  id: any;
  identifier?: string;
  reuseIdentifier?: string;
  title?: string;
  description?: string;
  image?: any;
  opacity?: number;
  pinColor?: string;
  coordinate: { latitude: number; longitude: number };
  centerOffset?: { x: number; y: number };
  calloutOffset?: { x: number; y: number };
  anchor?: { x: number; y: number };
  calloutAnchor?: { x: number; y: number };
  flat?: boolean;
  draggable?: boolean;
  onPress?: (value: { coordinate: LatLng; position: Point }) => void;
  onSelect?: (value: { coordinate: LatLng; position: Point }) => void;
  onDeselect?: (value: { coordinate: LatLng; position: Point }) => void;
  onCalloutPress?: Function;
  onDragStart?: (value: { coordinate: LatLng; position: Point }) => void;
  onDrag?: (value: { coordinate: LatLng; position: Point }) => void;
  onDragEnd?: (value: { coordinate: LatLng; position: Point }) => void;
  zIndex?: number;
  style?: any;
  rotation?: number;
  tracksViewChanges?: boolean;
  tracksInfoWindowChanges?: boolean;
  stopPropagation?: boolean;
  infoWindow?: boolean;
}

interface State {
  // position: LatLng;
  rotation: number;
  coordinate: AnimatedRegion;
}

/**
 * Xử lý bất đồng bộ quay marker = tổng thời gian animation marker.
 * Nếu thời gian tích lũy animation marker chưa >= tổng thời gian cấu hình animation marker 
 * mà có tiến trình khác yêu cầu animation marker thì lưu tạm coordinate này. 
 * Khi kết thúc animation marker thì kiểm tra nếu có coordinate thì tiếp tục animation
 */
export default class AnimatedMarker extends LifeComponent<Props, State> {
  public static MIN_DISTANCE_TO_MOVE = 5; // 5 mét

  /** thời gian di chuyển mặc định của marker*/
  public static MARKER_MOVE_TIME = 2000;

  /** số lượng quay mặc định */
  public static MAX_ROTATE_STEP = 10;

  /**thời gian mỗi lần quay */
  public static MARKER_ROTATE_TIME_STEP = 50;

  /** Tổng thời gian thực hiện animation = quay + move marker */
  public static TOTAL_ANIMATION_DURATION = AnimatedMarker.MARKER_MOVE_TIME + (AnimatedMarker.MAX_ROTATE_STEP * AnimatedMarker.MARKER_ROTATE_TIME_STEP);

  /** lưu trữ vị trí cũ*/
  private currentCoordinate: { latitude: number; longitude: number };

  /** số lượng quay */
  private mRotateIndex = 0;

  private handerRotationId = 0;

  /** lưu trạng thái hệ điều  hành nào */
  private isAndroid: boolean;

  private currentAnimTotalTime = AnimatedMarker.TOTAL_ANIMATION_DURATION;
  private nextMoveLocation: { latitude: number; longitude: number };

  constructor(props: Props) {
    super(props);

    this.isAndroid = PlatformOS.isAndroid();

    // this.log("props.coordinate", props.coordinate);

    this.currentCoordinate = props.coordinate;
    this.currentAnimTotalTime = AnimatedMarker.TOTAL_ANIMATION_DURATION;

    this.state = {
      rotation: props.rotation || 0,
      coordinate: new AnimatedRegion({
        latitude: props.coordinate.latitude,
        longitude: props.coordinate.longitude,
        latitudeDelta: 0.00002,
        longitudeDelta: 0.00002
      })
    };
  }

  /** tính lại góc quay theo chiều đồng hồ*/
  private getRotation(start: number, end: number): number {
    let normalizeEnd = end - start; // rotate start to 0
    let normalizedEndAbs = (normalizeEnd + 360) % 360;

    // -1 = anticlockwise, 1 = clockwise
    let direction = normalizedEndAbs > 180 ? -1 : 1;
    let rotation;
    if (direction > 0) {
      rotation = normalizedEndAbs;
    } else {
      rotation = normalizedEndAbs - 360;
    }
    return rotation;
  }

  /**
   * tính góc quay
   * @param fraction
   * @param start
   * @param newRotation
   */
  private computeRotation(
    fraction: number,
    start: number,
    newRotation: number
  ): number {
    let result = fraction * newRotation + start;

    //xử lý tính lại khi góc quay giá trị < 0
    return (result + 360) % 360;
  }

  private log(msg: any) {
    // console.log(msg);
  }

  /**
   * xoay và move marker
   * @param nextCoordinate
   */
  public rotateAndMove(nextCoordinate: {
    latitude: number;
    longitude: number;
  }) {
    if (nextCoordinate == undefined) return;

    // bỏ qua nếu chưa hoàn thành animation hiện tại, lưu tọa độ này
    if (this.currentAnimTotalTime < AnimatedMarker.TOTAL_ANIMATION_DURATION) {
      this.nextMoveLocation = nextCoordinate;
      return;
    }

    // reset total anim time
    this.currentAnimTotalTime = 0;

    this.rotate(nextCoordinate, angle => {
      this.moveCallback(nextCoordinate, () => {
        // xử lý sau khi move xong
        if (Utils.isNull(this.nextMoveLocation) || Utils.isOriginLocation(this.nextMoveLocation)) {
          this.nextMoveLocation = undefined;
          return;
        }

        if (SphericalUtil.computeDistanceBetween(this.nextMoveLocation, this.currentCoordinate) <= AnimatedMarker.MIN_DISTANCE_TO_MOVE) {
          this.nextMoveLocation = undefined;
          return;
        }

        // nếu còn tọa độ thì tiếp tục animation
        this.currentAnimTotalTime = AnimatedMarker.TOTAL_ANIMATION_DURATION;
        this.rotateAndMove({latitude: this.nextMoveLocation.latitude, longitude: this.nextMoveLocation.longitude});
        this.nextMoveLocation = undefined;
      }, AnimatedMarker.MARKER_MOVE_TIME);
    });
  }

  public rotate(nextCoordinate: { latitude: number; longitude: number }, callback?: Function) {
    // this.log('Gọi hàm rotate marker %%%%%%%%%%%%%%%%%%%%%%%%%%:  ' + `${nextCoordinate.latitude}, ${nextCoordinate.longitude}`)
    //xóa timer trước nếu đang tồn tại
    this.clearIntervalTimer();

    // reset total anim time
    this.currentAnimTotalTime = 0;

    //gán lại vòng quay
    this.mRotateIndex = 0;

    //tính góc
    let angle = SphericalUtil.computeHeading(
      this.currentCoordinate.latitude,
      this.currentCoordinate.longitude,
      nextCoordinate.latitude,
      nextCoordinate.longitude
    );

    // this.log("Tính góc ban đầu: ", angle);

    //gán lại vị trí mới
    this.currentCoordinate = nextCoordinate;

    // bỏ qua không quay nếu không có góc mới
    // if (angle === 0) {
    //   return;
    // }

    //góc trước đó
    let start = this.state.rotation;

    //tính lại độ lệch góc
    let deltaAngle = this.getRotation(start, angle);

    // this.log("Tính góc ban đầu: deltaAngle = ", deltaAngle);

    //thực hiện xoay
    this.handerRotationId = setInterval(() => {
      //góc quay tiếp theo
      let fractionAngle = this.computeRotation(
        this.mRotateIndex / AnimatedMarker.MAX_ROTATE_STEP,
        start,
        deltaAngle
      );

      // this.log("fractionAngle = ", this.mRotateIndex, fractionAngle, this.mRotateIndex / AnimatedMarker.MAX_ROTATE_STEP);

      //tăng số lần quay lên
      this.mRotateIndex = this.mRotateIndex + 1;
      this.currentAnimTotalTime += this.mRotateIndex*AnimatedMarker.MARKER_ROTATE_TIME_STEP;

      //gán giá trị quay xe
      this.setRotateState(fractionAngle);

      if (this.mRotateIndex > AnimatedMarker.MAX_ROTATE_STEP) {
        //xóa timer
        this.clearIntervalTimer();

        //thực hiện callback nếu có
        callback && callback(angle);
      }
    }, AnimatedMarker.MARKER_ROTATE_TIME_STEP);
  }

  public setRotateState(angle) {
    //nếu component unmount rồi thì bỏ qua
    if (!this.isMouted) {
      this.clearIntervalTimer();
      return;
    }

    this.setState({
      rotation: angle
    });
  }

  /** xóa timer */
  private clearIntervalTimer() {
    if (this.mRotateIndex) {
      clearInterval(this.handerRotationId);
    }
    this.handerRotationId = 0;
  }

  componentWillUnmount() {
    this.setUnmount();
    this.clearIntervalTimer();
  }

  public move(newCoordinate: { latitude: number; longitude: number }, duration?: number) {
    this.moveCallback(newCoordinate, null, duration);
  }

  /**
   * move marker
   * @param newCoordinate
   * @param duration
   */
  public moveCallback(newCoordinate: { latitude: number; longitude: number }, callback?: Function, duration?: number) {
    //nếu component unmount rồi thì bỏ qua
    if (!this.isMouted) {
      this.clearIntervalTimer();
      return;
    }

    duration = duration || AnimatedMarker.MARKER_MOVE_TIME;

    // this.log("animate", newCoordinate, duration);

    if (this.isAndroid) {
      this.getMarkerAnimated().animateMarkerToCoordinate(
        newCoordinate,
        duration
      );
    } else {
      this.state.coordinate.timing({ ...newCoordinate, duration }).start();
    }

    // cộng thêm thời gian thực hiện animation
    if (!Utils.isNull(callback) && Utils.isFunction(callback)) {
      setTimeout(() => {
        this.currentAnimTotalTime += duration;
        callback();
      }, duration);
    }
  }

  private getMarkerAnimated() {
    return (this.refs.marker as MarkerAnimated)._component;
  }

  /**
   * ẩn infoWindow
   */
  public hideInfoWindow() {
    if (this.getMarkerAnimated() != null)
      this.getMarkerAnimated().hideCallout();
  }

  /** show infor window */
  public showInfoWindow(msg?: string) {
    //text rỗng thì hủy
    if (msg == undefined) return;

    // if(this.marker != null) this.marker.showCallout();
    setTimeout(() => {
      if (this.getMarkerAnimated() != null)
        this.getMarkerAnimated().showCallout();
    }, 0);
  }

  render() {
    if (this.isAndroid) {
      return (
        <MarkerAnimated
          ref="marker"
          key={this.props.id}
          coordinate={this.state.coordinate}
          anchor={this.props.anchor || { x: 0.5, y: 0.5 }}
          image={this.props.image || null}
          style={{ transform: [{ rotate: `${this.state.rotation}deg` }] }}
          onPress={value => this.props.onPress && this.props.onPress(value)}
        >
          {this.props.children}
        </MarkerAnimated>
      );
    } else {
      return (
        <MarkerAnimated
          ref="marker"
          key={this.props.id}
          coordinate={this.state.coordinate}
          rotation={this.state.rotation}
          anchor={this.props.anchor || { x: 0.5, y: 0.5 }}
          image={this.props.image || null}
          onPress={value => this.props.onPress && this.props.onPress(value)}
        >
          {this.props.children}
        </MarkerAnimated>
      );
    }
  }
 
}
