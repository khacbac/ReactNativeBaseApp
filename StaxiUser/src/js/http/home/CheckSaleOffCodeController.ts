import CheckSaleOffCodeRequest from "./CheckSaleOffCodeRequest";
import BookTaxiModel from "../../viewmodel/booking/BookTaxiModel";
import User from "../../sql/bo/User";
import { DfInteger, DfString } from "../../../module";
import CheckSaleOffCodeReponse from "./CheckSaleOffCodeReponse";
import { requestByObject } from "../HttpHelper";
import MethodName from "../MethodName";

/**
 * Kiểm tra mã khuyến mại
 * 
 * @author BacHK.
 */
export default class CheckSaleOffCodeHandler {
	/**
	 * Gửi thông tin id hãng và mã khuyến mại
	 * 
	 * @des password
	 */
	public static async verifySaleCode(
		model: BookTaxiModel,
		promoCode: string,
		user: User
	): Promise<CheckSaleOffCodeReponse> {
		let checkSaleModel = new CheckSaleOffCodeRequest();
		checkSaleModel.companyID.setValue(model.company.companyKey);
		checkSaleModel.promoCode.setValue(promoCode);
		checkSaleModel.userName.setValue(user.phone);
		checkSaleModel.password.setValue(user.password);
		checkSaleModel.carType.setValue(model.getVehicleType().vehicleId);
		checkSaleModel.routeID.setValue(model.getVehicleType().type);
		checkSaleModel.currenLocation.setValue(model.srcAddress.location);

		console.log("checkSaleModel ---> ", checkSaleModel);

		// Thực hiện request
		try {
			let response: CheckSaleOffCodeReponse = await requestByObject(
				MethodName.CheckSaleOffCode,
				checkSaleModel,
				new CheckSaleOffCodeReponse()
			);
			console.log("response------------------------------------------> ", response);

			return Promise.resolve(response);
		} catch (error) {
			console.log("requestEstimate ===========", error.message || error);
			return Promise.reject(error);
		}
	}

}
