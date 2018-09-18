import ViewCarViewModel from "./ViewCarViewModel";
import strings from "../../../../res/strings";
import BookingViewModel from "../BookingViewModel";
import BookTaxiModel from "../BookTaxiModel";

export default class FinishViewModel {
  private viewCarViewModel: ViewCarViewModel;

  private bookingViewModel: BookingViewModel;

  private bookTaxiModel: BookTaxiModel;

  constructor(viewCarViewModel: ViewCarViewModel) {
    this.viewCarViewModel = viewCarViewModel;
    this.bookingViewModel = viewCarViewModel.getBookingViewModel();
    this.bookTaxiModel = viewCarViewModel.getBookTaxiModel();
  }

  public async onPressDoneBooking() {
    // Thông báo nếu ko có kết nối mạng
    let ret = await this.viewCarViewModel.isEnableNetwork();
    if (!ret) {
      this.viewCarViewModel.showToast(strings.no_network);
      return;
    }

    // if (!isFinishBook) {
    //   this.bookingViewModel.showToast(strings.book_car_finish_not_fare);
    //   return;
    // }

    // Nếu không có thông tin lái xe thì kết thúc luôn
    if (this.bookTaxiModel.driverInfo == null) {
      this.viewCarViewModel.showToast(strings.book_done_info_successful);
      this.viewCarViewModel.finishSuccessBookingToHome();
    } else {
        //hiện thị giao diện đánh giá
        this.viewCarViewModel.driverFeedBack();
    }
  }
}
