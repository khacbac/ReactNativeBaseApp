import AddressHistory from '../bo/AddressHistory';
import {SQLiteUtils, LatLng, ContentValues} from '../../../module';
import BAAddress from '../../model/BAAddress';
import { ResultSet } from 'react-native-sqlite-storage';
import AddressItem from '../../viewmodel/search/autocomplete/AddressItem';

/**
 * Quản lý địa chỉ đã đặt xe
 * @author ĐvHiện
 * Created on 13/07/2018
 */
class AddressHistoryDAO {
	public static TABLE = 'AddressHistoryTable';
	public static ID_COLUMN = 'addressHistoryId';
	public static CREATE_TIME_COLUMN = 'createTime';
	public static ADDRESS_NAME_COLUMN = 'addressName';
	public static ADDRESS_LATITUDE_COLUMN = 'addressLatitude';
	public static ADDRESS_LONGITUDE_COLUMN = 'addressLongitude';
	public static FOMART_ADDRESS_COLUMN = 'fomartAddress';
	public static IS_FAVORITED_COLUMN = 'isFavorited';
	public static PREDEFINED_VALUE_COLUMN = 'predefinedValue';
	public static USED_COUNT_TYPE_COLUMN = 'usedCount';

	// Tạo bảng
	public static getQueryCreateTable(): string {
		return `CREATE TABLE IF NOT EXISTS ${this.TABLE} (
                ${this.ID_COLUMN} INTEGER ,
                ${this.CREATE_TIME_COLUMN} INTEGER,
                ${this.ADDRESS_NAME_COLUMN} VARCHAR,
				${this.ADDRESS_LATITUDE_COLUMN} FLOAT,
				${this.ADDRESS_LONGITUDE_COLUMN} FLOAT,
                ${this.FOMART_ADDRESS_COLUMN} VARCHAR,
                ${this.IS_FAVORITED_COLUMN} BOOL,
                ${this.PREDEFINED_VALUE_COLUMN} INTEGER,
                ${this.USED_COUNT_TYPE_COLUMN} INTEGER);`;
	}

	// Xóa bảng
	public static getQueryDropTable() {
		return `DROP TABLE IF EXISTS ${this.TABLE}`;
	}

	// Insert dữ liệu
	public static async insert(baAddress: BAAddress): Promise<number>{
		if (baAddress == undefined) {
			return;
		}
		
		// kiểm tra điểm này trước đây đã đi chưa
		let sql = `SELECT * FROM ${AddressHistoryDAO.TABLE} WHERE ${AddressHistoryDAO.FOMART_ADDRESS_COLUMN} = '${baAddress.formattedAddress}'`;
		let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);

		// udpate pre address history
		if (resultSet.rows.length > 0) {
			let row = resultSet.rows.item(0);

			let addressHistory = new AddressHistory();
			addressHistory.id = row[AddressHistoryDAO.ID_COLUMN];
			addressHistory.createTime = row[AddressHistoryDAO.CREATE_TIME_COLUMN];
			addressHistory.name = row[AddressHistoryDAO.ADDRESS_NAME_COLUMN];
			addressHistory.location = new LatLng(row[AddressHistoryDAO.ADDRESS_LATITUDE_COLUMN],
				row[AddressHistoryDAO.ADDRESS_LONGITUDE_COLUMN]);
			addressHistory.fomartAddress = row[AddressHistoryDAO.FOMART_ADDRESS_COLUMN];
			addressHistory.favorited = row[AddressHistoryDAO.IS_FAVORITED_COLUMN];
			addressHistory.predefinedValue = row[AddressHistoryDAO.PREDEFINED_VALUE_COLUMN];

			if (addressHistory.predefinedValue === 0) {
				addressHistory.count = row[AddressHistoryDAO.USED_COUNT_TYPE_COLUMN] + 1;
				SQLiteUtils.update(AddressHistoryDAO.TABLE, this._getContentValue(addressHistory), this.ID_COLUMN + " = " + addressHistory.id);
			}

			return;
		}

		// insert new address history
		let address = new AddressHistory();
		address.id = new Date().getTime();
		address.createTime = new Date().getTime();
		address.name = baAddress.name;
		address.location.latitude = baAddress.location.latitude;
		address.location.longitude = baAddress.location.longitude;
		address.fomartAddress = baAddress.formattedAddress;
		address.favorited = false;
		address.predefinedValue = 0;
		address.count = 1;

		return SQLiteUtils.insert(AddressHistoryDAO.TABLE, this._getContentValue(address));
	}

	/**
	 * Thêm điểm yêu thích
	 * @param baAddress 
	 */
	public static async insertFavoriteAddress(addressItem: AddressItem): Promise<number>{
		// kiểm tra điểm này trước đây đã đi chưa
		let sql = `SELECT * FROM ${AddressHistoryDAO.TABLE} WHERE ${AddressHistoryDAO.FOMART_ADDRESS_COLUMN} = '${addressItem.formattedAddress}'`;
		let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);

		if (resultSet.rows.length > 0) {
			let row = resultSet.rows.item(0);

			let addressHistory = new AddressHistory();
			addressHistory.id = row[AddressHistoryDAO.ID_COLUMN];
			addressHistory.createTime = row[AddressHistoryDAO.CREATE_TIME_COLUMN];
			addressHistory.name = row[AddressHistoryDAO.ADDRESS_NAME_COLUMN];
			addressHistory.location = new LatLng(row[AddressHistoryDAO.ADDRESS_LATITUDE_COLUMN],
				row[AddressHistoryDAO.ADDRESS_LONGITUDE_COLUMN]);
			addressHistory.fomartAddress = row[AddressHistoryDAO.FOMART_ADDRESS_COLUMN];
			addressHistory.favorited = true;
			addressHistory.predefinedValue = row[AddressHistoryDAO.PREDEFINED_VALUE_COLUMN];
				
			return SQLiteUtils.update(AddressHistoryDAO.TABLE, this._getContentValue(addressHistory), 
			this.ID_COLUMN + " = " + addressHistory.id);
		}

		let address = new AddressHistory();
		address.id = new Date().getTime();
		address.createTime = new Date().getTime();
		address.name = addressItem.name;
		address.location.latitude = addressItem.location.latitude;
		address.location.longitude = addressItem.location.longitude;
		address.fomartAddress = addressItem.formattedAddress;
		address.favorited = true;
		address.predefinedValue = 0;
		address.count = 1;

		let values = new ContentValues();
		values.set(this.ID_COLUMN, address.id);
		values.set(this.CREATE_TIME_COLUMN, address.createTime);
		values.set(this.ADDRESS_NAME_COLUMN, address.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, address.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, address.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, address.fomartAddress);
		values.set(this.IS_FAVORITED_COLUMN, address.favorited);
		values.set(this.PREDEFINED_VALUE_COLUMN, address.predefinedValue);
		values.set(this.USED_COUNT_TYPE_COLUMN, address.count);

		return SQLiteUtils.insert(AddressHistoryDAO.TABLE, values);
	}

	private static _getContentValue(addressHistory: AddressHistory) {
		let values = new ContentValues();
		values.set(this.ID_COLUMN, addressHistory.id);
		values.set(this.CREATE_TIME_COLUMN, addressHistory.createTime);
		values.set(this.ADDRESS_NAME_COLUMN, addressHistory.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, addressHistory.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, addressHistory.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, addressHistory.fomartAddress);
		values.set(this.IS_FAVORITED_COLUMN, addressHistory.favorited);
		values.set(this.PREDEFINED_VALUE_COLUMN, addressHistory.predefinedValue);
		values.set(this.USED_COUNT_TYPE_COLUMN, addressHistory.count);

		return values;
	}

	// Insert địa chỉ nhà riêng
	public static insertHomeLocation(baAddress: BAAddress): Promise<number>{
		let address = new AddressHistory();
		address.id = new Date().getTime();
		address.createTime = new Date().getTime();
		address.name = baAddress.name;
		address.location.latitude = baAddress.location.latitude;
		address.location.longitude = baAddress.location.longitude;
		address.fomartAddress = baAddress.formattedAddress;
		address.favorited = false;
		address.predefinedValue = 1;
		address.count = 1;

		let values = new ContentValues();
		values.set(this.ID_COLUMN, address.id);
		values.set(this.CREATE_TIME_COLUMN, address.createTime);
		values.set(this.ADDRESS_NAME_COLUMN, address.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, address.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, address.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, address.fomartAddress);
		values.set(this.IS_FAVORITED_COLUMN, address.favorited);
		values.set(this.PREDEFINED_VALUE_COLUMN, address.predefinedValue);
		values.set(this.USED_COUNT_TYPE_COLUMN, address.count);

		return SQLiteUtils.insert(AddressHistoryDAO.TABLE, values);
	}
	
	// Update địa chỉ nhà riêng
	public static updateHomeLocation(id: number, baAddress: BAAddress): Promise<any>{
		let values = new ContentValues();
		values.set(this.ID_COLUMN, id);
		values.set(this.ADDRESS_NAME_COLUMN, baAddress.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, baAddress.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, baAddress.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, baAddress.formattedAddress);
		values.set(this.PREDEFINED_VALUE_COLUMN, 1);

		return SQLiteUtils.update(AddressHistoryDAO.TABLE, values, this.ID_COLUMN + " = " + id);
	}

	// Insert địa chỉ nơi làm việc
	public static insertWorkLocation(baAddress: BAAddress): Promise<number>{
		let address = new AddressHistory();
		address.id = new Date().getTime();
		address.createTime = new Date().getTime();
		address.name = baAddress.name;
		address.location.latitude = baAddress.location.latitude;
		address.location.longitude = baAddress.location.longitude;
		address.fomartAddress = baAddress.formattedAddress;
		address.favorited = false;
		address.predefinedValue = 2;
		address.count = 1;

		let values = new ContentValues();
		values.set(this.ID_COLUMN, address.id);
		values.set(this.CREATE_TIME_COLUMN, address.createTime);
		values.set(this.ADDRESS_NAME_COLUMN, address.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, address.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, address.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, address.fomartAddress);
		values.set(this.IS_FAVORITED_COLUMN, address.favorited);
		values.set(this.PREDEFINED_VALUE_COLUMN, address.predefinedValue);
		values.set(this.USED_COUNT_TYPE_COLUMN, address.count);

		return SQLiteUtils.insert(AddressHistoryDAO.TABLE, values);
	}
	
	// Update địa chỉ nơi làm việc
	public static updateWorkLocation(id: number, baAddress: BAAddress): Promise<any>{
		let values = new ContentValues();
		values.set(this.ID_COLUMN, id);
		values.set(this.ADDRESS_NAME_COLUMN, baAddress.name);
		values.set(this.ADDRESS_LATITUDE_COLUMN, baAddress.location.latitude);
		values.set(this.ADDRESS_LONGITUDE_COLUMN, baAddress.location.longitude);
		values.set(this.FOMART_ADDRESS_COLUMN, baAddress.formattedAddress);
		values.set(this.PREDEFINED_VALUE_COLUMN, 2);

		return SQLiteUtils.update(AddressHistoryDAO.TABLE, values, this.ID_COLUMN + " = " + id);
	}

	// Lấy tất cả dữ liệu đã lưu
	public static query = (): Promise<AddressHistory> => {
		return new Promise((resolve, reject) => {
			const sqlInsert = `SELECT * FROM ${AddressHistoryDAO.TABLE}`;
			SQLiteUtils.executeSql(sqlInsert)
				.then((resultSet: ResultSet) => {
					let addressHistory;
					for (let i = 0; i < resultSet.rows.length; i++) {
						let row = resultSet.rows.item(i);
						addressHistory = new AddressHistory();
						(addressHistory.id = row[AddressHistoryDAO.ID_COLUMN]),
						(addressHistory.createTime = row[AddressHistoryDAO.CREATE_TIME_COLUMN]),
						(addressHistory.name = row[AddressHistoryDAO.ADDRESS_NAME_COLUMN]),
						(addressHistory.location = new LatLng(
								row[AddressHistoryDAO.ADDRESS_LATITUDE_COLUMN],
								row[AddressHistoryDAO.ADDRESS_LONGITUDE_COLUMN]
						)),
						(addressHistory.fomartAddress = row[AddressHistoryDAO.FOMART_ADDRESS_COLUMN]),
						(addressHistory.favorited = row[AddressHistoryDAO.IS_FAVORITED_COLUMN]),
						(addressHistory.predefinedValue = row[AddressHistoryDAO.PREDEFINED_VALUE_COLUMN]),
						(addressHistory.count = row[AddressHistoryDAO.USED_COUNT_TYPE_COLUMN]);
					}
					resolve(addressHistory);
				})
				.catch(() => {
					resolve(new AddressHistory());
				});
		});
	};

	// Lấy tất cả dữ liệu đã lưu
	public static async getAddressHistorys(limit:number = 5): Promise<Array<BAAddress>> {
		try {
			var addressHistorys: Array<BAAddress> = new Array<BAAddress>();
			let sql = `SELECT * FROM ${AddressHistoryDAO.TABLE} ORDER BY ${AddressHistoryDAO.CREATE_TIME_COLUMN} DESC LIMIT ${limit}`;
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			let addressHistory:BAAddress;
			for (let i = 0; i < resultSet.rows.length; i++) {
				let row = resultSet.rows.item(i);
				addressHistory = new BAAddress();
				addressHistory.name = row[AddressHistoryDAO.ADDRESS_NAME_COLUMN];
				addressHistory.location = new LatLng(
					row[AddressHistoryDAO.ADDRESS_LATITUDE_COLUMN],
					row[AddressHistoryDAO.ADDRESS_LONGITUDE_COLUMN]
				);
				addressHistory.formattedAddress = row[AddressHistoryDAO.FOMART_ADDRESS_COLUMN];
				addressHistorys.push(addressHistory);
			}
			return Promise.resolve(addressHistorys);
		} catch (error) {
			return Promise.resolve([]);
		}
	}

	// Lấy tất cả dữ liệu đã lưu
	public static async getAllAddressHistorys(): Promise<Array<AddressItem>> {
		try {
			var addressHistorys: Array<AddressItem> = new Array<AddressItem>();
			let sql = `SELECT * FROM ${AddressHistoryDAO.TABLE}`;
			let resultSet = await SQLiteUtils.executeSql<ResultSet>(sql);
			let addressHistory;
			for (let i = 0; i < resultSet.rows.length; i++) {
				let row = resultSet.rows.item(i);
				addressHistory = new AddressItem();
				(addressHistory.id = row[AddressHistoryDAO.ID_COLUMN]),
				(addressHistory.createTime = row[AddressHistoryDAO.CREATE_TIME_COLUMN]),
				(addressHistory.name = row[AddressHistoryDAO.ADDRESS_NAME_COLUMN]),
				(addressHistory.location = new LatLng(
					row[AddressHistoryDAO.ADDRESS_LATITUDE_COLUMN],
					row[AddressHistoryDAO.ADDRESS_LONGITUDE_COLUMN]
				)),
				(addressHistory.formattedAddress = row[AddressHistoryDAO.FOMART_ADDRESS_COLUMN]),
				(addressHistory.favorited = row[AddressHistoryDAO.IS_FAVORITED_COLUMN]),
				(addressHistory.predefinedValue = row[AddressHistoryDAO.PREDEFINED_VALUE_COLUMN]),
				(addressHistory.count = row[AddressHistoryDAO.USED_COUNT_TYPE_COLUMN]);

				if (addressHistory.predefinedValue === 1) {
					addressHistory.type = AddressItem.HOME;
				} else if (addressHistory.predefinedValue === 2) {
					addressHistory.type = AddressItem.WORKING;
				} else {
					addressHistory.type = AddressItem.HISTORY;
				}

				addressHistorys.push(addressHistory);
			}
			return Promise.resolve(addressHistorys);
		} catch (error) {
			return Promise.resolve([]);
		}
	}
	
	/**
	 * Xóa điểm yêu thích
	 * @param id 
	 */
	public static deleteFavoriteAddress(id: number) {
		return SQLiteUtils.del(this.TABLE, this.ID_COLUMN + " = " + id);
	}

	 /* Xóa một địa chỉ theo ID */
	public static deleteTo(id: number) {
		return SQLiteUtils.del(this.TABLE, this.ID_COLUMN + " = " + id);
	}

	/* Xóa tất cả dữ liệu trong bảng lịch sử */
	public static deleteAll() {
		return SQLiteUtils.del(this.TABLE);
	  }
}

export default AddressHistoryDAO;