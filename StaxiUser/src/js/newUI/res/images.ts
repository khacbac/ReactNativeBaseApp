import { icons } from "../../../res/images";
import drawables from "../../../../../app/drawables";

/**
 * Các ảnh sử dụng trong ứng dụng
 * @author ĐvHiện
 * Created on 27/06/2018
 */

export default {
	//Icon chung
	...icons,

	ic_menu_home: require('./drawable/ic_menu_home.png'),
	ic_src_oval: require('./drawable/ic_src_oval.png'),
	ic_dst_oval: require('./drawable/ic_dst_oval.png'),

	//register new
	tel: require('./drawable/ic_tel.png'),
	user: require('./drawable/ic_user.png'),
	email: require('./drawable/ic_email.png'),
	promotion03: require('./drawable/ic_promotion.png'),
	register_logo: require('./drawable/register_logo.png'),
	ic_validate_key: require('./drawable/ic_validate_key.png'),
	validate_logo: require('./drawable/validate_logo.png'),

	ic_small_help: require('./drawable/small_help.png'),

	//profile
	profile_header_bg: require('./drawable/profile_header_bg.png'),
	ic_profile_note: require('./drawable/ic_profile_note.png'),

	ic_confirm_hotline: require('./drawable/ic_confirm_hotline.png'),
	ic_tel_driver: require('./drawable/ic_tel_driver.png'),
	ic_call_driver: require('./drawable/ic_call_driver.png'),

	ic_back_home: require('./drawable/ic_back_home.png'),

	// confirm.
	ic_car_datxe: require('./drawable/ic_car_datxe.png'),
	drawer_footer_bkg: require('./drawable/drawer_footer_bkg.png'),
	ic_help_48: require('./drawable/ic_help_48.png'),
	ic_type_4_cho: require('./drawable/ic_type_4_cho.png'),
	ic_type_4_cho_nho: require('./drawable/ic_type_4_cho_nho.png'),
	ic_type_7_cho: require('./drawable/ic_type_7_cho.png'),
	ic_type_tatca: require('./drawable/ic_type_tatca.png'),

	// chi tiết lịch sử mới
	ic_fee: require('./drawable/ic_fee.png'),
	ic_time_detail_history: require('./drawable/ic_time_detail_history.png'),
	ic_car_no: require('./drawable/ic_car_no.png'),
	ic_wallet: require('./drawable/ic_wallet.png'),

	...drawables,
};