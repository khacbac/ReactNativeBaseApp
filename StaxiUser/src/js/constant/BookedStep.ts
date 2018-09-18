/**
 * Các bước tiến trình trong cuốc
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:21:26
 * @modify date 2018-07-10 08:21:26
 * @desc [description]
*/

enum BookedStep{
    START, // Login
	INITBOOK, // Khởi tạo cuốc
	SIGN_CAR, // Đợi hãng gán xe
	CARS_INFO, // Có xe nhận đón
	CATCHED_CAR, // Lái xe mời khách
	DONE, // Gửi thông tin hoàn thành cuốc đến khách
	CLIENT_CANCEL, // Người dùng hủy cuốc đặt
	OPERATOR_CANCEL, // Điều hành hủy cuốc
	DRIVER_CANCEL, // Điều hành hủy cuốc
	DRIVER_MISSED, // Điều hành hủy cuốc
	INVITE //trạng thái mới khách thành công
}

export default BookedStep;