import { VehicleWithPrice } from "../../../http/estimate/CalcPriceResponse";
import BAAddress from "../../../model/BAAddress";

export default interface ConfirmBookPresenter {

    setConfirmNoteText(): void;

    setPromotionText(): void;

    setEstimate(): void;

    initialScheduleInfo(mTimeSchedule: string): void;

    estimatePrice(
        isShowEstimate: boolean,
        estimates: string,
        distanceAB: string,
        dstAddress: BAAddress
    ): void;

    updateEstimateInfo(estimate: string, taxiTypeName: string): void;

    setConfirmSchedule(mTimeSchedule: string): void;

    updateViewSrcAddress(baAddress: BAAddress);

    updateViewDstAddress(baAddress: BAAddress);

    getTopHeight(): number;

    getBottomHeight(): number;
}