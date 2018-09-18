import MethodName from "../MethodName";
import {requestByObject} from "../HttpHelper";
import {DfList, DfInteger} from '../../../module/js-serialize/DefinedType';
import {ContentValues, SQLiteUtils} from "../../../module";

import {
	SyncDataResponse,
	CompanySync,
	VehicleTypeSync,
	PriceSync,
	LandmarkSync,
	RouteSync,
  RouteVehicleSync,
  FeedbackTypeSync
} from './SyncDataResponse';

import SyncDataRequest from './SyncDataRequest';

import SyncDataVersionDAO from '../../sql/dao/SyncDataVersionDAO';
import CompanyDAO from "../../sql/dao/CompanyDAO";
import VehicleTypeDAO from '../../sql/dao/VehicleTypeDAO';
import PriceDAO from '../../sql/dao/PriceDAO';
import LandmarkDAO from '../../sql/dao/LandmarkDAO';
import RouteDAO from '../../sql/dao/RouteDAO';
import RouteVehicleDAO from '../../sql/dao/RouteVehicleDAO';
import FeedbackTypeDAO from "../../sql/dao/FeedbackTypeDAO";
import BaseDAO from "../../../module/sql/BaseDAO";

/* Thực hiện đồng bộ dữ liệu */
async function doSyncData(callback:Function) {
  // console.log("Thực hiện đồng bộ dữ liệu")
  let request = new SyncDataRequest();

  //lấy thông tin version và username
  let mVersionData = await SyncDataVersionDAO.getVesionData();
  // console.log(mVersionData);

  // request.companyVersion.setValue(0);
  // request.vehicleTypeVersion.setValue(0);
  // request.priceVersion.setValue(0);
  // request.feedbackTypeVersion.setValue(0);
  // request.landmarkVersion.setValue(0);
  // request.routeVersion.setValue(0);
  // request.routeVehicleVersion.setValue(0);

  request.companyVersion.setValue(mVersionData.companyVersion);
  request.vehicleTypeVersion.setValue(mVersionData.vehicleTypeVersion);
  request.priceVersion.setValue(mVersionData.priceVersion);
  request.feedbackTypeVersion.setValue(mVersionData.feedbackTypeVersion);
  request.landmarkVersion.setValue(mVersionData.landmarkVersion);
  request.routeVersion.setValue(mVersionData.routeVersion);
  request.routeVehicleVersion.setValue(mVersionData.routeVehicleVersion);


  request.osType.setValue(2);
  request.appVersion.setValue(1);
 
  // Thực hiện request
  try {
    let response = await requestByObject(
      MethodName.CustSyncData,
      request,
      new SyncDataResponse()
    );
    // console.log(store);
    // console.log("response------------------------------------------");
    console.log(response);

    // Kiểm tra nếu không có dữ liệu đồng bộ thì bỏ qua
    if (response.isEmpty()) {
      if (mVersionData.companyVersion <= 0 ||
        mVersionData.vehicleTypeVersion <= 0 ||
        mVersionData.priceVersion <= 0 ||
        mVersionData.landmarkVersion <= 0 ||
        mVersionData.routeVersion <= 0 ||
        mVersionData.routeVehicleVersion <= 0){
        callback(false);
      } else {
        callback(true);
      }

      return;
    }

    // console.log("response------!response.isEmpty()------------------------------------");

    let query = [];

    //Đồng bộ công ty
    if (!response.isEmptyCompanies()) {
      query.push(...syncCompanies(response.companies));
      // console.log("query syncCompanies= ", query.length);
      mVersionData.companyVersion = response.companyVersion.value;
    }

    // Đồng bộ loại xe
    if (!response.isEmptyCarTypes()) {
      query.push(...syncVehicleTypes(response.vehicleTypes));
      // console.log("query syncVehicleTypes = ", query.length);
      mVersionData.vehicleTypeVersion = response.vehicleTypeVersion.value;
    }

    // Đồng bộ bảng giá
    if (!response.isEmptyCompanyPrices()) {
      query.push(...syncPrices(response.prices));
      // console.log("query syncPrices= ", query.length);
      mVersionData.priceVersion = response.priceVersion.value;
    }

    // Đồng bộ loại phản hồi
    if (!response.isEmptyFeedBackTypes()) {
      query.push(...syncFeedbackTypes(response.feedbackTypes));
      // console.log("query syncFeedbackTypes = ", query.length);
      mVersionData.feedbackTypeVersion = response.feedbackTypeVersion.value;
    }

    // Đồng bộ bảng vùng
    if (!response.isEmptyLandmarks()) {
      query.push(...syncLandmarks(response.landmarks));
      // console.log("query syncLandmarks= ", query.length);
      mVersionData.landmarkVersion = response.landmarkVersion.value;
    }

    // Đồng bộ bảng tuyến
    if (!response.isEmptyRoutes()) {
      query.push(...syncRoutes(response.routes));
      // console.log("query syncRoutes= ", query.length);
      mVersionData.routeVersion = response.routeVersion.value;
    }

    // Đồng bộ bảng loại xe trong tuyến
    if (!response.isEmptyRouteVehicles()) {
      query.push(...syncRouteVehicles(response.routeVehicles));
      // console.log("query syncRouteVehicles= ", query.length);
      mVersionData.routeVehicleVersion = response.routeVehicleVersion.value;
    }

    // Cập nhật lại version sync data và config
    query.push(...SyncDataVersionDAO.syncQuery(mVersionData));
    // console.log("query SyncDataVersionDAO = ", mVersionData);

    SQLiteUtils.executeSqls(query)
      .then(() => {
        console.log("MutiInsert thực hiện thành công");
        callback(true);
      })
      .catch(err => {
        console.log("mutiInsert lỗi", err);
        // setVisibleRetry();
        callback(mVersionData.companyVersion <= 0 || 
          mVersionData.vehicleTypeVersion <= 0 || 
          mVersionData.priceVersion <= 0 || 
          mVersionData.landmarkVersion <= 0 || 
          mVersionData.routeVersion <= 0 || mVersionData.routeVehicleVersion);
      });
  } catch (error) {
    console.log("doSyncData request Exception", error.message || error);
    callback(false);
  }
}

/* Xử lý dữ liệu bảng công ty */
function syncCompanies(companys: DfList<CompanySync>): Array<string> {
  /* Nếu không trường nào thì không cần cập nhật */
  if (companys == null || companys.isEmpty()) {
    return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(CompanyDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(CompanyDAO.getQueryCreateTable());
  let values;
  companys.value.forEach(c => {
    if (c) {
      values = new ContentValues();
      values.set(CompanyDAO.NAME_COLUMN, c.name);
      values.set(CompanyDAO.REPUTATION_COLUMN, c.reputation);
      values.set(CompanyDAO.PHONE_COLUMN, c.phone);
      values.set(CompanyDAO.LOGO_COLUMN, c.logo);
      values.set(CompanyDAO.PROVINCE_ID_COLUMN, c.provinceId);
      values.set(CompanyDAO.ADDRESS_COLUMN, c.address);
      values.set(CompanyDAO.PARENT_ID_COLUMN, c.parentId);
      values.set(CompanyDAO.COMPANY_KEY, c.companyKey);
      
      // values.set(CompanyDAO.LAT_COLUMN, c.latlng.getLat());
      // values.set(CompanyDAO.LNG_COLUMN, c.latlng.getLng());
      values.set(CompanyDAO.LAT_COLUMN, 0);
      values.set(CompanyDAO.LNG_COLUMN, 1);
      
      values.set(CompanyDAO.TAXI_TYPE_COLUMN, c.taxiType);
      values.set(CompanyDAO.XN_CODE_COLUMN, c.xnCode);
      if(c.companyJson.value){
        values.set(CompanyDAO.LOGO_LINK_COLUMN, JSON.parse(c.companyJson.value).LogoLink);
        values.set(CompanyDAO.DISPLAY_NAME_COLUMN, JSON.parse(c.companyJson.value).DisplayName);
      }
      arr.push(SQLiteUtils.createInsertClause(CompanyDAO.TABLE, values));
    }
  });
  return arr;
}

/* Xử lý dữ liệu bảng loại xe */
function syncVehicleTypes(vehicleTypes: DfList<VehicleTypeSync>): Array<string> {
  /* Nếu không trường nào thì không cần cập nhật */
  if (vehicleTypes == null || vehicleTypes.isEmpty()) {
    return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(VehicleTypeDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(VehicleTypeDAO.getQueryCreateTable());
  let values;
  vehicleTypes.value.forEach(v => {
		if (v) {
			values = new ContentValues();
      values.set(VehicleTypeDAO.ID_COLUMN, v.vehicleTypeId);
			values.set(VehicleTypeDAO.NAME_VI_COLUMN, v.nameVi);
			values.set(VehicleTypeDAO.NAME_EN_COLUMN, v.nameEn);
			values.set(VehicleTypeDAO.SEAT_COLUMN, v.seat);
			values.set(VehicleTypeDAO.ICON_CODE_COLUMN, v.iconCode);
			values.set(VehicleTypeDAO.ICON_RESC_COLUMN, v.iconResc);
			values.set(VehicleTypeDAO.DESCRIPTION_COLUMN, v.description);
			values.set(VehicleTypeDAO.TYPE_COLUMN, v.type);
      values.set(VehicleTypeDAO.ORDER_COLUMN, v.orders);
      
      let listChild:number[] = [];
      v.listChild.value.forEach((item:DfInteger) =>{
        listChild.push(item.value);
      })
      values.set(VehicleTypeDAO.LIST_CHILD_COLUMN, listChild.join(BaseDAO.SPACE));

			values.set(VehicleTypeDAO.IS_SHOW_PRICE_COLUMN, v.isShowPrice);
			values.set(VehicleTypeDAO.IC_MARKER_URL_COLUMN, v.icMarkerUrl);
      values.set(VehicleTypeDAO.MARKER_ROATION_COLUMN, v.markerRotation);
      values.set(VehicleTypeDAO.COMPANY_ID_COLUMN, JSON.parse(v.vehicleTypeJson.value).CompanyID);
      values.set(VehicleTypeDAO.OBLIGE_END_POINT_COLUMN, JSON.parse(v.vehicleTypeJson.value).ObligeEndPoint);
      values.set(VehicleTypeDAO.OBLIGE_FINISH_COLUMN, JSON.parse(v.vehicleTypeJson.value).ObligeFinishBook);
      //values.set(VehicleTypeDAO.CUST_TIME_FINISH_COLUMN, JSON.parse(v.vehicleTypeJson.value).CustTimerFinishBook);
			arr.push(SQLiteUtils.createInsertClause(VehicleTypeDAO.TABLE, values));
		}
  });
  return arr;
}

/* Xử lý dữ liệu bảng giá */
function syncPrices(companyPrices: DfList<PriceSync>): Array<string> {
  /* Nếu không trường nào thì không cần cập nhật */
  if (companyPrices == null || companyPrices.isEmpty()) {
		return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(PriceDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(PriceDAO.getQueryCreateTable());
  let values;
  companyPrices.value.forEach(p => {
		if (p) {
			values = new ContentValues();
			values.set(PriceDAO.ID_COLUMN, p.priceId);
      values.set(PriceDAO.COMPANY_ID_COLUMN, p.companyId);
      values.set(PriceDAO.LIST_VEHICLE_TYLE_COLUMN, JSON.stringify(p.listVehicleTypes.value));
      values.set(PriceDAO.PRICE_APPLY_DATE_COLUMN, p.priceApplyDate);
      values.set(PriceDAO.PRICE_END_DATE_COLUMN, p.priceEndDate);
      values.set(PriceDAO.PRICE_FORMULA_COLUMN, p.priceFormula);
      values.set(PriceDAO.DOWN_PERCENT_WAYS_COLUMN, p.downPercent2ways);
      values.set(PriceDAO.BEGIN_KM_WAYS_COLUMN, p.beginKm2Ways);
      values.set(PriceDAO.PRICE_FORMULA_JSON, p.priceFormulaJson);
      values.set(PriceDAO.PRICE_FORMULA_NEW, p.priceJson);
			arr.push(SQLiteUtils.createInsertClause(PriceDAO.TABLE, values));
		}
  });
  return arr;
}

/* Xử lý dữ liệu bảng giá */
function syncFeedbackTypes(feedbackTypes: DfList<FeedbackTypeSync>): Array<string> {
  /* Nếu không trường nào thì không cần cập nhật */
  if (feedbackTypes == null || feedbackTypes.isEmpty()) {
    return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(FeedbackTypeDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(FeedbackTypeDAO.getQueryCreateTable());
  let values;
  feedbackTypes.value.forEach(f => {
    if (f) {
      values = new ContentValues();
      values.set(FeedbackTypeDAO.ID_COLUMN, f.feedbackTypeId);
      values.set(FeedbackTypeDAO.NAME_VI_COLUMN, f.nameVI);
      values.set(FeedbackTypeDAO.NAME_EN_COLUMN, f.nameEN);
      values.set(FeedbackTypeDAO.ORDER_COLUMN, f.order);
      values.set(FeedbackTypeDAO.FEEDBACK_JSON_COLUMN, f.feesbackJson);
      arr.push(SQLiteUtils.createInsertClause(FeedbackTypeDAO.TABLE, values));
    }
  });
  return arr;
}

/* Xử lý dữ liệu bảng vùng */
function syncLandmarks(landmarks: DfList<LandmarkSync>): Array<string> {
	/** Nếu không trường nào thì không cần cập nhật */
	if (landmarks == null || landmarks.isEmpty()) {
		return [];
	}
	let arr = [];
	/* Xóa bảng */
	arr.push(LandmarkDAO.getQueryDropTable());
	/* Tạo lại bảng */
  arr.push(LandmarkDAO.getQueryCreateTable());
	let values;
	landmarks.value.forEach((l: LandmarkSync) => {
		if (l) {
			values = new ContentValues();
      values.set(LandmarkDAO.ID_COLUMN, l.landmarkId);
			values.set(LandmarkDAO.POLYGONE_COLUMN, l.polygone);
			values.set(LandmarkDAO.ADDRESS_SOURCE_COLUMN, l.addressSource);
			values.set(LandmarkDAO.AVERAGE_COLUMN, l.averageSpeed);
			//values.set(LandmarkDAO.DISTANCE_MULTIPLIER_COLUMN, l.distanceMultiplier);
			values.set(LandmarkDAO.ADDITION_TIME_COLUMN, l.additionTime);
      values.set(LandmarkDAO.SUB_TYPE_COLUMN, l.subType);
      values.set(LandmarkDAO.LANDMARK_JSON, l.landmarkJson)
			arr.push(SQLiteUtils.createInsertClause(LandmarkDAO.TABLE, values));
		}
	});
	return arr;
}

/* Xử lý dữ liệu bảng tuyến */
function syncRoutes(routes: DfList<RouteSync>): Array<string> {
  /** Nếu không trường nào thì không cần cập nhật */
  if (routes == null || routes.isEmpty()) {
    return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(RouteDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(RouteDAO.getQueryCreateTable());

  let values;
  routes.value.forEach((r: RouteSync) => {
		if (r) {
			values = new ContentValues();
			values.set(RouteDAO.ID_COLUMN, r.routeId);
      values.set(RouteDAO.CODE_COLUMN, r.routeCode);
      values.set(RouteDAO.NAME_VI_COLUMN, r.routeNameVi);
      values.set(RouteDAO.NAME_EN_COLUMN, r.routeNameEn);
      values.set(RouteDAO.LANDMARK_ID_COLUMN, r.landmarkId);
      values.set(RouteDAO.ORDER_COLUMN, r.routeOrder);
      values.set(RouteDAO.COMPANY_ID_COLUMN, r.companyId);
      values.set(RouteDAO.ROUTE_TYPE_COLUMN, r.routeType);
      if(r.routeJson.value){
        values.set(RouteDAO.ACTIVE_STATE_COLUMN, JSON.parse(r.routeJson.value).IsActive);
        //values.set(RouteDAO.DISTANCE_INVITE_COLUMN, JSON.parse(r.routeJson.value).DistanceInviteUser);
      }
      arr.push(SQLiteUtils.createInsertClause(RouteDAO.TABLE, values));
		}
  });
  return arr;
}

/* Xử lý dữ liệu bảng loại xe trong tuyến */
function syncRouteVehicles(routeVehicles: DfList<RouteVehicleSync>): Array<string> {
  /* Nếu không trường nào thì không cần cập nhật */
  if (routeVehicles == null || routeVehicles.isEmpty()) {
    return [];
  }
  let arr = [];
  /* Xóa bảng */
  arr.push(RouteVehicleDAO.getQueryDropTable());
  /* Tạo lại bảng */
  arr.push(RouteVehicleDAO.getQueryCreateTable());
  let values;
  routeVehicles.value.forEach((rv: RouteVehicleSync) => {
    if (rv) {
      values = new ContentValues();
      values.set(RouteVehicleDAO.ID_COLUMN, rv.routeVehicleTypeId);
      values.set(RouteVehicleDAO.ROUTE_ID_COLUMN, rv.routeId);
      values.set(RouteVehicleDAO.VEHICLE_ID_COLUMN, rv.vehicleId);
      values.set(RouteVehicleDAO.VEHICLE_STT_COLUMN, rv.vehicleStt);
      values.set(RouteVehicleDAO.IS_VEHICLE_ACTIVE_COLUMN, rv.isVehicleActive);
      values.set(RouteVehicleDAO.ROUTE_VEHICLE_JSON, rv.routeVehicleJson);
      arr.push(SQLiteUtils.createInsertClause(RouteVehicleDAO.TABLE, values));
    }
  });
  return arr;
}

export {doSyncData};
