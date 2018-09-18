import CountDownTimer from "../../../../module/utils/CountDownTimer";
import BookTaxiModel from "../BookTaxiModel";
import ViewCarViewModel from "./ViewCarViewModel";
import InitBookMessage from "../../../tcp/sent/InitBookMessage";
import { DfString, UnitAlert } from "../../../../module";
import strings from '../../../../res/strings'
import SessionStore from "../../../Session";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-17 03:20:54
 * @modify date 2018-07-17 03:20:54
 * @desc [Xử lý gửi bản tin init book, gửi 5 lần cho đến khi nhận ack]
*/
export default class ProcessInitBook extends CountDownTimer {
    private static NO_RETRY_INITBOOK = 60 * 1000;
  
    private static TIMEOUT_RETRY_INITBOOK = 10 * 1000;
  
    private rModel: BookTaxiModel;
  
    private viewCarVM: ViewCarViewModel;
  
    private bMessage: InitBookMessage;
  
    constructor(viewCarVM: ViewCarViewModel) {
      super(
        ProcessInitBook.NO_RETRY_INITBOOK,
        ProcessInitBook.TIMEOUT_RETRY_INITBOOK
      );
      this.rModel = viewCarVM.getBookTaxiModel();
      this.viewCarVM = viewCarVM;
      this.initMessage();
    }
  
    /**
     * khởi tạo đối tượng
     */
    private initMessage() {
      let bMessage = new InitBookMessage();
      bMessage.companyKey.setValue(this.rModel.company.companyKey);
      bMessage.catchedTime.setValue(this.rModel.catchedTime);
  
      //gán điểm đi
      bMessage.sourceAddress.location.setValue(this.rModel.srcAddress.location);
      bMessage.sourceAddress.formattedAddress.setValue(
        this.rModel.srcAddress.formattedAddress
      );
      bMessage.sourceAddress.name.setValue(this.rModel.srcAddress.name);
  
      //gán điểm đến
      if (this.rModel.dstAddress) {
        if (this.rModel.dstAddress.location)
          bMessage.destAddress.location.setValue(this.rModel.dstAddress.location);
  
        bMessage.destAddress.formattedAddress.setValue(
          this.rModel.dstAddress.formattedAddress
        );
        bMessage.destAddress.name.setValue(this.rModel.dstAddress.name);
      }
  
      bMessage.currentCoordinate.setValue(this.rModel.srcAddress.location);
      bMessage.phone.setValue(SessionStore.getUser().phone);
      bMessage.countCar.setValue(this.rModel.countCar);
      bMessage.carType.setValue(this.rModel.getVehicleType().vehicleId);
      bMessage.bookType.setValue(this.rModel.bookType);
      bMessage.priority.setValue(this.rModel.priority);
      bMessage.isReceivedCall.setValue(this.rModel.isReceiveCall);
      bMessage.comment.setValue(this.rModel.comment);
      bMessage.promotion.setValue(this.rModel.promotion);
      
      // Danh sách biển số xe đã đặt không thành công
      if (
        this.rModel.vehicleInfo != null &&
        this.rModel.vehicleInfo.lstVehiclePlates != null
      ) {
        this.rModel.vehicleInfo.lstVehiclePlates.forEach(item => {
          bMessage.vehiclePlates.putValue(new DfString(item));
        });
      }
      bMessage.routeId.setValue(this.rModel.route != null ? this.rModel.route.routeId || 0 : 0);
      // tùy chọn tìm kiếm
      bMessage.searchOption.setValue(this.rModel.searchOption);
      bMessage.favComp.setValue(this.rModel.companyIdsFavorite);
      bMessage.blockComp.setValue(this.rModel.companyIdsDeny);
      // bookID
      bMessage.oldBookID.setValue(this.rModel.oldBookID);
      // Khoảng cách 2 điểm nếu có
      bMessage.distance.setValue(this.rModel.distanceAB);
      // Loại cuốc đặt
      bMessage.bookTripType.setValue(this.rModel.bookTripType);
      // Tiền khuyến mại
      if (this.rModel.childPrices.length > 0) {
        bMessage.childPrices.setValue(this.rModel.childPrices);
      }
      this.bMessage = bMessage;
    }
  
    public onTick(millisUntilFinished: number) {
      // console.log("ProcessInitBook onTick =====", millisUntilFinished);
      this.viewCarVM.sendBAMessageOnNetwork(this.bMessage);
    }
  
    async onFinish() {
      // LogFile.e("ProcessInitBook onFinish ======");
      //kiểm tra xem còn đang nằm trong trạng thái đặt xe không
      if (!SessionStore.isBooking()) return;
  
      UnitAlert.get().setMessage(strings.not_connected_server_retry_book).show();

      //cập nhật trạng thái cuốc hủy
      await this.viewCarVM.updateCancelBook();
  
      // hủy các tiến trình kết nối
      this.viewCarVM.finishSuccessBookingToHome();
    }
  }