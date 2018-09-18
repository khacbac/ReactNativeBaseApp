/**
 * Các mã lỗi trong màn hình SplashScreen
 * @author Đv Hiện
 * Created on 20/07/2018
 */
enum SplashCode {
    SPLASH_SUCCESS = 0, // Trạng thái bình thường
    SYNC_DATA_FAIL = 1, // Lỗi đồng bộ dữ liệu từ server
    LOAD_USER_FAIL = 2, // Lỗi lấy dữ liệu user từ database
    LOAD_DATA_FAIL = 3, // Lỗi lấy dữ liệu đồng bộ từ database
}
export default SplashCode;