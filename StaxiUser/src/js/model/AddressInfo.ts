import { DfShort, DfString, ISerialize, LatLng } from "../../module";

export default class AddressInfo implements ISerialize {
    /* Số nhà */
	public number:DfShort = DfShort.index(0);
	
	/* Tên đường */
	public roadName:DfString = DfString.index(1);
	
	/* Xã */
	public commueName:DfString = DfString.index(2);
	
	/* Huyện */
	public district:DfString = DfString.index(3);
	
	/* Tỉnh */
	public province:DfString = DfString.index(4);
	
	 /* Vị trí*/
	 public latLng: LatLng;

	 public propertyIndex: number;
   
	 constructor(index = 0) {
	   this.propertyIndex = index;
	 }
}