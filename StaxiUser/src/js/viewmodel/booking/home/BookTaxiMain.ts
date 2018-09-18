import BookTaxiModel from "../BookTaxiModel";
import BookingViewModel from "../BookingViewModel";
import { MarkerOptions, Utils, UserUtils, LatLng } from "../../../../module";
import OnNetworkListener from "../../../../module/net/OnNetworkListener";
import MapUtils from "../../../../module/maps/MapUtils";
import SphericalUtil from "../../../../module/maps/SphericalUtil";
import VehicleType from "../../../sql/bo/VehicleType";
import Region from "../../../model/Region";
import { CarNear } from "../../../http/carnear/CarNearResponse";
import NearCarRealtime, { NearCarRequest } from "./NearCarRealtime";
import MapManager from "../../../component/booking/MapManager";
import SessionStore from "../../../Session";
import images from "../../../../res/images";
import LogFile from "../../../../module/LogFile";

export default abstract class BookTaxiMain implements OnNetworkListener {
  public main: BookingViewModel;

  public rModel: BookTaxiModel;

  /* Danh sách xe xung quanh */
  private carnearMarkerOptions: MarkerOptions[] = null;

  /* Tìm xe xung quanh */
  public nearCarRealtime: NearCarRealtime;

  /* Cờ trạng thái kết nối mạng */
  public isEnableNetwork: boolean = true;

  /** đối tượng quản lý bản đồ */
  public mapManager: MapManager;

  /** vẽ start marker*/
  public abstract appendStartMarker(srcMarkerOptions: MarkerOptions);

  constructor(main: BookingViewModel) {
    this.main = main;
    this.rModel = main.getBookTaxiModel();
    this.mapManager = main.getMapManager();
  }

  onNetConnected(ret) {
    this.isEnableNetwork = true;
    if (this.nearCarRealtime != undefined) {
      this.nearCarRealtime.resume();
    }
  }

  onNetDisconnected(ret) {
    this.isEnableNetwork = false;
    if (this.nearCarRealtime != undefined) {
      this.nearCarRealtime.pause();
    }
  }

  onHostResume() {
    if (this.nearCarRealtime != null) {
      this.nearCarRealtime.resume();
    }
  }

  onHostPause() {
    if (this.nearCarRealtime != null) {
      this.nearCarRealtime.pause();
    }
  }

  /**
   * sử dụng sau khi load map xong
   * @param mapManager
   */
  public onMapReady(mapManager: MapManager) {
    if (mapManager == null) return;

    //xóa bản đồ
    mapManager.clear();

    var locationSrc = this.rModel.srcAddress.location;

    if (locationSrc == null) {
      locationSrc = this.main.getBookTaxiModel().srcAddress.location;
    }

    // vẽ điểm bắt đầu
    this.drawStartCustomMarker(locationSrc);

    // Địa chỉ đến (có thể có hoặc không)
    this.drawEndMarker();

    //di chuyển bản đồ về vị trí đón xe
    mapManager.moveCenterCamera(locationSrc, 0);
  }

  /**
   * bắt đầu start xe xung quanh
   */
  public startNearCarRealtime(callback?: Function) {
    // Request xe xung quanh
    this.nearCarRealtime = null;

    //cập nhật lại request
    this.requestNearCar(this.rModel.srcAddress.location, callback);
  }

  // Update lại params request xe xung quanh
  public requestNearCar(latlng: LatLng, callback?: Function) {
    //khởi tạo đối tượng nếu chưa có
    if (this.nearCarRealtime == null) {
      this.nearCarRealtime = new NearCarRealtime();
    }

    let nearCarRequest = new NearCarRequest();
    nearCarRequest.currentLocation = latlng;
    nearCarRequest.vehicleId = this.rModel.taxiType.vehicleId;
    nearCarRequest.companyKey = this.rModel.company.companyKey;
    nearCarRequest.routeId = this.rModel.route.routeId;
    this.nearCarRealtime.setCarNearRequest(nearCarRequest);

    this.nearCarRealtime.resume();

    // Lấy xe xung quanh
    this.retryNearCarRealtime(
      estimateCarnear => callback && callback(estimateCarnear)
    );
  }

  /* Lấy thông tin theo vị trí, vùng, tuyến, công ty */
  public getVehicleTypes(latLng: LatLng): Array<VehicleType> {
    // Lấy Vùng
    let regions = SessionStore.regions;
    if (regions == null || regions.size <= 0) {
      return null;
    }

    // Lấy Vùng được tìm kiếm đầu tiên
    let region: Region;
    this.rModel.landmark = null;
    for (const [key, value] of regions) {
      // Nếu điểm này nằm trong polygone
      if (
        MapUtils.isPointExistsPolygone(latLng, value.landmark.coordinatePolys)
      ) {
        region = value;
        this.rModel.landmark = region.landmark;
        break;
      }
    }

    // Thông báo ngoài vùng hỗ trợ
    if (
      region == undefined ||
      this.rModel.landmark == null ||
      region.routes == undefined ||
      region.routes.length <= 0
    ) {
      LogFile.e(
        "Không có vùng"
      );
      return null;
    }

    //lấy region
    this.rModel.route =
      region.routes.find(route => route.isActive == 1) || region.routes[0];

    if (this.rModel.route == null) {
      LogFile.e("Không có tuyến");
      return null;
    }

    // Lấy công ty
    this.rModel.company = region.companies.get(this.rModel.route.companyId);
    if (this.rModel.company == null) {
      LogFile.e(
        "Không có hãng trong tuyến"
      );
      return null;
    }

    // Lấy danh sách xe trong tuyến để vẽ lên giao diện
    let routeVehicles = region.vehicleTypeInRoute.get(
      this.rModel.route.routeId
    );

    //xác định xe active
    routeVehicles.forEach((vehicle: VehicleType) => {
      // Nếu xe active mặc định thì gán => chỉ chạy cho trường hợp đầu tiên load app
      if (this.rModel.taxiType == undefined) {
        if (vehicle.isActive || vehicle.seat == 0) {
          this.rModel.setVehicleType(vehicle);
        }
      } else {
        // Nếu đã có xe được chọn thì bỏ qua
        vehicle.isActive = (this.rModel.taxiType.vehicleId == vehicle.vehicleId);
      }
    });

    //nếu ko tìm thấy lại xe nào active thì lấy loại xe vị trí thứ 1
    if(this.rModel.taxiType == null){
      this.rModel.setVehicleType(routeVehicles[0]);
    }

    return routeVehicles;
  }

  /**
   * retry start xe xung quanh với param mới
   */
  public retryNearCarRealtime(calcMinTime?: (n: string) => any) {
    this.nearCarRealtime.componentDidMount((carNears: Array<CarNear>) => {
      // Tính khoảng cách nhỏ nhất
      calcMinTime && this.calcMinTimeNearCar(carNears, calcMinTime);
    });
  }

  /* Vẽ xe xung quanh */
  public createVehicleMarker(vehicle: CarNear): MarkerOptions {
    let markerOption = new MarkerOptions(vehicle.vehiclePlate.value);
    markerOption.icon(images.ic_car_traking);
    markerOption.position(vehicle.coordinate.value);
    markerOption.setRotation(vehicle.direction.value);
    // console.log('==========================', vehicle.direction.value);
    return markerOption;
  }

  /**
   * tính thời gian nhỏ nhất từ vị trí đặt xe đến xe gần nhất
   */
  public calcMinTimeNearCar(
    carNears: Array<CarNear>,
    callback: (n: string) => any
  ) {
    var minDistanceOnMeter: number = Number.MAX_VALUE;

    // Nếu có xe xung quanh thì vẽ xe lên bản đồ
    if (carNears.length > 0 && this.getMap() != null) {
      var markerOstions = [];
      carNears.forEach(vehicle => {
        if (!Utils.isOriginLocation(vehicle.coordinate.value)) {
          markerOstions.push(this.createVehicleMarker(vehicle));

          // Tính khoảng cách nhỏ nhất
          var distance = SphericalUtil.computeDistanceBetween(
            this.rModel.srcAddress.location,
            vehicle.coordinate.value
          );
          if (minDistanceOnMeter > distance) {
            minDistanceOnMeter = distance;
          }
        }
      });
      //vẽ marker
      this.getMap().setMarkers(markerOstions);
    } else {
      // Xóa marker xe xung quanh cũ
      this.getMap().removeAllMarkers();
      minDistanceOnMeter = 0;
    }

    // LogFile.log("calcMinTimeNearCar carNears.length ==", carNears.length);

    // LogFile.log("calcMinTimeNearCar minDistanceOnMeter", minDistanceOnMeter);

    // Hiển thị lên title marker start
    let estimateCarnear = UserUtils.formatTimeForTitleMarker(
      UserUtils.timeEstimatesNearCar(minDistanceOnMeter, this.rModel.landmark)
    );

    callback && callback(estimateCarnear);
  }

  public componentWillUnmount() {
    // Hủy realtime carnear
    if (this.nearCarRealtime != undefined) {
      this.nearCarRealtime.componentWillUnmount();
    }
  }

  public getMap(): MapManager {
    return this.mapManager;
  }

  /* Vẽ điểm đi */
  public drawStartCustomMarker(srcLatLng: LatLng) {
    if (Utils.isOriginLocation(srcLatLng) || this.getMap() == null) return;

    // di chuyển về vị trí hiện tại
    this.moveCenterCamera(srcLatLng);

    //thực hiện move
    let markerOption = this.getMap().moveStartMarker({
      latitude: srcLatLng.latitude,
      longitude: srcLatLng.longitude
    });

    // Xóa marker
    if (markerOption == null) {
      // Vẽ điểm đi
      markerOption = new MarkerOptions();
      markerOption.position(srcLatLng);
      this.appendStartMarker(markerOption);
      this.getMap().drawStartMarker(markerOption);
    }
  }

  /* Vẽ điểm đi */
  public drawStartMarker(srcLatLng: LatLng) {
    if (Utils.isOriginLocation(srcLatLng) || this.getMap() == null) return;

    // di chuyển về vị trí hiện tại
    this.moveCenterCamera(srcLatLng);

    //thực hiện move
    let markerOption = this.getMap().moveStartMarker({
      latitude: srcLatLng.latitude,
      longitude: srcLatLng.longitude
    });

    // Xóa marker
    if (markerOption == null) {
      // TODO: Vẽ điểm đi
      markerOption = new MarkerOptions();
      markerOption.position(srcLatLng);
      this.appendStartMarker(markerOption);
      this.getMap().drawStartMarker(markerOption);
    }
  }

  /* vẽ điểm đến */
  public drawEndMarker() {
    if (this.getMap() == null || !this.rModel.isValidDstAddress()) return;

    this.getMap().removeEndMarker();

    if (this.rModel.isValidDstAddress()) {
      //vẽ marker mới
      this.getMap().drawEndMarker(this.rModel.dstAddress.location);
    }
  }

  /* Xóa marker điểm đến */
  public removeEndMarker() {
    if (this.getMap() == null) return;

    //xóa
    this.getMap().removeEndMarker();

    // Move marker A về tâm
    if (!MapUtils.isOriginLocation(this.main.getCurrentLatLng())) {
      this.moveCenterCamera(this.main.getCurrentLatLng());
    }
  }

  /* Zoom bản đồ với điểm đón và điểm đến và đường đi ước lượng */
  public zoomBoundMapByLatLngAB(
    padding?:
      | number
      | { top: number; right: number; bottom: number; left: number }
  ) {
    let lstLatLng = [
      this.rModel.srcAddress.location,
    ];
    
    if (!Utils.isOriginLocation(this.rModel.dstAddress.location)) {
      lstLatLng.push(this.rModel.dstAddress.location);
    } else {
      return;
    }

    
    this.getMap().newLatLngBounds(lstLatLng, padding);
  }

  public getCarNearMarkerOption(): MarkerOptions[] {
    return this.carnearMarkerOptions;
  }

  public clearArrayCarNearMarkerOption() {
    this.carnearMarkerOptions = [];
  }

  // Lấy icon cho loại xe với name
  public getIconCar = iconName => {
    let arr = Object.keys(images);
    let item;
    for (let i = 0; i <= arr.length; i++) {
      item = arr[i];
      if (iconName === item) {
        return images[item];
      }
    }
  };

  protected moveCenterCamera(latLng: LatLng) {
    this.getMap().moveCenterCamera(latLng);
  }
}
