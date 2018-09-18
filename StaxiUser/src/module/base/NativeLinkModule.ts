import { NativeModules, Linking} from 'react-native';
import PlatformOS from '../PlatformOS';
export default class NativeLinkModule{

    private static isAndroid = PlatformOS.isAndroid();

    /** mã sẽ trả về trong hàm onActivityResult khi từ setting wifi sang */
    public static WIFI_SETTING_RC = 1;

    /** mã sẽ trả về trong hàm onActivityResult khi từ appstore trả về */
    public static APP_STORE_RC = 2;

    /** mở app store */
    public static showAppStore(){
        if(this.isAndroid){
            return NativeModules.NativeLinkModule.showAppStore(this.APP_STORE_RC);
        }else{
            return NativeModules.NativeLinkModule.showAppStore();
        }
    }

    /** kiểm tra google service mới nhất chưa */
    public static isCheckGoogleService(){
        return NativeModules.NativeLinkModule.isCheckGoogleService();
    }

    /** mở cài đặt */
    public static openWifiSetting(){
        if(this.isAndroid){
            return NativeModules.NativeLinkModule.openWifiSetting(this.WIFI_SETTING_RC);
        }else{
            return NativeModules.NativeLinkModule.openWifiSetting();
        }
        
    }

    /**
     * gọi điện thoại
     * @param phone 
     */
    public static openDialPhone(phone:string){
        Linking.openURL(`tel:` + phone);
    }
}