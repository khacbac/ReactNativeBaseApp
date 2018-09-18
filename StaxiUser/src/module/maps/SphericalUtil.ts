import Utils from "../Utils";
import { LatLng } from "..";

/**
 * Class này chứa các function tiện ích cho GooleMaps
 * @author Đv Hiện
 * Created on 05/07/2018
 */
class SphericalUtil {

  /* The earth's radius, in meters. Mean radius as defined by IUGG. */
	public static EARTH_RADIUS: number = 6371009;
	
	/**
	 * Returns the heading from one LatLng to another LatLng. Headings are
	 * expressed in degrees clockwise from North within the range [-180,180).
	 * @return The heading in degrees clockwise from north.
	 */
	public static computeHeading(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
		// http://williams.best.vwh.net/avform.htm#Crs
		let fromLatR: number = this.toRadians(fromLat);
		let fromLngR: number = this.toRadians(fromLng);
		let toLatR: number = this.toRadians(toLat);
		let toLngR: number = this.toRadians(toLng);
		let dLng: number = toLngR - fromLngR;
		let heading: number = Math.atan2(Math.sin(dLng) * Math.cos(toLatR),
			Math.cos(fromLatR) * Math.sin(toLatR) - Math.sin(fromLatR) * Math.cos(toLatR) * Math.cos(dLng));
		return this.wrap(this.toDegrees(heading), -180, 180);
	}

	/**
	 * Returns haversine(angle-in-radians). hav(x) == (1 - cos(x)) / 2 == sin(x
	 * / 2)^2.
	 */
  public static hav(x: number): number{
	  var sinHalf: number = Math.sin(x * 0.5);
	  return sinHalf * sinHalf;
	}

	/**
	 * Computes inverse haversine. Has good numerical stability around 0.
	 * arcHav(x) == acos(1 - 2 * x) == 2 * asin(sqrt(x)). The argument must be
	 * in [0, 1], and the result is positive.
	 */
	public static arcHav(x: number): number {
	  return 2 * Math.asin(Math.sqrt(x));
	}

	/**
	 * Returns hav() of distance from (lat1, lng1) to (lat2, lng2) on the unit
	 * sphere.
	 */
	public static havDistance(lat1: number, lat2: number, dLng: number): number {
	  return this.hav(lat1 - lat2) + this.hav(dLng) * Math.cos(lat1) * Math.cos(lat2);
	}

	/**
	 * Returns distance on the unit sphere; the arguments are in radians.
	 */
	public static distanceRadians(latitude1: number, longitude1: number,
		latitude2: number, longitude2: number): number {
	  return this.arcHav(this.havDistance(latitude1, latitude2, longitude1 - longitude2));
	}

	public static toRadians(angdeg: number): number {
		return angdeg / 180.0 * Math.PI;
	}

	public static toDegrees(angrad: number): number {
		return angrad * 180.0 / Math.PI;
	}

	public static wrap(n: number, min: number, max: number): number {
		return (n >= min && n < max) ? n : (this.mod(n - min, max - min) + min);
	}

	public static mod(x: number, m: number): number {
		return ((x % m) + m) % m;
	}
		
	/**
	 * Returns the angle between two LatLngs, in radians. This is the same as
	 * the distance on the unit sphere.
	 */
	public static computeAngleBetween(
			from: { latitude: number; longitude: number },
			to: { latitude: number; longitude: number }): number {
		return this.distanceRadians(this.toRadians(from.latitude), this.toRadians(from.longitude),
				this.toRadians(to.latitude), this.toRadians(to.longitude));
	}
	
	/** 
	 * Tính khoảng cách giữa 2 điểm 
	 * Returns the distance between two LatLngs, in meters.
	 * */
	public static computeDistanceBetween(
	  from: { latitude: number; longitude: number },
	  to: { latitude: number; longitude: number }
	): number {
		// return Math.ceil(this.computeAngleBetween(currentLocation, lastMoveLocation) * this.EARTH_RADIUS);
		return this.computeAngleBetween(from, to) * this.EARTH_RADIUS;
	}

	public static isBetweenLatlng(currentLocation: LatLng, lastMoveLocation: LatLng): boolean {
		if(Utils.isOriginLocation(currentLocation) || Utils.isOriginLocation(lastMoveLocation)){
			return true;
		}

		const MIN_DELTA_LATLNG_CAN_MOVE = 0.0002;
		let deltaLat = Math.abs(currentLocation.latitude - lastMoveLocation.latitude);
		let deltaLng = Math.abs(currentLocation.longitude - lastMoveLocation.longitude);

		return deltaLat <= MIN_DELTA_LATLNG_CAN_MOVE && deltaLng <= MIN_DELTA_LATLNG_CAN_MOVE;
		// if (deltaLat > MIN_DELTA_LATLNG_CAN_MOVE || deltaLng > MIN_DELTA_LATLNG_CAN_MOVE) {
		// 		return false;
		// }
		// return true;
	}
}

export default SphericalUtil;