import GeocodingLocation from "../../../http/address/GeocodingLocation";
import { AddressRequestType } from "../SearchParams";
import { Region } from "react-native-maps";
import BAAddress from "../../../model/BAAddress";
import { LatLng } from "../../../../module";

export default class GeocodingHandle {
    public static async onRegionChangeComplete(region: Region, googleKey: string, 
        requestAddressType: AddressRequestType): Promise<BAAddress> {
        return GeocodingLocation.geocodingFromLatLng(new LatLng(region.latitude, region.longitude),
            googleKey, requestAddressType);
    }
}