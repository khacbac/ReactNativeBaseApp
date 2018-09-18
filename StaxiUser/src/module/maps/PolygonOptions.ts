import { LineCapType, LineJoinType } from "react-native-maps";
import UUID from "../utils/UUID";

export default class PolygonOptions {
    coordinates: { latitude: number; longitude: number }[];
    holes?: { latitude: number; longitude: number }[][];
    onPress?: Function;
    tappable?: boolean;
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
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
      // console.log("PolygonOptions ==", this.key);
    }
  }