/**
 * Thông tin công ty
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class Company {
	// Id công ty
	public companyId: number;

	// Tên công ty
	public name: string;

	// Tên thương hiệu
	public reputation: string;

	// Số điện thoại
	public phone: string;

	// Logo công ty
	public logo: string;

	// Mã tỉnh
	public provinceId: number;

	// Địa chỉ công ty
	public address: string;

	/* Hãng cha */
	public parentId: number;

	/* Key */
	public companyKey: number;

	/* Vị trí văn phòng hãng */
	public lat: number;

	/* Vị trí văn phòng hãng */
	public lng: number;

	public taxiType: string;

	/* Mã xí nghiệp */
	public xnCode: number;

	/* Link ảnh công ty */
	public logoLink: string;

	/* Tên công ty */
	public displayName: string;
}

export default Company;