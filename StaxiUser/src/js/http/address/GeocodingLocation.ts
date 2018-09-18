import { LatLng, Utils } from '../../../module';
import BAAddress from '../../model/BAAddress';
import { AddressRequestType } from '../../viewmodel/search/SearchParams';
import STRINGS from '../../../res/strings';
import BAGeocodingRequest from './BAGeocodingRequest';
import BAAddressSerialize from '../../../module/js-serialize/serialize/BAAddressSerialize';
import { requestByObject, MethodName } from '../HttpHelper';
import LogFile from '../../../module/LogFile';

export default class GeocodingLocation {

  private log(msg: String) {
    LogFile.e(msg);
  }

  public geocodingFromLatLng(location: LatLng, googleKey: string, isRequestBA?: AddressRequestType): Promise<BAAddress> {
    // kiểm tra loại request
    let requestType: AddressRequestType = isRequestBA == undefined ? AddressRequestType.GOOGLE : isRequestBA;
    if (requestType == AddressRequestType.BINH_ANH) {
      return this.requestGeocodingToBAServer(1, location);
    } else {
      return this.requestGeocodingToGoogleServer(1, location, googleKey);
    }
  }

  private async requestGeocodingToBAServer(requestID: number, latlng: LatLng, ): Promise<BAAddress> {
    this.log('Request địa chỉ tới BA');

    let request = new BAGeocodingRequest();
    request.location.setValue(latlng);

    try {
      let addressInfo: BAAddressSerialize = await requestByObject(MethodName.GetAddress,
        request, new BAAddressSerialize());

      // Bỏ qua nếu không phải response của request mới nhất
      // if (requestID !== this.requestState.idRequest) {
      //   return Promise.reject(new Error(GeocodingError.DIFF_ID));
      // }

      if (Utils.isNull(addressInfo)) {
        return Promise.reject(new Error(GeocodingError.NO_RESULT));
      }

      try {
        let baAddress = new BAAddress();

        if (addressInfo.number.value > 0) {
          // Nếu có số nhà: số nhà, đường, quận
          baAddress.formattedAddress = [`${STRINGS.search_address_number} ${addressInfo.number.value}`, addressInfo.roadName.value, addressInfo.district.value].join(', ');
        } else if (!Utils.isEmpty(addressInfo.roadName.value)) {
          // Nếu có tên đường: đường, xã, huyện
          baAddress.formattedAddress = `${addressInfo.roadName.value}, ${addressInfo.commueName.value}, ${addressInfo.district.value}`;
        } else {
          // Xã
          baAddress.formattedAddress = `${addressInfo.commueName.value}`;

          // huyện
          if (!Utils.isEmpty(addressInfo.district.value)) {
            baAddress.formattedAddress += `, ${addressInfo.district.value}`;
          }

          // tỉnh
          if (!Utils.isEmpty(addressInfo.province.value)) {
            baAddress.formattedAddress += `, ${addressInfo.province.value}`;
          }
        }

        // lấy location
        baAddress.location = new LatLng(latlng.latitude, latlng.longitude);

        return Promise.resolve(baAddress);
      } catch (error) {
        return Promise.reject(new Error(GeocodingError.NO_RESULT));
      }
    } catch (error) {
      // if (requestID === this.requestState.idRequest) {
        return Promise.reject(new Error(GeocodingError.NO_RESULT));
      // } else {
      //   return Promise.reject(new Error(GeocodingError.DIFF_ID));
      // }
    }
  }

  private async requestGeocodingToGoogleServer(requestID: number, latlng: LatLng, googleKey: string): Promise<BAAddress> {
    this.log('Request địa chỉ tới GOOGLE');
    
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleKey}&latlng=${latlng.latitude},${latlng.longitude}`;

    try {
      let result = await fetch(URL);
      let jsonData = await result.json();
      let response = jsonData.results;

      // Bỏ qua nếu không phải response của request mới nhất
      // if (requestID !== this.requestState.idRequest) {
      //   return Promise.reject(new Error(GeocodingError.DIFF_ID));
      // }

      if (Utils.isNull(response) || response.length <= 0) {
        return Promise.reject(new Error(GeocodingError.NO_RESULT));
      }

      // Lấy địa chỉ chính xác nhất trong tập địa chỉ
      let addressJson = response[0];

      let baAddress = new BAAddress();
      // Lấy text địa chỉ - lấy 3 thông tin đầu
      if (
        addressJson.address_components &&
        addressJson.address_components.length > 2
      ) {
        for (let i = 0; i < 3; i++) {
          baAddress.formattedAddress +=
            addressJson.address_components[i].long_name;
          if (i < 2) {
            baAddress.formattedAddress += ', ';
          }
        }
      } else {
        baAddress.formattedAddress = addressJson.formatted_address;
      }

      // lấy location
      baAddress.location = new LatLng(latlng.latitude, latlng.longitude);

      return Promise.resolve(baAddress);
    } catch (error) {
      // if (requestID === this.requestState.idRequest) {
        return Promise.reject(new Error(GeocodingError.NO_RESULT));
      // } else {
      //   return Promise.reject(new Error(GeocodingError.DIFF_ID));
      // }
    }
  }
}

export enum GeocodingError {
  NO_RESULT = 'NO_RESULT',
  DIFF_ID = 'DIFF_ID'
}
