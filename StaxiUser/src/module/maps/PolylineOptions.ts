import { LineCapType, LineJoinType } from "react-native-maps";
import UUID from "../utils/UUID";

export default class PolylineOptions {
    coordinates: { latitude: number; longitude: number }[];
    onPress?: Function;
    tappable?: boolean;
    fillColor?: string;
    strokeWidth?: number;
    strokeColor?: string;
    zIndex?: number;
    lineCap?: LineCapType;
    lineJoin?: LineJoinType;
    miterLimit?: number;
    geodesic?: boolean;
    lineDashPhase?: number;
    lineDashPattern?: number[];
  
    public key: string | number;
  
    constructor(key?: number) {
      this.key = key || UUID.generate();
      // console.log("PolylineOptions ==", this.key);
    }
  }