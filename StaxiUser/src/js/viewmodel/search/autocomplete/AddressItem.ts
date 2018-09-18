import { LatLng } from "../../../../module/js-serialize/DefinedType";

export default class AddressItem {
    public static GOOGLE : number = 0;
    public static HISTORY : number = 1;
    public static NEAR_BY : number = 2;
    public static WORKING : number = 3;
    public static HOME : number = 4;

    public id : string = "";
    
	/* Thời gian tạo */
	public createTime: number = -1;
    
    /**Tọa độ điểm*/
    public location: LatLng = new LatLng(0,0);

    /**Thông tin địa chỉ*/
    public formattedAddress: string = "";

    /**Tên địa điểm*/
    public name: string = "";

    public placeID : string = "";

    /**
     * 0: là dữ liệu google
     * 1: là dữ liệu lịch sử tìm địa điểm đã đi
     */
    public type : number = AddressItem.GOOGLE;

    public favorited : boolean = false;
    
    /**
	 * Loại địa điểm
     * 0: Default
	 * 1: Nhà riêng
	 * 2: Công ty
	 * */
    public predefinedValue: number = 0;
    
    /* Số lần sử dụng */
    public count: number = -1;

    public static clone(addressItem: AddressItem): AddressItem {
        let obj: AddressItem = new AddressItem();

        obj.id = addressItem.id;
        obj.createTime = addressItem.createTime;
        obj.location = addressItem.location;
        obj.formattedAddress = addressItem.formattedAddress;
        obj.name = addressItem.name;
        obj.placeID = addressItem.placeID;
        obj.type = addressItem.type;
        obj.favorited = addressItem.favorited;
        obj.predefinedValue = addressItem.predefinedValue;
        obj.count = addressItem.count;

        return obj;
    }
}