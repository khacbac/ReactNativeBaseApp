import { VehicleWithPrice, CalcPriceResponse } from './CalcPriceResponse';
import CalcPriceRequest from './CalcPriceRequest';
import { LatLng, DfInteger } from "../../../module";
import { requestByObject } from "../HttpHelper";
import MethodName from "../MethodName";

/**
 * Xử lý dữ liệu ước lượng lộ trình, giá
 * @author Đv Hiện
 * Created on 13/07/2018
 */
export default class CalcPriceController {
  /* Thực hiện request xe xung quanh */
  public static async estimateRequest(
    srcLocation: LatLng,
    dstLocation: LatLng,
    companyId: number,
    carTypeId: number,
    promotionCode: string,
    phoneNumber: string
  ): Promise<CalcPriceResponse> {
    let request = new CalcPriceRequest();

    request.srcLocation.setValue(srcLocation);
    request.dstLocation.setValue(dstLocation);
    request.companyId.setValue(companyId);
    request.carType.setValue(carTypeId);
    request.requestType.setValue(0);
    request.promotionCode.setValue(promotionCode);
    request.phoneNumber.setValue(phoneNumber);

    console.log('CalcPriceController------------------------------------------');

    // Thực hiện request
    try {
      let response: CalcPriceResponse = await requestByObject(
        MethodName.CalcPrice,
        request,
        new CalcPriceResponse()
      );
      // console.log(store);

      // console.log("response------------------------------------------");
      console.log(response);

      return Promise.resolve(response);
    } catch (error) {
      console.log("requestEstimate ===========", error.message || error);
      // Alert.alert("Kết nối đến server quá lâu" + (error.message || error));
      return Promise.reject(error);
    }
  }
}
