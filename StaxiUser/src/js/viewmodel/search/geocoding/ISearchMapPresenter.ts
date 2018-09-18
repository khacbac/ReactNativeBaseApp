import BAAddress from "../../../model/BAAddress";
import { LatLng } from "../../../..";

export interface ISearchMapPresenter {
    updateAddress(baAddress: BAAddress, requestCoordinate: LatLng);

    onGetGPSLocationError();
}