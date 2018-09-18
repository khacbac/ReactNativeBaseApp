/**
 * Thông tin các xe được gán và kênh tương ứng
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 08:28:43
 * @modify date 2018-07-10 08:28:43
 * @desc [Lớp nhận thông tin của danh sách lái xe nhận]
*/

import { DfBoolean, ISerialize, DfList, DfString, DfInteger, DfLatLng, DfFloat, ISerializeItemArray } from "../../../module";

export default class CarsInfoMessage implements ISerialize{

	/** trạng thái có khách hay không */
    public hasCar:DfBoolean = DfBoolean.index(1);

    /* danh sách thông tin xe */
	public infoMessages:DfList<CarInfoModel> = DfList.index(new CarInfoModel(), 2);

	public propertyIndex:number;

	constructor(index?:number){
		this.propertyIndex = index;
	}
	
	public static index(index:number):CarsInfoMessage{
		return new CarsInfoMessage(index);
	}
}

export class CarInfoModel implements ISerializeItemArray<CarInfoModel>{

	/* Biển số xe */
	public vehiclePlate:DfString = DfString.index(0);

	/* Số hiệu lái xe */
	public driverCode:DfString = DfString.index(1);

	/* Số hiệu xe */
	public carNo:DfString = DfString.index(2);

	/* Trạng thái của xe */
	public carState:DfInteger = DfInteger.index(3);

    /*** Vị trí lái xe hiện tại */
	public latLng:DfLatLng = DfLatLng.index(4);

    /** Tên lái xe */
	public driverName:DfString = DfString.index(5);

    /*** số điện thoại lái xe */
	public driverPhone:DfString = DfString.index(6);

    /** giá trị đánh giá lái xe */
	public driverRating:DfFloat = DfFloat.index(7);

    /** Ảnh lái xe */
	public imageLink:DfString = DfString.index(8);

	/* Company id của lái xe */
	public companyID:DfInteger = DfInteger.index(9);

	/* Loại xe */
	public sCarType:DfInteger = DfInteger.index(10); //CarType.NORMAL.ordinal();

	// Thêm mới 18/01/2018
    /**Tên loại xe */
	public vehicleName:DfString = DfString.index(11);

	/** màu xe */
	public vehicleColor:DfString = DfString.index(12);

    /** Ảnh xe */
	public vehicleImage:DfString = DfString.index(13);

	newInstanceItemArray(){
		return new CarInfoModel();
	}

}