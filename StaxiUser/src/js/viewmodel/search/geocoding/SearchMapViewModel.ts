import { ISearchMapPresenter } from "./ISearchMapPresenter";
import SearchParams, { AddressRequestType } from "../SearchParams";
import FocusAddress from "../FocusAddress";
import BAAddress from "../../../model/BAAddress";
import { LatLng, Utils, ToastModule } from "../../../../module";
import GeocodingLocation, { GeocodingError } from "../../../http/address/GeocodingLocation";
import MapView from "react-native-maps";
import IMAGES from "../../../../res/images";
import ActionsManagerWrapper from "../../../../module/utils/ActionsManagerWrapper";

export default class SearchMapViewModel {
    public static REQUEST_GEOCODING_TIMEOUT: number = 1000;
    private ANIMATION_MOVE_MAP_DURATION: number = 500;

    protected mPresenter: ISearchMapPresenter;

    private mGeocodingLocation: GeocodingLocation;
    
    protected GOOGLE_KEY: string;
    
    protected searchParams: SearchParams;
    
    /** loại địa chỉ */
    protected initFocusAddress: FocusAddress;

    protected initMapLocation: LatLng;

    /** bán kính tìm kiếm */
    protected radius: number;

    /** Thông tin điểm đi */
    protected srcAddress: BAAddress;

    /** Thông tin điểm đến */
    protected dstAddress: BAAddress;

    /** vị trí gps */
    protected gpsLatLng: LatLng;

    /** loại api tìm kiếm */
    protected requestAddressType: AddressRequestType;

    /** Đối tượng xử lý action request lấy địa chỉ trên map */
    private mActionsManagerWrapper: ActionsManagerWrapper;

    constructor(presenter: ISearchMapPresenter, searchParams: SearchParams, GOOGLE_KEY: string) {
        this.mPresenter = presenter;

        // Lấy các giá trị trong search param
        this.initSearchParam(searchParams);

        this.GOOGLE_KEY = GOOGLE_KEY;
        this.mGeocodingLocation = new GeocodingLocation();
        this.mActionsManagerWrapper = new ActionsManagerWrapper();
    }

    public initSearchParam(searchParams: SearchParams) {
        this.searchParams = searchParams;

        this.initFocusAddress = this.searchParams.focusAddress;

        this.radius = this.searchParams.radius;

        this.srcAddress = this.searchParams.srcAddress;

        this.dstAddress = this.searchParams.dstAddress;

        this.requestAddressType = this.searchParams.requestType;

        this.gpsLatLng = this.searchParams.gpsLatLng

        if (Utils.isNull(this.gpsLatLng) || Utils.isOriginLocation(this.gpsLatLng)) {
            // nếu tọa độ khởi tạo không có hoặc (0, 0) thì khởi tạo tọa độ mặc định
            this.gpsLatLng = new LatLng(21.028998, 105.852492); // hồ gươm
        }

        if (this.initFocusAddress === FocusAddress.A_FOCUS) {
            this.initMapLocation = this.srcAddress.location;
        } else {
            this.initMapLocation = this.dstAddress.location;
        }
      
        // nếu tọa độ khởi tạo không có hoặc (0, 0) thì khởi tạo tọa độ mặc định
        if (Utils.isNull(this.initMapLocation) || Utils.isOriginLocation(this.initMapLocation)) {
            if  (Utils.isNull(this.gpsLatLng) || Utils.isOriginLocation(this.gpsLatLng)) {
                this.initMapLocation = new LatLng(21.028998, 105.852492); // hồ gươm
            } else {
                this.initMapLocation = new LatLng(this.gpsLatLng.latitude, this.gpsLatLng.longitude); // gps
            }
        }
    }

    public getRequestAddressTypeParam(): AddressRequestType {
        return this.requestAddressType;
    }

    public getInitMapLocation(): LatLng {
        return this.initMapLocation;
    }

    public getGpsLatLngParam(): LatLng {
        return this.gpsLatLng;
    }

    public getRadiusParam(): number {
        if (this.radius <= 0) return SearchParams.DEFAULT_RADIUS_VALUE;

        return this.radius;
    }

    public getFocusAddress(): FocusAddress {
        return this.initFocusAddress;
    }

    /** Lấy marker center resource */
    public getImageCenterSource() {
        if (this.getFocusAddress() === FocusAddress.A_FOCUS) {
            return IMAGES.ic_marker_start_uri;
        }

        return IMAGES.ic_marker_end_uri;
    }

    /** Move map về vị trí gps */
    public moveToGPSLocation(mapView: MapView) {
        try {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                let tempCoords = {
                    latitude: Number(position.coords.latitude),
                    longitude: Number(position.coords.longitude)
                }
                
                // animation move to coordinate
                mapView.animateToCoordinate(tempCoords, this.ANIMATION_MOVE_MAP_DURATION);
            }, error => {
                //Alert.alert("Lỗi: " + error)
                this.mPresenter.onGetGPSLocationError();
            }, );
        } catch(error) {
            this.mPresenter.onGetGPSLocationError();
        }
    }

    /**
     * Hiển thị toast message
     * @param {*} msg
     */
    public showToastMsg(msg) {
        ToastModule.show(msg);
    }

    /** Xử lý request địa chỉ geocoding */
    public onRegionChangeComplete(region) {
        let requestCoordinate: LatLng = new LatLng(region.latitude, region.longitude);
        this.mActionsManagerWrapper.doAction(() => this.requestGeocoding(requestCoordinate),  
            (error, baAddress?) => {
                // console.log('onRegionChangeComplete - cập nhật UI cho requestID: ' + this.actionStackWrapper.getCurrentRequestID());
                if (baAddress) {
                    this.mPresenter.updateAddress(baAddress, requestCoordinate);
                } else {
                    // nếu khác ID thì bỏ qua
                    if (error.message == GeocodingError.DIFF_ID) {
                        return;
                    }
            
                    this.mPresenter.updateAddress(null, requestCoordinate);
                };
            }
        );
    }

    private requestGeocoding(requestCoordinate) {
        return this.mGeocodingLocation.geocodingFromLatLng(requestCoordinate, this.GOOGLE_KEY, this.requestAddressType);
    }
}