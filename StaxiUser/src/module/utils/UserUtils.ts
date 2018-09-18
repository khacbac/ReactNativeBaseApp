import Landmark from "../../js/sql/bo/Landmark";
import MapUtils from "../maps/MapUtils";
import Utils from "../Utils";

/**
 * Các hàm tiện ích cho app Khách hàng
 * @author Đv Hiện
 * Created on 07/08/2018
 */
export default class UserUtils {
    public static formatMoney(money: number): string {
        let moneyStr = money.toString();

        if (money <= 0) {
            return moneyStr = "0";
        }

        let moneyArr = [];
        while (moneyStr.length > 3) {
            moneyArr.push([",", moneyStr.slice(moneyStr.length - 3)].join(''));
            moneyStr = moneyStr.slice(0, moneyStr.length - 3);
        }
        moneyArr.push(moneyStr);

        return moneyArr.reverse().join('');
    }

    public static formatMoneyToK(money: number): string {
        return [Math.round(money / 1000), "K"].join('');
    }

    public static formatDistance(distance: number): string {
        let distanceStr: string = "";
        if (distance > 1000) {
            let dt = (distance / 1000).toFixed(1);
            distanceStr = dt + " km";
        } else {
            distanceStr = "0.1 km";
        }

        return distanceStr;
    }

    /* Thời gian ước lượng từ xe đến vị trí người dùng */
    public static timeEstimatesNearCar(minDistance: number, landmark: Landmark): number {
        if (minDistance == 0) { return 0 };
        // Gán mặc định nếu không tìm được vùng
        if (landmark == null || landmark != null && landmark.distanceMultiplier == undefined) {
            landmark = new Landmark();
            landmark.averageSpeed = 30;
            landmark.distanceMultiplier = 1.2;
            landmark.additionTime = 90;
        }
        // Tính khoảng cách
        var distance = minDistance * landmark.distanceMultiplier;
        // Tính thời gian
        var time: number = (distance * 60 * 60 / (landmark.averageSpeed * 1000))
            + landmark.additionTime;
        if (time <= 60) {
            time = 60;
        }
        return Math.floor(time);
    }

    /* Khoảng cách gần nhất từ A -> B */
    public static minDistanceAtoB(
        startP: { latitude: number; longitude: number },
        endP: { latitude: number; longitude: number }
    ): number {
        var minDistance: number = MapUtils.calculationByDistance(
            startP,
            endP)
            * MapUtils.RATIO_DISTANCE;
        if (minDistance <= MapUtils.MAX_DISTANCE_FOR_USER) {
            minDistance = MapUtils.MAX_DISTANCE_FOR_USER;
        }
        return minDistance;
    }

    /* Thời gian ước lượng từ xe đến vị trí người dùng */
    public static timeEstimatesViewCar(minDistance: number,
        landmark: Landmark): string {
        return Utils.formatLabelTime(UserUtils.timeEstimatesNearCar(minDistance,
            landmark) + 30);
    }

    public static formatFieldTime(field: number): string {
        // nếu nhỏ hơn 0 thì gán về 0
        if (field < 0)
            field = 0;
        // nếu nhỏ hơn 10
        if (field < 10) {
            return "" + field;
        }
        return "" + field;
    }

    /* Định dạng thời gian theo dạng 0 \nphút */
    public static formatTimeForTitleMarker(totalSecond: number): string {
        if (totalSecond == 0) { return "" }
        var estMinute = (totalSecond % 3600) / 60;
        if (estMinute <= 1) {
            estMinute = 1;
        }
        return this.formatFieldTime(Math.floor(estMinute));
    }
}