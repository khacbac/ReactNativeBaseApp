import UUID from "../utils/UUID";
import MarkerInfoWindow from "./MarkerInfoWindow";
import AnimatedMarker from "./AnimatedMarker";

export default class MarkerOptions {
  //key của marker
  private key?: string;

  //tọa độ
  private coordinate: { latitude: number; longitude: number };

  //xoay
  private rotation: number = 0;

  private image?: any;

  private anchorAtr: { x: number; y: number } = { x: 0.5, y: 0.5 };

  public viewsAsMarker?: JSX.Element;

  private tag: string;

  public onPress: Function;

  public style?: any;

  /** info window của marker */
  public markerInfoWindow: MarkerInfoWindow;

  constructor(key?: string) {
    this.key = key || UUID.generate();
    // console.log("MarkerOptions ==", this.key);
  }

  public setKey(key: string) {
    this.key = key;
  }

  public getKey(): string {
    return this.key;
  }

  public icon(image: any) {
    this.image = image;
  }

  public getIcon(): any {
    return this.image;
  }

  public anchor(x?: number, y?: number) {
    this.anchorAtr = { x: x || 0, y: y || 0 };
  }

  public getAnchor(): any {
    return this.anchorAtr;
  }

  public position(coordinate: { latitude: number; longitude: number }) {
    this.coordinate = coordinate;
  }

  public getPosition(): { latitude: number; longitude: number } {
    return this.coordinate;
  }

  public setRotation(rotation: number): number {
    return (this.rotation = rotation);
  }

  public getRotation(): number {
    return this.rotation;
  }

  public snippet(snippet: string) {
    this.tag = snippet;
  }

  public getSnippet(): string {
    return this.tag;
  }

  /**
   * ẩn infoWindow
   */
  public hideInfoWindow(marker:AnimatedMarker) {
    if (marker != null) marker.hideInfoWindow();
  }

  /** show infor window */
  public showInfoWindow(marker:AnimatedMarker, msg?: string) {
    //text rỗng thì hủy
    if (msg == undefined) return;

    //thiết lập lại text
    if (this.markerInfoWindow != null) {
      this.markerInfoWindow.setTitle(msg);
    }

    // if(this.marker != null) this.marker.showCallout();
    setTimeout(() => {
      if (marker != null) marker.showInfoWindow(msg);
    }, 0);
  }
}
