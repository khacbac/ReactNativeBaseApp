import FocusAddress from "./FocusAddress";
import { LatLng } from "../../../module";
import BAAddress from "../../model/BAAddress";

export default class SearchParams{
	public static ADDRESS_FOCUS_TYPE = "ADDRESS_FOCUS_TYPE";
	public static LOCATION_EXTRA_NAME = "LOCATION_EXTRA_NAME";
	public static ADDRESS_REQUEST_TYPE = "ADDRESS_REQUEST_TYPE";
	public static RADIUS_EXTRA_NAME = "RADIUS_EXTRA_NAME";

	public static DEFAULT_RADIUS_VALUE: number = 5 * 1000;

	/** loại địa chỉ lựa chọn */
	public focusAddress:FocusAddress = FocusAddress.NO_FOCUS;

	/** Loại request api*/
	public requestType:AddressRequestType = AddressRequestType.GOOGLE;

	/** bán kính tìm kiếm, mặc định 5000 mét */
	public radius:number = SearchParams.DEFAULT_RADIUS_VALUE;

	/** Vị trí GPS */
	public gpsLatLng: LatLng;

	/** Thông tin điểm đi */
	public srcAddress: BAAddress;
	
	/** Thông tin điểm đến */
	public dstAddress: BAAddress;
}

/**
 * Address source request Bình Anh
 * public static REQUEST_SOURCE_BINH_ANH = 2;
 *
 * Address source request Google
 * public static REQUEST_SOURCE_GOOGLE = 1;
 */
export enum AddressRequestType{
	BINH_ANH = 2,
	GOOGLE = 1
}