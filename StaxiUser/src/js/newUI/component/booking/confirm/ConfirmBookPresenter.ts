import ConfirmBookPresenterLib from "../../../../viewmodel/booking/confirm/ConfirmBookPresenter";
import ConfirmBookModel from "./ConfirmBookModel";
import VehicleSelectDialog from "./VehicleSelectDialog";

export default interface ConfirmBookPresenter extends ConfirmBookPresenterLib {
    setConfirmBookModel();
    getVehicleSelect(): VehicleSelectDialog;
    getNavigation();
    hideBottomSheet(): void;
    showBottomSheet(): void;
}