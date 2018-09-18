import Vehicle from "./Vehicle";

export default class VehicleInfo extends Vehicle{

    /* Danh sách biển số xe đã đặt không thành công */
    public lstVehiclePlates:string[];

    /* Số hiệu lái xe */
    public driverCode:string;
    
    /**
     * Lưu trữ danh sách xe đã đặt để không đặt lại xe này nữa
     * @param plate 
     */
    public addBookedVehicle(plate:string){
        if(this.lstVehiclePlates == null || this.lstVehiclePlates == undefined){
            this.lstVehiclePlates = [];
        }

        this.lstVehiclePlates.push(plate);
    }
}