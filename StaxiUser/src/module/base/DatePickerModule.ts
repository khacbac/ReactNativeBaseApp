import { NativeModules} from 'react-native';

export default class DatePickerModule {
    public static async showDatePicker(catchedTime: number): Promise<any> {
        return NativeModules.DatePickerModule.showDatePicker(catchedTime);
    }
}

