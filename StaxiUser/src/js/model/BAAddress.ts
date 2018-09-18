import Address from "../../module/js-serialize/serialize/Address";
import AddressInfo from "./AddressInfo";

export default class BAAddress extends Address{

    public static NUMBER = 0;
	public static ROAD = 1;
	public static COMMUE = 2;
	public static DISTRICT = 3;
	public static PROVINCE = 4;

	public fields:string[] = new Array(5);

	/** id của tỉnh */
	public proviceID;

	/** id của huyện */
	public districtID;

	// Thêm số nhà
	public addNumber(number:number) {
		if (number != 0) {
			this.fields[BAAddress.NUMBER] = `Số ${number}`;
		} else {
			this.fields[BAAddress.NUMBER] = "";
		}
	}

	public toString() {
		// Xử lý theo số nhà
        let f = "";
        let buffer = "";
        let length = this.fields.length;
		// Thực hiện cộng dồn
		for (let i = 0; i < length; i++) {
			f = this.fields[i];
			if (!f) {
				buffer += f;
				if (i != length - 1) {
					buffer += ", ";
				}
			}
		}
		this.formattedAddress = buffer;
		return this.formattedAddress;
	}

	/** Chỉ lấy 2 thông tin địa chỉ có nghĩa đầu tiên */
	public getShortAddress():string {
		let buffer = "";
		// Xử lý theo số nhà
		let f;
		// Thực hiện cộng dồn
        let count = 0;
        let length = this.fields.length;
		for (let i = 0; i < length; i++) {
			f = this.fields[i];
			if (f != null && !f.isEmpty()) {
				buffer += f;
				count++;
				if (count != 2) {
					buffer += ", ";
				}
			}
			if (count == 2) {
				break;
			}
		}
		return buffer;
	}

	/** Lấy 2 thông tin địa chỉ có nghĩa đầu tiên và thêm quận ở cuối */
	public getCustomAddress():string {
		let buffer = "";
		let strSubTwo = [this.fields[BAAddress.COMMUE], this.fields[BAAddress.DISTRICT]];
		if (!this.fields[BAAddress.NUMBER]) {
            // Số nhà, tên đường, quận/huyện
		    let str = [this.fields[BAAddress.NUMBER], this.fields[BAAddress.ROAD], this.fields[BAAddress.DISTRICT]];
			buffer = this.appendAddress(str);
		} else if (!this.fields[BAAddress.ROAD]) {
            let strSub = [this.fields[BAAddress.ROAD], this.fields[BAAddress.COMMUE], this.fields[BAAddress.DISTRICT]];
			buffer = this.appendAddress(strSub);
		} else {
			buffer += (strSubTwo[0]);
			buffer += ", ";
			buffer += strSubTwo[1];
		}

		return buffer;
	}

	private appendAddress(str:string[]):string {
        let buffer = "";
		let count = 0;
		let f;
		for (let i = 0; i < str.length; i++) {
			f = str[i];
			if (f != null && !f.isEmpty()) {
				buffer += f;
				count++;
				if (count != 3) {
					buffer += ", ";
				}
			}
        }
        return buffer;
	}

	public updateAddressInfo(addressInfo:AddressInfo) {
		this.addNumber(addressInfo.number.value);
		this.fields[BAAddress.ROAD] = addressInfo.roadName.value;
		this.fields[BAAddress.COMMUE] = addressInfo.commueName.value;
		this.fields[BAAddress.DISTRICT] = addressInfo.district.value;
		this.fields[BAAddress.PROVINCE] = addressInfo.province.value;
		this.formattedAddress = this.getCustomAddress();
	}
}