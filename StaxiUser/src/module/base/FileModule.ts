import { NativeModules} from 'react-native';
import AndroidSdk from '../AndroidSdk';

export default class FileModule{
    /** Lưu logfile */
    public static LOGFILE_FOLER = AndroidSdk.isAndroid()?NativeModules.NativeAppModule.LOGFILE_FOLER: "LogFile";

    /**ghi log */
    public static writeLog(log:string):Promise<boolean>{
        return NativeModules.FileModule.writeLog(log);
    }
}

