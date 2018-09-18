import { LatLng } from "../../module";

class Vehicle{

/* Mã công ty */
public companyId:number = -1;

/* Mã số của xe */
public carNo:string = "";

/* Mã xí nghiệp */
public xnCode:number = 0;

/* Biển số xe */
public vehiclePlate:string = "";

/* Thời gian cập nhật */
public dataTime:number;

/* vị trí hiện tại */
public currentLocation:LatLng;

/* Vị trí trước đấy */
public preLocation:LatLng;

/* Tốc độ gps */
public speedGPS:number = 0;

/* Trạng thái xe */
public status:number;

/* Loại resource của xe hiện thị trên bản đồ */
public markerResource:any;

/* Lưu trữ trạng thái có di chuyển xe hay không */
public isDrawMoving:boolean = false;

/* Số lượng cho phép để move bản đồ */
public count:number = 0;

/* Danh sách xe xung quanh */
public direction:number;

/* Loại xe */
public carType:number;

/* Loại xe trên bản đồ */
public carTypeUrl:string = "";

/* Cho phép marker xoay theo hướng hay không 0: xoay, 1: không xoay */
public markerRotation:number;

/* Ảnh của xe */
public vehicleImage:string = "";

/* Màu xe */
public vehicleColor:string = "";

/* Loại dòng xe */
public vehicleName:string = "";

/* Kiểm tra xem tọa độ này có phải là tọa độ (0,0) */
public isOriginLocation():boolean {
    if (this.currentLocation != null && this.currentLocation.latitude != 0
            && this.currentLocation.longitude != 0) {
        return false;
    }
    return true;
}
}

export default Vehicle;