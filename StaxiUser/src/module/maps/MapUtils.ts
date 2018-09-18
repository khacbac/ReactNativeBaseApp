import Utils from "../Utils";
import SphericalUtil from "./SphericalUtil";

/**
 * Class này chứa các function tiện ích cho GooleMaps
 * @author Đv Hiện
 * Created on 05/07/2018
 */
class MapUtils {
	  
	/**
	 * Hàm này tính hướng marker trên bản đồ
	 * @author Đv Hiện
	 * Created on 05/07/2018
	 */
	public static getRotation = (lat2, long2, lat1, long1) => {
		var rotation = Math.atan2(lat2 - lat1, long2 - long1);
		rotation = rotation * (180 / Math.PI);
		rotation = (rotation + 360) % 360;
		return 360 - rotation;
  };
  
  /* Sai số khảng cách của đường chim bay và đường thật */
  public static RATIO_DISTANCE: number = 1.2;
  
  /* Khoảng cách để hiện thị thông báo khi xe gần tới người dùng */
  public static MAX_DISTANCE_FOR_USER: number = 150;

	/**
	 * Hàm này tính vận tốc của xe di chuyển
	 * @author Đv Hiện
	 * Created on 05/07/2018
	 */
	public static getVelocity = (lat2, long2, lat1, long1, timeStamp2, timeStamp1) => {
		const p = 0.017453292519943295; // Math.PI / 180
		const c = Math.cos;
		var a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((long2 - long1) * p))) / 2;
		let distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
		return distance / (timeStamp2 - timeStamp1);
	};

	/**
	 * Hàm này decode từ 1 chuỗi overview_polyline từ google trả về
	 * thành danh sách các điểm
	 * @author Đv Hiện
	 * Created on 05/07/2018
	 * @param: str: chuỗi overview_polyline
	 * @param precision: số lượng chính xác sau dấu
	 */
	public static decodePolyline = function(
		str: string,
		precision?: number
	): Array<{ latitude: number; longitude: number }> {
		var index = 0,
			lat = 0,
			lng = 0,
			coordinates: Array<{ latitude: number; longitude: number }> = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, precision || 5);
		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < str.length) {
			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;
			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);
			latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
			shift = result = 0;
			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);
			longitude_change = result & 1 ? ~(result >> 1) : result >> 1;
			lat += latitude_change;
			lng += longitude_change;
			coordinates.push({
				latitude: lat / factor,
				longitude: lng / factor,
			});
			//coordinates.push([lat / factor, lng / factor]);
		}
		return coordinates;
	};

	/**
	 * Hàm này kiểm tra 1 vị trí có nằm trong vùng polygone hay không
	 * @author Đv Hiện
	 * Created on 05/07/2018
	 */
	public static isPointExistsPolygone(
		point: { latitude: number; longitude: number },
		coordinates: Array<{ latitude: number; longitude: number }>
	) {
		var x = point.latitude,
			y = point.longitude;
		var inside = false;
		for (var i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
			var xi = coordinates[i].latitude,
				yi = coordinates[i].longitude;
			var xj = coordinates[j].latitude,
				yj = coordinates[j].longitude;
			var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
			if (intersect) inside = !inside;
		}
		return inside;
	}

	/**
	 * Tính khoảng cách giữa 2 tọa độ, trả về khoảng cách đơn vị mét
	 * @param startP 
	 * @param endP 
	 */
	public static calculationByDistance(startP: { latitude: number; longitude: number },
		endP: { latitude: number; longitude: number }): number {
		return SphericalUtil.computeDistanceBetween(startP, endP);
	}

	/**
	 * Hàm này kiểm tra 1 vị trí có khả dụng hay không
	 * @author Đv Hiện
	 * Created on 02/08/2018
	 */
	public static isOriginLocation(location: { latitude: number; longitude: number }): boolean {
		/* Nếu không có vị trí */
		if (location == null) return true;
		/* vị trí tâm xích đạo */
		if (location.latitude != 0 && location.longitude != 0) {
			return false;
		}
		return true;
	}

	/**
	 * Hàm này kiểm tra 1 vị trí có nằm trong vùng polygone hay không
	 * @author Đv Hiện
	 * Created on 02/08/2018
	 */
	public static isBetweenLatlng(
		currentLocation: { latitude: number; longitude: number },
		lastMoveLocation: { latitude: number; longitude: number }
	): boolean {
		if (Utils.isOriginLocation(currentLocation) || Utils.isOriginLocation(lastMoveLocation)) {
			return true;
		}
		let MIN_DELTA_LATLNG_CAN_MOVE: number = 0.0002;
		var deltaLat = Math.abs(currentLocation.latitude - lastMoveLocation.latitude);
		var deltaLng = Math.abs(currentLocation.longitude - lastMoveLocation.longitude);
		if (deltaLat > MIN_DELTA_LATLNG_CAN_MOVE || deltaLng > MIN_DELTA_LATLNG_CAN_MOVE) {
			return false;
		}
		return true;
	}

	public static bearingBetweenLocations(
		latLngOld: { latitude: number; longitude: number },
		latLngNew: { latitude: number; longitude: number }
	): number {
		let PI = 3.14159;
		let lat1 = (latLngOld.latitude * PI) / 180;
		let long1 = (latLngOld.longitude * PI) / 180;
		let lat2 = (latLngNew.latitude * PI) / 180;
		let long2 = (latLngNew.longitude * PI) / 180;

		let dLon = long2 - long1;

		let y = Math.sin(dLon) * Math.cos(lat2);
		let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

		let brng = Math.atan2(y, x);

		brng = (brng * 180.0) / PI;
		brng = (brng + 360) % 360;
		return brng;
	}
}

export default MapUtils;
