import {DfInteger, DfByte, DfString, DfLatLng, DfLong, DfFloat, DfBoolean} from '../../../module';
import BaseDAO from "../../../module/sql/BaseDAO";
import { DfList } from '../../../module/js-serialize/DefinedType';
import { StrokeDashoffsetProperty } from 'csstype';

/**
 * Thông tin dữ liệu bảng công ty
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class CompanySync {
	/* Tên công ty */
	public name: DfString = DfString.index(0);

	/* Thương hiệu */
	public reputation: DfString = DfString.index(1);

	/* Số điện thoại */
	public phone: DfString = DfString.index(2);

	/* teeb logo */
	public logo: DfString = DfString.index(3);

	/* Mã tỉnh */
	public provinceId: DfInteger = DfInteger.index(4);

	/* Địa chỉ công ty */
	public address: DfString = DfString.index(5);

	/* Hãng cha */
	public parentId: DfInteger = DfInteger.index(6);

	/* Id công ty */
	public companyKey: DfInteger = DfInteger.index(7);

	/* Vị trí công ty */
	public latlng: DfLatLng = DfLatLng.index(8);

	/* Loại dịch vụ */
	public taxiType: DfString = DfString.index(9);

	/* Ma xí nghiệp */
	public xnCode: DfInteger = DfInteger.index(10);

	/**
	 * Các trường mở rộng dùng cho hiển thị:
	 * LogoLink (String)
	 * DisplayName (String)
	 */
	public companyJson: DfString = DfString.index(11);
}

/**
 * Thông tin dữ liệu bảng loại xe
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class VehicleTypeSync {
	/* Định danh của bảng */
	public vehicleTypeId: DfInteger = DfInteger.index(0);

	/* Tên loại xe tiếng việt */
	public nameVi: DfString = DfString.index(1);

	/* Tên loại xe tiếng anh */
	public nameEn: DfString = DfString.index(2);

	/* Số chỗ ngồi */
	public seat: DfInteger = DfInteger.index(3);

	/* Tên của icon */
	public iconCode: DfString = DfString.index(4);

	/* Tên của icon */
	public iconResc: DfInteger = DfInteger.index(5);

	/* Mô tả */
	public description: DfString = DfString.index(6);

	/* Loại xe */
	public type: DfInteger = DfInteger.index(7);

	/* Thứ tự sắp xếp */
	public orders: DfInteger = DfInteger.index(8);

	/* Danh sách con */
	public listChild: DfList<DfInteger> = new DfList(new DfInteger(), 9);

	/* Cờ trạng thái hiển thị giá */
	public isShowPrice: DfBoolean = DfBoolean.index(10);

	/* Tên icon trên bản đồ */
	public icMarkerUrl: DfString = DfString.index(11);

	/* Hướng marker trên bản đồ */
	public markerRotation: DfInteger = DfInteger.index(12);

	/**
	 * Các trường mở rộng cho loại xe:
	 * CompanyID (Int)
	 * ObligeEndPoint (Int)
	 * ObligeFinishBook (Int)
	 * CustTimerFinishBook (Int)
	 */
	public vehicleTypeJson: DfString = DfString.index(13);
}

/**
 * Thông tin dữ liệu bảng giá
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class PriceSync {
	/* Định danh của bảng */
	public priceId: DfInteger = DfInteger.index(0);

	/* Id công ty */
	public companyId: DfInteger = DfInteger.index(1);

	/* Danh sách id loại xe */
	public listVehicleTypes: DfList<DfInteger> = new DfList(new DfInteger(), 2);

	/* Giá tạo */
	public priceApplyDate: DfLong = DfLong.index(3);

	/* Giá kết thúc */
	public priceEndDate: DfLong = DfLong.index(4);

	/* Công thức theo bước nhảy cũ */
	public priceFormula: DfString = DfString.index(5);

	/* Chưa xác định */
	public downPercent2ways: DfInteger = DfInteger.index(6);

	/* Chưa xác định */
	public beginKm2Ways: DfInteger = DfInteger.index(7);

	/**
	 * Công thức giá hiển thị footer loại xe:
	 * Open (Float)
	 * Level1 (Float)
	 * Level2 (Float)
	 */
	public priceFormulaJson: DfString = DfString.index(8);

	public priceJson: DfString = DfString.index(9);
}

/**
 * Thông tin dữ liệu bảng phản hồi
 * @author ĐvHiện
 * Created on 03/07/2018
 * */
class FeedbackTypeSync {
	/* ID feedback type */
	public feedbackTypeId: DfInteger = DfInteger.index(0);

	/* Tên tiếng Việt */
	public nameVI: DfString = DfString.index(1);

	/* Tên tiếng Anh */
	public nameEN: DfString = DfString.index(2);

	/* Stt */
	public order: DfInteger = DfInteger.index(3);

	/* Trường mở rộng */
	public feesbackJson: DfString = DfString.index(4);
}

/**
 * Thông tin dữ liệu bảng vùng
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class LandmarkSync {
	/* Id định danh của bảng thông tin vùng */
	public landmarkId: DfInteger = DfInteger.index(0);

	/* Đanh sách điểm */
	public polygone: DfString = DfString.index(1);

	/* Nguồn request địa chỉ */
	public addressSource: DfInteger = DfInteger.index(2);

	/* Vận tốc ước lượng theo vùng(dùng để tính ước lượng xe) */
	public averageSpeed: DfInteger = DfInteger.index(3);

	/* Khoảng cách ước lượng(bù trừ cho đường chim bay) */
	public distanceMultiplier: DfFloat = DfFloat.index(4);

	/**
	 * Số phút thêm cho ước lượng theo vùng(những vùng dễ tắc, nhiều đèn đỏ như
	 * nội thành)
	 */
	public additionTime: DfInteger = DfInteger.index(5);

	/* Loại tuyến để set giao diện */
	public subType: DfByte = DfByte.index(6);

	/* Trường mở rộng */
	public landmarkJson: DfString = DfString.index(7);
}

/**
 * Thông tin dữ liệu bảng tuyến
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class RouteSync {
	/* Định danh của bảng */
	public routeId: DfInteger = DfInteger.index(0);

	/* Chưa xác định */
	public routeCode: DfString = DfString.index(1);

	/* Tên tuyến tiếng Việt */
	public routeNameVi: DfString = DfString.index(2);

	/* Tên tuyến tiếng Anh */
	public routeNameEn: DfString = DfString.index(3);

	/* Id vùng */
	public landmarkId: DfInteger = DfInteger.index(4);

	/* Sắp xếp tuyến */
	public routeOrder: DfInteger = DfInteger.index(5);

	/* Id công ty */
	public companyId: DfInteger = DfInteger.index(6);

	/* Loại tuyến */
	public routeType: DfByte = DfByte.index(7);

	/**
	 * Trường mở rộng: 
	 * IsActive (String)
	 * DistanceInviteUser (String)
	 * */
	public routeJson: DfString = DfString.index(8);
}

/**
 * Thông tin dữ liệu bảng loại xe trong tuyến
 * @author ĐvHiện
 * Created on 29/06/2018
 * */
class RouteVehicleSync {
	/* Định danh của bảng */
	public routeVehicleTypeId: DfInteger = DfInteger.index(0);

	/* Id của tuyến */
	public routeId: DfInteger = DfInteger.index(1);

	/* Id xe trong tuyến */
	public vehicleId: DfInteger = DfInteger.index(2);

	/* Số thứ tự */
	public vehicleStt: DfInteger = DfInteger.index(3);

	/* Xe được active */
	public isVehicleActive: DfBoolean = DfBoolean.index(4);

	/* Các trường mở rộng */
	public routeVehicleJson: DfString = DfString.index(5);
}

/**
 * Đối tượng response đồng bộ dữ liệu app khách hàng
 * @author ĐvHiện
 * Created on 29/06/2018
 */
class SyncDataResponse {
	/* Cờ trạng thái cập nhật ứng dụng */
	public isUpdateApp: DfBoolean = DfBoolean.index(0);

	/* Thông tin version bảng công ty */
	public companyVersion: DfInteger = DfInteger.index(1);

	/* Thông tin dữ liệu bảng công ty */
	public companies: DfList<CompanySync> = new DfList(new CompanySync(), 2);

	/* Thông tin version bảng loại xe */
	public vehicleTypeVersion: DfInteger = DfInteger.index(3);

	/* Thông tin dữ liệu bảng loại xe */
	public vehicleTypes: DfList<VehicleTypeSync> = new DfList(new VehicleTypeSync(), 4);

	/* Thông tin version bảng giá */
	public priceVersion: DfInteger = DfInteger.index(5);

	/* Thông tin dữ liệu bảng giá */
	public prices: DfList<PriceSync> = new DfList(new PriceSync(), 6);

	/* Thông tin version bảng giá */
	public feedbackTypeVersion: DfInteger = DfInteger.index(7);

	/* Thông tin dữ liệu bảng giá */
	public feedbackTypes: DfList<FeedbackTypeSync> = new DfList(new FeedbackTypeSync(), 8);

	/* Thông tin version bảng vùng */
	public landmarkVersion: DfInteger = DfInteger.index(9);

	/* Thông tin dữ liệu bảng vùng */
	public landmarks: DfList<LandmarkSync> = new DfList(new LandmarkSync(), 10);

	/* Thông tin version bảng tuyến */
	public routeVersion: DfInteger = DfInteger.index(11);

	/* Thông tin dữ liệu bảng tuyến */
	public routes: DfList<RouteSync> = new DfList(new RouteSync(), 12);

	/* Thông tin version bảng loại xe trong tuyến */
	public routeVehicleVersion: DfInteger = DfInteger.index(13);

	/* Thông tin dữ liệu bảng bảng loại xe trong tuyến */
	public routeVehicles: DfList<RouteVehicleSync> = new DfList(new RouteVehicleSync(), 14);

	public isEmptyCompanies() {
		return this.companies == null || this.companies.isEmpty();
	}

	public isEmptyCarTypes() {
		return this.vehicleTypes == null || this.vehicleTypes.isEmpty();
	}

	public isEmptyCompanyPrices() {
		return this.prices == null || this.prices.isEmpty();
	}

	public isEmptyFeedBackTypes() {
		return this.feedbackTypes == null || this.prices.isEmpty();
	}

	public isEmptyLandmarks() {
		return this.landmarks == null || this.landmarks.isEmpty();
	}

	public isEmptyRoutes() {
		return this.routes == null || this.routes.isEmpty();
	}

	public isEmptyRouteVehicles() {
		return this.routes == null || this.routes.isEmpty();
	}

	public isEmpty() {
		return (
			this.isEmptyCompanies() &&
			this.isEmptyCarTypes() &&
			this.isEmptyCompanyPrices() &&
			this.isEmptyFeedBackTypes() &&
			this.isEmptyLandmarks() &&
			this.isEmptyRoutes() &&
			this.isEmptyRouteVehicles()
		);
	}
}

export {
  CompanySync,
  VehicleTypeSync,
  PriceSync,
  FeedbackTypeSync,
  LandmarkSync,
  RouteSync,
  RouteVehicleSync,
  SyncDataResponse
};
