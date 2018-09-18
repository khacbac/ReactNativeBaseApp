import { AlertButton, Alert } from "react-native";
import AlertStyle from "./AlertStyle";
import { ViewState } from "../..";
import PairAlert from "./PairAlert";
import LogFile from "../../LogFile";
import ButtonMap from "./ButtonMap";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-18 10:57:03
 * @modify date 2018-07-18 10:57:03
 * @desc [Thoogn báo tạo 2 nút]
*/

export default class Triplet extends PairAlert {

    protected askMe: AlertButton;

    protected askMeVisibility: ViewState = ViewState.VISIBLE;

    setAskMeText(text: string) {
        this.askMe = { ...this.askMe, text: text };
        return this;
    }

    setAskMePress(onPress: Function) {
        this.askMe = {
            ...this.askMe, onPress: () => {
                LogFile.e("PairAlert Ask Me Click: " + this.askMe.text);
                onPress && onPress();
            }
        };
        return this;
    }

    setAskMeStyle(style: AlertStyle) {
        this.askMe = { ...this.askMe, style: style };
        return this;
    }

    setAskMeVisible(visibility: ViewState) {
        this.askMeVisibility = visibility;
        return this;
    }

    protected getAlertButtons() {

        //nếu ẩn nút ask me
        if (this.askMeVisibility == ViewState.GONE) {
            return super.getAlertButtons();
        }

        //nếu nút nagative ẩn
        if (this.negativeVisibility == ViewState.GONE) return [this.getAskMeButton(), this.getPositiveButton()];

        //nếu nút positive ẩn
        if (this.positiveVisibility == ViewState.GONE) return [this.getAskMeButton(), this.getNegativeButton()];

        //trả về cả 2 nút
        return [this.getAskMeButton(), this.getNegativeButton(), this.getPositiveButton()];
    }

    protected getButtonMap() {
        let map = super.getButtonMap();
        if (this.negativeVisibility == ViewState.GONE) return map;
        map.set(ButtonMap.AskMe, this.getAskMeButton());
        return map;
    }

    protected getAskMeButton() {
        return this.askMe || { text: "Ask me later" };
    }

    static get() {
        return new Triplet();
    }
}