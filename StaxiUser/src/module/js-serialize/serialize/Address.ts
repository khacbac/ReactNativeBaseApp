import { LatLng } from "../DefinedType";
import Utils from "../../Utils";

export default class Address {

    /**Tọa độ điểm*/
    public location: LatLng = new LatLng(0,0);

    /**Thông tin địa chỉ*/
    public formattedAddress: string = "";

    /**Tên địa điểm*/
    public name: string = "";

    /* Kiểm tra chuỗi địa chỉ là null hoặc rỗng */
	public isEmptyFormatedAddress():boolean{
		return !this.formattedAddress || !this.formattedAddress.trim();
	}
	
	/* Kiểm tra vị trí có chính xác hay không */
	public isAvailableLocation():boolean{
		return !Utils.isNull(this.location) && !this.location.isOrigin();
    }
    
    /* 
	 * Format địa chỉ, chỉ lấy 3 thành phần trong chuỗi địa chỉ ngăn cách dấu ','
	 * @param address
	 */
	public formatAddress3Segments():string{
		if(this.isEmptyFormatedAddress()) return "";
		let index = 0;
		let count = 0;
		let c;

		// Thực hiện lấy index của ký tự 3.
		for(let index = 0;index < this.formattedAddress.length; index++){
			c = this.formattedAddress.charAt(index);
			if(c == ','){
				count++;
				if(count == 3) break;
			}
		}
		// Nếu số lượng tên vùng nhiều hơn 3 thì cắt bớt
		if(count >= 3) return this.formattedAddress.substring(0, index).trim();

		return this.formattedAddress;
	}
}