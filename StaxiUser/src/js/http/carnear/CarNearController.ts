import { CarNear, CarNearResponse } from "./CarNearResponse";
import CarNearRequest from "./CarNearRequest";
import {DfInteger } from "../../../module";
import { requestByObject } from "../HttpHelper";
import MethodName from "../MethodName";

/**
 * Lấy xe xung quanh vị trí khách hàng, thực hiện định kỳ 5s 
 * @author Đv Hiện
 * Created on 10/07/2018
 */
export default class CarNearController {
  /* Thực hiện request xe xung quanh */
  public static async requestCarnear(
    latLng: {latitude: number; longitude: number},
    carTypeId: number,
    companyId: number,
    companyIdsFavorite: Array<number>,
    companyIdsDeny: Array<number>,
    routerId: number,
    isOnlyFavorite: number
  ): Promise<Array<CarNear>> {
    let request = new CarNearRequest();
    request.currentLocation.setLatLng(latLng.latitude, latLng.longitude);
    request.carTypeId.setValue(carTypeId);
    request.companyId.setValue(companyId);
    if(companyIdsFavorite){
      companyIdsFavorite.forEach(value=>{
        request.companyIdsFavorite.putValue(new DfInteger(value));
      })
    }

    if(companyIdsDeny){
      companyIdsDeny.forEach(value=>{
        request.companyIdsDeny.putValue(new DfInteger(value));
      })
    }
    request.routerId.setValue(routerId);
    request.isOnlyFavorite.setValue(isOnlyFavorite);

    // Thực hiện request
    // console.log('==============carNearsParam===================', request);
    try {
      let response: CarNearResponse = await requestByObject(
        MethodName.GetNearCars,
        request,
        new CarNearResponse()
      );
      // console.log(store);

      // console.log("response------------------------------------------");
      // console.log(response);

      return Promise.resolve(response.carNears.value);
    } catch (error) {
      // console.log("requestCarnear ===========", error.message || error);
      // Alert.alert("Kết nối đến server quá lâu" + (error.message || error));
      return Promise.reject(error);
    }
  }
}
