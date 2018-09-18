/**
 * Bảng giá của từng loại xe
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class Price {
	// Id bảng giá
	public priceId: number;

	// Id công ty
	public companyId: number;

	// Danh sách loại xe
	public vehicleTypes: Array<number> = [];

	public priceApplyDate: number;

	public priceEndDate: number;

	/* Công thức theo bước nhảy cũ */
	public priceFormula: string;

	public downPercent2ways: number;

	public beginKm2Ways: number;

	/* Công thức cũ không dùng nữa */
	public priceFormulaJson: string;

	public priceJson: string;

	public isVehicleTypesV2(carTypeID: number): boolean {
		let listCartypeID = this.vehicleTypes;
		for (let i = 0; i < listCartypeID.length; i++) {
			if (carTypeID == listCartypeID[i]) {
				return true;
			}
		}
		return false;
	}
}

export default Price;