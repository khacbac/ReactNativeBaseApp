import Company from "../bo/Company";
import { SQLiteUtils } from "../../../module";
import { ResultSet } from "react-native-sqlite-storage";
import LogFile from "../../../module/LogFile";

/**
 * Quản lý bảng công ty
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class CompanyDAO {
	public static TABLE = 'CompanyTable';
	public static ID_COLUMN = 'companyId';
	public static NAME_COLUMN = 'name';
	public static REPUTATION_COLUMN = 'reputation';
	public static PHONE_COLUMN = 'phone';
	public static LOGO_COLUMN = 'logo';
	public static PROVINCE_ID_COLUMN = 'provinceId';
	public static ADDRESS_COLUMN = 'address';
	public static PARENT_ID_COLUMN = 'parentId';
	public static COMPANY_KEY = 'companyKey';
	public static LAT_COLUMN = 'lat';
	public static LNG_COLUMN = 'lng';
	public static TAXI_TYPE_COLUMN = 'taxiType';
	public static XN_CODE_COLUMN = 'xnCode';
	public static LOGO_LINK_COLUMN = 'logoLink';
	public static DISPLAY_NAME_COLUMN = 'displayName';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${CompanyDAO.TABLE} (
                ${CompanyDAO.ID_COLUMN} INTEGER ,
                ${CompanyDAO.NAME_COLUMN} VARCHAR(50),
                ${CompanyDAO.REPUTATION_COLUMN} VARCHAR(50),
                ${CompanyDAO.PHONE_COLUMN} VARCHAR(15),
                ${CompanyDAO.LOGO_COLUMN} VARCHAR(30),
                ${CompanyDAO.PROVINCE_ID_COLUMN} INTEGER,
                ${CompanyDAO.ADDRESS_COLUMN} VARCHAR(150),
				${CompanyDAO.PARENT_ID_COLUMN} INTEGER,
				${CompanyDAO.COMPANY_KEY} INTEGER,
                ${CompanyDAO.LAT_COLUMN} FLOAT,
                ${CompanyDAO.LNG_COLUMN} FLOAT,
                ${CompanyDAO.TAXI_TYPE_COLUMN} VARCHAR,
                ${CompanyDAO.XN_CODE_COLUMN} VARCHAR(30),
                ${CompanyDAO.LOGO_LINK_COLUMN} VARCHAR,
                ${CompanyDAO.DISPLAY_NAME_COLUMN} VARCHAR(100));`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${CompanyDAO.TABLE}`;
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<Company> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${CompanyDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let company;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						company = new Company();
						(company.companyId = row[CompanyDAO.ID_COLUMN]),
						(company.name = row[CompanyDAO.NAME_COLUMN]),
						(company.reputation = row[CompanyDAO.REPUTATION_COLUMN]),
						(company.phone = row[CompanyDAO.PHONE_COLUMN]),
						(company.logo = row[CompanyDAO.LOGO_COLUMN]),
						(company.provinceId = row[CompanyDAO.PROVINCE_ID_COLUMN]),
						(company.address = row[CompanyDAO.ADDRESS_COLUMN]),
						(company.parentId = row[CompanyDAO.PARENT_ID_COLUMN]),
						(company.companyKey = row[CompanyDAO.COMPANY_KEY]),
						(company.lat = row[CompanyDAO.LAT_COLUMN]),
						(company.lng = row[CompanyDAO.LNG_COLUMN]),
						(company.taxiType = row[CompanyDAO.TAXI_TYPE_COLUMN]),
						(company.xnCode = row[CompanyDAO.XN_CODE_COLUMN]),
						(company.logoLink = row[CompanyDAO.LOGO_LINK_COLUMN]),
						(company.displayName = row[CompanyDAO.DISPLAY_NAME_COLUMN]);
					}

					resolve(company);
				})
				.catch(() => {
					resolve(new Company());
				});
		});
	};

	// Lấy tất cả dữ liệu đã lưu
    public static async getCompanys(): Promise<Map<number, Company>> {
		let companys: Map<number, Company> = new Map<number, Company>();
        try {
            let sql = `SELECT * FROM ${this.TABLE}`;
            console.log(sql);
            let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
            let company:Company;
			for (let i = 0; i < resultSet.rows.length; i++) {
				company = new Company();
				let row = resultSet.rows.item(i);
				(company.companyId = row[CompanyDAO.ID_COLUMN]),
				(company.name = row[CompanyDAO.NAME_COLUMN]),
				(company.reputation = row[CompanyDAO.REPUTATION_COLUMN]),
				(company.phone = row[CompanyDAO.PHONE_COLUMN]),
				(company.logo = row[CompanyDAO.LOGO_COLUMN]),
				(company.provinceId = row[CompanyDAO.PROVINCE_ID_COLUMN]),
				(company.address = row[CompanyDAO.ADDRESS_COLUMN]),
				(company.parentId = row[CompanyDAO.PARENT_ID_COLUMN]),
				(company.companyKey = row[CompanyDAO.COMPANY_KEY]),
				(company.lat = row[CompanyDAO.LAT_COLUMN]),
				(company.lng = row[CompanyDAO.LNG_COLUMN]),
				(company.taxiType = row[CompanyDAO.TAXI_TYPE_COLUMN]),
				(company.xnCode = row[CompanyDAO.XN_CODE_COLUMN]),
				(company.logoLink = row[CompanyDAO.LOGO_LINK_COLUMN]),
				(company.displayName = row[CompanyDAO.DISPLAY_NAME_COLUMN]);
				companys.set(company.companyKey, company);
			}
        } catch (error) {
            LogFile.e("getCompanys", error);
		}
		return Promise.resolve(companys);
	}
	
	// Lấy company theo key
    public static async getCompanyByKey(companyKey: number): Promise<Company> {
        try {
            let sql = `SELECT * FROM ${this.TABLE} WHERE ${CompanyDAO.COMPANY_KEY} = ${companyKey}`;
            LogFile.e(sql);
			let company = new Company();
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			
			for (let i = 0; i < resultSet.rows.length; i++) {
				let row = resultSet.rows.item(i);
				(company.companyId = row[CompanyDAO.ID_COLUMN]),
				(company.name = row[CompanyDAO.NAME_COLUMN]),
				(company.reputation = row[CompanyDAO.REPUTATION_COLUMN]),
				(company.phone = row[CompanyDAO.PHONE_COLUMN]),
				(company.logo = row[CompanyDAO.LOGO_COLUMN]),
				(company.provinceId = row[CompanyDAO.PROVINCE_ID_COLUMN]),
				(company.address = row[CompanyDAO.ADDRESS_COLUMN]),
				(company.parentId = row[CompanyDAO.PARENT_ID_COLUMN]),
				(company.companyKey = row[CompanyDAO.COMPANY_KEY]),
				(company.lat = row[CompanyDAO.LAT_COLUMN]),
				(company.lng = row[CompanyDAO.LNG_COLUMN]),
				(company.taxiType = row[CompanyDAO.TAXI_TYPE_COLUMN]),
				(company.xnCode = row[CompanyDAO.XN_CODE_COLUMN]),
				(company.logoLink = row[CompanyDAO.LOGO_LINK_COLUMN]),
				(company.displayName = row[CompanyDAO.DISPLAY_NAME_COLUMN]);

				break;
			}
            return Promise.resolve(company);
        } catch (error) {
            return Promise.resolve(null);
        }
    }
}

export default CompanyDAO;