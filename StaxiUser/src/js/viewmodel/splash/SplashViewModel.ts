import { PermissionsAndroid, Platform } from "react-native";
import { doSyncData } from "../../http/loadapp/SyncModelView";
import {
  AndroidSdk,
  PairAlert,
  NativeLinkModule,
  ActivityResultModule,
  FileModule
} from "../../../module";
import UserDAO from "../../sql/dao/UserDAO";
import { NativeAppModule } from "../../../module";
import SqliteHelper from "../../sql/SqliteHelper";
import CompanyDAO from "../../sql/dao/CompanyDAO";
import VehicleTypeDAO from "../../sql/dao/VehicleTypeDAO";
import LandmarkDAO from "../../sql/dao/LandmarkDAO";
import RouteDAO from "../../sql/dao/RouteDAO";
import RouteVehicleDAO from "../../sql/dao/RouteVehicleDAO";
import BookedHistoryDAO from "../../sql/dao/BookedHistoryDAO";
import BookedHistory from "../../sql/bo/BookedHistory";
import ConfigParam from "../../constant/ConfigParam";
import LogFile from "../../../module/LogFile";
import strings, { Locate } from "../../../res/strings";
import PriceDAO from "../../sql/dao/PriceDAO";
import SharedCache from "../../constant/SharedCache";
import Language from "../../../module/model/Language";
import Region from "../../model/Region";
import Company from "../../sql/bo/Company";
import VehicleType from "../../sql/bo/VehicleType";
import RouteVehicleType from "../../sql/bo/RouteVehicleType";
import Route from "../../sql/bo/Route";
import ScreenName from "../../ScreenName";
import SessionStore from "../../Session";

export default class SplashViewModel {
  /** đối tượng xử lý khi quay lại ứng dụng mở vào setting */
  private activityResultModule: ActivityResultModule;

  /** đối tượng điều hướng */
  private navigation;

  private getRequiredPermissionsForAndroid() {
    let pers = [];
    pers.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    pers.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    return pers;
  }

  private getRequiredPermissionsForIOS() {
    let pers = [];
    pers.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return pers;
  }

  public componentWillUnmount() {
    if (this.activityResultModule != null)
      this.activityResultModule.removeEmitterSubscription();
  }

  // Kiểm tra quyền trên android
  public async componentDidMount(navigation): Promise<SplashType> {
    //cập nhật ngôn ngữ nếu có
    let locate: Language = await SharedCache.getLanguage();
    Locate.change(locate);
    SessionStore.language = locate;

    // Check trên android,chưa xử lý trên ios.
    if (locate === Language.VN) {
      NativeAppModule.setLocale(Language.VN);
    } else {
      NativeAppModule.setLocale(Language.EN);
    }

    //kiểm tra quyền trên android
    this.navigation = navigation;

    if (AndroidSdk.isAndroid()) {
      if (AndroidSdk.marshmallow()) {
        let ret = await NativeAppModule.checkPermissions(
          this.getRequiredPermissionsForAndroid()
        );

        if (ret) {
          return this.syncData(navigation);
        } else {
          //promise đang treo trên native => đợi native trả về trạng thái
        }
      } else {
        return this.syncData(navigation);
      }
    } else {
      let status = await NativeAppModule.checkPermissions(
        this.getRequiredPermissionsForIOS()
      );

      if (status) {
        // Đã được cho phép từ người dùng
        return this.syncData(navigation);
      } else {
        // bị từ chối từ người dùng, yêu cầu mở setting.
        return NativeAppModule.openUserSetting();
      }
    }
  }

  /**
   * đồng bộ dữ liệu với server
   * @param navigation
   */
  private async syncData(navigation): Promise<SplashType> {
    //khởi tạo logfile
    LogFile.initialize(FileModule.LOGFILE_FOLER);

    LogFile.e("syncData>>>>>>>>>>>>>>>>>>>>>>>>>>");

    //sử dụng khi cài lần đầu tiên trên ứng dụng
    let ret = await SqliteHelper.migrateData();

    if (!ret) {
      this.showCreateTableError(navigation);
      return SplashType.ERROR_CREATE_TABLE;
    }

    //lấy dữ liệu đồng bộ từ server
    let ret1 = await this.syncDataWithNet();

    return ret1;
  }

  /**
   * đồng bộ dữ liệu khi có kết nối mạng
   * @param navigation
   */
  private async syncDataWithNet() {
    //kiểm tra kết nối mạng
    let ret = await NativeAppModule.isEnableNetwork();

    if (!ret) {
      this.showDisableNetwork();
      return SplashType.DISCONNECT_NETWORK;
    }

    //lấy dữ liệu đồng bộ từ server
    let ret1 = await this.fetchData();

    return ret1;
  }

  /** lỗi ko enable mạng*/
  private showDisableNetwork() {
    PairAlert.get()
      .setMessage(strings.sync_not_network)
      .setPositiveText(strings.btn_setting)
      .setPositivePress(() => {
        NativeLinkModule.openWifiSetting();
        //tạo đối tượng lắng nghe trạng thái trả về
        this.startActivityResultModule();
      })
      .setNegativeText(strings.btn_finish)
      .setNegativePress(() => NativeAppModule.stopApp())
      .show();
  }

  /**
   * bật đối tượng lắng nghe nếu có
   */
  private startActivityResultModule() {
    if (this.activityResultModule == null) {
      //tạo đối tượng lắng nghe trạng thái trả về
      this.activityResultModule = new ActivityResultModule();
      this.activityResultModule.start(this.onActivityResult.bind(this));
    }
  }

  private onActivityResult(resultCode: number) {
    console.log("ActivityResultModule: ", resultCode);
    if (resultCode == NativeLinkModule.WIFI_SETTING_RC) {
      this.syncDataWithNet();
    }
  }

  /** lỗi không tạo được bản */
  private showCreateTableError(navigation) {
    PairAlert.get()
      .setMessage(
        "Lỗi không tạo được các bảng dữ liệu, bạn có thể khởi động lại ứng dụng"
      )
      .setPositiveText(strings.btn_restart)
      .setPositivePress(() => this.restartApp(navigation))
      .setNegativeText(strings.btn_finish)
      .setNegativePress(() => NativeAppModule.stopApp())
      .show();
  }

  private showSyncError() {
    PairAlert.get()
      .setMessage("Đồng bộ dữ liệu không thành công")
      .setPositiveText(strings.btn_restart)
      .setPositivePress(() => this.restartApp(this.navigation))
      .setNegativeText(strings.btn_finish)
      .setNegativePress(() => NativeAppModule.stopApp())
      .show();
  }

  private showQueryDataError() {
    PairAlert.get()
      .setMessage("Lỗi khi lấy dữ liệu đồng bộ từ database")
      .setPositiveText(strings.btn_restart)
      .setPositivePress(() => this.restartApp(this.navigation))
      .setNegativeText(strings.btn_finish)
      .setNegativePress(() => NativeAppModule.stopApp())
      .show();
  }

  /**
   * bật lại app
   * @param navigation
   */
  private restartApp(navigation) {
    navigation.replace(ScreenName.LOAD_APP);
  }

  private fetchData(): Promise<SplashType> {
    return new Promise(async (resolve, reject) => {
      doSyncData(async ret => {
        //nếu lấy dữ liệu thành công
        if (ret) {
          //Lấy user
          let user = await UserDAO.getUser();

          //lưu vào session
          SessionStore.setUser(user);

          // Lấy dữ liệu đồng bộ
          try {
            await this.loadSycnData();
            // console.log(`data__${JSON.stringify(data)}`);
            //kiểm tra tài khoản tồn tại hay chưa
            resolve(
              user.isRegisted() ? SplashType.REGISTRY : SplashType.NOT_REGISTRY
            );
          } catch (error) {
            this.showQueryDataError();
            resolve(SplashType.QUERY_ERROR);
          }
        } else {
          this.showSyncError();
          resolve(SplashType.SYNC_ERROR);
        }
      });
    });
  }

  /* Lấy dữ liệu từ database */
  public async loadSycnData() {
    // Lấy thông tin công ty
    let companys = await CompanyDAO.getCompanys();
    // console.log("companys------------------- ", companys);
    SessionStore.setCompanys(companys);

    // Lấy thông tin loại xe
    let vehicles = await VehicleTypeDAO.getVehicles();
    // console.log("vehicles------------------- ", vehicles);
    SessionStore.setVehicleTypes(vehicles);

    // Lấy thông tin bảng giá
    let prices = await PriceDAO.getPrices();
    // console.log("companys------------------- ", companys);
    SessionStore.setPrices(prices);

    // Lấy thông tin vùng, tuyến, công ty
    let landmarks = await LandmarkDAO.getLandmarks();
    // console.log("landmarks------------------- ", landmarks);

    // Lấy thông tin tuyến
    let routes = await RouteDAO.getRoutes();
    // console.log("routes------------------- ", routes);

    // Lấy thông tin loại xe trong tuyến
    let routeVehicles = await RouteVehicleDAO.getRouteVehicles();

    //tạo lại map để tính lại vùng tuyến
    let regions: Map<number, Region> = new Map<number, Region>();
    let region: Region;
    landmarks.forEach(lm => {
      region = new Region();

      //gán vùng
      region.landmark = lm;

      //gán tuyến
      region.routes = routes.filter(route => route.landmarkId == lm.landmarkId);

      //gán công ty
      region.companies = new Map<number, Company>();
      region.vehicleTypeInRoute = new Map<number, Array<VehicleType>>();

      let vehicle: VehicleType;
      region.routes.forEach((route: Route) => {

        //lấy công ty
        region.companies.set(route.companyId, companys.get(route.companyId));

        //danh sách loại xe
        let routeVehicleType: Array<VehicleType> = new Array<VehicleType>();

        routeVehicles.forEach((rv: RouteVehicleType) => {
          //tìm xe trong tuyến
          if (route.routeId == rv.routeId) {
            vehicle = vehicles.find(x => x.vehicleId == rv.vehicleId);
            if (vehicle != null) {
              vehicle.isActive = rv.isVehicleActive;
              //đẩy danh sách xe
              routeVehicleType.push(vehicle);
            }
          }
        });

        //lưu danh sách xe trong tuyến
        region.vehicleTypeInRoute.set(route.routeId, routeVehicleType);

      });
      regions.set(lm.landmarkId, region);
    });
    SessionStore.regions = regions;

    // console.log("SessionStore.regions ==", SessionStore.regions)

    //load ữ liệu lịch sử nếu có
    SessionStore.activeBooked = await this.loadActiveBook();

    // console.log("SessionStore.activeBooked------------------- ", SessionStore.activeBooked);

    //lấy thông tin vị trí mặc định trước đó
    let ret = await SharedCache.getLastestLocation();
    // console.log("SessionStore.activeBooked------------------- ", ret);

    SessionStore.setLastBookAddress(ret);
  }

  /**
   * load cuốc active
   */
  public async loadActiveBook(): Promise<BookedHistory> {
    //lấy thông tin đặt lịch
    let time = await BookedHistoryDAO.getScheduledBookTaxiTime();

    //lưu trữ thời gian đặt lịch
    SessionStore.setScheduledBookTime(time);

    let book: Array<BookedHistory>;

    if (ConfigParam.MODULE_BOOKING_CAR) {
      book = await BookedHistoryDAO.getActiveBookCarModel();
    } else {
      book = await BookedHistoryDAO.getActiveBookTaxiModel();
    }
    // console.log("initView", book);

    //kiểm tra có book hay không
    if (book) {
      return Promise.resolve(book[0]);
    } else {
      return Promise.resolve(null);
    }
  }
}

export enum SplashType {
  SUCCESS,
  DISCONNECT_NETWORK,
  REGISTRY,
  NOT_REGISTRY,
  ERROR_CREATE_TABLE,
  SYNC_ERROR,
  QUERY_ERROR
}
