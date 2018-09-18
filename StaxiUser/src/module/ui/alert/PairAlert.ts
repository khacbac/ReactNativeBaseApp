import UnitAlert from "./UnitAlert";
import { AlertButton, Alert } from "react-native";
import AlertStyle from "./AlertStyle";
import { ViewState } from "../..";
import LogFile from "../../LogFile";
import ButtonMap from "./ButtonMap";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 10:57:03
 * @modify date 2018-07-18 10:57:03
 * @desc [Thoogn báo tạo 2 nút]
*/

export default class PairAlert extends UnitAlert {

    protected negative: AlertButton;

    protected negativeVisibility: ViewState = ViewState.VISIBLE;

    setNegativeText(text: string) {
        this.negative = { ...this.negative, text: text };
        return this;
    }

    setNegativePress(onPress: Function) {
        this.negative = {
            ...this.negative, onPress: () => {
                LogFile.e("PairAlert Nagative Click: " + this.negative.text);
                onPress && onPress();
            }
        };
        return this;
    }

    setNegativeStyle(style: AlertStyle) {
        this.negative = { ...this.negative, style: style };
        return this;
    }

    setNegativeVisible(visibility: ViewState) {
        this.negativeVisibility = visibility;
        return this;
    }

    protected getAlertButtons() {

        //nếu ẩn nút cancel
        if (this.negativeVisibility == ViewState.GONE) {
            return super.getAlertButtons();
        }

        //nếu nút positive ẩn
        if (this.positiveVisibility == ViewState.GONE) return [this.getNegativeButton()];

        //trả về cả 2 nút
        return [this.getNegativeButton(), this.getPositiveButton()];
    }

    protected getButtonMap() {
        let map = super.getButtonMap();
        if (this.negativeVisibility == ViewState.GONE) return map;
        map.set(ButtonMap.Negative, this.getNegativeButton());
        return map;
    }

    protected getNegativeButton() {
        return this.negative || { text: "Cancel", style: AlertStyle.CANCLE };
    }

    static get() {
        return new PairAlert();
    }
}