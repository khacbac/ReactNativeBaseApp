import { NativeModules, Platform, BackHandler } from 'react-native';
import { Utils } from '..';
import PlatformOS from '../PlatformOS';

/** xử lý các hàm native truyền xuống */
export default class NativeAppModule {

    public static VERSION_CODE = NativeModules.NativeAppModule.VERSION_CODE;

    public static HTTP_API = NativeModules.NativeAppModule.HTTP_API;

    public static KEY_MAP = NativeModules.NativeAppModule.KEY_MAP;

    /** kiểm tra mạng */
    public static isEnableNetwork() {
        return NativeModules.NativeAppModule.isEnableNetwork();
    }

    // Thiết lập ngôn ngữ.
    public static setLocale(key: number): Promise<boolean> {
        return NativeModules.NativeAppModule.setLocale(key);
    }

    /** kiểm tra quyền */
    public static checkPermissions(permissions: string[]): Promise<boolean> {
        return NativeModules.NativeAppModule.checkPermissions(permissions);
    }

    public static isExistedDatabase(databaseName: string): Promise<boolean> {
        return NativeModules.NativeAppModule.isExistedDatabase(databaseName);
    }

    public static attachModuleToActivity() {
        return NativeModules.NativeAppModule.attachModuleToActivity();
    }

    public static getDeviceInfo() {
        return NativeModules.NativeAppModule.getDeviceInfo();
    }

    public static openUserSetting() {
        return NativeModules.NativeAppModule.openUserSetting();
    }

    public static stopApp(msg?: string) {
        if (PlatformOS.ios()) {
            NativeModules.NativeAppModule.stopApp(msg || "Stop app");
        } else {
            BackHandler.exitApp();
        }
    }

    public static dismissTopView() {
        if (PlatformOS.ios()) {
            return NativeModules.NativeAppModule.dismissTopView();
        }
    }
}

