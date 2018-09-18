import { NativeAppModule } from "../../../../module";
import BAMessage from "../../../../module/tcp/BAMessage";
import PingMessage from "../../../tcp/sent/PingMessage";
import NetworkInfoState from "../../../../module/model/NetworkInfoState";
import { MessageType } from "../../../tcp/MessageType";
import AckLoginMessage, { LoginState } from "../../../tcp/recv/AckLoginMessage";
import BookTaxiModel from "../BookTaxiModel";
import TripStep from "../../../constant/TripStep";
import LogFile from "../../../../module/LogFile";
import Constants from "../../../constant/Constants";
import strings from "../../../../res/strings";
import {
  Utils,
  ConnectionManager,
  NativeTcpModule,
  MediaManager,
  PairAlert,
  UnitAlert,
  IAlert,
  DfString,
  LifecycleEventListener,
  Dialog,
  AlertModel,
  MarkerOptions,
  MarkerInfoWindow,
  NativeLinkModule,
  TcpEventProcess
} from "../../../../module";
import AckInitBookMessage from "../../../tcp/recv/AckInitBookMessage";
import BookedStep from "../../../constant/BookedStep";
import CarsInfoMessage, {
  CarInfoModel
} from "../../../tcp/recv/CarsInfoMessage";
import VehicleInfo from "../../../model/VehicleInfo";
import DriverInfo from "../../../model/DriverInfo";
import CarType from "../../../constant/CarType";
import ServerViewCarMessage from "../../../tcp/recv/ServerViewCarMessage";
import ConfigParam from "../../../constant/ConfigParam";
import BookingViewModel, {
  FragmentMap,
  HeaderAlertType
} from "../BookingViewModel";
import OperatorDispatchingMessage from "../../../tcp/recv/OperatorDispatchingMessage";
import AckCommandInfoMessage from "../../../tcp/recv/AckCommandInfoMessage";
import OperatorCancelMessage from "../../../tcp/recv/OperatorCancelMessage";
import AckReloginMessage from "../../../tcp/recv/AckReloginMessage";
import SubStep from "../../../constant/SubStep";
import AckReloginSubMessage from "../../../tcp/recv/AckReloginSubMessage";
import CancelInfo from "../../../tcp/recv/CancelInfo";
import raws from "../../../../res/raw";
import ClientCancelMessage from "../../../tcp/sent/ClientCancelMessage";
import OnTcpEventListener from "../../../../module/tcp/OnTcpEventListener";
import CatchedCarMessage from "../../../tcp/sent/CatchedCarMessage";
import ProcessInitBook from "./ProcessInitBook";
import ProcessClientCancel from "./ProcessClientCancel";
import ProcessWaitDriverMissed from "./ProcessWaitDriverMissed";
import ProcessWaitCarInfo from "./ProcessWaitCarInfo";
import ProcessRelogin from "./ProcessRelogin";
import ProcessLogin from "./ProcessLogin";
import ProcessCommandInfo from "./ProcessCommandInfo";
import ViewCarPage from "./ViewCarPage";
import ViewCarPresenter from "./ViewCarPresenter";
import BookedHistoryDAO from "../../../sql/dao/BookedHistoryDAO";
import MapUtils from "../../../../module/maps/MapUtils";
import Landmark from "../../../sql/bo/Landmark";
import MessageEvent from "../../../../module/tcp/MessageEvent";
import ISentMessage from "../../../../module/tcp/ISentMessage";
import DoneInfoMessage from "../../../tcp/recv/DoneInfoMessage";
import BookedHistory from "../../../sql/bo/BookedHistory";
import images from "../../../../res/images";
import MapManager from "../../../component/booking/MapManager";
import { BAMessageType } from "../../../../module/tcp/BAMessageType";
import SessionStore from "../../../Session";
import ProcessConnection from "./ProcessConnection";

export default class ViewCarViewModel extends TcpEventProcess
  implements OnTcpEventListener, MessageEvent, LifecycleEventListener {
  private static TIME_OUT_RELOGIN = 15 * 60 * 1000;

  private static TIME_OUT_WITING_CARINFO = 3 * 60 * 1000;

  private static MAKER_TAXI_X_ANCHOR = 0.5;

  private static NO_CONNECTION = -1;

  public mViewCarPresenter: ViewCarPresenter;

  public bookingViewModel: BookingViewModel;

  private rModel: BookTaxiModel;

  /* Đối tượng ping */
  private pingMessage: BAMessage;

  private mMessageStatus: Map<number, boolean>;

  /* Đối tượng login */
  public processLogin: ProcessLogin;

  /* Đối tượng xử lý initbook */
  public processInitBook: ProcessInitBook;

  /* Đối tượng xử lý đợi xe */
  public processWaitCarInfo: ProcessWaitCarInfo;

  /* Đối tượng xử lý clientcancel */
  public processClientCancel: ProcessClientCancel;

  /* Đối tượng xử lý driver miss */
  public processDriverMissed: ProcessWaitDriverMissed;

  /* Đối tượng xử lý commandinfo */
  public processCommandInfo: ProcessCommandInfo;

  public processConnect:ProcessConnection;

  /** đối tượng xử lý relogin */
  public processRelogin: ProcessRelogin;

  /* Cờ trạng thái khách đã click lên xe và lái xe đã mời khách */
  public isViewCustomer: boolean = false;

  /* Trạng thái gửi bản tin clientcancel khi finish OperatorDispatching */
  // public isCancelDispatchingFinish: boolean = false;

  /* Cờ trạng thái Restart app */
  public isRestartAppRelogin: boolean = false;

  /* Cờ trạng thái relogin thành công hay không */
  public isReloginSuccess: boolean = false;

  /* Trạng thái người dùng hủy cuốc khi đang đợi timeout OperatorDispatching */
  public isCancelBookOnDispatching: boolean = false;

  /** Map lưu trữ các action sau khi nhận message mà chưa xử lý*/
  private actionQueues: Map<number, Function>;

  /** trạng thái kết nối với server */
  private connectState: NetworkInfoState;

  /**marker xe */
  public vehicleMarker: MarkerOptions;

  /** Lưu trữ thông tin book để xử lý giữ liệu nhận*/
  public bookid: number = ViewCarViewModel.NO_CONNECTION;

  constructor(
    viewCarPresenter: ViewCarPresenter,
    bookingViewModel: BookingViewModel
  ) {
    super();
    //gán đối tượng xử lý
    this.mViewCarPresenter = viewCarPresenter;
    this.bookingViewModel = bookingViewModel;
    this.rModel = bookingViewModel.getBookTaxiModel();
  }

  public getBookTaxiModel(): BookTaxiModel {
    return this.rModel;
  }

  public getViewCarPresenter(): ViewCarPresenter {
    return this.mViewCarPresenter;
  }

  public getBookingViewModel(): BookingViewModel {
    return this.bookingViewModel;
  }

  public showToast(msg: string) {
    this.bookingViewModel.showToast(msg);
  }

  public async onInit() {
    //gán sự kiện lắng nghe trạng thái
    this.bookingViewModel.setListener(this);

    //xử lý trên bản đồ
    this.onMapReady(this.getMapManager());

    //gán lại trạng thái step
    this.rModel.tripStep = TripStep.NONE;

    //start lại cuốc
    SessionStore.setStartBooking();

    this.mMessageStatus = new Map();

    //ngắt kết nối
    await this.disconnectAll();
  }

  public actionIconOnMap(): void {
    if (this.rModel.vehicleInfo && this.rModel.vehicleInfo.currentLocation) {
      this.getMapManager().moveCenterCamera(
        this.rModel.vehicleInfo.currentLocation
      );
    } else {
      this.getMapManager().moveCenterCamera(this.rModel.srcAddress.location);
    }
  }

  /** thiết lập nội dung khi componentDidMount*/
  public async setContent() {

    // Gán trạng thái là đang đặt xe
    if (this.rModel.isStart()) {
      this.rModel.catchedTime = new Date().getTime();
      this.isRestartAppRelogin = false;
    } else {
      // Cập nhật trạng thái restart app
      this.isRestartAppRelogin = true;
    }

    // Kiểm tra cuốc đặt cũ và cuốc đặt mới, nếu thỏa mãn thì gán OldBookID
    let bookedHistories: BookedHistory[] = await BookedHistoryDAO.getBookedTaxis();
    if (bookedHistories != null && bookedHistories.length > 0) {
      let history = bookedHistories[0];
      LogFile.e("ViewCarViewModel setContent bookedHistories", bookedHistories);
      LogFile.e("ViewCarViewModel setContent history", history);
      // Gửi lại book nếu cuốc chưa hoàn thành, thời gian giữa 2 cuốc < 5 phút, khoảng cách < 200m
      let isSentOldBook =
        this.rModel.catchedTime - history.catchedTime <=
          Constants.TIME_OLD_BOOK_AND_NEW_BOOK &&
        MapUtils.calculationByDistance(
          this.rModel.srcAddress.location,
          history.srcAddress.location
        ) < Constants.MAX_DISTANCE_FOR_USER;
      if (
        history.state != BookedStep.DONE &&
        history.tripStep != TripStep.DONE &&
        history.state != BookedStep.DRIVER_MISSED &&
        isSentOldBook
      ) {
        this.rModel.oldBookID = history.bookCode;
      } else {
        this.rModel.oldBookID = "";
      }
    }

     //hiện thị waiting
     this.startAmimation();

    //tạo bookid
    this.bookid = Math.round(new Date().getTime() / 1000);

    this.processConnect = new ProcessConnection(this);
    this.processConnect.start();
  }

  public cancelProcessConnect(){
     if(this.processConnect != null){
      this.processConnect.cancel();
      this.processConnect = null;
     }
  }

  public tcpConnectSuccess() {

    //hủy tiến trình kết nối
    this.cancelProcessConnect();

    //thực hiện kết nối
    this.onStart();
  }

  public tcpConnectFail() {

    //về màn hình home
    this.showBookTaxiFragment();

    //hiện thông báo
    UnitAlert.get()
      .setMessage("Không kết nối được server")
      .show();
  }

  componentWillUnmount() {
    //xóa lắng nghe sự kiện
    this.removeEmitterSubscription();
  }

  /**
   * sử dụng sau khi load map xong
   * @param map
   */
  public onMapReady(map: MapManager) {
    if (map == null) return;
    // console.log("onMapReady #########################", this.rModel.srcAddress.location);

    //xóa xe xung quanh nếu có
    map.removeAllMarkers();

    //kiểm tra nếu ko có start marker thì vẽ lại
    if(map.getStartMarker() == null){
      map.drawStartMarker(this.rModel.srcAddress.location);
    }

    //di chuyển bản đồ về vị trí đón xe
    map.moveCenterCamera(this.rModel.srcAddress.location, 0);
    
  }

  /**
   * bắt đầu tiến trình kết nối và lắng nghe sự kiện
   * @param option
   */
  public async onStart(option?: Object) {
    //gán sự kiện xử lý
    this.startTcpEvent(this, this);

    //khởi tạo đối tượng message nhận
    this.actionQueues = new Map();

    //đẩy thông tin lên server
    this.processLogin = new ProcessLogin(this);
    this.processLogin.start();

    return Promise.resolve(this.emitterSubscription);
  }

  

  public moveMyLocation() {
    if (
      this.isMessage(MessageType.CATCHED_CAR) &&
      this.rModel.vehicleInfo &&
      !Utils.isOriginLocation(this.rModel.vehicleInfo.currentLocation)
    ) {
      // Di chuyển về vị trí location
      this.getMapManager().moveCenterCamera(
        this.rModel.vehicleInfo.currentLocation
      );
    } else {
      // Move bản đồ về vị trí hiện tại
      this.bookingViewModel.moveMyLocation();
    }
  }

  /**
   * xử lý khi callback gửi message thành công hay không
   * @param messageId -1: nếu không thành công, id của message khi trả về thành công
   */
  public onSentMessage(messageId: number | -1) {
    if (messageId == -1) {
      LogFile.e("Gửi bản tin không thành công");
    }

    // else {
    //   LogFile.e(`Gửi bản tin ${messageId} thành công`);
    // }

    /** đẩy xuống model lắng nghe */
    // if (this.viewCarListener) this.viewCarListener.onSentMessage(messageId);
  }

  /**
   * thực hiện chu kỳ gửi dữ liệu lên server để kiểm tra kết nối
   */
  public onKeepAlive(option?: Object): boolean {
    //gửi ping lên server
    if (!this.pingMessage) {
      this.pingMessage = new BAMessage();
      this.pingMessage.setWrapperData(new PingMessage());
    }

    //cập nhật vị trí
    if (this.bookingViewModel.getCurrentLatLng() != null) {
      (this.pingMessage.getWrapperData() as PingMessage).update(
        this.bookingViewModel.getCurrentLatLng()
      );
    }

    //gửi bản tin
    this.sendBAMessage(this.pingMessage);
    return true;
  }

  /**
   * trả về trạng thái mạng
   * @param state
   */
  public onConnectionState(state: NetworkInfoState) {
    if (this.connectState !== state) {
      LogFile.log(NativeTcpModule.TYPE_CONNECTION_STATE, state);
      //cập nhật trạng thái kết nối với server
      if (state === NetworkInfoState.CONNECTED) {
        this.bookingViewModel.hideHeaderAlert(HeaderAlertType.NETWORK_ALERT);
      } else {
        let alert = new AlertModel(
          HeaderAlertType.NETWORK_ALERT,
          strings.not_connected_server
        );
        this.bookingViewModel.showHeaderAlert(alert);
      }
      this.connectState = state;
    }
  }

  /*** Thực hiện kết nối lại */
  public onReconnectServer(state: NetworkInfoState) {
    if (state == NetworkInfoState.CONNECTED) {
      if (this.processRelogin == null)
        this.processRelogin = new ProcessRelogin();
      this.processRelogin.start(this);
    } else {
      LogFile.e("Kết nối lại tcp bị lỗi");
    }
  }

  /**
   * kết thúc tiến trình gửi và nhận tcp
   * @param data
   */
  public onFinish(data) {
    LogFile.e("onFinish >>>>>>", data);
  }

  /**
   * xử lý khi đã nhận được bản tin
   * @param message
   */
  public onRecvMessage(message: BAMessage) {
    //log bản tin
    LogFile.logReceivedMessage(message);

    //cập nhật trạng thái kết nối server
    this.onConnectionState(NetworkInfoState.CONNECTED);

    //xử lý nhận message
    switch (message.type.getId()) {
      case MessageType.ACK_LOGIN.getId():
        this.doAckLoginMessage(message);
        break;
      case MessageType.ACK_INIT_BOOK.getId():
        this.doAckInitBookMessage(message);
        break;
      case MessageType.CARS_INFO.getId():
        this.doCarsInfoMessage(<CarsInfoMessage>message.getWrapperData());
        break;
      case MessageType.TCP_SERVER_VIEW_CAR.getId():
        this.doServerViewCarfoMessage(message);
        break;
      case MessageType.INVITE.getId():
        //kiểm tra nếu có carinfor thì đẩy vào query
        if (!this.isMessage(MessageType.CARS_INFO)) {
          LogFile.e(
            "MessageType.INVITE.getId not carinfo==========================="
          );
          this.actionQueues.set(MessageType.INVITE.getId(), () =>
            this.doInviteMessage(message)
          );
        } else {
          this.doInviteMessage(message);
        }
        break;
      case MessageType.CATCHER_USER.getId():
        this.doCatcherUserMessage(message);
        break;
      case MessageType.ACK_CLIENT_CANCEL.getId():
        this.doClientCancelMessage();
        break;
      case MessageType.ACK_DRIVER_MISSED.getId():
        this.doDriverMissedMessage(message);
        break;
      case MessageType.OPERATOR_CANCEL.getId():
        this.doOperatorCancelMessage(<OperatorCancelMessage>(
          message.getWrapperData()
        ));
        break;
      case MessageType.ACK_RELOGIN.getId():
        this.doAckReloginMessage(message);
        break;
      case MessageType.DONE_INFO.getId():
        this.doDoneInfoMessage(message);
        break;
      case MessageType.CHANGE_DRIVER.getId():
        this.doChangeDriverMessage();
        break;
      case MessageType.OPERATOR_DISPATCHING.getId():
        this.doOperatorDispatchingMessage(message);
        break;
      case MessageType.ACK_COMMAND_INFO.getId():
        this.doCommandInfoMessage(message);
        break;
      default:
        break;
    }
  }

  public setViewCarPresenter(viewCarPresenter: ViewCarPresenter) {
    this.mViewCarPresenter = viewCarPresenter;
  }

  private async doAckLoginMessage(message: BAMessage) {
    //ngắt tiến trình login
    if (this.processLogin != null) this.processLogin.cancel();

    let loginAckMessage: AckLoginMessage = <AckLoginMessage>(
      message.getWrapperData()
    );

    try {
      let code = loginAckMessage.loginStatus;
      if (code.value == LoginState.NONE) {
        //lưu sessionkey
        ConnectionManager.setSessionKey(
          DfString.toBytes(loginAckMessage.sessionKey)
        );
        // Login thành công thực hiện gửi message initbook
        this.rModel.tripStep = TripStep.INITING;
        this.mMessageStatus.set(MessageType.ACK_LOGIN.getId(), true);
        // LogFile.e(loginAckMessage.sessionKey);
        // LogFile.logBinary(ConnectionManager.getSessionKey());

        //khởi tạo initbook
        this.processInitBook = new ProcessInitBook(this);
        this.processInitBook.start();
      } else if (code.value == LoginState.WRONG_USER) {
        await this.showBookingErrorAlert(
          UnitAlert.get().setMessage(strings.booked_taxi_schedule_login_fail)
        );
      } else if (code.value == LoginState.LOCK) {
        let message;
        if (loginAckMessage.liftBanTime.value <= 0) {
          message = strings.booked_taxi_schedule_look;
        } else {
          message = strings.booked_taxi_schedule_look_time;
          let time =
            loginAckMessage.liftBanTime.value * 1000 -
            Constants.DELTA_TIME_SERVER;
          message = message.replace(
            Constants.STRING_ARGS,
            Utils.formatDateTime(time, "HH:mm-dd/MM/yyyy")
          );
        }
        await this.showBookingErrorAlert(UnitAlert.get().setMessage(message));
      }
    } catch (e) {
      LogFile.e("doAckLoginMessage", e && e.message);
      await this.showBookingErrorAlert(
        this.getBookingErrorAlert(strings.not_connected_server_retry_book)
      );
    }
  }

  public getBookingErrorAlert(msg: string) {
    return UnitAlert.get()
      .setMessage(msg)
      .setPositiveText(strings.btn_ok)
      .setPositivePress(() => {
        // Trở về màn hinh home
        this.bookingViewModel.showBookTaxiFragment(true);
      });
  }

  /**
   * hiện thị thông báo lỗi
   * @param msg
   */
  public async showBookingErrorAlert(alert: IAlert) {
    LogFile.e("showBookingErrorAlert >>>>>>>>>>>>>>>>>>>>>>>");
    //cập nhật trạng thái hủy
    await this.updateCancelBook();

    //hiện thị thông báo
    this.showAlert(alert);

    //về home
    this.showBookTaxiFragment();
  }

  /**
   * cập nhật trạng thái cuốc khách hàng hủy vào database
   */
  public async updateCancelBook() {
    //cập nhật trạng thái hủy
    this.rModel.state = BookedStep.CLIENT_CANCEL;

    await BookedHistoryDAO.updateState(this.rModel);
  }

  /**
   * xử lý khi nhận initbook
   * @param baMessage
   */
  private async doAckInitBookMessage(baMessage: BAMessage) {
    LogFile.e("doAckInitBookMessage >>>>>>>>>>>>>>>>>>>>>>>");

    //hủy tiến trình initbook
    if (this.processInitBook) {
      this.processInitBook.cancel();
      this.processInitBook = null;
    }

    let ackInitBookMessage = <AckInitBookMessage>baMessage.getWrapperData();

    try {
      if (ackInitBookMessage.initBookStatus.value) {
        // Gán trip step wait car
        this.rModel.tripStep = TripStep.WAIT_CAR;
        this.rModel.state = BookedStep.INITBOOK;
        this.rModel.bookCode = ackInitBookMessage.bookCode.value;
        this.rModel.updateDate = new Date().getTime();

        //cập nhật lịch sử
        try {
          this.rModel.id = await BookedHistoryDAO.insertBookedVehicle(
            this.rModel
          );
          // LogFile.e(
          //   "doAckInitBookMessage insert thành công",
          //   ret + ";this.rModel.id = " + this.rModel.id
          // );
        } catch (e) {
          this.rModel.id = -1;
          LogFile.e(
            "doAckInitBookMessage HistoryHelper.insertBookedVehicle ",
            e && e.message
          );
        }

        //lưu trạng thái đã init book thành công
        this.mMessageStatus.set(MessageType.ACK_INIT_BOOK.getId(), true);

        // Cập nhật lại giao diện
        // this.showInitbookAlert(this.rModel.company.reputation);

        // Thiết lập timeout 3' từ initbook -> message carinfo thì hủy
        let timeOutSeconds =
          ackInitBookMessage.timeOutSeconds.value * 1000 ||
          ViewCarViewModel.TIME_OUT_WITING_CARINFO;

        this.processWaitCarInfo = new ProcessWaitCarInfo(this);
        this.processWaitCarInfo.start(timeOutSeconds);

        // Thiết lập gửi ping
        await NativeTcpModule.enableKeepAlive(true);
      } else {
        // Lỗi khi không thể khởi tạo quốc khách
        let message;
        if (
          ackInitBookMessage.msg != null &&
          !Utils.isEmpty(ackInitBookMessage.msg.value)
        ) {
          message = ackInitBookMessage.msg.value;
        } else {
          message = strings.not_connected_server_retry_book;
        }
        await this.showBookingErrorAlert(this.getBookingErrorAlert(message));
      }
    } catch (e) {
      LogFile.e("doAckInitBookMessage", e && e.message);
      await this.showBookingErrorAlert(
        this.getBookingErrorAlert(strings.not_connected_server_retry_book)
      );
    }
  }

  /* Xử lý khi nhận message carinfo */
  public async doCarsInfoMessage(carsInfoMessage: CarsInfoMessage) {
    LogFile.e("doCarsInfoMessage >>>>>>>>>>>>>>>>>>>>>>>");

    //stop waiting nếu có
    this.stopAmimation();

    // Hủy timer
    if (this.processWaitCarInfo) {
      this.processWaitCarInfo.cancel();
      this.processWaitCarInfo = null;
    }
    // Nếu người dùng đã xác nhận lên xe thì không nhận carinfo mới
    if (this.isMessage(MessageType.CATCHED_CAR)) {
      return;
    }
    // Gán lại các trạng thái nếu có carinfo mới
    this.mMessageStatus.set(MessageType.CARS_INFO.getId(), false);
    this.mMessageStatus.set(MessageType.INVITE.getId(), false);
    this.rModel.tripStep = TripStep.VIEW_CAR;

    // Thông tin carinfo nhận đón
    let carInfoModel = carsInfoMessage.infoMessages.get(0);

    //cập nhật thông tin xe
    this.updateVehicleInfo(carInfoModel);

    //cập nhật loại xe
    if (this.rModel.getVehicleType()) {
      this.rModel.getVehicleType().type = carInfoModel.sCarType.value;
    }

    //cập nhật id hãng
    this.rModel.companyIdTemp = carInfoModel.companyID.value;

    // Lưu thông tin lái xe nhận đón
    this.rModel.state = BookedStep.CARS_INFO;

    //cập nhật thông tin lái xe
    this.updateDriverInfo(carInfoModel);

    //hiện thị giao diện có xe nhận
    this.showCarInfo();

    // Thông báo cho người dùng xe # đã nhận đón
    if (!this.isMessage(MessageType.CARS_INFO)) {
      // Thông báo cho xe HĐ
      let s;
      if (this.rModel.getVehicleType().type == CarType.CAR_CONTRACT) {
        s = strings.book_carinfo_description_contract;
      } else {
        s = strings.book_carinfo_description;
      }
      s = s.replace(Constants.STRING_ARGS, this.rModel.vehicleInfo.carNo);
      //Nếu app đang ở trạng thái sleep thì thông báo notification
      if (this.isStopped()) {
        MediaManager.addNotification(strings.book_carinfo_subtitle, s);
      } else {
        this.showToast(s);
      }
      // Thông báo chuông, rung
      MediaManager.playRingtone(
        Constants.TIME_RING_TONE_SHORT,
        raws.staxi_dispatched
      );
    }

    // Update trạng thái cuốc vào database
    try {
      let ret = await BookedHistoryDAO.updateVehicleInfo(this.rModel);
      LogFile.e("doCarsInfoMessage HistoryHelper.updateVehicleInfo ", ret);
    } catch (e) {
      LogFile.e(
        "doCarsInfoMessage HistoryHelper.updateVehicleInfo ",
        e && e.message
      );
    }

    //cập nhật lại trạng thái đã có xe nhận
    this.mMessageStatus.set(MessageType.CARS_INFO.getId(), true);

    // Vẽ xe nhận đón và thông tin ước lượng
    if (!Utils.isOriginLocation(this.rModel.vehicleInfo.currentLocation)) {
      //xóa marker cũ nếu có
      this.removeVehicleMarker();

      //vẽ xe mới
      this.drawVehicles();

      // Zoombound vị trí xe và vị trí đón
      let lstLatLng = [
        this.rModel.srcAddress.location,
        this.rModel.vehicleInfo.currentLocation
      ];
      this.zoomBoundCameraByLatLngs(lstLatLng);
    }

    //xử lý các hàm sau khi có carInfo
    if (this.actionQueues != null && this.actionQueues.size > 0) {
      this.actionQueues.forEach(callback => {
        LogFile.e(
          "doCarsInfoMessage thực hiện sau khi carinfo xử lý xong" + callback &&
            callback.name
        );
        callback && callback();
      });

      this.actionQueues.clear();
    }
  }

  public isStopped(): boolean {
    return this.bookingViewModel.isStopped();
  }

  /**
   * cập nhật thông tin xe
   * @param carInfoModel
   */
  private updateVehicleInfo(carInfoModel: CarInfoModel) {
    // console.log("updateVehicleInfo =========carInfoModel========",  carInfoModel);

    //nếu chưa khởi tạo thông tin lái xe thì khởi tạo
    if (Utils.isNull(this.rModel.vehicleInfo)) {
      this.rModel.vehicleInfo = new VehicleInfo();
    }

    //cập nhật carinfo
    this.rModel.vehicleInfo.carNo = carInfoModel.carNo.value;
    this.rModel.vehicleInfo.driverCode = carInfoModel.driverCode.value;
    this.rModel.vehicleInfo.vehiclePlate = carInfoModel.vehiclePlate.value;
    this.rModel.vehicleInfo.status = carInfoModel.carState.value;
    this.rModel.vehicleInfo.currentLocation = carInfoModel.latLng.value;
    this.rModel.vehicleInfo.vehicleImage = carInfoModel.vehicleImage.value;
    this.rModel.vehicleInfo.vehicleColor = carInfoModel.vehicleColor.value;
    this.rModel.vehicleInfo.vehicleName = carInfoModel.vehicleName.value;
    this.rModel.vehicleInfo.carType = carInfoModel.sCarType.value;

    // Thêm biển số vào danh sách xe đã đặt
    this.rModel.vehicleInfo.addBookedVehicle(
      this.rModel.vehicleInfo.vehiclePlate
    );

    // console.log("updateVehicleInfo =================", this.rModel.vehicleInfo);
  }

  /**
   * cập nhật thông tin lái xe
   * @param carInfoModel
   */
  private updateDriverInfo(carInfoModel: CarInfoModel) {
    // console.log("updateDriverInfo =========carInfoModel========",  carInfoModel);
    this.rModel.driverInfo = new DriverInfo();

    // console.log("updateDriverInfo =========1111========",  this.rModel.driverInfo);

    this.rModel.driverInfo.driverCode = carInfoModel.driverCode.value;
    this.rModel.driverInfo.name = carInfoModel.driverName.value;
    this.rModel.driverInfo.phone = carInfoModel.driverPhone.value;
    this.rModel.driverInfo.rating = carInfoModel.driverRating.value;
    this.rModel.driverInfo.avatarLink = carInfoModel.imageLink.value;
    this.rModel.driverInfo.vehicleColor = carInfoModel.vehicleColor.value;
    this.rModel.driverInfo.vehicleName = carInfoModel.vehicleName.value;

    // console.log("updateDriverInfo =================",  this.rModel.driverInfo);
  }

  /**
   * hiện thị thông tin xe
   */
  public showCarInfo() {
    // Xóa mới bản đồ và vẽ lại marker
    this.drawMarkerBooking(this.getMapManager());

    // Dừng animation tìm xe
    this.stopAmimation();

    // Enable button gặp xe khi người dùng nhận được thông tin lái xe
    // console.log("showCarInfo =================",  this.rModel.driverInfo);
    this.showLayout(ViewCarPage.VIEW_CAR);
  }

  /* Vẽ marker điểm đón xe và điểm trả khách nếu có */
  public drawMarkerBooking(mapManager: MapManager) {
    if (mapManager == null) return;

    //xóa bản đồ
    mapManager.clear();

    //vẽ điểm bắt đầu
    mapManager.drawStartMarker(this.rModel.srcAddress.location);

    // Địa chỉ đến (có thể có hoặc không)
    if (this.rModel.isValidDstAddress()) {
      mapManager.drawEndMarker(this.rModel.dstAddress.location);
    }
  }

  public getMapManager(): MapManager {
    return this.bookingViewModel.getMapManager();
  }

  /* Xử lý bản tin message TCPViewCar */
  public doServerViewCarfoMessage(baMessage: BAMessage) {
    let message = <ServerViewCarMessage>baMessage.getWrapperData();
    // Trả về nếu danh sách xe local null
    if (
      this.rModel.vehicleInfo == null ||
      message == null ||
      Utils.isOriginLocation(message.latLng.value)
    ) {
      return;
    }
    // Cập nhật thông tin xe
    this.rModel.vehicleInfo.preLocation = this.rModel.vehicleInfo.currentLocation;
    this.rModel.vehicleInfo.currentLocation = message.latLng.value;
    this.rModel.vehicleInfo.status = message.status.value;

    this.drawVehicles();
  }

  /* Hiển thị xe nhận đón và thông tin ước lượng */
  protected drawVehicles() {
    // Trạng thái gặp khách lái xe gửi xuống
    let isCatcherUser = this.isMessage(MessageType.CATCHER_USER);
    // Trạng thái người dùng đã click gặp xe
    let isCatchedCar = this.isMessage(MessageType.CATCHED_CAR);

    // Chỉ dùng cho view car theo vị trí KH ngồi trên xe
    if (ConfigParam.MODULE_VIEWCAR_BY_LOCATION_USER) {
      this.isViewCustomer = isCatchedCar && isCatcherUser;
    }

    // Vẽ đối tượng xe chuyển động
    this.moveCar(this.isViewCustomer);

    if (this.vehicleMarker == null) return;
    // Người dùng đã click gặp xe
    if (isCatchedCar) {
      //nếu đã gặp khách rồi thì ẩn thông báo trên xe
      this.vehicleMarker.hideInfoWindow(this.getVehicleMarker());
    } else if (this.isMessage(MessageType.INVITE)) {
      //nếu đã mời khách thì thông báo xe đến điểm
      this.vehicleMarker.showInfoWindow(
        this.getVehicleMarker(),
        strings.marker_title_catcher_user
      );
    } else {
      // Thông tin ước lượng từ xe đến khách
      let minDistance =
        MapUtils.calculationByDistance(
          this.rModel.srcAddress.location,
          this.rModel.vehicleInfo.currentLocation
        ) * Constants.RATIO_DISTANCE;

      // minDistance = 500;
      //nếu khoảng cách quá ngắn thì mời khách luôn
      LogFile.e(
        "Khoảng cách để thực hiện mời khách hay không: minDistance = ",
        minDistance
      );

      // Nếu lái xe chưa mời và khoảng cách gần hơn 150m thì mời khách ra
      // xe, ngược lại hiển thị ước lượng thời gian khoảng cách
      if (minDistance <= Constants.MAX_DISTANCE_FOR_USER) {
        //nếu giá trị nhỏ hơn giá trị mặc định thì gán bằng => view mặc định
        minDistance = Constants.MAX_DISTANCE_FOR_USER;

        // Nếu đã mời khách rồi thì thôi
        if (this.rModel.state == BookedStep.INVITE) {
          return;
        }

        // Hiển thị thông tin title marker
        this.vehicleMarker.showInfoWindow(
          this.getVehicleMarker(),
          strings.marker_title_catcher_user
        );

        this.doInviteMessage(null);
      } else {
        let snipet =
          Utils.formatDistance(minDistance) +
          " " +
          Constants.KM_UNIT_WIDTH +
          " - " +
          this.formatTimeForTitleMarker(
            this.timeEstimatesNearCar(minDistance, this.rModel.landmark)
          );
        this.vehicleMarker.showInfoWindow(this.getVehicleMarker(), snipet);
      }
    }
  }

  /* Định dạng thời gian theo dạng 0 \nphút đơn vị giây*/
  public formatTimeForTitleMarker(totalSecond: number): string {
    if (totalSecond == 0) {
      return "";
    }
    var estMinute = totalSecond / 60;
    if (estMinute <= 1) {
      estMinute = 1;
    } else if (estMinute > 60) {
      return (estMinute / 60).toFixed(1) + " " + strings.book_schedule_hour;
    }
    return Math.floor(estMinute) + " " + strings.book_comfirm_minute_lable;
  }

  /* Thời gian ước lượng từ xe đến vị trí người dùng */
  public timeEstimatesNearCar(minDistance, landmark: Landmark): number {
    // Gán mặc định nếu không tìm được vùng
    if (landmark == null) {
      landmark = new Landmark();
      landmark.averageSpeed = Constants.VEHICLE_AVERAGE_SPEED;
      landmark.distanceMultiplier = Constants.RATIO_DISTANCE;
      landmark.additionTime = Constants.ADDITION_TIME_DEFAULT;
    }

    // Tính khoảng cách
    var distance = minDistance * landmark.distanceMultiplier;
    // Tính thời gian
    var time: number =
      (distance * 60 * 60) / (landmark.averageSpeed * 1000) +
      landmark.additionTime;
    if (time <= 60) {
      time = 60;
    }
    // console.log("timeEstimatesNearCar time", Math.floor(time));
    return Math.floor(time);
  }

  public async doInviteMessage(baMessage: BAMessage) {
    LogFile.e("doInviteMessage >>>>>>>>>>>>>>>>>>>>>>>");

    // Nếu người dùng đã gặp xe thì bỏ qua
    if (this.isViewCustomer || this.isMessage(MessageType.INVITE)) {
      return;
    }

    // Update trạng thái cuốc
    this.rModel.state = BookedStep.INVITE;
    // Thông báo cho xe HĐ
    let s = "";
    if (
      this.rModel.getVehicleType().type == CarType.CAR_CONTRACT ||
      this.rModel.getVehicleType().type == CarType.BIKE
    ) {
      s = strings.book_catcher_user_description_contract;
    } else {
      s = strings.book_catcher_user_description;
    }
    //TODO: sẽ xử lý replaceFirst  thay replace
    s = s.replace(Constants.STRING_ARGS, this.rModel.vehicleInfo.carNo);
    // Nếu app đang sleep thì thông báo notification
    if (this.isStopped()) {
      await MediaManager.addNotification(strings.book_invite_subtitle, s);
    } else {
      this.showToast(s);
    }
    // Playsoud
    await MediaManager.playRingtone(Constants.TIME_RING_TONE_LONG);
    // Cập nhật lại trạng thái
    this.mMessageStatus.set(MessageType.INVITE.getId(), true);
  }

  /* Xử lý khi lái xe thông báo gặp khách message CatcherUser */
  public async doCatcherUserMessage(baMessage: BAMessage) {
    LogFile.e("doCatcherUserMessage>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    //lưu trạng thái gặp khách
    this.mMessageStatus.set(MessageType.CATCHER_USER.getId(), true);

    // Nếu người dùng đã chọn gặp xe thì bỏ qua
    if (this.isMessage(MessageType.CATCHED_CAR)) {
      this.isViewCustomer = true;
      return;
    }

    //nếu chưa mời khách thì thêm thông báo mời khách
    if (!this.isMessage(MessageType.INVITE)) {
      let s;
      if (
        this.rModel.getVehicleType().type == CarType.CAR_CONTRACT ||
        this.rModel.getVehicleType().type == CarType.BIKE
      ) {
        s = strings.book_catcher_user_description_contract;
      } else {
        s = strings.book_catcher_user_description;
      }
      // Replace '#' -> số hiệu xe
      s = s.replace(Constants.STRING_ARGS, this.rModel.vehicleInfo.carNo);
      // Nếu app đang ở trạng thái sleep thì thông báo notification
      if (this.isStopped()) {
        await MediaManager.addNotification(strings.book_invite_subtitle, s);
      }
      await MediaManager.playRingtone(Constants.TIME_RING_TONE_SHORT);
    }

    // Hiển thị thông báo
    if (ConfigParam.MODULE_BOOKING_CAR && this.rModel.isCatcherCar) {
      this.processCatchedCarMessage();
    } else {
      // Xử lý ở các app con
      this.showAlert(
        PairAlert.get()
          .setMessage(strings.book_invite_description)
          .setNegativeText(strings.book_button_new)
          .setNegativePress(() => this.sentRetryBooking())
          .setPositiveText(strings.book_button_meetcar)
          .setPositivePress(() => this.hasMeetCar())
      );
    }

    // Cập nhật lại trạng thái
    this.mMessageStatus.set(MessageType.INVITE.getId(), true);
  }

  /* Xử lý khi nhận message ACK ClientCancel */
  public async doClientCancelMessage() {
    LogFile.e("doClientCancelMessage >>>>>>>>>>>>>>>>>>>>>>>");

    this.dismissWaittingDialog();

    // Hủy các tiến trình cũ
    if (this.processClientCancel) {
      this.processClientCancel.cancel();
      this.processClientCancel = null;
    }

    // Cập nhật trạng thái hủy
    this.rModel.state = BookedStep.START;

    //thông báo hủy cuốc thành công
    this.showToast(strings.booked_taxi_cancel_success);

    // Hiện thị màn hình home
    this.showBookTaxiFragment();
  }

  /* Xử lý khi nhận message ACK DriverMissed */
  public doDriverMissedMessage(baMessage: BAMessage) {
    LogFile.e("doDriverMissedMessage >>>>>>>>>>>>>>>>>>>>>>>");

    if (this.processDriverMissed) {
      this.processDriverMissed.cancel();
    }

    //đặt lại cuốc tự động
    this.retryBooking(true);
  }

  /**
   * xử lý khi khách hàng bấm gặp xe
   */
  public async confirmMeetCar() {
    // THông báo nếu ko có kết nối mạng
    let ret = await this.isEnableNetwork();
    if (!ret) {
      this.showToast(strings.no_network);
      return;
    }

    // Thông tin ước lượng từ xe đến khách
    let minDistance =
      MapUtils.calculationByDistance(
        this.rModel.srcAddress.location,
        this.rModel.vehicleInfo.currentLocation
      ) * Constants.RATIO_DISTANCE;

    LogFile.e("confirmMeetCar minDistance = ", minDistance);

    if (minDistance >= Constants.MAX_DISTANCE_FOR_USER) {
      let str = strings.book_meet_car_confirm.replace(
        Constants.STRING_ARGS,
        this.rModel.vehicleInfo.carNo
      );

      //hiện thông báo
      this.showAlert(
        PairAlert.get()
          .setMessage(str)
          .setNegativeText(strings.btn_cancel)
          .setPositiveText(strings.dialog_confirm_meetcar_yes)
          .setPositivePress(() => this.hasMeetCar())
      );
    } else {
      this.hasMeetCar();
    }
  }

  /* Xử lý khi người dùng chọn đã gặp xe */
  private async hasMeetCar() {
    LogFile.e("hasMeetCar: >>>>>>>>>>>>>>>>>>>>>>");
    // Gửi message gặp xe lên server
    try {
      let carMessage = new CatchedCarMessage(CatchedCarMessage.CATCHED_CAR);
      await this.sendBAMessage(carMessage);
    } catch (e) {
      LogFile.e("hasMeetCar exeption", e && e.message);
    }
    // Hiển thị giao diện gặp khách
    this.processCatchedCarMessage();
  }

  /* Xử lý khi lái xe mời khách nhưng người dùng chọn "Đặt lại xe" */
  public async sentRetryBooking() {
    // Nếu cuốc đã kết thúc thì đặt lại xe ngay
    LogFile.log(
      "sentRetryBooking DONE_INFO = ",
      this.isMessage(MessageType.DONE_INFO)
    );

    if (this.isMessage(MessageType.DONE_INFO)) {
      await this.retryBooking();
    } else {
      this.showWaittingDialog();
      this.sentDriverMissedMessage();
    }
  }

  /* Đặt lại xe với 1 cuốc mới */
  public async retryBooking(isACKDriverMissed?: boolean) {
    LogFile.e("retryBooking >>>>>>>>>>>>>>>", isACKDriverMissed);
    // Ẩn các dialog khi xử lý relogin
    this.dismissWaittingDialog();

    // Hủy các tiến trình, kết thúc cuốc đặt xe cũ
    this.cancelProcess();

    //xử lý hủy cuốc và xóa thông báo notification nếu có
    await this.finishBookingTaxiWhenCancel();

    // Cập nhật trạng thái cuốc cũ vào lịch sử
    if (isACKDriverMissed) {
      this.rModel.state = BookedStep.DRIVER_MISSED;
    } else {
      this.rModel.state = BookedStep.OPERATOR_CANCEL;
    }

    await BookedHistoryDAO.updateState(this.rModel);

    //xóa marker xe
    this.removeVehicleMarker();

    //di chuyển bản đồ về vị trí đặt
    if (this.getMapManager() != null) {
      this.getMapManager().moveCenterCamera(this.rModel.srcAddress.location, 0);
    }

    // Gán lại trạng thái đặt xe mới
    this.rModel.state = BookedStep.START;

    //làm mới giao diện
    this.mViewCarPresenter.retryBooking();
  }

  /* Bản tin đếm ngược đợi điều hành xác nhận khi không có lái xe nhận cuốc */
  private doOperatorDispatchingMessage(baMessage: BAMessage) {
    this.cancelProcess();
    let dispatchingMessage = <OperatorDispatchingMessage>(
      baMessage.getWrapperData()
    );
    this.doOperatorDispatching(dispatchingMessage);
  }

  /* Xử lý khi nhận bản tin Operator Dispatching */
  protected doOperatorDispatching(odMessage: OperatorDispatchingMessage) {
    // Xử lý ở app kế thừa => hiện tại chỉ xử lý cho thành công
  }

  /* Bản tin ACK CommandInfo */
  public async doCommandInfoMessage(baMessage: BAMessage) {
    LogFile.log("doCommandInfoMessage >>>>>>>>>>>>>>>>>>>>>>>>retryable = ");
    // Hủy timer commandinfo nếu có
    if (this.processCommandInfo) {
      this.processCommandInfo.cancel();
      this.processCommandInfo = null;
    }

    this.stopAmimation();

    this.rModel.state = BookedStep.START;
    // Kiểm tra code
    let infoMessage = <AckCommandInfoMessage>baMessage.getWrapperData();
    let code = infoMessage.code.value;
    if (code === 0) {
      this.showToast(strings.booked_taxi_cancel_success);
    } else if (code == 1 || code == 2) {
      this.showToast(strings.booked_taxi_cancel_error);
    }
    // Trở về home
    this.showBookTaxiFragment();
  }

  /* Bản tin Reset Source */
  public doChangeDriverMessage() {
    this.mMessageStatus.set(MessageType.CARS_INFO.getId(), false);
    this.mMessageStatus.set(MessageType.CHANGE_DRIVER.getId(), true);
    this.dismissWaittingDialog();
  }

  /* Xử lý khi nhận được message OPERATOR_CANCEL */
  public async doOperatorCancelMessage(cancelMessage: OperatorCancelMessage) {
    LogFile.e(
      `doOperatorCancelMessage >>>>>>>>>>>>>>>: CATCHED_CAR = ${this.isMessage(
        MessageType.CATCHED_CAR
      )} 
      , CLIENT_CANCEL = ${this.isMessage(MessageType.CLIENT_CANCEL)}`
    );

    // Nếu khách hàng đã lên xe hoặc đã cancel cuốc thì bỏ qua
    if (
      this.isMessage(MessageType.CATCHED_CAR) ||
      this.isMessage(MessageType.CLIENT_CANCEL)
    ) {
      return;
    }

    //hủy cuốc
    await this.driverCancel();

    //xử lý dữ liệu nhận về
    let msg = cancelMessage.message.value;
    let cancelType = cancelMessage.cancelType.value;

    LogFile.log(
      "doOperatorCancelMessage CARS_INFO",
      this.isMessage(MessageType.CARS_INFO) +
        "; this.isRestartAppRelogin = " +
        this.isRestartAppRelogin +
        "; cancelType = " +
        cancelType
    );

    // Nếu có thông tin lái xe
    if (this.isMessage(MessageType.CARS_INFO)) {
      let str;
      // Người dùng restart lại app
      if (this.isRestartAppRelogin) {
        str = msg || strings.book_operator_relogin_fail;
      } else {
        // Xử lý ở app con
        if (
          cancelType == OperatorCancelMessage.DRIVER_CANCEL ||
          cancelType == OperatorCancelMessage.DRIVER_MISSTRIP
        ) {
          await this.isProccesDriverCancelInSubApp(cancelMessage);
        } else {
          // Thông báo khi có thông tin xe hủy cuốc
          if (
            this.rModel.vehicleInfo &&
            !Utils.isEmpty(this.rModel.vehicleInfo.carNo)
          ) {
            str = msg || strings.book_driver_cancel;
            str = str.replace(
              Constants.STRING_ARGS,
              this.rModel.vehicleInfo.carNo
            );
          } else {
            str = msg || strings.book_driver_relogin_fail;
          }
          // Nhận thông báo hủy OperaCancel
          if (cancelType == OperatorCancelMessage.OPERATOR_CANCEL) {
            str = msg || strings.book_operator_cancel_wrong;
            str = str.replace(
              Constants.STRING_ARGS,
              this.rModel.company.reputation
            );
          }

          // Show diglog
          this.showDriverCancelDialog(str, cancelMessage.retryable.value);
        }

        // Hiển thị thông báo
        if (this.isStopped()) {
          this.removeNotification();
          MediaManager.addNotification(strings.book_carinfo_subtitle, str);
        }
      }
      // Play sound
      MediaManager.playRingtone(Constants.TIME_RING_TONE_SHORT);
    } else {
      LogFile.log("doOperatorCancelMessage: chưa nhận được carinfo: ");
      let str;
      // Nếu là điều hành hủy/ko xe nhận
      if (cancelType == OperatorCancelMessage.OPERATOR_CANCEL) {
        str = msg || strings.book_driver_relogin_fail;
        str = str.replace(
          Constants.STRING_ARGS,
          this.rModel.company.reputation
        );
        LogFile.log("doOperatorCancelMessage: str =" + str);
        // Hiển thị dialog thông báo và trở về home
        this.showAlert(UnitAlert.get().setMessage(str));
        this.showBookTaxiFragment();
      } else if (
        cancelType == OperatorCancelMessage.DRIVER_CANCEL ||
        cancelType == OperatorCancelMessage.DRIVER_MISSTRIP
      ) {
        await this.isProccesDriverCancelInSubApp(cancelMessage);

        // let ret = await this.isProccesDriverCancelInSubApp(cancelMessage);
        // if (!ret) {
        //   // Thông báo lái xe hủy cuốc
        //   if (!this.isRestartAppRelogin) {
        //     str = msg || strings.book_driver_relogin_fail;
        //   } else {
        //     str = msg || strings.book_operator_relogin_fail;
        //   }
        //   str = str.replace(
        //     Constants.STRING_ARGS,
        //     this.rModel.company.reputation
        //   );
        //   this.showDriverCancelDialog(str, cancelMessage.retryable.value);
        // }
      } else if (cancelType == OperatorCancelMessage.OPERATOR_DISPATCHING) {
        // Thiết lập thời gian block đặt lại
        // Configuration.setBookingTimeBlock(System.currentTimeMillis());
        this.operatorDispatchingWaiting();
      }
    }
  }

  /**
   * hiện thị dialog khi hủy cuốc từ điều hành
   * @param str
   * @param retryable
   */
  private async showDriverCancelDialog(str: string, retryable: boolean) {
    // Xử lý ở các app con
    if (retryable) {
      this.showDriverCancelDialogHasRetry(str);
    } else {
      this.showDriverCancelDialogNotRetry(str);
    }
  }

  /**
   * hiện thị thông báo lái xe hủy => có thể đặt lại
   * @param str
   */
  private async showDriverCancelDialogHasRetry(str: string) {
    LogFile.log("showDriverCancelDialogHasRetry >>>>>>>>>>>>>>>>>>>>>>>>");
    this.showAlert(
      PairAlert.get()
        .setMessage(str)
        .setNegativeText(strings.btn_dismiss)
        .setNegativePress(() => this.showBookTaxiFragment())
        .setPositiveText(strings.book_button_new)
        .setPositivePress(() => {
          this.retryBooking();
        })
    );
  }

  /**
   * hiện thị thông báo không đặt lại
   * @param str
   */
  private async showDriverCancelDialogNotRetry(str: string) {
    LogFile.log("showDriverCancelDialogNotRetry >>>>>>>>>>>>>>>>>>>>>>>>");
    this.showAlert(
      UnitAlert.get()
        .setMessage(str)
        .setPositiveText(strings.btn_ok)
    );
  }

  /* Xử lý drivercancel ở app rẽ nhánh */
  protected async isProccesDriverCancelInSubApp(
    cancelMessage: OperatorCancelMessage
  ) {
    LogFile.log(
      "isProccesDriverCancelInSubApp >>>>>>>>>>>>>>>>>>>>>>>>retryable = ",
      cancelMessage.retryable.value +
        "; this.isRestartAppRelogin = " +
        this.isRestartAppRelogin
    );

    let retryable = cancelMessage.retryable.value;
    if (retryable && !this.isRestartAppRelogin) {
      //yêu cầu đặt lại thì hiện thị thông báo
      await this.retryBooking();
      return true;
    }

    // Hiển thị thông báo
    let message = "";
    if (
      cancelMessage.message != null &&
      !Utils.isEmpty(cancelMessage.message.value)
    ) {
      message = cancelMessage.message.value;
    } else {
      // Nếu tắt app bật lại thì thông báo hỏi người dùng
      if (!this.isRestartAppRelogin) {
        message = strings.book_driver_cancel;
      } else {
        message = strings.book_driver_relogin_fail;
      }
    }

    //nếu có yêu cầu đặt lại thì hiện thị thông báo đặt lại
    if (retryable) {
      this.showDriverCancelDialogHasRetry(message);
    } else {
      //nếu server yêu cầu retry nhưng là cuốc relogin khi bật lại app thì thông báo và về màn hình home
      //hiện thị thông báo
      this.showDriverCancelDialogNotRetry(message);

      //về màn hình home
      await this.showBookTaxiFragment();
    }

    return true;
  }

  /* Chuyển sang màn hình đợi điều hành gán xe */
  public operatorDispatchingWaiting() {
    LogFile.e("operatorDispatchingWaiting >>>>>>>>>>>");
    // Xử lý ở app kế thừa
  }

  /* Xử lý khi nhận message Relogin */
  public async doAckReloginMessage(baMessage: BAMessage) {
    this.isReloginSuccess = true;

    // Hủy tiến trình login và relogin lần đầu
    if (this.processLogin) {
      this.processLogin.cancel();
    }

    //hủy tiến trình relogin
    if (this.processRelogin) this.processRelogin.killRelogin();

    // Gửi lại
    if (this.processDriverMissed) {
      this.processDriverMissed.cancel();
      this.sentDriverMissedMessage();
      return;
    }

    let reloginMessage = <AckReloginMessage>baMessage.getWrapperData();
    if (!reloginMessage.success.value) {
      await this.reloginFail();
      return;
    }
    // Cập nhật sessionkey
    if (
      reloginMessage.sessionKey != null &&
      reloginMessage.sessionKey.value != null
    ) {
      ConnectionManager.setSessionKey(reloginMessage.sessionKey.value);
    }

    // Phân tích chuỗi info
    let ack: AckReloginSubMessage = AckReloginSubMessage.parse(reloginMessage);

    LogFile.e(ack);

    // Xử lý khi không có trip
    if (!ack.tripID || !ack.tripID.value) {
      await this.reloginFail();
      return;
    }

    SessionStore.setStartBooking();

    // Lấy các step
    switch (ack.tripStep.value) {
      case TripStep.INITING:
        break;
      case TripStep.WAIT_CAR:
        // Cập nhật lại giao diện đợi hãng gán xe
        this.startAmimation();

        //hiện thị giao diện waitcar với thông báo thông tin hãng
        this.mViewCarPresenter.showWaitCarLayout();

        // Xử lý khi relogin có operator dispatching
        if (ack.odList != null && ack.odList.isAvailable()) {
          let odMessage = ack.odList.get(0);
          // Xử lý đợi xác nhận từ điều hành
          this.doOperatorDispatching(odMessage);
        }
        break;
      case TripStep.VIEW_CAR:
        // Nếu khách đã gặp xe thì hiển thị giao diện hoàn thành
        if (this.isMessage(MessageType.CATCHED_CAR)) {
          this.mViewCarPresenter.showLayout(ViewCarPage.FINISH);
          return;
        }

        // Cập nhật lại giao diện viewcar
        this.mViewCarPresenter.showWaitCarLayout();

        // Nếu có thông tin xe thì cập nhật lại
        if (
          ack.carInfo != null &&
          ack.carInfo.hasCar != null &&
          ack.carInfo.hasCar.value
        ) {
          this.isRestartAppRelogin = false;
          await this.doCarsInfoMessage(ack.carInfo);
        }

        // Thông báo mời khách
        if (ack.subStep.value == SubStep.HAVE_INVITE) {
          await this.doInviteMessage(null);
        } else if (ack.subStep.value == SubStep.CATCHED_USER) {
          await this.doCatcherUserMessage(null);
        }
        break;
      case TripStep.CHANGE_DRIVER:
        this.doChangeDriverMessage();
        // Xử lý khi relogin có operator dispatching
        if (ack.odList != null && ack.odList.isAvailable()) {
          let odMessage = ack.odList.get(0);
          // Xử lý đợi xác nhận từ điều hành
          this.doOperatorDispatching(odMessage);
        }
        break;
      case TripStep.DONE:
        await this.reloginDone(ack);
        break;
      case TripStep.FAIL:
        // Relogin sau 15' trở về màn hình đặt xe
        let currentTime = new Date().getTime();
        if (
          currentTime - this.rModel.updateDate >
          ViewCarViewModel.TIME_OUT_RELOGIN
        ) {
          await this.cancelReloginTimeOut();
        } else {
          //gán lại trạng thái nhận carinof
          if (
            this.rModel.driverInfo != null &&
            this.rModel.driverInfo.driverCode &&
            !this.isRestartAppRelogin
          ) {
            this.mMessageStatus.set(MessageType.CARS_INFO.getId(), true);
          }

          //xử lý relogin fail
          await this.reloginFailTripStep(ack.subStep.value, ack.cancelInfo);
        }
        break;
      default:
        break;
    }
  }

  /* Xử lý khi admin hủy cuốc trong trong trường hợp relogin */
  public async reloginFailTripStep(subStep: number, cancelInfo: CancelInfo) {
    let sub;
    if (
      subStep == SubStep.OPERATOR_CANCEL ||
      subStep == SubStep.DRIVER_MISS ||
      subStep == SubStep.DRIVER_CANCEL ||
      subStep == SubStep.OPERATOR_DISPATCHING
    ) {
      sub = subStep;
    }

    //thực hiện xử lý như nhận message từ server hủy
    if (sub != undefined) {
      await this.doOperatorCancelMessage(
        new OperatorCancelMessage(
          sub,
          cancelInfo.retryable.value,
          cancelInfo.message.value
        )
      );
    } else {
      LogFile.e("reloginFailTripStep subStep = ", subStep);
    }
  }

  /* Xử lý khi nhận bản tin Done info */
  public async doDoneInfoMessage(baMessage: BAMessage) {
    this.mMessageStatus.set(MessageType.DONE_INFO.getId(), true);
    // Thông tin carinfo nhận đón
    if (
      this.isMessage(MessageType.CATCHER_USER) ||
      this.isMessage(MessageType.CATCHED_CAR)
    ) {
      // Ẩn các dialog waiting
      this.dismissWaittingDialog();

      this.getBookingViewModel().closeDialog();

      // Lưu thông tin kết thúc
      let message = <DoneInfoMessage>baMessage.getWrapperData();
      if (message.doneInfo != null) {
        this.rModel.doneInfo = message.doneInfo;
      }
      // Gửi đánh giá cho lái xe
      await this.driverFeedBack();
    } else {
      await this.showDialogFisnishTrip();
    }
  }

  /* Hiện thị giao diện đánh giá */
  public async driverFeedBack() {
    //ngắt tất cả các kết nối
    await this.disconnectAll();

    // Xử lý cuốc thành công
    this.rModel.state = BookedStep.DONE;
    this.rModel.tripStep = TripStep.DONE;
    await BookedHistoryDAO.updateState(this.rModel);

    //chuyển sang màn hình feedback
    this.bookingViewModel.showFragment(FragmentMap.RATING);
  }

  /* Hiển thị thông báo cuốc hoàn thành khi ko có CarInfo */
  private async showDialogFisnishTrip() {
    //kết thúc trở về màn hình chính
    await this.finishSuccessBookingToHome();

    // Nếu người dùng tắt app thì bỏ qua
    if (!this.isRestartAppRelogin) {
      this.showAlert(
        UnitAlert.get().setMessage(
          strings.book_alert_catched_user_not_driver_infor
        )
      );
    }
  }

  /* Hủy cuốc khi relogin time out quá 15' */
  private async cancelReloginTimeOut() {
    LogFile.log("cancelReloginTimeOut >>>>>>>>>>>>>>>>>>>>>>>>");
    // Cập nhật trạng thái hủy
    await this.updateCancelBook();

    // Hiện thị màn hình home
    await this.showBookTaxiFragment();
  }

  /* Hủy các tiến trình và trở về màn hình home */
  public async showBookTaxiFragment() {
    // RealTimeThread.get(main).destroy();
    this.stopAmimation();

    //hủy các tiến trình khác
    this.cancelProcess();

    //ngắt hết kết nối nếu có
    await this.disconnectAll();

    await this.bookingViewModel.showBookTaxiFragment(true);
  }

  /* Xử lý khi nhận được message DoneInfo relogin */
  public async reloginDone(ack: AckReloginSubMessage) {
    LogFile.log(
      "reloginDone >>>>>>>>>>>>>>>>>>>>>>>>>",
      this.isRestartAppRelogin
    );

    this.mMessageStatus.set(MessageType.DONE_INFO.getId(), true);

    //ẩn dialog
    this.dismissWaittingDialog();

    this.getBookingViewModel().closeDialog();

    // Ẩn các dialog khi xử lý relogin
    this.stopAmimation();

    //nếu app bật lại sau khi chưa kết thúc cuốc
    if (this.isRestartAppRelogin) {
      //kết thúc trở về màn hình chính
      await this.finishSuccessBookingToHome();
      return;
    }

    //gán thông tin trả về khi done
    if (ack.doneInfo != null) {
      this.rModel.doneInfo = ack.doneInfo;
    }

    //nếu có thông tin xe thì gán lại
    if (ack.isHasCarInfo()) {
      let carInfoModel = ack.carInfo.infoMessages.get(0);

      //cập nhật thông tin xe
      this.updateVehicleInfo(carInfoModel);

      //cập nhật thông tin lái xe
      this.updateDriverInfo(carInfoModel);
    }

    // Nếu có thông tin xe thì cập nhật lại
    if (this.rModel.vehicleInfo != null) {
      // Gửi đánh giá từ người dùng
      await this.driverFeedBack();
    } else {
      //hiện thị thông báo thành công
      this.showAlert(
        UnitAlert.get().setMessage(
          strings.book_alert_catched_user_not_driver_infor
        )
      );

      await this.finishSuccessBookingToHome();
    }
  }

  /* Hủy các tiến trình cũ nếu có */
  public cancelProcess() {

    if (this.processConnect != null) {
      this.processConnect.cancel();
      this.processConnect = null;
    }

    if (this.processLogin != null) {
      this.processLogin.cancel();
      this.processLogin = null;
    }
    //hủy timer
    if (this.processInitBook) {
      this.processInitBook.cancel();
      this.processInitBook = null;
    }
    if (this.processWaitCarInfo) {
      this.processWaitCarInfo.cancel();
      this.processWaitCarInfo = null;
    }
    if (this.processClientCancel) {
      this.processClientCancel.cancel();
      this.processClientCancel = null;
    }
    if (this.processDriverMissed) {
      this.processDriverMissed.cancel();
      this.processDriverMissed = null;
    }
    if (this.processCommandInfo) {
      this.processCommandInfo.cancel();
      this.processCommandInfo = null;
    }
  }

  /**
   * ngắt kết nối
   */
  public async disconnectAll() {
    LogFile.e("ViewCarViewModel disconnectAll >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    //gán trạng thái bỏ nhận
    this.bookid = ViewCarViewModel.NO_CONNECTION;

    //bỏ lắng nghe sự kiện
    this.removeEmitterSubscription();

    //ngắt tcp
    await NativeTcpModule.disconnect();

    //kill tiến trình relogin nếu đang tồn tại
    if (this.processRelogin) {
      this.processRelogin.killRelogin();
      this.processRelogin = null;
    }

    //hủy tiến trình hủy cuốc nếu có
    if (this.processClientCancel) {
      this.processClientCancel.cancel();
      this.processClientCancel = null;
    }

    //hủy tiến trình nhỡ cuốc nếu có
    if (this.processDriverMissed) {
      this.processDriverMissed.cancel();
      this.processDriverMissed = null;
    }
  }

  /* Xử lý khi lái xe hủy cuốc */
  public async driverCancel() {
    LogFile.e("ViewCarViewModel driverCancel >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // Cập nhật trạng thái hủy từ điều hành
    this.rModel.state = BookedStep.OPERATOR_CANCEL;
    this.rModel.tripStep = TripStep.FAIL;
    await BookedHistoryDAO.updateState(this.rModel);

    // Xóa danh sách xe cũ
    this.rModel.companies = null;
    this.rModel.state = BookedStep.START;

    // Kết thúc đặt xe
    await this.finishBookingTaxiWhenCancel();
  }

  /* Kết thúc quốc khách và trở lại confirm */
  public async finishBookingTaxiWhenCancel() {
    // Hủy thread nhận dữ liệu
    await this.disconnectAll();

    //reset thông tin lái xe
    if (this.rModel.driverInfo) {
      this.rModel.driverInfo = null;
    }

    // Thiết lập lại trạng thái kết thúc quốc
    SessionStore.setFinishBooking();

    this.rModel.bookCode = "";

    this.rModel.isCatcherCar = false;

    // Xóa notification
    this.removeNotification();
  }

  /* Xóa notification và dừng âm thanh, rung */
  public removeNotification() {
    MediaManager.removeNotification();
    MediaManager.stopSound();
  }

  /* Gửi bản tin Driver Missed */
  public sentDriverMissedMessage() {
    LogFile.e(
      "ViewCarViewModel sentDriverMissedMessage >>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );

    this.processDriverMissed = new ProcessWaitDriverMissed(this);
    this.processDriverMissed.start();
  }

  /* Xử lý khi relogin fail */
  private async reloginFail() {
    LogFile.log("reloginFail >>>>>>>>>>>>>>>>>>>>>>>>");

    // Hủy cuốc
    await this.driverCancel();

    // Hiện thị thông báo
    this.showAlert(
      UnitAlert.get().setMessage(strings.booked_taxi_relogin_fail)
    );

    await this.showBookTaxiFragment();
  }

  /* Hiển thị thông báo khi initbook thành công 
      hiện tại không cần cập nhật lại giao diện khi init book thành công
  */
  public showInitbookAlert(companyReputation: string) {
    // let message = strings.book_receive_taxi_note_2;
    // message = message.replace(Constants.STRING_ARGS, companyReputation);
  }

  /* Xử lý khi người dùng chọn đã gặp xe */
  protected async processCatchedCarMessage() {
    // Lưu trạng thái đã gặp xe
    this.mMessageStatus.set(MessageType.CATCHED_CAR.getId(), true);

    // Cập nhật trạng thái mời khách
    if (ConfigParam.MODULE_BOOKING_CAR) {
      this.rModel.state = BookedStep.CATCHED_CAR;
      this.rModel.tripStep = TripStep.VIEW_CAR;
      this.rModel.isCatcherCar = true;
    } else {
      this.rModel.state = BookedStep.DONE;
      this.rModel.tripStep = TripStep.DONE;
    }

    //Lưu lịch sử
    await BookedHistoryDAO.updateState(this.rModel);

    //Hiển thị giao diện hoàn thành đặt xe
    this.mViewCarPresenter.showLayout(ViewCarPage.FINISH);

    // Xóa oldBookID
    this.rModel.oldBookID = "";

    if (this.vehicleMarker != null) {
      this.vehicleMarker.hideInfoWindow(this.getVehicleMarker());
    }

    // Xử lý xóa/vẽ marker điểm đón ở các app kế thừa
    if (this.getMapManager() != null) {
      this.getMapManager().removeStartMarker();
      this.getMapManager().removeEndMarker();
    }
  }

  /* Kết thúc đặt xe
    hàm này được sửa dụng cho một số trường hợp sau
    1. Kết thúc đặt xe
    2. Lỗi không thể initbook
  */
  public async finishSuccessBookingToHome() {
    // Hủy timeout cho việc kết thúc quốc
    // if (timeoutSleepApp != null) {
    //     timeoutSleepApp.removeCallbacksAndMessages(null);
    // }

    LogFile.log("finishSuccessBookingToHome >>>>>>>>>>>>>>>>>>>>>>>>");

    // Xử lý cuốc thành công
    this.rModel.state = BookedStep.DONE;
    this.rModel.tripStep = TripStep.DONE;
    await BookedHistoryDAO.updateState(this.rModel);

    //xóa địa chỉ
    this.rModel.resetAddress();

    await this.showBookTaxiFragment();
  }

  /**
   * hỏi khác hàng để hủy cuốc
   */
  public async askUserForCancel() {
    // Thông báo khi không có kết nối mạng
    let ret = await this.isEnableNetwork();
    if (!ret) {
      this.showToast(strings.no_network);
      return;
    }

    //nếu đã mời khách rồi
    if (this.isMessage(MessageType.INVITE)) {
      this.showAlert(
        PairAlert.get()
          .setMessage(strings.book_invite_user_cancel)
          .setNegativeText(strings.btn_cancel)
          .setPositiveText(strings.btn_call_driver)
          .setPositivePress(async () => {
            //hủy cuốc
            await this.cancelBookTaxi();

            // Gọi điện thoại cho lái xe
            if (
              this.rModel.driverInfo != null &&
              !Utils.isEmpty(this.rModel.driverInfo.phone)
            ) {
              NativeLinkModule.openDialPhone(this.rModel.driverInfo.phone);
            }
          })
      );
    } else {
      this.showAlert(
        PairAlert.get()
          .setMessage(strings.book_cancel_des)
          .setNegativeText(strings.btn_dismiss)
          .setPositiveText(strings.btn_ok)
          .setPositivePress(() => this.cancelBookTaxi())
      );
    }
  }

  /* Gửi message hủy quốc khách */
  private async cancelBookTaxi() {
    // LogFile.e("cancelBookTaxi: hủy đặt xe >>>>>>>>>>>>>");


    //hủy tiến trình kết nối
    this.cancelProcessConnect();

    // Thông báo khi không có kết nối mạng
    let ret = await this.isEnableNetwork();
    if (!ret) {
      this.showToast(strings.booked_taxi_cancel_fail);
      return;
    }

    // Gửi bản tin clientcancel đến server
    this.showWaittingDialog();

    // Cập nhật trạng thái hủy cuốc
    if (this.isCancelBookOnDispatching) {
      this.rModel.state = BookedStep.DRIVER_MISSED;
    } else {
      this.rModel.state = BookedStep.CLIENT_CANCEL;
    }
    await BookedHistoryDAO.updateState(this.rModel);

    // LogFile.e("Chung 2", this);

    //gửi thông báo hủy cuốc lên server
    this.processClientCancel = new ProcessClientCancel(
      this,
      ClientCancelMessage.USER_CANCEL
    );
    this.processClientCancel.start();
  }

  public showLayout(page: ViewCarPage) {
    this.mViewCarPresenter.showLayout(page);
  }

  /**
   * gửi message lên server
   * @param baMessage
   */
  public async sendBAMessage(baMessage: BAMessage | ISentMessage) {
    if (baMessage instanceof BAMessage) {
      ConnectionManager.sendBAMessage(baMessage, this.bookid);
    } else {
      ConnectionManager.sendMessage(baMessage, this.bookid);
    }
  }

  /**
   * gửi bản tin kiểm tra điệu kiện mạng,
   * nếu ko có kết nối thì ko gửi bản tin đi
   * @param baMessage
   */
  public sendBAMessageOnNetwork(baMessage: BAMessage | ISentMessage) {
    this.isEnableNetwork().then(ret => {
      if (ret) this.sendBAMessage(baMessage);
      else LogFile.e("sendBAMessageOnNetwork: gửi khi mất kết nối");
    });
  }

  /**
   * kiểm tra mạng có enable không
   */
  public isEnableNetwork(): Promise<boolean> {
    return NativeAppModule.isEnableNetwork();
  }

  public startAmimation() {
    this.mViewCarPresenter.visibleAnimationWaitCar(true);
  }

  public stopAmimation() {
    this.mViewCarPresenter.visibleAnimationWaitCar(false);
  }

  zoomBoundCameraByLatLngs = latLngs => {
    this.getMapManager() &&
      this.getMapManager().newLatLngBounds(latLngs, {
        top: 100,
        right: 20,
        bottom: 200,
        left: 20
      });
  };

  /** khi ứng dụng bắt đầu hiện thị lên foreground */
  onHostResume() {
    // console.log("View Car onHostResume <<<<<<<<<<<<<<<<<<<<<<");
  }

  /** khi ứng dụng bắt đầu chạy xuống background */
  onHostPause() {
    // console.log("View Car onHostPause >>>>>>>>>>>>>>>>>>>>>>>>")
  }

  /** khi ứng dụng bắt đầu bị tắt */
  onHostDestroy() {}

  /**
   * xóa marker trả
   */
  public removeVehicleMarker() {
    if (this.vehicleMarker != null && this.getMapManager() != null) {
      this.getMapManager().removeMarker(this.vehicleMarker.getKey());
      this.vehicleMarker = null;
    }
  }

  /**
   * vẽ marker xe khi chưa có
   */
  public drawVehicleMarker() {
    //nếu chưa có thông tin xe hoặc vị trí (0,0)
    //nếu xe đã tạo thì bỏ qua
    if (
      this.getMapManager() == null ||
      this.rModel.vehicleInfo == null ||
      this.vehicleMarker != null ||
      this.rModel.vehicleInfo.isOriginLocation()
    )
      return;

    // Nếu chưa có marker thì khởi tạo
    let vehicle = this.rModel.vehicleInfo;

    // Set resource cho marker
    vehicle.markerResource = images.ic_car_traking_uri;
    if (vehicle.carType == CarType.CAR_CONTRACT) {
      vehicle.markerResource = images.ic_contract_car;
    } else if (vehicle.carType == CarType.BIKE) {
      vehicle.markerResource = images.ic_bike_near;
    }
    // Tính góc giữa vị trí xe và vị trí điểm đón
    let toRotation = MapUtils.bearingBetweenLocations(
      vehicle.currentLocation,
      this.rModel.srcAddress.location
    );

    // tạo marker
    let markerOptions = new MarkerOptions();
    markerOptions.icon(vehicle.markerResource);
    markerOptions.anchor(
      ViewCarViewModel.MAKER_TAXI_X_ANCHOR,
      ViewCarViewModel.MAKER_TAXI_X_ANCHOR
    );
    // Vị trí của điểm đánh dấu
    markerOptions.position(vehicle.currentLocation);
    // Góc quay ban đầu cho marker
    markerOptions.setRotation(toRotation);

    //tạo inforwindow
    markerOptions.viewsAsMarker = MarkerInfoWindow.create(
      "",
      ref => (markerOptions.markerInfoWindow = ref)
    );

    this.vehicleMarker = this.getMapManager().addMarker(markerOptions);
  }

  private showWaittingDialog() {
    LogFile.e("showWaittingDialog");
    // this.getDialog().showWaitingDialogNoTitle();
  }

  private dismissWaittingDialog() {
    LogFile.e("dismissWaittingDialog");
    // this.getDialog().dissmiss();
  }

  public getDialog(): Dialog {
    return this.getBookingViewModel().getDialog();
  }

  public moveCar(isViewCarWithGPS: boolean) {
    // Nếu chưa có marker thì khởi tạo
    if (this.vehicleMarker == null) {
      this.drawVehicleMarker();
      return;
    }

    let latLng = this.bookingViewModel.getCurrentLatLng();
    if (isViewCarWithGPS && !Utils.isOriginLocation(latLng)) {
      if (!MapUtils.isBetweenLatlng(this.vehicleMarker.getPosition(), latLng)) {
        //di chuyển marker
        this.vehicleMove(latLng);

        this.getMapManager().moveCenterCamera(latLng);
      }
    } else {
      //di chuyển marker
      this.vehicleMove(this.rModel.vehicleInfo.currentLocation);
    }
  }

  /**
   * di chuyển xe trên bản đồ
   * @param src
   */
  private vehicleMove(src) {
    let marker = this.getVehicleMarker();
    marker.rotateAndMove(src);
  }

  private getVehicleMarker() {
    if (this.vehicleMarker == null) return null;

    return this.getMapManager().getAnimatedMarkerRef(
      this.vehicleMarker.getKey()
    );
  }

  /* Kết thúc quốc khách reset toàn bộ thông tin cuốc cũ */
  public async finishBookingTaxi() {
    // Hủy thread nhận dữ liệu
    // await this.disconnectAll();
    LogFile.log("finishBookingTaxi >>>>>>>>>>>>>>>>>>>>>>>>");

    //về màn hình home
    await this.showBookTaxiFragment();
  }

  /** trả về trạng thái lưu trong map đã nhận bản tin hoặc xem như đã có bản tin này chưa */
  private isMessage(type: BAMessageType) {
    return this.mMessageStatus.get(type.getId());
  }

  public async showAlert(alert: IAlert) {
    //show dialog
    alert.showDialog(this.getDialog());

    // alert.show();
  }
}
