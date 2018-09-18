import { AlertButton, Alert } from "react-native";
import AlertStyle from "./AlertStyle";
import IAlert from "./IAlert";
import { ViewState, Dialog } from "../..";
import LogFile from "../../LogFile";
import ButtonMap from "./ButtonMap";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 10:57:24
 * @modify date 2018-07-18 10:57:24
 * @desc [thông báo hiện thị 1 nút]
 */

export default class UnitAlert implements IAlert {
  protected static DEFAULT_BUTTON = { text: "OK", style: AlertStyle.DEFAULT };

  protected title: string;
  protected msg: string;
  protected positive: AlertButton;
  protected cancel = false;
  protected verticle = false;
  protected positiveVisibility: ViewState = ViewState.VISIBLE;

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setMessage(msg: string) {
    this.msg = msg;
    return this;
  }

  setPositiveText(text: string) {
    this.positive = { ...this.positive, text: text };
    return this;
  }

  setPositivePress(onPress: Function) {
    this.positive = {
      ...this.positive,
      onPress: () => {
        LogFile.e("UnitAlert Positive Click: " + this.positive.text);
        onPress && onPress();
      }
    };
    return this;
  }

  setPositiveStyle(style: AlertStyle) {
    this.positive = { ...this.positive, style: style };
    return this;
  }

  setPositiveVisible(visibility: ViewState) {
    this.positiveVisibility = visibility;
    return this;
  }

  isCancel(cancel: boolean) {
    this.cancel = cancel;
    return this;
  }

  isVerticle(isVerticle: boolean) {
    this.verticle = isVerticle;
    return this;
  }

  show(onDismiss?: Function) {
    LogFile.e("UnitAlert MSG:" + this.msg);

    Alert.alert(this.title || "", this.msg || "", this.getAlertButtons(), {
      cancelable: this.cancel, onDismiss: () => onDismiss && onDismiss()
    });
    return this;
  }

  showDialog(dialog: Dialog) {
    // dialog.showAlert(this.title || "", this.msg || "", this.getAlertButtons(), {cancelable: this.cancel});
    dialog.showAlert(this.title || "", this.msg || "", this.getButtonMap(), { cancelable: this.cancel, isVerticle: this.verticle });
  }

  protected getAlertButtons() {
    if (this.positiveVisibility == ViewState.GONE) return [];
    return [this.getPositiveButton()];
  }

  protected getButtonMap() {
    let map = new Map<string, AlertButton>();
    if (this.positiveVisibility == ViewState.GONE) return map;
    map.set(ButtonMap.Positive, this.getPositiveButton())
    return map;
  }

  protected getPositiveButton() {
    return this.positive || UnitAlert.DEFAULT_BUTTON;
  }

  static get() {
    return new UnitAlert();
  }
}
