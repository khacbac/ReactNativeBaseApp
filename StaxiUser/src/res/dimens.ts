import ScreenUtils from '../module/ui/res/dimen/ScreenUtils';
import dimensUI from '../module/ui/res/dimen/dimens';


function size(percent: number) {
    // alert(`height:${heightPercent}__percent: ${percent}__deviceHeight: ${deviceHeight}__width:${width}__height:${height}__status_bar:${StatusBar.currentHeight}`)
    return ScreenUtils.dimentsSizer(percent);
}


export default {
    ...dimensUI,
    //Đăng ký
    register_padding_txtPhone: size(115),
    register_margin_top_txtPhone: size(7),
    register_margin_top_cbx: size(18),
    register_margin_txtPhone: size(10), //~10px
    register_padding_btn_register: size(15),
    register_margin_check_agree: size(14),
    register_height_check_agree: size(17),
    register_icon_lang_size: size(28),
    register_icon_margin_lang: ScreenUtils.dimentsSizer(2),
    register_margin_btn_footer: ScreenUtils.dimentsSizer(30),
    register_margin_left_btn_footer: ScreenUtils.dimentsSizer(20),
    register_margin_top_btn_footer: ScreenUtils.dimentsSizer(10),
    register_margin_logo: size(25),
    register_icon_size: size(28),
    register_icon_phone_size: size(34),
    register_margin_phone: size(7),
    register_height_txtPhone: size(60),
    register_height_item_txtPhone: size(46),
    register_padding_container: size(30),
    register_height_logo: size(80),
    register_width_logo: size(150),
    //Validate
    validate_margin_top_phone_number: ScreenUtils.dimentsSizer(30),
    validate_padding_right_txt_code: ScreenUtils.dimentsSizer(7),
    validate_back_header: ScreenUtils.dimentsSizer(10),
    validate_code_number: ScreenUtils.dimentsSizer(20),
    //Promotion Dialog
    promotion_padding_title: ScreenUtils.dimentsSizer(10),
    promotion_space_button: ScreenUtils.dimentsSizer(6),
    promotion_item_padding: ScreenUtils.dimentsSizer(20),
    promotion_item_padding_status: ScreenUtils.dimentsSizer(5),
    promotion_padding_top_discount_code: ScreenUtils.dimentsSizer(20),
    //Confirm Note Dialog
    confirm_note_padding_top_title: ScreenUtils.dimentsSizer(30),
    confirm_note_margin_top_btn: ScreenUtils.dimentsSizer(15),
    confirm_note_height_input: ScreenUtils.dimentsSizer(160),
    //Confirm Book View
    confirm_book_view_padding_left: ScreenUtils.dimentsSizer(6),
    confirm_book_view_padding_bot: ScreenUtils.dimentsSizer(5),
    confirm_book_view_animate_icon_width: ScreenUtils.dimentsSizer(30),
    confirm_book_view_animate_icon_height: ScreenUtils.dimentsSizer(40),
    btn_padding_confirm_vertical: ScreenUtils.dimentsSizer(10),
    //Address View
    address_view_padding_title: ScreenUtils.dimentsSizer(2),
    address_view_padding_container: ScreenUtils.dimentsSizer(6),
    //Profile
    profile_height_info: ScreenUtils.dimentsSizer(150),
    profile_margin_avatar: ScreenUtils.dimentsSizer(13),
    profile_height_avartar: ScreenUtils.dimentsSizer(100),
    profile_corner_avartar: ScreenUtils.dimentsSizer(50),
    profile_margin_back_header: ScreenUtils.dimentsSizer(10),
    //Profile
    drawer_custom_container_info_height: ScreenUtils.dimentsSizer(200),
    drawer_custom_container_padding_top: ScreenUtils.dimentsSizer(15),
    drawer_custom_phonenumber_padding_top: ScreenUtils.dimentsSizer(5),
    drawer_custom_avatar_width: ScreenUtils.dimentsSizer(80),
    drawer_custom_avatar_radius: ScreenUtils.dimentsSizer(40),
    drawer_custom_lang_margin: ScreenUtils.dimentsSizer(5),
    drawer_custom_item_padding: ScreenUtils.dimentsSizer(12),
    drawer_custom_item_padding_left: ScreenUtils.dimentsSizer(14),
    drawer_custom_item_padding_icon_left: ScreenUtils.dimentsSizer(24),
    //About
    about_home_logo_app_size: ScreenUtils.dimentsSizer(80),
    about_icon_size: ScreenUtils.dimentsSizer(24),
    about_icon_margin_top:ScreenUtils.dimentsSizer(20),
    about_header_height: ScreenUtils.dimentsSizer(170),
    about_content_margin: ScreenUtils.dimentsSizer(10),
    about_footer_height: ScreenUtils.dimentsSizer(90),
    about_footer_padding_top: ScreenUtils.dimentsSizer(20),
    about_content_padding_top: ScreenUtils.dimentsSizer(8),
    // Schedule Fragment.
    scd_note_margin_top: ScreenUtils.dimentsSizer(20),
    home_padding_map_zoombound: ScreenUtils.dimentsSizer(380),
    // Rating Book View.
    rt_padding_horixontal: ScreenUtils.dimentsSizer(20),
    rt_margin_right: ScreenUtils.dimentsSizer(8),
    rt_fare_view_height: ScreenUtils.dimentsSizer(32),
    rt_money_total_height: ScreenUtils.dimentsSizer(56),

    //History
    history_icon_time_width: ScreenUtils.dimentsSizer(25),
    history_padding_item_cell: ScreenUtils.dimentsSizer(5),
    history_padding_left_item_cell: ScreenUtils.dimentsSizer(8),
    history_point_width: ScreenUtils.dimentsSizer(8),
    history_point_width_corner: ScreenUtils.dimentsSizer(4),
    history_padding_item_point: ScreenUtils.dimentsSizer(3),
    history_margin_container: ScreenUtils.dimentsSizer(7),
    history_padding_top_section_header: ScreenUtils.dimentsSizer(20),
    history_padding_bot_section_header: ScreenUtils.dimentsSizer(10),

    //history detail
    history_detail_icon_height: ScreenUtils.dimentsSizer(24),
    history_detail_item_height: ScreenUtils.dimentsSizer(50),
    history_detail_item_content_height: ScreenUtils.dimentsSizer(40),
    history_detail_icon_margin_left: ScreenUtils.dimentsSizer(20),
    history_detail_text_margin_left: ScreenUtils.dimentsSizer(20),
    history_detail_icon_right_margin: ScreenUtils.dimentsSizer(20),

    history_detail_fee_padding_top: ScreenUtils.dimentsSizer(5),
    history_detail_fee_padding: ScreenUtils.dimentsSizer(5),
    history_detail_from_to_padding: ScreenUtils.dimentsSizer(10),
    history_detail_view_marginLeft: ScreenUtils.dimentsSizer(30),
    history_detail_text_marginRight: ScreenUtils.dimentsSizer(10),
    history_detail_from_to_icon_size: ScreenUtils.dimentsSizer(16),
    history_detail_from_to_icon_margin_right: ScreenUtils.dimentsSizer(5),
    history_detail_driver_size: ScreenUtils.dimentsSizer(100),
    history_detail_driver_circle_size: ScreenUtils.dimentsSizer(80),
    history_detail_driver_info_margin_top_bottom: ScreenUtils.dimentsSizer(10),
    history_detail_driver_info_margin_left: ScreenUtils.dimentsSizer(20),
    history_detail_padding_5: ScreenUtils.dimentsSizer(5),
    history_detail_padding_2: ScreenUtils.dimentsSizer(2),
    history_detail_dot_size: ScreenUtils.dimentsSizer(10),


    //help
    help_item_dot_margin_left: ScreenUtils.dimentsSizer(20),
    help_item_title_padding_left: ScreenUtils.dimentsSizer(20),

    //feedback
    feedback_text_margin_left: ScreenUtils.dimentsSizer(10),
    feedback_text_margin_right: ScreenUtils.dimentsSizer(10),
    feedback_text_margin_top: ScreenUtils.dimentsSizer(20),
    feedback_input_margin_left: ScreenUtils.dimentsSizer(10),
    feedback_footerView_margin_left: ScreenUtils.dimentsSizer(10),
    feedback_footerView_margin_bottom: ScreenUtils.dimentsSizer(10),

    // Address View.
    add_left_icon_width:ScreenUtils.dimentsSizer(20),
    add_left_icon_height:ScreenUtils.dimentsSizer(20),

    //menu left
    menu_left_padding_avatar_bottom:ScreenUtils.dimentsSizer(20),
    menu_left_padding_text_bottom:ScreenUtils.dimentsSizer(10),

}

