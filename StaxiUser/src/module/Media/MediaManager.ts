import raws from "../../res/raw";
import { NativeModules } from "react-native";
export default class MediaManager {

    /**
     * bật âm thanh khi có thông báo
     * @param timeDelay: thời gian delay đơn vị giây (seconds)
     */
    public static playRingtone(timeDelay: number, resId?: any) {
        resId = resId || raws.staxi_ringtone;
        NativeModules.MediaModule.playRingtone(timeDelay);
    }

    /**
     * bật âm thanh khi có thông báo
     * @param timeDelay: thời gian delay đơn vị giây (seconds)
     */
    public static playRingtone2(timeDelay: number) {
        NativeModules.MediaModule.playRingtone(timeDelay);
    }

    /**
     * Hiện thị thông báo đặt xe
     *
     * @param <T>
     */
    public static addNotification(title: any, desc: any): void {
        NativeModules.MediaModule.addNotification(title, desc);
    }

    /**
     * xóa notification và dừng âm thanh, rung
     */
    public static removeNotification() {
        NativeModules.MediaModule.removeNotification();
    }

    /**
     * Dừng âm thanh cảnh báo
     */
    public static stopSound() {
        NativeModules.MediaModule.stopSound();
    }

    /**
     * bật âm thanh khi có tin nhắn
     */
    public static playNotifyCommand(){
        NativeModules.MediaModule.playNotifyCommand();
    }
}