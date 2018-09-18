import { CarNear } from "../../../http/carnear/CarNearResponse";
import CarNearController from "../../../http/carnear/CarNearController";
import { LatLng } from "../../../..";
import ActionsManagerWrapper from "../../../../module/utils/ActionsManagerWrapper";

/**
 * Thực hiện request xe xung quanh vị trí đặt xe
 * @author Đv Hiện
 * Created on 30/07/2018
 */
class NearCarRealtime {
	public nearCarRequest: NearCarRequest;

	/* Cờ trạng thái ngắt quá trình request xe */
	private disableFetch: boolean = false;

	/* Timer tìm xe xung quanh */
	private realtimeNearCar;

	/* Timer delay reqest */
	private callback: (n: Array<CarNear>) => any;

	/** Đối tượng quản lý stack request near car */
	private mActionsManagerWrapper: ActionsManagerWrapper;

	constructor() {
		this.mActionsManagerWrapper = new ActionsManagerWrapper();
	}

	/* Cập nhật lại param request xe xung quanh */
	public setCarNearRequest = (nearCarRequest: NearCarRequest) => {
		this.nearCarRequest = nearCarRequest;
	};

	/* Bắt đâu thực hiện request xe xung quanh */
	public componentDidMount(callback: (n: Array<CarNear>) => any) {
		this.fetchNearCar(callback);
	}

	/* Thực hiện khi component bị hủy */
	public componentWillUnmount() {
		this.destroy();
	}

	/* Request xe xung quanh */
	public fetchNearCar(callback: (n: Array<CarNear>) => any) {
		//timer đang chạy thì bỏ qua
		if (this.nearCarRequest == undefined) return;

		// Xóa các action delay cũ trước khi bắt đầu mới
		this.clearEveryThings();

		this.callback = callback;

		// Chạy lần đầu
		this.request(callback);

		//bắt đầu realtime
		this.realtimeNearCar = setInterval(() => {
			this.request(callback);
		}, 5000);
	}

	/**
	 * request lấy realtime
	 * @param callback
	 */
	private request(callback: (n: Array<CarNear>) => any) {
		if (this.disableFetch || callback == undefined) {
			this.clearActionsStack();
			return;
		}

		// console.log("request %%%%%%%%%%%%%%%%", this.nearCarRequest);
		// Gán request action vào class quản lý
		this.mActionsManagerWrapper.doAction(() => {
			return CarNearController.requestCarnear(this.nearCarRequest.currentLocation, this.nearCarRequest.vehicleId, 
				this.nearCarRequest.companyKey, [], [], this.nearCarRequest.routeId, 0);
		}, (err, _carNears: Array<CarNear>) => {
			// nếu đang bật cờ dừng request near car thì không xử lý response này, xóa các action trong stack
			if (this.disableFetch) {
				this.clearActionsStack();
				return;
			}

			callback(_carNears);
		});
	}

	/** Dừng timer định kỳ realtime */
	private clearTimeIntervalRequest() {
		if (this.realtimeNearCar) {
			clearInterval(this.realtimeNearCar);
			this.realtimeNearCar = null;
		}
	}

	/** Xóa request action đã lưu */
	private clearActionsStack() {
		if (this.mActionsManagerWrapper) {
			this.mActionsManagerWrapper.removeAction();
		}
	}

	private clearEveryThings() {
		this.clearTimeIntervalRequest();
		this.clearActionsStack();
	}

	/* Ngắt request xe xung quanh */
	public destroy = () => {
		this.disableFetch = true;
		this.clearEveryThings();
	};

	/* Pause request xe xung quanh */
	public pause = () => {
		this.disableFetch = true;
	};

	/* Resume request xe xung quanh */
	public resume = () => {
		this.disableFetch = false;
	};

	/* Retry request xe cung quanh */
	public retry = () => {
		this.request(this.callback);
	};
}

export default NearCarRealtime;

export class NearCarRequest {
	public currentLocation: LatLng;
	public vehicleId: number;
	public companyKey: number;
	public routeId: number;
}
