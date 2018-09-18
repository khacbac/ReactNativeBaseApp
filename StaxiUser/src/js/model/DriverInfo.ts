import { DfString, DfFloat } from "../../module";

export default class DriverInfo{
    /* ID lái xe */
	public driverCode:string;
	
	/* Tên lái xe */
	public name:string;
	
	/* Số điện thoại lái xe */
	public phone:string;

	/* Điểm đánh giá lái xe */
	public rating:number;
	
	/* Ảnh lái xe */
	public avatarLink:string;

	public vehicleColor:string;

	public vehicleName:string;
}