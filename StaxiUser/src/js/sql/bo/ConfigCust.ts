/**
 * Công thức giá cho loại xe
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class CustConfig {
	// ID của bảng
	public configId: number;

	/* Ép bật GPS hay không */
	public isEnableGps: boolean;

	/**
	 * 0: mặc định
	 * 1: ép nhập điểm đến
	 * */
	public obligeEndPoint: number;

	/**
	 * 0: mặc định
	 * 1: chờ cuốc hoàn thành từ lái xe
	 * */
	public obligeFinishBook: number;

	/* Thời gian được hoàn thành cuốc trước khi nhận bản tin DONE */
	public custTimerFinishBook: number;
}

export default CustConfig;