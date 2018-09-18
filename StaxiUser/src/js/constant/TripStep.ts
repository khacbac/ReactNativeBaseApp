/**
 * Trạng thái cuốc
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:23:20
 * @modify date 2018-07-10 08:23:20
 * @desc [description]
*/

enum TripStep{
    NONE = 0, 
    INITING = 1, 
    WAIT_CAR = 2, 
    VIEW_CAR = 3, 
    DONE = 4, 
    CHANGE_DRIVER = 5, 
    FAIL = 127
}

export default TripStep;