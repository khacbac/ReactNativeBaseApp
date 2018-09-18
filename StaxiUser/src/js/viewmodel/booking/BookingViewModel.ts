import { NativeEventSubscription } from "react-native";
import {
  AndroidSdk,
  Dialog,
  FusedLocation,
  FusedLocationModule,
  LatLng,
  LifecycleEventListener,
  LifeCycleModule,
  Location,
  NativeLinkModule,
  PairAlert,
  Utils,
  GpsStatus,
  AlertModel,
  ActivityResultModule,
  ToastModule,
  MediaManager,
  AlertLayout,
  NativeAppModule
} from "../../../module";
import LogFile from "../../../module/LogFile";
import NetworkManager from "../../../module/net/NetworkManager";
import OnNetworkListener from "../../../module/net/OnNetworkListener";
import images from "../../../res/images";
import strings from "../../../res/strings";
import ConfigParam from "../../constant/ConfigParam";
// import NativeAppModule from "../../../module/base/NativeAppModule";
import BookTaxiModel from "./BookTaxiModel";
import WaitGpsDialog from "../../../module/location/WaitGpsDialog";
import MapManager from "../../component/booking/MapManager";
import ScreenName from "../../ScreenName";
import BookedStep from "../../constant/BookedStep";
import { Region } from "react-native-maps";
import SessionStore from "../../Session";
import AddressHistoryDAO from "../../sql/dao/AddressHistoryDAO";

export default class BookingViewModel extends FusedLocation
  implements LifecycleEventListener, OnNetworkListener {
  private bookHomePresenter: BookHomePresenter;

  /* Thông tin đặt xe */
  protected rModel: BookTaxiModel;

  /** đối tượng nhận sự kiện kết nối mạng */
  public network: NetworkManager;

  /** đối tượng lắng nghe vòng đời của activity */
  public lifeCycleModule: LifeCycleModule;

  /** xử lý sự kiện back trên android*/
  private eventBack: NativeEventSubscription;

  /* Biến lưu trữ trạng thái activity đã stop hay chưa */
  private mStopped = false;

  /** xử lý sụ kiện nhận ví tri */
  private fusedLocationModule: FusedLocationModule;

  /** đối tượng để đẩy các tiến trình lắng nghe xuống */
  private listener;

  /** lưu trạng thái map đã load */
  private mapManager: MapManager;

  /** trạng thái callback*/
  private activityResultModule: ActivityResultModule;

  /** lấy lại vùng khi move bản đồ*/
  public moveRegion: any;

  constructor(bookHomePresenter: BookHomePresenter, mapManager?: MapManager) {
    super();
    this.bookHomePresenter = bookHomePresenter;
    this.mapManager = mapManager;

    //cập nhật lại dữ liệu nếu có book đang active
    this.rModel = new BookTaxiModel();

    if (SessionStore.activeBooked != null) {
      this.rModel.appendFromSuper(SessionStore.activeBooked);
      SessionStore.activeBooked = null;
    }
    // console.log("BookingViewModel this.bookTaxiModel.bookCode:", this.bookTaxiModel.bookCode);
  }

  public getBookTaxiModel(): BookTaxiModel {
    return this.rModel;
  }

  public setListener(listener) {
    this.listener = listener;
  }

  /**
   * thiết lập khi gắn đối tượng nhận dữ liệu và xử lý load bản đồ
   * @param listener
   */
  public setListenerWithMap(listener) {
    console.log("setListenerWithMap %%%%%%%%%%%%%%");
    this.listener = listener;

    //xử lý load bản đồ
    if (this.mapManager != null) {
      this.broadcastOnMapReady(this.mapManager);
    }
  }

  public removeListener() {
    this.listener = null;
  }

  onNetConnected(ret) {
    LogFile.e("Thiết bị kết nối mạng:", ret);
    this.hideHeaderAlert(HeaderAlertType.NETWORK_ALERT);

    //xử lý ở đối tượng lắng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onNetConnected)
    ) {
      this.listener.onNetConnected(ret);
    }
  }

  onNetDisconnected(ret) {
    LogFile.e("Thiết bị ngắt kết nối mạng:", ret);
    let alertModel = new AlertModel(
      HeaderAlertType.NETWORK_ALERT,
      strings.no_network
    );
    alertModel.setOnClickListener(() => NativeLinkModule.openWifiSetting());
    this.showHeaderAlert(alertModel);

    //xử lý ở đối tượng lắng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onNetDisconnected)
    ) {
      this.listener.onNetDisconnected(ret);
    }
  }

  /** khi ứng dụng bắt đầu hiện thị lên foreground */
  onHostResume() {
    console.log("onHostResume %%%%%%%%%%%%%%%");

    this.mStopped = false;

    this.resumeGps();

    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (this.listener != null && Utils.isFunction(this.listener.onHostResume)) {
      this.listener.onHostResume();
    }
  }

  /** khi ứng dụng bắt đầu chạy xuống background */
  onHostPause() {
    console.log("onHostPause %%%%%%%%%%%%%%%");
    this.mStopped = true;

    if (this.fusedLocationModule != null) {
      this.fusedLocationModule.stopOnEvent();
    }

    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (this.listener != null && Utils.isFunction(this.listener.onHostPause)) {
      this.listener.onHostPause();
    }

    //lưu logfile
    LogFile.saveFile();
  }

  /** khi ứng dụng bắt đầu bị tắt */
  onHostDestroy() {
    console.log("onHostDestroy %%%%%%%%%%%%%%%");
  }

  onGpsStatusChanged(state: number) {
    // console.log("onGpsStatusChanged %%%%%%%%%%%%%%%", state);

    // Hiển thị thông báo mất GPS theo cấu hình
    if (state == GpsStatus.GPS_EVENT_STOPPED) {
      let alertModel = new AlertModel(
        HeaderAlertType.GPS_ALERT,
        strings.gps_not_enabled
      );
      alertModel.setOnClickListener(() =>
        FusedLocationModule.openLocationSetting()
      );
      this.showHeaderAlert(alertModel);
    } else {
      this.hideHeaderAlert(HeaderAlertType.GPS_ALERT);
    }

    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onGpsStatusChanged)
    ) {
      this.listener.onGpsStatusChanged(state);
    }
  }

  /**
   * bắt đầu start gps
   */
  public async resumeGps() {
    if (this.fusedLocationModule == null) {
      this.fusedLocationModule = new FusedLocationModule();
    }

    this.fusedLocationModule.startOnEvent(this);
  }

  /**khởi tạo nội dung khi bản đồ được load hoàn thành*/
  async onMapReady(map: MapManager) {
    console.log("onMapReady %%%%%%%%%%%%%%");

    this.mapManager = map;

    this.onInitContent(map);
  }

  /**
   * đẩy xuống các đối tượng lắng nghe
   * @param map
   */
  private broadcastOnMapReady(map: MapManager) {
    // console.log("broadcastOnMapReady ^^^^^^^^^^^^^^^^^^", this.listener);
    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (this.listener != null && Utils.isFunction(this.listener.onMapReady)) {
      this.listener.onMapReady(map);
    }
  }

  /**
   * khởi tạo nội dung
   */
  private async onInitContent(map: MapManager) {
    // LogFile.e("SessionStore.activeBooked", SessionStore.activeBooked);
    //nếu có book đang tồn tại
    if (!Utils.isEmpty(this.rModel.bookCode)) {
      // Thực hiện relogin nếu đang trong cuốc
      this.rModel.taxiType.iconResc = Utils.getDrawableIdFromIconName(
        images,
        this.rModel.taxiType.iconCode
      );
      // Nếu không có kết nối mạng thì hiển thị dialog relogin
      let isNet = await NativeAppModule.isEnableNetwork();
      if (!isNet) {
        let alert: PairAlert = PairAlert.get()
          .setTitle(strings.alert_dialog_title)
          .setMessage(strings.book_alert_network)
          .setPositiveText(strings.btn_setting)
          .setNegativePress(() => {
            //mở wifi setting
            NativeLinkModule.openWifiSetting();
          })
          .setNegativeText(strings.btn_retry)
          .setNegativePress(() => {
            NativeAppModule.isEnableNetwork().then(ret => {
              if (ret) {
                this.showViewCar();
              } else {
                alert.show();
              }
            });
          })
          .show();
      } else {
        this.showViewCar();
      }
    } else {
      // Hiển thị giao diện đặt xe
      this.showMainHome();

      // Đồng bộ lịch sử và tin tức
      if (ConfigParam.MODULE_ONLINE_HISTORY) {
        // syncOnlineHistory();
      }
      // Lấy thông báo mới nhất
      if (ConfigParam.MODULE_ENABLE_POPUPNEW_ON_HOME) {
        // checkPopupNews();
      }
      // Gửi TokenKey cho server
      if (ConfigParam.MODULE_ENABLE_GET_TOKEN_FIREBASE) {
        // sentTokenKey();
      }
    }

    //đẩy sự kiện xuống đối tượng con lăng nghe
    this.broadcastOnMapReady(map);
  }

  /** xử lý khi callback từ app khác */
  private onActivityResult(resultCode: number) {
    console.log("ActivityResultModule: ", resultCode);
    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onActivityResult)
    ) {
      this.listener.onActivityResult(resultCode);
    }
  }

  public isStopped() {
    return this.mStopped;
  }

  /**
   * bắt đâu thực hiện cho book
   */
  public async componentDidMount() {
    //bắt đầu start nhận sự kiện vòng đời
    this.lifeCycleModule = new LifeCycleModule();
    this.lifeCycleModule.start(this);

    //lắng nghe trạng thái kết nối
    this.network = new NetworkManager(this);
    this.network.start();

    //start gps vì khi bắt đầu module này thì app đã resume
    await this.resumeGps();

    // this.activityResultModule = new ActivityResultModule();
    // this.activityResultModule.start(this.onActivityResult.bind(this));

    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (this.listener != null && Utils.isFunction(this.listener.onHostResume)) {
      this.listener.onHostResume();
    }
  }

  public onRegionChangeCompleted(region: Region) {
    //đẩy sự kiện xuống đối tượng con lăng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onRegionChangeCompleted)
    ) {
      this.listener.onRegionChangeCompleted(region);
    }
  }

  /**
   * thực hiện khi component bị hủy
   */
  componentWillUnmount() {
    //xóa lắng nghe vòng đời
    if (this.lifeCycleModule != null)
      this.lifeCycleModule.removeEmitterSubscription();

    //xóa activity result
    if (this.activityResultModule != null)
      this.activityResultModule.removeEmitterSubscription();

    //xóa sự kiện back
    AndroidSdk.removeBackListener(this.eventBack);

    //xóa sự kiện lăng nghe trạng thái mạng
    if (this.network != null) this.network.removeEventListener();

    //xóa location
    if (this.fusedLocationModule != null)
      this.fusedLocationModule.removeEmitterSubscription();
  }

  public showFragment(fragmentMap: FragmentMap) {
    this.bookHomePresenter.showFragment(fragmentMap);
  }

  public showToast(msg: string) {
    ToastModule.show(msg);
  }

  public dismissDialog() {
    this.getDialog().dissmiss();
  }

  public getMapManager(): MapManager {
    return this.mapManager;
  }

  public getDialog(): Dialog {
    return this.bookHomePresenter.getDialog();
  }

  // Hiển thị dialog full màn hình
  public showDialogFragment(children) {
    this.bookHomePresenter.getDialog()._showFragment(children);
  }

  // Đóng dialog.
  public closeDialog() {
    this.getDialog().dissmiss();
  }

  /* Hiển thị book taxi fragment */
  public async showBookTaxiFragment(isClearMap?: boolean) {
    // if (isClearMap && this.mapManager != null) {
    //   console.log("showBookTaxiFragment === this.mapManager.clear()");
    //   this.mapManager.clear();
    // }

    //xóa hết model ko sử dụng
    await this.resetBookingTaxi();

    //về màn hình chính
    this.showMainHome();
  }

  /**
   * về màn hình chính
   */
  public showMainHome() {
    //khởi tạo lại đối tượng mới lưu trữ book
    //về màn hình home
    this.bookHomePresenter.showFragment(FragmentMap.BOOK_HOME);
  }

  // Cập nhật các thông tin đặt xe trong màn hình xác nhận
  public setConfirmDataBooking(catchedTime: number) {
    this.rModel.catchedTime = catchedTime;
  }

  public showViewCar() {
    this.showFragment(FragmentMap.SHOW_TAXI);
  }

  public showMenuHeader(title?: string) {
    //remove sự kiện back
    AndroidSdk.removeBackListener(this.eventBack);

    //hiện thị menu
    this.bookHomePresenter.showHeader(HeaderType.MENU);
  }

  public showBackHeader(title?: string, callback?: Function) {
    //TODO: gán sự kiện back nhưng chưa chạy
    this.eventBack = AndroidSdk.addBackListener(() => {
      if (Utils.isNull(callback)) {
        this.showMainHome();
        return true;
      }

      //gọi hàm callback
      callback();
    });

    this.bookHomePresenter.showHeader(HeaderType.BACK);
  }

  public hideHeader() {
    this.bookHomePresenter.showHeader(HeaderType.NONE);
  }

  /** ẩn thông báo */
  public hideHeaderAlert(alertType: HeaderAlertType) {
    if (
      this.bookHomePresenter.getAlertLayout() == null ||
      alertType == undefined
    )
      return;

    this.bookHomePresenter.getAlertLayout().hideAlertModel(alertType);
  }

  /** hiện thị thông báo */
  public showHeaderAlert(alertModel: AlertModel) {
    // this.setState({ headerAlert: alertModel ? alertModel.msg || "" : "" });
    if (this.bookHomePresenter.getAlertLayout() == null || alertModel == null)
      return;

    //hiện alert
    this.bookHomePresenter.getAlertLayout().show(alertModel);
  }

  public async moveMyLocation(callback?: Function) {
    //kiểm tra có enable ko
    let ret = await FusedLocationModule.isEnableLocation();
    if (!ret) {
      FusedLocationModule.openLocationSetting();
      return;
    }

    //Nếu ko có vị trí
    let location = this.getCurrentLatLng();

    //kiểm tra vị trí
    if (Utils.isOriginLocation(location)) {
      this.getDialog().showWaitingDialog(strings.waiting_connected_gps);
      new WaitGpsDialog(
        location => {
          this.getDialog().dissmiss();
          if (location != null) {
            if (callback != undefined) {
              callback(location);
            } else {
              this.getMapManager().moveCenterCamera(location);
            }
          } else {
            ToastModule.show(strings.gps_network_not_get_location);

            //start lại gps
            this.resumeGps();
          }
        },
        () => this.getCurrentLatLng()
      ).start();
    } else {
      // Di chuyển về vị trí location
      if (callback != undefined) {
        callback(location);
      } else {
        this.getMapManager().moveCenterCamera(location);
      }
    }
  }

  onLocationChanged(option?: Location) {
    //ẩn thông báo nếu có
    //TODO: sẽ kiểm tra lại để check các trường hợp location thay đổi liên tục
    this.hideHeaderAlert(HeaderAlertType.GPS_ALERT);

    //xử lý ở đối tượng lắng nghe
    if (
      this.listener != null &&
      Utils.isFunction(this.listener.onLocationChanged)
    ) {
      this.listener.onLocationChanged(option);
    }
  }

  public getCurrentLocation(): Location {
    if (this.fusedLocationModule == null) return null;
    return this.fusedLocationModule.getCurrentLocation();
  }

  public getCurrentLatLng(): LatLng {
    if (this.fusedLocationModule == null) return null;

    return this.fusedLocationModule.getCurrentLatLng();
  }

  /**
   * lấy địa chỉ đi, nếu không có trả về giá trị mặc đinh
   */
  public getDefaultSrcAddressName() {
    let src = this.rModel.srcAddress;
    if (!src.formattedAddress) {
      return strings.search_address_from;
    }

    return src.formattedAddress;
  }

  /**
   * lấy địa chỉ trả, nếu không có trả về giá trị mặc đinh
   */
  public getDefaultDstAddressName() {
    if (!this.rModel.isValidDstAddress()) {
      return strings.search_address_to;
    }
    return this.rModel.dstAddress.formattedAddress;
  }

  // Di chuyển màn hình
  public navigateScreen(screen: ScreenName, params?) {
    this.bookHomePresenter.getNavigation().navigate(screen, params);
  }

  /* Kết thúc quốc khách reset toàn bộ thông tin cuốc cũ */
  public resetBookingTaxi() {
    // Reset công ty nếu app đặt xe cho nhiều hãng
    if (ConfigParam.MODULE_COMPANY_OPTION) {
      this.rModel.company = null;
    }
    // Hủy các tham số đặt xe
    this.rModel.companies = null;
    this.rModel.isCatcherCar = false;

    // Hủy khuyến mại và ghi chú cũ
    this.rModel.promotion = "";
    this.rModel.comment = "";
    this.rModel.estimates = "";
    if (this.rModel.childPrices != null) {
      this.rModel.childPrices.length = 0;
    }
    this.rModel.doneInfo = null;
    this.rModel.vehicleInfo = null;
    this.rModel.driverInfo = null;

    this.rModel.state = BookedStep.START;

    // Thiết lập lại trạng thái kết thúc quốc
    SessionStore.setFinishBooking();
    this.rModel.bookCode = "";
    this.rModel.isCatcherCar = false;

    // Xóa notification
    MediaManager.removeNotification();
    MediaManager.stopSound();
  }
}

export interface BookHomePresenter {
  showFragment(fragmentMap: FragmentMap);
  getDialog(): Dialog;
  showHeader(type: HeaderType, title?: string);
  getNavigation();
  getAlertLayout(): AlertLayout;
}

export enum FragmentMap {
  LOADING = 0,
  BOOK_HOME = 1,
  CONFIRM_HOME = 2,
  SHOW_TAXI = 3,
  RATING = 4
}

export enum HeaderType {
  NONE,
  BACK,
  MENU
}

/** Danh sách alert hiển thị trên top, độ ưu tiên hiển thị giảm dần */
export enum HeaderAlertType {
  NETWORK_ALERT = 1, // ưu tiên cao nhất
  GPS_ALERT = 2
}
