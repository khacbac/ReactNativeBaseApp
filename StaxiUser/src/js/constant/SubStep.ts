/**
 * trạng thái cuốc
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:20:30
 * @modify date 2018-07-10 08:20:30
 * @desc [description]
*/

enum SubStep {
	/** trạng thái bình thường*/
	NORMAL = 0,
	/**điều hành hủy cuốc*/
	OPERATOR_CANCEL = 1,
	/**lái xe nhỡ cuốc*/
	DRIVER_MISS = 2,
	/**khách hàng nhỡ cuốc */
	CUSTOMER_MISS = 3,

	/**lái xe hủy cuốc */
	DRIVER_CANCEL = 4,

	/**trạng thái mời khách*/
	HAVE_INVITE = 5,

	/**trạng thái gặp khách */
	CATCHED_USER = 6,

	/** bổ xung 14/10/2016*/
	OPERATOR_DISPATCHING = 7
}


export default SubStep;