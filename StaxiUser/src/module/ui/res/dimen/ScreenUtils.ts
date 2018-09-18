import { PixelRatio, Dimensions } from "react-native";
import PlatformOS  from "../../../PlatformOS";

// Các loại phân giải màn hình
enum ScreenCode {
    SCREEN_MDPI = 1, // Android devices (160 dpi)
    SCREEN_HDPI = 1.5, // Android devices (240 dpi)
    SCREEN_XHDPI = 2, // iPhone 4, 4S, 5, 5c, 5s, 6, Android devices (320 dpi)
    SCREEN_XXHDPI = 3, // iPhone 6 plus, Android devices (480 dpi)
    SCREEN_XXXHDPI = 4, // iPhone X, Android devices (560 dpi)
    SCREEN_WIDTH_MIN = 360,
    SCREEN_WIDTH_NORMAL = 667,
    SCREEN_WIDTH_LARGE = 735,
}

let size: number = PixelRatio.get();
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get('window').height;
let ios = PlatformOS.ios();

/**
 * Tính fontsize theo từng loại DPI
 * @author: Đv Hiện
 * Created on 08/08/2018
 */
class ScreenUtils {

    // Check dpi for device
    public static getScreenByDpi(): number {
        var dpi: number;
        if (size <= ScreenCode.SCREEN_MDPI) {
            dpi = ScreenCode.SCREEN_MDPI;
            return dpi;
        } else if (size > ScreenCode.SCREEN_MDPI && size <= ScreenCode.SCREEN_HDPI) {
            dpi = ScreenCode.SCREEN_HDPI;
            return dpi;
        } else if (size > ScreenCode.SCREEN_HDPI && size <= ScreenCode.SCREEN_XHDPI) {
            dpi = ScreenCode.SCREEN_XHDPI;
            return dpi;
        } else if (size > ScreenCode.SCREEN_XHDPI && size <= ScreenCode.SCREEN_XXHDPI) {
            dpi = ScreenCode.SCREEN_XXHDPI;
            return dpi;
        } else if (size > ScreenCode.SCREEN_XXHDPI && size <= ScreenCode.SCREEN_XXXHDPI) {
            dpi = ScreenCode.SCREEN_XXXHDPI;
            return dpi;
        }
        return dpi;
    }

    /**
     * chuyển đối giá trị theo loai màn hình
     * @param mdpi 
     * @param hdpi 
     * @param xhdpi 
     * @param xxhdpi 
     * @param xxxhdpi 
     */
    public static convertValueByDpi(mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi): any {
        if (size <= ScreenCode.SCREEN_MDPI) {
            return mdpi;
        } else if (size > ScreenCode.SCREEN_MDPI && size <= ScreenCode.SCREEN_HDPI) {
            return hdpi;
        } else if (size > ScreenCode.SCREEN_HDPI && size <= ScreenCode.SCREEN_XHDPI) {
            return xhdpi;
        } else if (size > ScreenCode.SCREEN_XHDPI && size <= ScreenCode.SCREEN_XXHDPI) {
            return xxhdpi;
        } else if (size > ScreenCode.SCREEN_XXHDPI && size <= ScreenCode.SCREEN_XXXHDPI) {
            return xxxhdpi;
        }
        return xxhdpi;
    }

    public static convertValueByIosDpi(x2, x3): any {
        if (size >= ScreenCode.SCREEN_XXHDPI) {
            return x3;
        } 
        return x2;
    }

    // Hàm này lấy diments cho các loại thiết bị dp => pixel
    public static dimentsSizer(dimentsDefault: number): number {
        if (ios) return dimentsDefault;
        return PixelRatio.getPixelSizeForLayoutSize(dimentsDefault) / size;
    }

    // Hàm này lấy font size cho các loại thiết bị android theo pixel
	public static fontSizer(fontDefault: number): number {
        if(ios) return fontDefault;
        //console.log('--------------size-------------', size);
        if (size <= ScreenCode.SCREEN_MDPI) {
            //console.log('--------------SCREEN_MDPI-------------');
            return fontDefault;
        } else if (size > ScreenCode.SCREEN_MDPI && size <= ScreenCode.SCREEN_HDPI) {
            //console.log('--------------SCREEN_HDPI-------------');
            return fontDefault * 1.05;
        } else if (size > ScreenCode.SCREEN_HDPI && size <= ScreenCode.SCREEN_XHDPI) {
            //console.log('--------------SCREEN_XHDPI-------------');
            if (deviceWidth < ScreenCode.SCREEN_WIDTH_MIN) {
                return fontDefault * 0.95;
            }
            // iphone 5
            if (deviceHeight < ScreenCode.SCREEN_WIDTH_NORMAL) {
                return fontDefault;
                // iphone 6-6s
            } else if (deviceHeight >= ScreenCode.SCREEN_WIDTH_NORMAL && deviceHeight <= ScreenCode.SCREEN_WIDTH_LARGE) {
                return fontDefault * 1.15;
            }
            // older phablets
            return fontDefault * 1.25;
        } else if (size > ScreenCode.SCREEN_XHDPI && size <= ScreenCode.SCREEN_XXHDPI) {
            //console.log('--------------SCREEN_XXHDPI-------------');
            if (deviceWidth <= ScreenCode.SCREEN_WIDTH_MIN) {
                return fontDefault;
            }
            // Catch other weird android width sizings
            if (deviceHeight < ScreenCode.SCREEN_WIDTH_NORMAL) {
                return fontDefault * 1.15;
                // catch in-between size Androids and scale font up
                // a tad but not too much
            }
            if (deviceHeight >= ScreenCode.SCREEN_WIDTH_NORMAL && deviceHeight <= ScreenCode.SCREEN_WIDTH_LARGE) {
                return fontDefault * 1.2;
            }
            // catch larger devices
            // ie iphone 6s plus / 7 plus / mi note 
            return fontDefault * 1.27;
        } else if (size > ScreenCode.SCREEN_XXHDPI && size <= ScreenCode.SCREEN_XXXHDPI) {
            //console.log('--------------SCREEN_XXXHDPI-------------');
            if (deviceWidth <= ScreenCode.SCREEN_WIDTH_MIN) {
                return fontDefault;
                // Catch other smaller android height sizings
            }
            if (deviceHeight < ScreenCode.SCREEN_WIDTH_NORMAL) {
                return fontDefault * 1.2;
                // catch in-between size Androids and scale font up
                // a tad but not too much
            }
            if (deviceHeight >= ScreenCode.SCREEN_WIDTH_NORMAL && deviceHeight <= ScreenCode.SCREEN_WIDTH_LARGE) {
                return fontDefault * 1.25;
            }
            // catch larger phablet devices
            return fontDefault * 1.4;
        } else {
            return fontDefault;
        }
	}
}

export default ScreenUtils;

