import Price from '../bo/Price';
import { SQLiteUtils } from '../../../module';
import { ResultSet } from 'react-native-sqlite-storage';
import BaseDAO from '../../../module/sql/BaseDAO';

/**
 * Quản lý bảng giá
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class PriceDAO extends BaseDAO{
	public static TABLE = 'PriceTable';
	public static ID_COLUMN = 'PriceListID';
	public static COMPANY_ID_COLUMN = 'CompanyID';
	public static LIST_VEHICLE_TYLE_COLUMN = 'ListVehicleTypes';
	public static PRICE_APPLY_DATE_COLUMN = 'PriceApplyDate';
	public static PRICE_END_DATE_COLUMN = 'PriceEndDate';
	public static PRICE_FORMULA_COLUMN = 'PriceFormula';
	public static DOWN_PERCENT_WAYS_COLUMN = 'DownPercent2ways';
	public static BEGIN_KM_WAYS_COLUMN = 'BeginKm2Ways';
	public static PRICE_FORMULA_JSON = 'PriceFormulaJson';
	public static PRICE_FORMULA_NEW = 'PriceJson';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${PriceDAO.TABLE} (
                ${PriceDAO.ID_COLUMN} INTEGER ,
                ${PriceDAO.COMPANY_ID_COLUMN} VARCHAR(50),
                ${PriceDAO.LIST_VEHICLE_TYLE_COLUMN} VARCHAR,
                ${PriceDAO.PRICE_APPLY_DATE_COLUMN} VARCHAR(15),
                ${PriceDAO.PRICE_END_DATE_COLUMN} VARCHAR(30),
                ${PriceDAO.PRICE_FORMULA_COLUMN} INTEGER,
                ${PriceDAO.DOWN_PERCENT_WAYS_COLUMN} VARCHAR(150),
				${PriceDAO.BEGIN_KM_WAYS_COLUMN} INTEGER,
				${PriceDAO.PRICE_FORMULA_JSON} VARCHAR,
				${PriceDAO.PRICE_FORMULA_NEW} VARCHAR);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${PriceDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	// Lấy tất cả dữ liệu đã lưu
	public static async getPrices(): Promise<Array<Price>> {
		try {
			var prices: Array<Price> = new Array<Price>();
			let sql = `SELECT * FROM ${this.TABLE}`;
			console.log(sql);
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			let price;
			for (let i = 0; i < resultSet.rows.length; i++) {
				price = new Price();
				let row = resultSet.rows.item(i);
				price.priceId = this.getInt(row, PriceDAO.ID_COLUMN);
				price.companyId = this.getInt(row, PriceDAO.COMPANY_ID_COLUMN);
				let listVehicle = row[PriceDAO.LIST_VEHICLE_TYLE_COLUMN];
				if(listVehicle){
					(price.vehicleTypes = JSON.parse(row[PriceDAO.LIST_VEHICLE_TYLE_COLUMN]));
				}
				(price.priceApplyDate = row[PriceDAO.PRICE_APPLY_DATE_COLUMN]);
				(price.priceEndDate = row[PriceDAO.PRICE_END_DATE_COLUMN]);
				(price.priceFormula = row[PriceDAO.PRICE_FORMULA_COLUMN]);
				(price.downPercent2ways = row[PriceDAO.DOWN_PERCENT_WAYS_COLUMN]);
				(price.beginKm2Ways = row[PriceDAO.BEGIN_KM_WAYS_COLUMN]);
				(price.priceFormulaJson = row[PriceDAO.PRICE_FORMULA_JSON]);
				(price.priceJson = row[PriceDAO.PRICE_FORMULA_NEW]);
				prices.push(price);
			}
			return Promise.resolve(prices);
		} catch (error) {
			return Promise.resolve([]);
		}
	}
}

export default PriceDAO;