/**
 * Định nghĩa các hằng số dùng chung cho toàn dự án
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:21:53
 * @modify date 2018-07-10 08:21:53
 * @desc [description]
*/

import { Platform } from "react-native";
import { PlatformOS } from "../../module";

enum OsType {
    IOS = 1,
    ANDROID = 2
}

export default class Constants {

	public static FOLDER_LOG = "User_QN_HungLong";

    public static STRING_ARGS = "#";

    /* Thời gian đặt xe tối đa là 7 ngày từ ngày hiện tại*/
    public static DELTA_TIME_SERVER = 7 * 60 * 60 * 1000;

    /* Thời gian chuông thông báo ngắn */
    public static TIME_RING_TONE_SHORT = 3;

    /* Thời gian chuông thông báo dài */
    public static TIME_RING_TONE_LONG = 3;

    public static OS_TYPE = () => {
        return PlatformOS.ios() ? OsType.IOS.valueOf() : OsType.ANDROID.valueOf();
    };

    public static phoneNumber = "0976543210";

    /* Số chỗ loại xe bất kỳ */
    public static CARTYPE_ANY_SEAT: number = 0;

	public static ANDROID_OS = 2;
	
	public static KM_UNIT_WIDTH = "km";

	public static UNIT_SECONDS_PER_MILLISECONDS = 1000;

	/* Thời gian delay animation 200 */
	public static TIME_ANIMATIONE_DELAY = 200;

    /* Thời gian kích hoạt lại tài khoản */
	public static START_ACTIVE_TIME = 5 * 60 * 1000;
    
    /* Thời gian delay thoát ứng dụng */
    public static DELAY_EXIT_APP = 2000;
    
    /* Định dạng lịch tiếng việt */
 	public static TIME_VI_PARTERN_SHORT = "HH'h'mm" + " '-' " + "dd/MM";

 	/* Định dạng lịch tiếng anh */
 	public static TIME_EN_PARTERN = "HH:mm dd MMM yyyy";
 	public static TIME_EN_PARTERN_SHORT = "HH:mm dd MMM";

 	/* Thời gian đặt xe tối thiểu là 15p so với hiện tại */
 	public static MIN_SCHEDULE_TIME = 15 * 60 * 1000;

 	/* Thời gian đặt xe tối đa là 7 ngày từ ngày hiện tại*/
	public static MAX_SCHEDULE_TIME = 7 * 24 * 60 * 60 * 1000;

	/* Thời gian lấy tin tức mặc định là trước 90 ngày */
	public static LAST_SYNC_TIME_NEWS = 90 * 24 * 60 * 60;

	/* Sai số khảng cách của đường chim bay và đường thật*/
	public static  RATIO_DISTANCE = 1.2;
	
	/* Khoảng cách để hiện thị thông báo khi xe gần tới người dùng */
	public static MAX_DISTANCE_FOR_USER = 150;
	
	/* Thời gian kiểm tra khoảng cách thời gian giữa 2 cuốc đặt */
	public static TIME_OLD_BOOK_AND_NEW_BOOK = 5 * 60 * 1000;
	
	/* Thời gian delay màn hình khởi động */
	public static SPLASH_SCREEN_DELAY = 2*1000; // 2s
	
	/* Folder chứa avatar user */
	public static AVATAR_FOLDER_NAME = "/STaxi";
	
	/* ID loại xe nội thành bất kỳ */
	public static CARTYPE_DEFAULT_ID = 3;
	
	/* ID loại xe sân bay bất kỳ */
	public static CARTYPE_DEFAULT_AIRPORT_ID = 8;
	
	/* Address source request Bình Anh */
	public static REQUEST_SOURCE_BINH_ANH = 2;

	/* Address source request Google */
	public static REQUEST_SOURCE_GOOGLE = 1;

	/* Bán kính tìm kiếm */
	public static RADIUS_SEARCH = 5000;

	//vận tốc trung bình của xe taxi
	public static VEHICLE_AVERAGE_SPEED = 30; 

	/** thời gian mặc định xe đến điểm s*/
	public static ADDITION_TIME_DEFAULT = 150;

	 // Id loai xe tat ca.
	 public static VEHICLE_TYPE_ALL_ID: number = 0;
}