/**
 * Định nghĩa các config
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:21:53
 * @modify date 2018-07-10 08:21:53
 * @desc [description]
*/
export default class ConfigParam {

    public static MODULE_BOOKING_CAR = false;

    /**Module sử dụng lịch sử online */
    public static MODULE_ONLINE_HISTORY = true;

     /**Module cho phép sử dụng tin tức mới ở home (PopupNew) */
     public static MODULE_ENABLE_POPUPNEW_ON_HOME = true;

      /**Module cho phép đăng ký lái xe cùng hãng */
    public static MODULE_ENABLE_GET_TOKEN_FIREBASE = true;

      /**Module viewcar theo vị trí của khách hàng sau khi đã lên xe */
      public static MODULE_VIEWCAR_BY_LOCATION_USER = true;

      /** Sử dụng dữ liệu cài đặt trước, false đồng bộ tất cả từ server */
    public static MODULE_DATABASE_AVAILABLE = false;

    /** Có cài đặt module chọn hãng không */
    public static MODULE_COMPANY_OPTION = false;

    /** Có cài đặt module mã giới thiệu */
    public static MODULE_REFERENCE_CODE = true;

    /** Có cài đặt module phản hồi lái xe theo loại cấu hình, hình ảnh */
    public static MODULE_FEEDBACK_DRIVER_TYPE = false;

    /** Có cài đặt module cho cá nhân: danh sách lái xe bị chặn, địa chỉ home, work */
    public static MODULE_USER_CUSTOMER = false;

    /** Cấu hình ép bật GPS khi sử dụng app */
    public static MODULE_REQUIRED_LOCATION_SERVICES = false;

    /** Cấu hình điều khoản sử dụng trong about */
    public static MODULE_TERM_OF_USED = false;

    /** Module thanh toán */
    public static MODULE_PAYMENT = false;

    /** Module taxi xe chiều về */
    public static MODULE_TAXI_RETURN = false;

    /** Cấu hình module lưu điểm đến của khách hàng */
    public static MODULE_ADDRESS_DST_HISTORY = false;

    /** Module menu khuyến mại */
    public static MODULE_MENU_PROMOTION = false;

    /** Module sử dụng api bình anh maps */
    public static MODULE_FIND_FASTEST_PATH = false;

    /** Module sử dụng chức năng xem lại lộ trình */
    public static MODULE_REVIEW_TRACKING_LOG = false;

    /** Module custom marker điểm đi */
    public static MODULE_CUSTOM_MARKER_START = false;

    /** Module chia sẻ facebook */
    public static MODULE_SHARE_ONLY_FACEBOOK = true;

    /** Module cho phép sửa địa chỉ ở màn hình home */
    public static MODULE_EDIT_ADDRESS_ON_HOME = false;

    /** Module cho phép đăng ký lái xe cùng hãng */
    public static MODULE_JOIN_DRIVER_ON_APP = false;

    /** Module cho phép đặt lịch xe đi chung taxi */
    public static MODULE_SHARE_BOOKING_TAXI = false;

    /** Module hiển thị thông tin mở rộng chi tiết lịch sử online */
    public static MODULE_HISTORY_ONLINE_INFO_OTHER = false;

    /** Module ước lượng lộ trình, giá tiền = API Bình Anh */
    public static MODULE_ESTIMATE_PRICE_DIRECTION_BA = false;

    /** Module hiển thị bills trong lịch sử chi tiết */
    public static MODULE_BILLS_FIRE_IS_SHOW = true;

    /** Module ép nhập đánh giá nếu chọn nhỏ hơn 2 sao */
    public static MODULE_DRIVER_RATE_COMMENT = false;

    /** Module ép nhập tên khi đăng ký */
    public static MODULE_INPUT_NAME_RIGISTER = false;
    
}