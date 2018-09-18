import { LatLng, Utils } from "../../../module";
import AddressItem from "../../viewmodel/search/autocomplete/AddressItem";
import BAAddress from "../../model/BAAddress";

export default class GoogleAutocompleteController {

  public static requestNearAddress(requestID: number, latlng: LatLng, googleKey: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlng.latitude},${latlng.longitude}
        &key=${googleKey}&rankby=distance&types=address`;

        fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return response.json();
        })
        .then((jsonData) => {

            let results = jsonData.results;
            let arrDataTemp = [];
            for(let index = 0; index < results.length; index++) {
                let item = results[index];
      
                let addressItem = new AddressItem();
                addressItem.id = item.id;
                addressItem.name = item.name;
                addressItem.formattedAddress = item.vicinity;
                addressItem.placeID = item.place_id;
                let geometry = item.geometry;
                addressItem.location = new LatLng(geometry.location.lat, geometry.location.lng);
                addressItem.type = AddressItem.NEAR_BY;
                
                arrDataTemp.push(addressItem);
            }

            resolve({requestID: requestID, response: arrDataTemp});
        })
        .catch((err) => {
            reject({requestID: requestID, error: err});
        });
    });
  }
  
  public static requestAutoComplete(
    requestID: number,
    latlng: LatLng,
    googleKey: string, 
    searchText: string,
  ): Promise<any> {
    return new Promise(function(resolve, reject) {
        
        let URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${googleKey}&rankby=distance&types=geocode&language=vi&radius=10000&input=${searchText}`;
        if (!Utils.isOriginLocation(latlng)) {
            URL += `&location=${latlng.latitude},${latlng.longitude}`;
        }

        fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return response.json();
        })
        .then((jsonData) => {
                let arrDataTemp = [];
                let results = jsonData.predictions;
                // lấy data từ server
                for(let index = 0; index < results.length; index++) {
                    let item = results[index];
        
                    let temp = new AddressItem();
                    temp.id = item.id;
                    temp.name = item.description;
                    temp.formattedAddress = "";
                    temp.placeID = item.place_id;
                    temp.type = AddressItem.GOOGLE;
                    
                    arrDataTemp.push(temp);
                }

            resolve({requestID: requestID, response: arrDataTemp});
        })
        .catch((err) => {
            reject({requestID: requestID, error: err});
        });
    });
  }
  
  public static getDetailAddressInfoV2(
    googleKey: string, 
    placeID: string,
  ): Promise<BAAddress> {
    return new Promise(function(resolve, reject) {
        
        const URL = `https://maps.googleapis.com/maps/api/place/details/json?key=${googleKey}&placeid=${placeID}&language=vi`;

        fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

            return response.json();
        })
        .then((jsonData) => {
            let result = jsonData.result;

            let baAddress = new BAAddress();
            baAddress.name = result.name;
            baAddress.formattedAddress = result.formatted_address;
            baAddress.location = new LatLng (
                result.geometry.location.lat,
                result.geometry.location.lng
            );

            resolve(baAddress);
        })
        .catch((err) => {
            reject(err);
        });
    });
  }
}
