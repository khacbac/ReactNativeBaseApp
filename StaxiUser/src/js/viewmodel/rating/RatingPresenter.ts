import IeRatingPresenter from "./IeRatingPresenter";
import IeRatingBookView from "./IeRatingBookView";
import strings from "../../../res/strings";
import BookTaxiModel from "../booking/BookTaxiModel";
import BookingViewModel from "../booking/BookingViewModel";
import NetworkManager from "../../../module/net/NetworkManager";
import DriverFeedbackHandler from "../../http/rating/DriverFeedbackHandler";
import SessionStore from "../../Session";

export default class RatingPresenter implements IeRatingPresenter {

    private ieRatingView: IeRatingBookView;

    private bookTaxiModel: BookTaxiModel;

    private bookingViewModel: BookingViewModel;

    constructor(ieRatingView: IeRatingBookView, bookingViewModel: BookingViewModel) {
        this.ieRatingView = ieRatingView;
        this.bookingViewModel = bookingViewModel;
        this.bookTaxiModel = bookingViewModel.getBookTaxiModel();
    }

    public onInit(): void {
        this.ieRatingView.onInit();
    }

    public setContent(): void {
        this.ieRatingView.setContent();
    }

    public onBackPress(): void {
        this.doneBooking();
    }

    // public getListRating(): Array<Object> {
    //     return this.ratingViewModel.getListRating();
    // }

    // // Sự kiện người dùng chọn trên thanh rating bar.
    // public onTouchRating(item: Object): void {
    //     let newRatings: Array<any> = this.ratingViewModel.onRating(item);
    //     let ratingStatus: RatingStatus = this.ratingViewModel.getStatusRating(newRatings);
    //     let ratingCount: number = this.ratingViewModel.getCountRating(newRatings);
    //     this.ieRatingView.updateAfterRating(newRatings, ratingStatus, ratingCount);
    // }

    // Người dùng bỏ qua rating.
    public onExitRating(): void {
        this.doneBooking();
    }

    // Xử lý gửi rating lên server.
    public onSendRating(ratingCount: number, note: string): void {

        NetworkManager.isConnected().then(isConnected => {
            if (isConnected) {
                // Gửi đánh giá lên server
                if (ratingCount < 1) {
                    this.ieRatingView.unRating(strings.dialog_rate_content_null);
                    return;
                }
                // else if (ratingCount <= 2 && !note) {
                //     // Nếu đánh giá nhỏ hởn 2 sao thì thông báo KH nhập nội dung
                //     this.ieRatingView.ratingUnNote(strings.dialog_rate_content_empty);
                //     return;
                // }

                let request = DriverFeedbackHandler.get(SessionStore.getUser(), this.bookTaxiModel, ratingCount, note);

                DriverFeedbackHandler.driverFeedBackRequest(request).then(response => {
                    if (response) {
                        this.doneBooking();
                    } else {
                        this.ieRatingView.failSendRating(strings.dialog_rate_send_fail);
                    }
                }).catch(error => {
                    this.ieRatingView.failSendRating(strings.dialog_rate_send_fail);
                })

            } else {
                this.ieRatingView.failSendRating(strings.no_network);
            }
        }).catch(error => {
            this.ieRatingView.failSendRating(strings.no_network);
        })


    }

    private doneBooking = () => {

        // hiện thị thông báo
        this.ieRatingView.successRating(strings.book_done_info_successful);

        //xóa địa chỉ
        this.bookingViewModel.getBookTaxiModel().resetAddress();

        //về màn hình home
        this.bookingViewModel.showBookTaxiFragment(true);
    }

}