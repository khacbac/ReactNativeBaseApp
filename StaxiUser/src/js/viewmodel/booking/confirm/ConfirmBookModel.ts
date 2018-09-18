import ConfirmBookPresenter from "./ConfirmBookPresenter";
import CalcPriceController from "../../../http/estimate/CalcPriceController";
import BookingViewModel, { FragmentMap } from "../BookingViewModel";
import MapUtils from "../../../../module/maps/MapUtils";
import BAAddress from "../../../model/BAAddress";
import strings from "../../../../res/strings";
import AddressHistoryDAO from "../../../sql/dao/AddressHistoryDAO";
import {
  VehicleWithPrice,
  CalcPriceResponse
} from "../../../http/estimate/CalcPriceResponse";
import VehicleTypeDAO from "../../../sql/dao/VehicleTypeDAO";
import Constants from "../../../constant/Constants";
import {
  LatLng,
  UserUtils,
  Utils,
  UnitAlert,
  PairAlert,
  PolylineOptions,
  MarkerOptions,
  FusedLocationModule,
  ToastModule,
  NativeLinkModule
} from "../../../../module";
import DatePickerModule from "../../../../module/base/DatePickerModule";
import SharedCache from "../../../constant/SharedCache";
import FocusAddress from "../../search/FocusAddress";
import CarType from "../../../constant/CarType";
import BookTaxiMain from "../home/BookTaxiMain";
import images from "../../../../res/images";
import Triplet from "../../../../module/ui/alert/Triplet";
import BookingViaHandler, { BookingViaReponseModel } from "./BookingViaHandler";
import BookedStep from "../../../constant/BookedStep";
import BookedHistoryDAO from "../../../sql/dao/BookedHistoryDAO";
import BookedHistory from "../../../sql/bo/BookedHistory";
import ScreenName from "../../../ScreenName";
import ConfigParam from "../../../constant/ConfigParam";
import { NativeAppModule } from "../../../../module";
import GeocodingLocation from "../../../http/address/GeocodingLocation";
import { AddressRequestType } from "../../search/SearchParams";
import CancelScheduleHandler, { CancelScheduleReponseModel } from "./CancelScheduleHandler";
import SessionStore from "../../../Session";
import ConfirmNotesFragment from "../../../component/booking/confirm/ConfirmNotesFragment";
import ConfirmPromotionFragment from "../../../component/booking/confirm/ConfirmPromotionFragment";
import EstimatedFareDetailDialog from "../../../component/booking/confirm/EstimatedFareDetailDialog";
import { BackHandler } from "react-native";

export default class ConfirmBookModel extends BookTaxiMain
// implements ConfirmBookPresenter 
{
  // public ieConfirmBook: IeConfirmBookView;

  private points: Array<LatLng>;

  protected centerMarker: MarkerOptions;

  private mHistory: BookedHistory;

  protected confirmPresenter: ConfirmBookPresenter;

  constructor(
    // ieConfirmBook: IeConfirmBookView,
    confirmPresenter: ConfirmBookPresenter,
    bookingViewModel: BookingViewModel
  ) {
    super(bookingViewModel);
    // this.ieConfirmBook = ieConfirmBook;
    this.confirmPresenter = confirmPresenter;
    this.points = new Array<LatLng>();
    this.main.setListener(this);
  }

  appendStartMarker(srcMarkerOptions: MarkerOptions) {
    if (srcMarkerOptions == null) return;
    srcMarkerOptions.viewsAsMarker = null;
    srcMarkerOptions.icon(images.ic_marker_start_uri);
    srcMarkerOptions.onPress = null;
  }

  public componentDidMount(): void {
    //xử lý load bản đồ
    if (this.getMap() != null) {

      //xóa marker start
      this.getMap().removeStartMarker();

      //tạo lại marker
      this.onMapReady(this.getMap());
    }

    // this.callToEstimate();
    this.checkSchudeInfo();
    // Khởi tạo các thành phần con cho layout địa chỉ
    this.initAddress();


    this.rModel.focusAddress = FocusAddress.NO_FOCUS;

    // Request xe xung quanh
    this.startNearCarRealtime(() => { });

    // Load thông tin chi tiết điểm đến nếu có
    this.showDirections();

    if (!this.rModel.isValidDstAddress()) {
      this.rModel.distanceAB = -1;
    }

    this.initData();

  }


  // Khởi tạo các giá trị ban đầu.
  private initData(): void {
    this.confirmPresenter.setConfirmNoteText();
    this.confirmPresenter.setPromotionText();
  }

  // public componentWillUnmount() {
  //   // Hủy realtime carnear
  //   if (this.nearCarRealtime != undefined) {
  //     this.nearCarRealtime.componentWillUnmount();
  //   }
  // }

  /* Thông tin cuốc đặt lịch */
  public checkSchudeInfo() {
    if (SessionStore.isScheduleBooking()) {
      this.confirmPresenter.setConfirmSchedule(strings.alarm_was_schedule_booking);
    } else {
      this.rModel.catchedTime = new Date().getTime();
      this.rModel.isSchedule = false;
      this.rModel.isShareBooking = false;
      this.confirmPresenter.setConfirmSchedule(strings.book_alarm_waiting_title);
    }
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
  }

  /**
   * @override.
   * Xử lý chọn mã khuyến mại
   */
  public actionPromotionCodeBtn(): void {
    // Hiển thị Dialog nhập mã khuyến mại.
    this.main.showDialogFragment(
      ConfirmPromotionFragment.create(
        this.rModel,
        () => {
          this.main.closeDialog();
        },
        () => {
          this.main.closeDialog();
        },
        promotion => {
          this.main.closeDialog();
          this.rModel.promotion = promotion;
          if (!this.rModel.isValidPromotion()) {
            this.rModel.promotion = "";
            this.rModel.estimates = "";
          }
          // this.confirmPresenter.setPromotionText();
          this.showDirections();
        }
      )
    );
  }

  /**
   * action mở dialog chọn loại xe.
   */
  public actionEstmateDialog(): void {
    let datas = [];
    for (let i = 0; i < this.rModel.childPrices.length; i++) {
      let withPrice = this.rModel.childPrices[i];

      let vehicleType = SessionStore.getVehicleTypes().find(item => {
        return item.vehicleId === withPrice.carType.value;
      });

      if (vehicleType && vehicleType.iconCode) {
        // giá cước.
        let priceDetail = "";
        if (withPrice.priceType.value === 0) {
          priceDetail =
            strings.taxi_back_a_to_b +
            " " +
            UserUtils.formatMoney(withPrice.price.value) +
            " đ";
        } else {
          priceDetail =
            strings.fare_total_label +
            " " +
            UserUtils.formatMoney(withPrice.price.value) +
            " đ";
        }

        datas.push({
          // icon loại xe.
          icon: images[vehicleType.iconCode],
          carTypeName: vehicleType.nameVi,
          // giá cước.
          priceDetail: priceDetail
        });
      }
    }

    this.main.getDialog().showBaseDialog(
      EstimatedFareDetailDialog.create(
        this.rModel.childPrices,
        withPrice => this.onItemEstimateDialogClick(withPrice),
        datas,
        () => {
          this.main.closeDialog();
        }
      )
    );
  }

  /**
   * @override.
   * Xử lý chọn ghi chú
   */
  public actionNotesBtn(): void {
    // show dialog nhập ghi chú.
    this.main.showDialogFragment(ConfirmNotesFragment.create(
      () => {
        this.main.closeDialog();
      },
      () => {
        this.main.closeDialog();
      },
      value => {
        this.rModel.comment = value;
        // this.confirmPresenter.setConfirmNoteText();
        this.main.closeDialog();
      },
      this.rModel.comment
    ))
  }

  /**
   * @override.
   */
  public async onItemEstimateDialogClick(
    withPrice: VehicleWithPrice
  ): Promise<any> {
    try {
      this.rModel.taxiType = null;
      this.rModel.taxiType = await VehicleTypeDAO.getVehicleTypeByID(
        withPrice.carType.value
      );

      // confirmFragment.getCompanyByCompanyKey(new RouteDAO(this).getRouteByID(this.bookTaxiModel.routeId));
      // RealTimeThread.get(this).retryRealTime();
      // this.bookTaxiModel.lstOldCartypeActive.put(this.bookTaxiModel.routeId, this.bookTaxiModel.taxiType.vehicleID);
      // this.bookTaxiModel.lstOldTabIDActive.put(this.bookTaxiModel.landmarkID, this.bookTaxiModel.routeId);

      // Ước lượng.
      this.rModel.estimates =
        UserUtils.formatMoney(withPrice.price.value) + " đ";
      let estimate = "";
      if (
        this.rModel.taxiType.seat != Constants.CARTYPE_ANY_SEAT &&
        withPrice.priceType.value === 1
      ) {
        estimate = strings.fare_total_label + ": " + this.rModel.estimates;
      } else {
        estimate = strings.taxi_back_a_to_b + ": " + this.rModel.estimates;
      }

      let taxiTypeName = this.rModel.taxiType.getName();

      // Cập nhật lại tên loại xe đã chọn
      this.confirmPresenter.updateEstimateInfo(estimate, taxiTypeName);

      // confirmFragment.cartypeInfo.setText(this.bookTaxiModel.taxiType.getName());
      // if (this.bookTaxiModel.taxiType.type == CarType.BIKE.getId()) {
      //     confirmFragment.cartypeInfo.setLeftIcon(R.drawable.ic_menu_bike);
      // }

      this.main.closeDialog();
    } catch (error) { }
  }

  // Xử lý sự kiện click right icon tren dst address.
  public estimateDstRightIconClick(): void {
    this.removeEndMarker();
    this.removeDirections();
    this.rModel.resetDstAddress();
    this.main.moveMyLocation();
  }

  /**
   * @override.
   */
  public async actionConfirmScheduleBtn(): Promise<any> {
    this.mHistory = await BookedHistoryDAO.getScheduleBookTaxi();

    if (SessionStore.isScheduleBooking()) {
      Triplet.get()
        .isVerticle(true)
        .setTitle(strings.alert_dialog_title)
        .setMessage(strings.book_confirm_schedule_alert)
        // Hủy cuốc đặt lịch.
        .setAskMeText(strings.book_schedule_cancel_btn)
        .setAskMePress(() => {
          this.onScheduleCancel();
        })
        // Xem chi tiết cuốc đặt lịch.
        .setNegativeText(strings.book_schedule_show_btn)
        .setNegativePress(() => {
          // this.main.showFragment(FragmentMap.ScheduleFragment);
          this.main.navigateScreen(ScreenName.SCHEDULE_FRAGMENT, {
            bookingViewModel: this.main
          });
        })
        // Bỏ qua.
        .setPositiveText(strings.btn_dismiss)
        .setPositivePress(() => { })
        .showDialog(this.main.getDialog());
      // .show()
    } else {
      DatePickerModule.showDatePicker(this.rModel.catchedTime).then(
        response => {
          this.rModel.catchedTime = response.catchedTime;
          this.rModel.isSchedule = response.isSchedule;
          this.rModel.isShareBooking = response.isShareBooking || false;

          // Update to layout.
          let mTimeSchedule = "";
          if (response.isSchedule) {
            mTimeSchedule = this.formatTimeByLanguage(response.catchedTime);
          } else {
            mTimeSchedule = strings.book_alarm_waiting_title;
          }
          this.confirmPresenter.setConfirmSchedule(mTimeSchedule);
        }
      );
    }
  }

  // action huỷ cuốc đặt lịch.
  public onScheduleCancel(): void {
    // DialogWaitRequest.show(main);
    // this.main.getDialog().showDialogWaitRequest();

    CancelScheduleHandler.verifyCancelSchedule(
      this.mHistory.bookCode,
      this.mHistory.company.companyKey
    )
      .then(async (response: CancelScheduleReponseModel) => {
        console.log(`test_shedulte__${JSON.stringify(response.status.value)}`);
        let message: string = "";
        if (response.status.value) {
          // Thông báo hủy đặt lịch thành công
          message = strings.booked_taxi_schedule_cancel_success;
          // Hủy cuốc đặt lịch
          this.rModel.isSchedule = false;
          this.mHistory.state = BookedStep.CLIENT_CANCEL;
          // Thiết lập lại thời gian đặt lịch
          this.rModel.catchedTime = Date.now();
          // Thiết lập lại thời gian đặt lịch
          SessionStore.setScheduledBookTime(Date.now());
          this.confirmPresenter.setConfirmSchedule(
            strings.book_alarm_waiting_title
          );
          this.finishBookSchedule();
          await BookedHistoryDAO.updateScheduleState(this.mHistory);
          // this.main.getMapManager().clear();

          this.main.showFragment(FragmentMap.CONFIRM_HOME);
        } else {
          message = strings.history_delete_error;
        }
        this.main.showToast(message);
      })
      .catch(error => {
        this.main.showToast(strings.alert_not_connect_server);
      });
  }

  /* Kết thúc quốc đặt lịch */
  public finishBookSchedule(): void {
    // Nếu là cuốc đặt lịch thì gán lại trạng thái cuốc
    if (this.rModel.isSchedule) {
      this.rModel.isSchedule = false;
      this.rModel.isShareBooking = false;
    }
    // Thiết lập lại trạng thái kết thúc quốc
    SessionStore.setFinishBooking();
    this.rModel.bookCode = "";
    this.rModel.isCatcherCar = false;

    // Hủy khuyến mại và ghi chú cũ
    this.rModel.promotion = "";
    this.rModel.comment = "";
    this.rModel.estimates = "";
    if (this.rModel.childPrices != null) {
      this.rModel.childPrices = [];
    }
  }

  /**
   * @override
   * Xử lý sự kiện click button đặt xe.
   */
  public actionBooking(srcAddress: string): void {
    // Hủy các thông tin lái xe
    this.rModel.vehicleInfo = null;

    // Move về trung tâm bản đồ trước khi thực hiện animation
    //TODO: bỏ ko move về tâm => để view car move vị trí đặt xe
    // this.moveMyLocation();

    this.confirmBooking(srcAddress);

    // this.showTaxiOnMap();
  }

  private async confirmBooking(srcAddress: string): Promise<any> {
    // Nếu đang update địa chỉ thì đợi
    // if (isRequsetAddress) {
    //   isRequsetAddress = false;
    //   return;
    // }

    // Nếu mạng không khả dụng
    let ret = await NativeAppModule.isEnableNetwork();
    if (!ret) {
      this.main.showToast(strings.book_confirm_network_error);
      return;
    }

    this.componentWillUnmount();

    // Chuyển sang màn hình đặt xe
    // this.main.setConfirmDataBooking(new Date().getTime());

    // Thông báo khi chưa có địa chỉ đặt xe
    if (
      !this.rModel.isValidSrcAddress() ||
      this.rModel.srcAddress.formattedAddress.trim().toUpperCase() ===
      ",".toUpperCase() ||
      this.rModel.srcAddress.formattedAddress.toUpperCase() ===
      strings.no_address.toUpperCase()
    ) {
      this.main.showToast(strings.book_address_from_empty);
      return;
    }

    // Nếu là loại app hợp đồng thì thông báo khi chưa ước lượng được giá
    if (
      this.rModel.taxiType.obligeEndPoint == 1 &&
      this.rModel.estimates === ""
    ) {
      // Thông báo hoàn thành cuốc khi mất kết nối từ initbook

      UnitAlert.get()
        .setMessage(strings.book_car_not_fare)
        .setPositiveText(strings.btn_ok)
        .setPositivePress(() => {
          this.showDirections();
        })
        .show();

      return;
    }

    // Vùng không hỗ trợ là vùng ngoài ds vùng hỗ trợ và không có tuyến trong vùng
    // Cập nhật lại tableId vùng nếu tìm kiếm vùng khác trong confirm
    if (
      this.rModel.taxiType == null ||
      this.rModel.route.routeId == -1 ||
      this.rModel.landmark == null ||
      this.rModel.landmark.landmarkId == -1
    ) {
      this.main.showToast(strings.book_not_support_are);
      return;
    }

    // Kiểm tra đăng ký tài khoản
    let isActive: boolean = SessionStore.getUser().isActive;
    if (!isActive) {
      // new BookingDialogCreateUser(main).show();
      PairAlert.get()
        .setMessage(strings.book_create_user_alert)
        .setNegativeText(strings.btn_dismiss)
        .setNegativePress(() => {
          this.rModel.isSchedule = false;
          this.rModel.isShareBooking = false;
        })
        .setPositiveText(strings.user_register_title)
        .setPositivePress(() => {
          // Start màn hình user.
        })
        .show();
      return;
    }

    // Lưu thông tin địa chỉ vào model
    this.rModel.srcAddress.formattedAddress = srcAddress;
    this.rModel.focusAddress = FocusAddress.NO_FOCUS;

    // Cuốc sân bay đặt lịch hoặc cuốc đặt lịch
    if (
      this.rModel.isSchedule ||
      (this.rModel.isSchedule && this.rModel.taxiType.type == CarType.AIR_PORT)
    ) {
      let message: string = "";
      // Nếu đang có cuốc đặt lịch thì bỏ qua
      if (SessionStore.isScheduleBooking() && this.rModel.isSchedule) {
        this.main.showToast(strings.alarm_was_schedule_booking_confirm);
        return;
      }

      if (this.rModel.isSchedule) {
        // Thời gian đặt lịch không phù hợp với quá khứ
        // if (this.rModel.catchedTime < Date.now()) {
        //   this.main.showToast(strings.alarm_history);
        //   return;
        // }

        // Thời gian đặt lịch < 15 so với hiện tại
        // if (
        //   this.rModel.catchedTime - Date.now() <
        //   Constants.MIN_SCHEDULE_TIME
        // ) {
        //   this.main.showToast(strings.alarm_low);
        //   return;
        // }
        message = strings.booked_taxi_schedule;
      } else if (this.rModel.taxiType.type == CarType.AIR_PORT) {
        message = strings.booked_taxi_airport;
        this.rModel.catchedTime = Date.now();
      }

      // this.main.showToast(message);
      BookingViaHandler.verifyBookingVia(this.rModel, SessionStore.getUser())
        .then(async (response: BookingViaReponseModel) => {
          let message: string = "";

          switch (response.status.value) {
            case 0:
              //NONE
              message = strings.alert_not_connect_server;
              break;
            case 1:
              //SUCCESS
              message = "";
              // Lưu trữ thông tin quốc khách vào database
              // let bookedHistoryDAO: BookedHistoryDAO = new BookedHistoryDAO();
              this.rModel.state = BookedStep.DONE;
              this.rModel.updateDate = Date.now();
              this.rModel.bookCode = response.bookCode.value;
              if (this.rModel.isSchedule) {
                SessionStore.setScheduledBookTime(this.rModel.catchedTime);
              }
              BookedHistoryDAO.insertBookedVehicle(this.rModel);
              // Trở về màn hình chính và hiện thông báo
              UnitAlert.get()
                .setTitle(strings.alert_dialog_title)
                .setMessage(strings.booked_taxi_schedule_success)
                .setPositiveText(strings.btn_ok)
                .setPositivePress(() => {
                  this.rModel.resetAddress();
                  this.finishBookSchedule();
                  // về home và xóa bản đồ
                  this.main.showBookTaxiFragment(true);
                })
                .show();
              break;
            case 2:
              //FAIL_LOGIN
              message = strings.booked_taxi_schedule_login_fail;
              break;
            case 3:
              //TIMEOUT
              message = strings.booked_taxi_schedule_time_out;
              break;
            case 4:
              //CANCEL
              message = strings.booked_taxi_schedule_cancel.replace(
                /#/gi,
                this.rModel.company.reputation
              );
              break;

            default:
              //LOCK_USER: 5
              if (response.liftbanTime.value <= 0) {
                message = strings.booked_taxi_schedule_look;
              } else {
                message = strings.booked_taxi_schedule_look_time;
                message = message.replace(
                  Constants.STRING_ARGS,
                  "" +
                  Utils.formatDateTime(
                    response.liftbanTime.value * 1000 -
                    Constants.DELTA_TIME_SERVER,
                    "HH:mm-dd/MM/yyyy"
                  )
                );
              }
              // Thông báo hoàn thành cuốc khi nhận bản tin DONE
              // SimpleDialog dialog = new SimpleDialog(main, message);
              // main.showDialog(dialog);
              break;
          }
          if (!Utils.isEmpty(message)) {
            this.main.showToast(message);
          }
        })
        .catch(error => {
          this.main.getDialog()._closeDialog();
          this.main.showToast(strings.alert_not_connect_server);
        });
    } else {
      // Kiểm tra xe xung quanh nếu là loại xe hợp đồng
      if (
        !this.rModel.isValidDstAddress() &&
        this.rModel.taxiType != null &&
        this.rModel.taxiType.obligeEndPoint == 1
        // && this.bookTaxiModel.nearCarRealTime.size() <= 0
      ) {
        this.checkContractCarNear();
        return;
      }
      // this.bookTaxiModel.isFragmentConfirm = false;
      // Xử lý quá trình đặt xe
      this.showTaxiOnMap();
    }
  }

  /* Kiểm tra xe xung quanh nếu là loại xe hợp đồng */
  protected checkContractCarNear(): void {
    // Dùng cho app kế thừa
  }

  /* Chuyển sang màn hình xử lý đặt xe */
  public async showTaxiOnMap() {
    // Lưu vị trí đặt xe
    await SharedCache.setLastestLocation(this.rModel.srcAddress);

    this.rModel.currentLocation =
      this.main.getCurrentLatLng() || new LatLng(0, 0);
    this.rModel.state = BookedStep.START;
    this.rModel.isBookFromHistory = false;

    // Dừng thread real time near car
    if (this.nearCarRealtime != null) this.nearCarRealtime.destroy();


    if (this.getMap() != null) {

      //xóa marker xe xung quanh
      this.getMap().removeAllMarkers();

      //xóa lộ trình nếu có
      this.getMap().removePolyline();
    }

    // reset thông tin loại xe
    // this.rModel.nearCarRealTime.clear();
    // Khóa tự động update địa chỉ
    this.rModel.isTouchMoveMap = true;

    // Lưu địa chỉ vào danh sách lịch sử
    await this.addAddressToHistory();

    // Chuyển sang màn hình đợi
    this.main.showFragment(FragmentMap.SHOW_TAXI);
  }

  /* Lưu địa chỉ đặt xe vào danh sách history */
  private async addAddressToHistory() {
    // Lưu thông tin điểm đón
    try {
      // Lưu thêm điểm đến của khách theo cấu hình
      if (this.rModel.isValidDstAddress()) {
        await AddressHistoryDAO.insert(this.rModel.dstAddress);
        this.rModel.addAddressHistorys(this.rModel.dstAddress);
      }

      //chèn điểm đi
      await AddressHistoryDAO.insert(this.rModel.srcAddress);
      this.rModel.addAddressHistorys(this.rModel.srcAddress);
    } catch (error) {
      // console.log("addAddressToHistory error -> ", error);
    }
  }

  /**
   * @override
   * Xử lý sự kiện click button gọi hãng.
   */
  public actionCall(): void {
    NativeLinkModule.openDialPhone(this.main.getBookTaxiModel().company.phone);
  }

  /**
   * @override
   * Xử lý khi chọn nút location.
   */
  public async actionLocationBtn() {
    let currentLocation = this.main.getCurrentLatLng();

    // Nếu đang ở vị trí hiện tại thì bỏ qua
    if (
      Utils.isCurrentLocation(this.rModel.srcAddress.location, currentLocation)
    ) {
      this.main
        .getMapManager()
        .moveCenterCamera(this.rModel.srcAddress.location);
      return;
    }

    // Nếu GPS ko được bật thì vào settings
    let ret = await FusedLocationModule.isEnableLocation();
    if (!ret) {
      ToastModule.show(strings.gps_network_not_get_location);
      FusedLocationModule.openLocationSetting();
      return;
    }

    // Di chuyển về vị trí location
    this.moveMyLocation();
  }

  private initAddress = (): void => {
    if (this.rModel.isValidDstAddress()) {
    } else {
    }
  };

  public animatedZoomOutWhenFinishLayOut() {
    //TODO: cần tính lại padding top, bottom
    //zoom theo ab
    let topPadding = this.confirmPresenter.getTopHeight();
    let bottomPadding = this.confirmPresenter.getBottomHeight();
    
    this.zoomBoundMapByLatLngAB({
      top: topPadding,
      right: 10,
      bottom: bottomPadding,
      left: 10
    });  

  }

  /* Vẽ lộ trình ước lượng từ server */
  public showDirections() {
    //kiểm tra nếu ko có điểm đến thì bỏ qua
    if (!this.rModel.isValidDstAddress()) {
      return;
    }

    //nếu khoảng cách quá gần thì cũng bỏ qua
    if (
      MapUtils.isBetweenLatlng(
        this.rModel.srcAddress.location,
        this.rModel.dstAddress.location
      )
    ) {
      return;
    }

    this.animatedZoomOutWhenFinishLayOut();

    //xóa lộ trình cũ
    this.removeDirections();

    // Vẽ lộ trình theo cấu hình sử dụng
    this.drawDirections();
    // isRequestToServer = true;
  }

  /* Vẽ đường ước lượng 
    thêm điểm đầu vè điểm cuối để vẽ kín polyline
  */
  public drawerPolyline(
    polylines: Array<{ latitude: number; longitude: number }>
  ) {
    if (this.main.getMapManager() == null) return null;

    if (polylines && polylines.length > 0) {
      let options = new PolylineOptions();
      options.coordinates = polylines;
      options.fillColor = "rgba(255,0,0,0.5)";
      options.strokeColor = "#F00";
      options.strokeWidth = 1;
      return this.main.getMapManager().addPolyline(options);
    }

    return null;
  }

  private drawDirections(): void {
    let dstAddress: BAAddress = this.main.getBookTaxiModel().dstAddress;
    if (dstAddress.isAvailableLocation()) {
      // Vẽ lại marker B và hiển thị ước lượng giá.
      this.esstimatePrice(response => {
        // Nếu có dữ liệu thì vẽ lộ trình lên bản đồ
        if (response) {
          // Gán danh sách giá ước lượng.
          this.rModel.childPrices = response.childPrices.value;

          // Vẽ vùng hỗ trợ
          let polylines = MapUtils.decodePolyline(response.polyline.value);
          if (polylines && polylines.length > 0) {
            //thêm điểm dầu đi vào đầu mảng
            polylines.splice(0, 0, this.rModel.srcAddress.location);

            //thêm điểm đến vào cuối mảng
            polylines.push(this.rModel.dstAddress.location);
          }

          this.drawerPolyline(polylines);

          // Hiển thị animation trên view ước lượng.
          // this.ieConfirmBook.showEstimateAnimation(true);
          // Tính toán ước lượng,khoảng cách.
          // this.ieConfirmBook.estimatePrice(response);

          let reponseModel: CalcPriceResponse = response;

          this.rModel.estimates = "";
          this.rModel.distanceAB = -1;

          // gán dữ liệu.
          this.rModel.distanceAB = reponseModel.distance.value;

          if (this.points.length > 0) {
            this.points = [];
          }

          this.updateEstimatePrice(reponseModel, dstAddress);


        } else {
          // vẫn phải hiển thị điểm đến nếu không estimate đc
          this.confirmPresenter.estimatePrice(false, "", "", dstAddress);
        }
      });
    }
  }

  public updateEstimatePrice(reponseModel: CalcPriceResponse, dstAddress: BAAddress): void {
    //     points = Utils.decodePoly(reponseModel.polyline);
    // drawPolyline(points);
    if (reponseModel.priceMax.value > 0) {
      this.rModel.estimates =
        UserUtils.formatMoney(reponseModel.priceMin.value) +
        " - " +
        UserUtils.formatMoney(reponseModel.priceMax.value) +
        " đ";
    } else {
      this.rModel.estimates =
        UserUtils.formatMoney(reponseModel.priceMin.value) + " đ";
    }

    // Hiển thị.
    let txtEstimate = "";
    if (
      this.rModel.taxiType.seat != Constants.CARTYPE_ANY_SEAT &&
      reponseModel.priceType.value === 1
    ) {
      txtEstimate =
        strings.fare_total_label + ": " + this.rModel.estimates;
    } else {
      txtEstimate =
        strings.taxi_back_a_to_b + ": " + this.rModel.estimates;
    }
    this.confirmPresenter.estimatePrice(
      true,
      txtEstimate,
      UserUtils.formatDistance(this.rModel.distanceAB),
      dstAddress
    );
  }

  /** Di chuyển về vị trí location */
  private async moveMyLocation() {
    let currentLocation = this.main.getCurrentLatLng();

    // Nếu location null bỏ qua
    if (Utils.isOriginLocation(currentLocation)) {
      return;
    }

    // Khóa các sự kiện trên bản đồ
    // this.mapManager.setActionMapEnable(false);

    const TIME_ANIM_MOVE_CENTER = 1;
    // move to current location
    this.main
      .getMapManager()
      .moveCenterCamera(currentLocation, TIME_ANIM_MOVE_CENTER);

    this.removeDirections();

    // Vẽ lại A nếu không có marker nào dc focus
    if (this.rModel.focusAddress != FocusAddress.A_FOCUS) {
      this.rModel.srcAddress.location = new LatLng(
        currentLocation.latitude,
        currentLocation.longitude
      );

      this.mapManager.removeStartMarker();
      this.mapManager.drawStartMarker(this.rModel.srcAddress.location);

      // mCameraPosition = new CameraPosition(point, MapManager.CAMARA_DEFAULT_ZOOM, 0, 0);

      // Vẽ lại ước lượng
      this.showDirections();

      // Cập nhật lại địa chỉ
      let isNet = await NativeAppModule.isEnableNetwork();
      if (isNet) {
        // Lấy địa chỉ đi và cập nhật lên giao diện
        await this._loadSourceAddress(this.rModel.srcAddress.location, true);
      } else {
        this.rModel.srcAddress.formattedAddress = "";
        this.confirmPresenter.updateViewSrcAddress(null);
      }
    }

    // Cập nhật lại giá trị của company trong model
    //TODO: kiểm tra lại
  }

  async _loadSourceAddress(latLng: LatLng, isUpdate: boolean) {
    if (isUpdate) {
      this.rModel.srcAddress.location = latLng;
      this.rModel.srcAddress.formattedAddress = "";
    }

    // threadScrId++;
    let isRequestSourceBA =
      this.rModel.isSupportArea() && this.rModel.isRequestAddressBA();
    let addressRequestType: AddressRequestType = isRequestSourceBA
      ? AddressRequestType.BINH_ANH
      : AddressRequestType.GOOGLE;
    let srcAddress = await new GeocodingLocation().geocodingFromLatLng(
      latLng,
      NativeAppModule.KEY_MAP,
      addressRequestType
    );
    this.confirmPresenter.updateViewSrcAddress(srcAddress);
  }

  /* Ước lượng lộ trình, giá cước di chuyển */
  public esstimatePrice(callback: Function) {
    CalcPriceController.estimateRequest(
      this.rModel.srcAddress.location,
      this.rModel.dstAddress.location,
      this.rModel.company.companyKey,
      this.rModel.getVehicleType().vehicleId,
      this.rModel.promotion,
      SessionStore.getUser().phone
    )
      .then(response => callback(response))
      .catch(err => callback(null));
  }

  /* Xóa ước chỉ dẫn đường từ A->B */
  private removeDirections(): void {
    // Xóa ước lượng
    // googleDirection.resetDirection();
    this.mapManager.removePolyline();

    // Xóa thông tin cũ
    this.rModel.estimates = "";
    this.rModel.distanceAB = -1;
    this.rModel.childPrices = [];
    // ẩn view ước lượng.
    // this.ieConfirmBook.showEstimateAnimation(false);
    this.confirmPresenter.estimatePrice(false, "", "", new BAAddress());
  }

  /* Set ngôn ngữ hiển thị cho thời gian đặt lịch */
  private formatTimeByLanguage(date): string {
    let longDate = new Date(date);
    let hour =
      longDate.getHours() < 10
        ? `0${longDate.getHours()}`
        : longDate.getHours();
    let minute =
      longDate.getMinutes() < 10
        ? `0${longDate.getMinutes()}`
        : longDate.getMinutes();

    // let day = longDate.getDate();
    let day =
      longDate.getDate() < 10 ? `0${longDate.getDate()}` : longDate.getDate();
    let month =
      longDate.getMonth() + 1 < 10
        ? `0${longDate.getMonth() + 1}`
        : longDate.getMonth() + 1;

    return `${hour}h${minute} - ${day}/${month}`;
  }

  /**
   * trở về màn hình home
   */
  public async clickHeaderBack() {
    //về màn hình home
    this.main.showFragment(FragmentMap.BOOK_HOME);
  }
}
