import { DfLatLng, DfInteger } from "../../../module";

export default class ServerViewCarMessage {

	/* Vị trí của xe */
	public latLng:DfLatLng = DfLatLng.index(0);
	
	/* Trạng thái */
	public status:DfInteger = DfInteger.index(1);
}