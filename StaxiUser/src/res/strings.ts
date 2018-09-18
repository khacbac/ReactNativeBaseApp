import SessionStore from "../js/Session";
import {vi, en} from "../../../app/strings" 

class LanguageLocate {
  private locate: number;
  constructor(locate) {
    this.locate = locate || 0;
  }

  change(locate) {
    if (this.locate == locate) return;
    this.locate = locate;
    Object.keys(strings).forEach(key => {
      strings[key] = this.getString(key);
    });
  }

  getString(key) {

    //nếu tiếng anh ko có
    if (this.locate === 1) {
      let en = LANGUAGE_EN[key];
      if(en != undefined) return en;
    }  
    
      return LANGUAGE_VI[key];
    }
}

var Locate =
  Locate ||
  new LanguageLocate(
    SessionStore.language || 0
  );


let LANGUAGE_VI = {
  app_name: "G7Taxi",
  version_name: "Phiên bản: 1.0.0",
  sologan_name: "Taxi chính hãng",

  register_code_unknown: "Không xác định",
  home_screen_title: "Đặt taxi",
  home_history_title: "Lịch sử",
  title_detail_history: "Chi tiết chuyến đi",
  home_promotion_title: "Khuyến mại",
  home_alert_title: "Thông báo",
  home_feedback_title: "Góp ý",
  home_about_title: "Giới thiệu",
  home_help_title: "Trợ giúp",

  feedback_fail: "Có lỗi xảy ra, vui lòng thử lại",

  search_address_title: "Tìm kiếm",
  search_address_number: "Số",

  status_successful: "Thành công",
  status_cancelled: "Thất bại",
  status_promation: "Khuyến mãi",

  about_content_one:
    "\tXe chất lượng cao - giá cước rẻ - phục vụ chuyên nghiệp.",
  about_content_two:
    "\tTheo dõi Xe đến đón, lộ trình và dự kiến giá cước chuyến đi.",
  about_content_three:
    "\tDễ dàng tương tác với tổng đài để được hỗ trợ tốt nhất.",
  about_content_four:
    "\tĐặt lịch trước với chúng tôi cho chuyến đi của bạn hoàn hảo hơn.",
  about_content_five: "\tLưu lại lịch sử để phản hồi hoặc tìm đồ thất lạc.",
  about_btn_share: "Chia sẻ",
  waiting: "Đang xử lý",
  invalid_network: "Bạn đang offline, vui lòng kiểm tra lại kết nối",

  about_btn_rate: "Đánh giá",
  about_copyright: "©2018 bản quyền thuộc Công ty Bình Anh",

  // TaxiLib ---------------------------------
  // <!-- Thông tin chung -->
  //app_name: "G7Taxi",
  // <!-- Các lable button -->
  btn_call: "Gọi hãng",
  btn_call_driver: "Gọi lái xe",
  btn_retry: "Thử lại",
  btn_book_again: "Đặt lại",
  btn_cancel: "Bỏ qua",
  btn_complete: "Hoàn Thành",
  dialog_confirm_meetcar: "Bạn đã thực sự gặp xe chưa?",
  dialog_confirm_meetcar_yes: "Đã gặp xe",
  dialog_rate_title: "Đánh giá lái xe",
  dialog_rate_driver_name: "Tên lái xe",
  dialog_rate_content:
    "Vui lòng đánh giá chất lượng lái xe trong chuyến đi của bạn",
  dialog_rate_quality: "Loại đánh giá",
  dialog_rate_content_null: "Bạn vui lòng đánh giá trước khi gửi.",
  dialog_rate_content_empty:
    "Bạn vui lòng nhập nội dung đánh giá vào ô trống để dịch vụ được hoàn thiện hơn.",
  dialog_rate_send_fail: "Gửi đánh giá không thành công.",
  dialog_rate_content_note: "Thông tin góp ý thêm",
  dialog_rate_sent_btn: "Gửi",

  booking_share_btn: "Đi chung taxi",
  book_button_new: "Đặt lại xe",
  title_marker_center_no_car: "Không có xe",
  book_button_meetcar: "Đã lên xe",
  alert: "Cảnh báo",
  // <!-- Cảnh báo google play service chưa cài đặt -->
  update_google_service: "Bạn cần cập nhật Google service mới nhất!",
  update_software: "Bạn cần cập nhật phiên bản mới để tiếp tục sử dụng!",
  // <!-- Cảnh báo gps, địa chỉ -->
  gps_not_enabled: "Thiết bị chưa được bật dịch vụ vị trí!",
  gps_network_not_get_location:
    "Chưa lấy được vị trí hiện tại của bạn, vui lòng thử lại!",
  waiting_notification_connected_gps: "Đang xác định vị trí của bạn.",
  address_loadding: "Đang xác định địa chỉ…",
  no_address: "Không lấy được địa chỉ của điểm này!",
  add_favorite_point_failt: "Thêm điểm yêu thích thất bại, vui lòng thử lại",
  delete_history_point_failt: "Xóa địa chỉ thất bại, vui lòng thử lại",
  no_network: "Bạn đang offline, vui lòng kiểm tra lại kết nối!",
  no_search_result: "Không tìm thấy kết quả nào phù hợp với từ khóa bạn nhập!",
  confirm_not_network: "Bạn cần kết nối internet để thực hiện chức năng này",
  // <!-- Xử lý ngoại lệ -->
  not_connected_server: "Không kết nối được với máy chủ",
  connected_server_time_out:
    "Kết nối mạng không ổn định. Bạn vui lòng kiểm tra kết nối để cập nhật thông tin chuyến đi.",
  dialog_waiting_title: "Vui lòng chờ…",
  not_connected_server_retry_book:
    "Hệ thống mạng bị lỗi, bạn vui lòng đặt lại xe",
  no_phone_number: "Số điện thoại không hợp lệ",
  // <!-- đăng ký tài khoản -->
  term_of_used: "Điều khoản sử dụng",
  user_profile_back: "Cá nhân",
  accounts_user_default: "Đăng ký tài khoản",
  accounts_user_profile: "Thông tin cá nhân",
  user_name_default: "Tên của bạn",
  user_email_default: "Email",
  user_refcode_default: "Mã giới thiệu",
  accounts_term_of_used: "Tôi đồng ý với",
  accounts_term_of_used_link: "Điều khoản sử dụng",
  accounts_user_hint_phone: "Số điện thoại(*)",
  user_register_title: "Đăng ký",
  user_verify_title: "Nhập mã kích hoạt",
  accounts_user_verify_code: "Mã kích hoạt",
  accounts_user_active_ok: "Xác nhận",
  accounts_user_active_try: "00:05:00",
  user_profile_title: "Thông tin cá nhân",
  user_profile_info_email: "Email:",
  user_profile_info_pass: "Mật khẩu:",
  user_profile_info_phone: "Điện thoại:",
  user_profile_info_phone_hint: "Số điện thoại",
  user_profile_manager_hint_pass: "Nhập mật khẩu",
  user_profile_manager_hint_email: "Tài khoản Email",
  user_profile_manager_delete: "Xóa tài khoản",
  manager_selecter_avatar: "Chọn ảnh đại diện",
  manager_selecter_album: "Thư viện",
  manager_selecter_camera: "Camera",
  user_verify_try_btn: "Gửi lại mã kích hoạt",
  user_verify_try_btn_time: "Kích hoạt lại sau: ",
  accounts_user_active_has_code: "Đã có mã kích hoạt",
  accounts_user_active_cancel: "Bỏ qua",
  profile_driver_blocked_btn: "Danh sách lái xe bị chặn",

  // <!-- Màn hình cái đặt -->
  book_taxi_title: "Đặt taxi",
  book_confirm_title: "Xác nhận",
  book_taxi_btn: "Đặt xe",
  book_taxi_confirm: "Xác nhận",
  book_address: "Địa chỉ",
  book_address_null: "Không lấy được địa chỉ",
  book_address_from: "Điểm đi",
  book_address_to: "Điểm đến",
  book_address_from_empty: "Bạn vui lòng chọn địa chỉ trước khi đặt xe!",
  book_address_to_empty: "Bạn chưa chọn điểm đến",
  book_not_support_top: "Ngoài vùng",
  book_not_support_bottom: "Hỗ trợ",
  book_check_allow_call: "Nhận cuộc gọi từ",
  book_address_reselect_a: "Chưa có vị trí điểm đón",
  book_address_reselect_b: "Chưa có vị trí điểm đến",
  book_address_to_airport: "Sân bay Nội Bài",
  book_estimation_info:
    "Lộ trình chỉ mang tính ước lượng, giá cước có thể thay đổi theo điều kiện thực tế!",

  book_taxi_return: "Taxi chiều về",
  cartype_inner_city_tab: "Taxi",
  cartype_car_tab: "Car",

  // <!-- màn hình tùy chọn hãng -->
  book_company_title: "Chọn hãng",
  book_company_favorites: "Chọn hãng yêu thích",
  book_company_title_like: "Hãng yêu thích",
  book_company_title_normal: "Hãng thường",
  book_company_found_option_title: "Tùy chọn tìm kiếm",
  book_company_found_option_1: "Ưu tiên tìm xe gần nhất",
  book_company_found_option_2: "Chỉ tìm các hãng yêu thích",
  book_company_found_alert:
    "Bạn chưa có hãng yêu thích, vui lòng chọn hãng yêu thích để sử dụng dịch vụ này!",
  book_company_like: "Yêu thích",
  book_company_block: "Chặn hãng",

  // <!-- Màn hình chọn hãng taxi -->
  taxi_proceeding_menu_title: "Đang có cuốc đặt",
  // <!-- màn hình xác nhận yêu cầu đặt xe -->
  book_receive_taxi_company: "Yêu cầu của bạn đã được gửi tới Taxi",
  book_cancel_des: "Bạn có muốn hủy chuyến đi này không?",
  book_datepicker_alert:
    "Lịch hẹn phải dưới 7 ngày và trên 15 phút so với thời gian hiện tại",
  book_create_user_alert: "Bạn cần đăng ký tài khoản trước khi đặt xe",
  book_confirm_network_error: "Bạn cần kết nối internet trước khi đặt xe",
  book_time_title: "Đặt giờ",
  book_date_title: "Đặt ngày",
  book_notes_title: "Ghi chú",
  book_notes_hint_button: "Ghi chú",
  book_notes_hint_input:
    "Ví dụ: Mang theo nhiều hành lý, xe đến chờ ở đầu ngõ 123 …",
  book_notes_description:
    "Thêm ghi chú giúp lái xe đón bạn nhanh và dễ dàng hơn",
  book_schedule_title: "Đặt lịch",
  book_alarm_waiting_title: "Đặt lịch",
  book_alarm_cancel_title: "Đã hủy",
  book_confirm_schedule_alert:
    "Ứng dụng chỉ hỗ trợ một chuyến đặt lịch trong một thời điểm.Bạn có muốn hủy đặt lịch đã có không?",
  book_confirm_cancel_schedule_book: "Bạn có muốn hủy cuốc đặt lịch không?",
  book_confirm_schedule_cancel: "Hủy lịch",
  book_schedule_cancel_btn: "Hủy đặt lịch",
  book_schedule_show_btn: "Xem chi tiết",
  book_confirm_promotion: "Khuyến mại",
  book_taxi_promotion_description:
    "Bạn vui lòng nhập mã khuyến mãi để được giảm giá",
  book_taxi_companies_book_item: "xe",
  book_confirm_schedule_button: "Xác nhận",
  book_confirm_schedule_cancel_button: "Đi ngay",
  book_confirm_schedule_current_day: "Hôm nay",
  book_confirm_cartype_not_determine: "Loại xe chưa xác định giá",
  book_carinfo_price_open: "Giá mở cửa ",
  book_carinfo_price_open_bike: "Giá đón khách #",
  book_carinfo_price_open_detail: " VNĐ/Km",
  book_carinfo_price_step_two: "đến",
  book_carinfo_price_step_next_from: "Từ",
  book_carinfo_price_step_next_to: "trở đi",
  book_carinfo_price_percent: "-#%",
  book_carinfo_price_distance: "cước chiều về với\ncuốc chiều đi\ntrên ",
  book_carinfo_price_wait: "Thời gian chờ #",
  book_not_support_are: "Hiện tại không hỗ trợ đặt xe tại vùng này",
  // <!-- Đợi nhận thông tin từ hãng -->
  book_receive_taxi: "G7Taxi",
  book_receive_taxi_note_2:
    "G7Taxi đang tìm kiếm lái xe. Bạn vui lòng đợi trong giây lát…",
  book_receive_taxi_note_3: "Đang lấy thông tin lái xe…",
  book_receive_taxi_timeout:
    "Hệ thống đặt xe đang bận, bạn vui lòng gọi trực tiếp đến hãng",
  book_receive_taxi_not_relogin:
    "Không thể kết nối với server vì thiết bị mất kết nối quá lâu",
  book_not_enable_network: "Bạn đang offline, vui lòng kiểm tra lại kết nối",
  book_connect_to_server_instability: "Kết nối mạng tới máy chủ không ổn định",
  book_enable_network: "Đang kết nối lại với máy chủ…",
  book_relogin_taxi_timeout:
    "Không kết nối được với hệ thống. Vui lòng liên lạc với lái xe hoặc thử lại sau",
  book_taxi_not_network:
    "Thiết bị không có kết nối mạng, bạn vui lòng bật kết nối hoặc gọi điện đến tổng đài để tiếp tục đặt xe!",
  // <!-- Tìm kiếm địa chỉ -->
  book_search_ba_address: "Google",
  book_search_recent_address: "Hay đi",
  book_search_maps_address: "Bản đồ",
  book_search_google_input:
    'Để tìm theo số nhà, bạn nhập theo mẫu:\n"10 giai phong", "96 dinh cong", …\n(không có dấu phẩy và các từ "số", "số nhà")',
  book_search_recent_alert: "Bạn chưa thực hiện chuyến đi nào qua G7Taxi",
  book_search_google_alert:
    "Không tìm thấy kết quả nào phù hợp với từ khóa bạn nhập",
  book_search_google_error: "Hệ thống tìm kiếm gặp sự cố, vui lòng thử lại sau",
  book_search_google_auto: "Đang tìm kiếm các điểm xung quanh…",
  book_search_google_gps_not_enable: "Dịch vụ vị trí chưa được kích hoạt",
  book_selecter_address_btn: "Đặt xe tại đây",
  book_selecter_address_to_btn: "Chọn điểm đến",
  book_search_latlng_point: "Vị trí ghim",
  search_bar_hit: "Tìm kiếm",
  // <!-- Màn hình xem vị trí xe -->
  book_comfirm_distance: "Ước lượng xe gần nhất:",
  book_comfirm_minute_lable: "phút",
  book_step_option_btn: "Tùy chọn",
  // <!-- Màn hình mời khách -->
  book_invite_subtitle: "Xe đã đến",
  book_invite_user_cancel:
    "Xe đã đến đón bạn. Nếu bạn muốn hủy chuyến đi, vui lòng gọi điện cho lái xe",
  book_carinfo_subtitle: "Thông báo",
  book_carinfo_description: "Xe # đang trên đường đến đón bạn",
  book_carinfo_description_contract: "Xe # đang trên đường đến đón bạn",
  book_invite_description:
    "Lái xe thông báo đã đón bạn. Vui lòng xác nhận hoặc đặt lại một chuyến khác",
  book_catcher_user_description_contract:
    "Xe số # đã đến đón bạn, mời bạn ra xe.",
  book_catcher_user_description: "Taxi số # đã đến đón bạn, mời bạn ra xe.",
  book_meet_car_confirm:
    "Lái xe đang ở xa vị trí của bạn. Bạn đã lên đúng xe # hay chưa?",
  book_cancel_btn: "Hủy đặt xe",
  book_cancel_btn_success: "Hoàn thành",
  book_invite_meet_car_btn: "Gặp xe",
  book_invite_not_meet_car_btn: "Không có xe",
  book_invite_thanks_for_used:
    "Cảm ơn bạn đã dùng dịch vụ G7Taxi, chúc bạn có một chuyến đi an toàn",
  book_operator_cancel_subtitle_notification: "G7Taxi: hủy đặt xe",
  book_alert_catched_user:
    "Lái xe thông báo đã đón bạn. Vui lòng xác nhận hoặc đặt lại một chuyến khác",
  book_alert_catched_user_not_driver_infor:
    "Lái xe thông báo đã đón bạn. Cảm ơn bạn đã sử dụng dịch vụ G7Taxi",
  // <!-- Màn hình đón khách thành công -->
  book_done_info_successful:
    "Cám ơn bạn đã dùng dịch vụ G7Taxi, chúc bạn có một chuyến đi an toàn.",
  // <!-- Hủy quốc khác từ server -->
  book_operator_cancel_wrong:
    "Taxi # đang điều xe đến đón bạn, xin vui lòng chờ trong giây lát",
  book_operator_cancel:
    "Taxi # đang điều xe đến đón bạn, xin vui lòng chờ trong giây lát",
  book_operator_relogin_fail:
    "Chuyến đặt taxi của bạn không thành công. Xin lỗi vì sự bất tiện này. Bạn có muốn đặt lại chuyến khác không?",
  book_driver_cancel:
    "Xin lỗi, xe đang đến gặp sự cố, không thể tới đón bạn được. Hãng đang điều xe khác đến đón bạn",
  book_driver_missed:
    "Xin lỗi, xe # gặp sự cố, không thể tới đón bạn được. Điều hành đang điều xe khác đến đón bạn!",
  book_driver_relogin_fail:
    "Xin lỗi, xe đang đến gặp sự cố, không thể tới đón bạn được. Bạn có muốn đặt lại một xe khác không?",
  // <!-- Thông tin viewcar -->
  taxi_back_taxi: "Xe",
  taxi_back_time_waiting: "Thời gian",
  taxi_back_a_to_b: "Ước lượng",
  taxi_estimates_a_to_b: "tính tiền thực tế sẽ dựa trên đồng hồ",
  car_contract_a_to_b: "Giá trị hợp đồng",
  taxi_back_a_to_b_sub: "A -&amp;gt; B",
  taxi_back_money: "Tiền đồng hồ",
  taxi_back_sale: "Phải trả (-#%)",
  taxi_back_money_vn: "VNĐ",
  // <!-- Các label trong dialog gọi xe gần nhất -->
  car_number_sh: "Số xe",
  car_number_bsx: "Biển số",
  distance_title: "Khoảng cách",
  seats_number: "chỗ",
  distance: "Khoảng cách: ",
  duration: "Thời gian: ",
  tracking_log: "Lộ trình chuyến đi",
  // <!-- Các label trong dialog lựa chọn loại xe -->
  car_type: "Loại xe",
  taxi_title: "Taxi",
  car_type_all: "Tất cả",
  car_type_4_seat: "4 chỗ",
  car_type_7_seat: "7 chỗ",
  car_type_4_seat_airport: "4 chỗ sân bay",
  car_type_7_seat_airport: "7 chỗ sân bay",
  car_type_4_seat_low: "4 chỗ nhỏ",
  car_type_4_seat_large: "4 chỗ rộng",
  car_type_7_seat_small: "7 chỗ nhỏ",
  car_type_auto: "Bất kỳ",
  car_type_airport: "Sân bay",
  car_type_center: "Nội thành",
  // <!-- Lịch sử đi xe -->
  history_title: "Lịch sử",
  history_tab_book: "Đặt taxi",
  history_book_promotion: "Khuyến mại",
  history_book_airport: "Sân bay",
  history_address_date: "Ngày:",
  history_address_from: "Từ:",
  history_address_to: "Đến:",
  history_address_not_define: "Không xác định",
  history_address_to_small: "đến",
  history_book_taxi_shx: "Số hiệu xe:",
  history_retry_book_a_b: "ĐẶT XE A->B",
  history_retry_book_b_a: "ĐẶT XE B->A",
  history_yesterday: "Hôm qua",
  history_days_ago: "Ngày trước",
  history_hours_ago: "Giờ trước",
  history_recent: "Mới đây",
  // <!-- Thông tin trợ giúp -->
  feedback_manager_title: "Góp ý",
  feedback_title:
    "Chúng tôi mong muốn nhận được góp ý của bạn để ngày càng tốt hơn",
  feedback_content_title_hint: "Tiêu đề",
  feedback_content_hint: "Nội dung góp ý(*)",
  feedback_hotline: "0902 95 64 64",
  feedback_hotline_alert: "Chăm sóc khách hàng:",
  feedback_hotline_alert_b: "Fanpage",
  feedback_hotline_alert_c: "Website",
  feedback_hotline_alert_d: "Hotline",
  feedback_email_cskh: "G7Taxi.cskh@binhanh.com",
  feedback_website: "http://www.G7Taxi.com",
  feedback_fanpage_cskh: "https://www.facebook.com/G7Taxi",
  feedback_sent: "Gửi góp ý",
  feedback_type_select_name: "Danh mục đánh giá",
  // <!-- Trợ giúp -->
  help_book_taxi: "Hướng dẫn đặt xe",
  help_cancel_book: "Hướng dẫn hủy chuyến đặt lịch",
  help_book_taxi_one_header: "CHỌN LOẠI XE",
  help_book_taxi_one:
    "\n\n- Bạn có thể chọn loại xe bằng cách chạm vào biểu tượng của loại xe tương ứng. Loại xe được chọn sẽ được hiển thị nổi bật hơn.\
    \n\n- Chuyển đổi loại xe “Nội thành” và xe “Sân bay” bằng bấm trực tiếp hoặc vuốt sang trái hoặc sang phải.",
  help_book_taxi_two_header: "Chọn điểm đón, điểm đến",
  help_book_taxi_two:
    "\n\n- Cách 1: Di chuyển bản đồ tới vị trí mà bạn mong muốn. Sau đó, bấm vào “Chọn điểm đón” để xác nhận. Bạn cũng có thể đổi vị trí điểm bằng cách bấm lại vào điểm này.\
        \n\n- Cách 2: Chọn điểm đã đi trước đây hoặc tìm kiếm địa chỉ thông qua việc bấm vào khung địa chỉ.",
  help_book_taxi_three_header: "Xác nhận thông tin",
  help_book_taxi_three:
    "\n\n- Thông tin đặt xe của bạn sẽ được hiển thị trên màn hình. Tại đây, bạn có thể:\
        \n\t+ Thay đổi thời gian đón xe.\
        \n\n\t+ Nhập mã khuyến mại, nếu có.\
        \n\n\t+ Thêm thông tin cho tài xế.\
        \n\n- Bấm “Đặt xe” để gửi thông tin đặt xe lên hệ thống G7Taxi. Quá trình đặt xe đã hoàn thành, bạn vui lòng chờ xe đến đón.",
  help_book_taxi_four_header: "Thông tin lái xe",
  help_book_taxi_four:
    "\n\n- G7Taxi sẽ tiến hành tìm kiếm lái xe gần nhất thỏa mãn yêu cầu của bạn.\
        \n- Thông tin lái xe đến đón sẽ được hiển thị trên màn hình. Bạn có thể gọi trực tiếp cho lái xe.\
        \n\n- Vị trí của xe sẽ liên tục được cập nhật trên màn hình. Bạn có thể chủ động trong việc đón taxi hơn.",
  help_book_taxi_five_header: "Hoàn thành chuyến đi",
  help_book_taxi_five:
    "\n\n- Khi lái xe đã đón bạn, vui lòng bấm “Gặp xe” để lái xe xác nhận đã đón đúng bạn.\
        \n\n- Lúc này, bạn có thể bấm “Hoàn thành” để nhận xét lái xe và kết thúc chuyến đi với G7Taxi.",
  help_cancel_book_one_header: "Nhắc nhở",
  help_cancel_book_one:
    "\n\n- Sau khi đặt lịch thành công, ứng dụng sẽ luôn hiển thị “Có lịch đặt” trên menu cho đến khi hết hạn hoặc bị hủy.\
        \n\n- Để hủy chuyến đi, bạn cần chuyển sang chức năng “Lịch sử”.",
  help_cancel_book_two_header: "Chuyến đặt lịch",
  help_cancel_book_two:
    "\n\n- Chuyến đặt lịch khả dụng sẽ được đặt trên đầu danh sách cùng với trạng thái “Đặt lịch” màu xanh.\
        \n\n- Chọn chuyến để xem chi tiết.",
  help_cancel_book_three_header: "Hủy chuyến đi",
  help_cancel_book_three:
    "\n\n- Thông tin chi tiết của chuyến đặt lịch sẽ được hiển thị.\
        \n\n- Bạn có thể hủy chuyến bằng cách bấm nút “Hủy lịch”.",
  // <!-- Thông tin trợ giúp -->
  help_manager_title: "Trợ giúp",
  help_manager_warrning:
    "Hiện tại không có thông tin hướng dẫn trợ giúp, vui lòng thử lại sau!",
  // <!-- Thông tin about -->
  about_manager_title: "Giới thiệu",
  about_manager_sologan: "Luôn vươn tới sự hoàn thiện",
  contact_binhanh_hotline_txt: "Hotline:",
  help_about_version_app: "Phiên bản:",
  about_detail_default:
    "\tG7Taxi là một trong những doanh nghiệp đi đầu trong lĩnh vực vận chuyển khách bằng taxi tại Hà Nội.\
        \n\n\tVới số lượng trên 1.000 xe, đội ngũ lái xe chuyên nghiệp, giàu kinh nghiệm.\n\n\tG7Taxi luôn mong muốn là bạn đồng hành tin cậy và luôn sẵn sàng phục vụ Quí khách.",
  about_share_app: "CHIA SẺ",
  about_rate_app: "ĐÁNH GIÁ",
  //about_copyright: "Thiết kế bởi Công ty Điện tử Bình Anh",
  version_required: "Bạn cần cập nhật phiên bản mới để tiếp tục sử dụng",
  // <!-- Url điều khoản sử dụng -->
  term_of_user_url: "",

  // <!-- String lib -->
  prefs_theme_key: "Theme",

  // <!-- Các lable button -->
  alert_dialog_title: "Thông báo",
  alert_dialog_title_detail: "Chi tiết",
  btn_ok: "Đồng ý",
  btn_update: "Cập nhật",
  btn_delete: "Xóa",
  btn_dismiss: "Bỏ qua",
  btn_exit: "Thoát",
  btn_next: "Tiếp tục",
  btn_login: "Đăng nhập",
  btn_logout: "Đăng xuất",
  btn_back: "Quay lại",
  btn_reconnect: "Kết nối lại",
  btn_sent: "Gửi",
  btn_setting: "Cài đặt",
  btn_confirm: "Xác nhận",
  btn_restart: "Khởi động lại",
  btn_accept: "Nhận",
  btn_finish: "Kết thúc",
  btn_fast_book: "Đi ngay",
  btn_book_taxi: "Đặt taxi",

  // <!-- Cảnh báo gps, địa chỉ -->
  gps_network_not_enabled: "Thiết bị chưa được bật dịch vụ vị trí!",
  waiting_connected_gps: "Đang xác định vị trí của bạn…",
  error_alert: "Lỗi khi lấy dữ liệu từ server",
  server_waiting_retry: "Không kết nối được tới máy chủ, bạn hãy thử lại sau.",
  not_server_infor: "Không nhận được thông tin từ trung tâm điều hành",
  gps_alert_loadscreen:
    "Ứng dụng cần dịch vụ vị trí để lấy địa chỉ hiện tại của bạn để đặt xe.",

  // <!-- Thông báo relogin -->
  relogin_wating_connect: "Đang kết nối với server",
  relogin_connect_finish: "Thiết bị đã kết nối với server",
  relogin_connect_fail: "Thiết bị không kết nối với server",

  // <!-- Thông báo trên menu khi đang có cuốc -->
  menu_state_title: "Đang có cuốc đặt",
  alarm_was_schedule_booking: "Có lịch đặt",

  // <!-- đồng bộ dữ liệu -->
  sync_waiting_title: "Đang đồng bộ dữ liệu với server",
  sync_not_network:
    "Bạn vui lòng bật kết nối mạng trước khi sử dụng chức năng này!",
  sync_waiting_retry:
    "Không đồng bộ được dữ liệu, bạn vui lòng kiểm tra kết nối và thử lại!",

  // <!-- đăng ký tài khoản -->
  driver_info_nome: "Tên lái xe",
  driver_info_plate: "Biển số xe",
  driver_info_car_no: "Số xe:",
  driver_info_car_color: "Màu xe:",
  car_type_unknown: "Không xác định",
  user_promotion: "Mã khuyến mại",
  join_driver_app: "Lái xe cùng G7Taxi App",
  join_driver_app_url: "",
  about_version_app: "Phiên bản:",
  about_version_app_alert:
    "Có phiên bản mới cần cập nhật, vui lòng chọn đồng ý",
  search_google_input: "Nhập từ khóa để tìm địa chỉ",
  search_google_alert:
    "Không tìm thấy kết quả nào phù hợp với từ khóa bạn nhập",

  // <!-- Thông báo footer -->
  footer_not_support_are: "Ngoài vùng hỗ trợ",
  footer_not_support_confirm:
    "Xin lỗi bạn. Hiện tại, G7Taxi chưa hỗ trợ đặt xe tại vùng này.",

  search_address_from: "Chọn điểm đi",
  search_address_to: "Chọn điểm đến",
  search_address_i_m_going_to: "Tôi muốn đến...",
  search_address_to_confirm: "Xác nhận địa chỉ",

  search_address_to_confirm_from: "Xác nhận điểm đi",
  search_address_to_confirm_to: "Xác nhận điểm đến",
  profile_address_history_title: "Lịch sử, địa chỉ gần đây",
  profile_address_favorite_title: "Địa điểm yêu thích",
  search_address_home: "Nhà riêng",
  search_address_home_hint: "Thêm địa chỉ nhà riêng",
  search_address_home_null: "Hiện tại bạn chưa có địa chỉ nhà riêng!",
  search_address_working: "Công ty",
  search_address_working_hint: "Thêm địa chỉ công ty",
  search_address_work_null: "Hiện tại bạn chưa có địa chỉ nơi làm việc!",

  // <!-- Menu khuyến mại -->
  news_promotion_title: "Tin khuyến mại",
  news_promotion_empty: "Hiện tại không có tin khuyến mại nào!",
  sales_promotion_empty: "Hiện tại bạn không có mã khuyến mại nào!",
  sales_promotion_title: "Mã khuyến mại",
  sales_promotion_only:
    "Lưu ý: mã khuyến mại chỉ được sử dụng một lần duy nhất",
  sales_item_used: "Đã dùng",
  sales_item_fulltime: "Hết hạn",
  sales_item_availability: "Khả dụng",
  sales_item_des_availability: "Đang trong khuyến mại",
  sales_item_money: "Giảm",
  sales_item_timer: "Hạn dùng đến:",

  // <!-- Loại cuốc đặt -->
  book_type_return: "Chiều về",
  book_type_long: "Đường dài",
  book_type_contract: "Hợp đồng",
  book_finish: "Thành Công",
  book_fail: "Thất bại",

  // <!-- Menu giá cước -->
  taxi_price_title: "Giá cước",
  taxi_price_empty: "Hiện tại chưa có dữ liệu về giá cước!",
  taxi_price_note:
    "Giá cước đã bao gồm thuế VAT, chưa bao gồm phí cầu phà, bến bãi",
  taxi_fare_suggest: "Bạn có thể chọn lại loại xe mong muốn để đặt xe!",

  // <!-- Thêm thông tin cho chi tiết lịch sử Phiệt Học-->
  history_book_km: "Quãng đường:",
  history_book_total_time: "Thời gian thực hiện:",
  postage_title: "Cước phí:",

  // <!-- Thông tin cước phí -->
  fare_title: "Cước phí",
  fare_total_label: "Cước di chuyển",
  fare_wait_label: "Cước chờ",
  fare_extend_label: "Phụ phí",
  fare_sale_label: "Khuyến mại",
  fare_pay_label: "Thanh toán",

  // <!-- Thông báo khi khách hàng kết thúc cuốc trước khi lái xe gửi bản tin DONE -->
  book_car_finish_not_fare:
    "Bạn vui lòng chờ cho tới khi kết thúc chuyến đi để có cước phí thanh toán chính xác nhất",
  book_car_not_fare:
    "Chưa ước lượng được cước di chuyển, bạn vui lòng thử lại để tiếp tục đặt xe.",
  book_car_distance_min:
    "Khoảng cách đặt xe quá gần, bạn vui lòng kiểm tra điểm đến để tiếp tục đặt xe!",

  language_vi_label: "Tiếng Việt",
  language_en_label: "English",

  customer_news_title: "Tin tức",
  customer_news_empty:
    "Hiện tại không có tin tức mới, bạn vui lòng thử lại sau!",

  support_title: "Tổng đài hỗ trợ",
  support_about: "Tổng đài chăm sóc khách hàng 24/7",

  book_schedule_hour: "Giờ",
  book_schedule_minute: "Phút",

  // <!-- Tài khoản -->
  user_register_phone_empty: "Bạn chưa nhập số điện thoại",
  user_register_name_empty:
    "Vui lòng nhập tên vào ô trống để tiếp tục đăng ký!",
  accounts_pattern_phone:
    "Số điện thoại bạn nhập không đúng, xin vui lòng nhập lại",
  accounts_pattern_email: "Email bạn nhập không đúng, xin vui lòng nhập lại",
  accounts_term_of_used_error:
    "Bạn phải đồng ý với điều khoản sử dụng trước khi đăng ký",
  accounts_pattern_verify_code: "Mã kích hoạt phải là một số có 4 chữ số",
  accounts_user_active_status:
    "Nhập mã với 4 chữ số đã gửi tới",
  account_validate_not_receive: "Bạn chưa nhận được mã?",
  user_profile_manager_delete_detail:
    "Lịch sử đặt xe sẽ bị xóa cùng với tài khoản. Bạn có muốn xóa tài khoản này không?",
  user_not_delete_alert: "Bạn đang đặt xe, không xóa được tài khoản",

  // <!-- Các lỗi khi đăng ký tài khoản -->
  user_register_message_one:
    "Mã kích hoạt tài khoản đã được gửi tới số điện thoại của bạn, xin vui lòng kiểm tra tin nhắn sms",
  user_register_message_two:
    "Mã kích hoạt tài khoản đã được gửi tới bạn qua tin nhắn SMS",
  user_register_message_three:
    "Số điện thoại mà bạn đăng ký đang bị khóa, bạn vui lòng đăng ký lại sau #",
  user_register_message_three_sub:
    "Số điện thoại này đang bị tạm khóa, bạn vui lòng đăng ký lại!",
  user_register_message_four:
    "Số điện thoại mà bạn đăng ký đang bị khóa, bạn vui lòng liên hệ trực tiếp với G7Taxi để đăng ký lại",
  user_register_message_five:
    "Số điện thoại bạn nhập không đúng, xin vui lòng nhập lại",
  user_register_message_six:
    "Số điện thoại của bạn đã gửi đăng ký quá nhiều lần trong 24h qua, vui lòng đăng ký lại sau 24h tới",
  user_register_message_sevent:
    "Bạn đã đăng ký quá nhiều lần trong 24h qua, vui lòng đăng ký lại sau 24h tới",
  user_create_message_eight: "",
  user_create_message_nine:
    "Thiết bị của bạn bị khóa do vi phạm điều khoản sử dụng. Vui lòng liên hệ trực tiếp với G7Taxi để đăng ký lại",
  user_create_message_nine_sub:
    "Tài khoản của bạn bị khóa do vi phạm điều khoản sử dụng. Vui lòng đăng ký lại sau #",
  user_register_teen:
    "Mã giới thiệu bạn đã nhập không chính xác, vui lòng kiểm tra và thử lại!",
  user_register_message_phone_change:
    "Số điện thoại đã thay đổi. Bạn vui lòng đăng ký lại",
  user_create_input_error:
    "Bạn vừa nhập sai mã kích hoạt, xin vui lòng nhập lại hoặc tạo mã kích hoạt mới",
  user_register_message_full_time:
    "Mã kích hoạt tài khoản bạn vừa nhập đã hết thời hạn sử dụng, xin vui lòng tạo mã kích hoạt mới",
  user_register_finish: "Đăng ký tài khoản thành công",
  alert_not_connect_server: "Không kết nối được đến server! Vui lòng thử lại.",

  // <!-- Các thông báo update profile -->
  user_update_profile_succeed: "Cập nhật thông tin thành công",
  user_update_profile_fail: "Cập nhật thông tin thất bại",
  // <!-- Thông báo xóa tài khoản thành công -->
  user_delete_profile_succeed: "Xóa tài khoản thành công",
  user_delete_profile_fail: "Xóa tài khoản không thành công, bạn hãy thử lại",
  user_share_promotion_1: "Hãy nhập mã giới thiệu ",
  user_share_promotion_2: " để nhận ưu đãi khi dùng ứng dụng ",

  // <!-- thông báo sau khi đặt xe trong tương lai thành công -->
  booked_taxi_airport:
    "Cuốc đặt của bạn đã được gửi lên tổng đài G7Taxi, vui lòng đợi trong giây lát!",
  booked_taxi_schedule:
    "Cuốc đặt lịch của bạn đã được gửi lên tổng đài G7Taxi, vui lòng đợi trong giây lát!",
  booked_taxi_schedule_cancel_success: "Bạn đã hủy lịch hẹn thành công",
  booked_taxi_cancel_success:
    "Công ty đã nhận thông tin hủy đặt xe của quý khách, cảm ơn quý khách đã dùng dịch vụ của chúng tôi.",
  booked_taxi_cancel_error:
    "Có lỗi xảy ra, bạn vui lòng liên hệ trực tiếp với hãng để huỷ chuyến đi.",
  booked_taxi_cancel_fail:
    "Bạn đã hủy cuốc không thành công do mất kết nối mạng!",
  booked_taxi_relogin_fail: "Hệ thống mạng bị lỗi, bạn vui lòng đặt lại xe.",
  booked_taxi_schedule_success:
    "Trung tâm đã nhận thông tin đặt xe của bạn. Trung tâm sẽ gọi điện lại cho bạn để xác nhận",
  booked_taxi_schedule_login_fail:
    "Thông tin đăng nhập không đúng, bạn vui lòng đăng ký lại",
  booked_taxi_schedule_time_out:
    "Hệ thống đặt xe đang bận, bạn vui lòng gọi trực tiếp đến hãng",
  booked_taxi_schedule_cancel:
    "Taxi # không thể điều xe đến đón bạn, bạn vui lòng gọi trực tiếp đến hãng.",
  booked_taxi_schedule_look:
    "Tài khoản của bạn đã bị khóa do vi phạm quy định, vui lòng liên hệ trực tiếp với G7Taxi.",
  booked_taxi_schedule_look_time:
    "Tài khoản của bạn đã bị khóa do vi phạm quy định, vui lòng thử lại sau #",

  book_alert_network: "Bạn đang offline, vui lòng kiểm tra lại kết nối!",

  // <!-- Thông báo khi có xe điều qua đàm -->
  book_operator_set_car_success:
    "Đã có xe Taxi Thành Công nhận đón quý khách, xin quý khách vui lòng chờ trong một vài phút",
  book_operator_set_car_fail:
    "Rất tiếc, hiện tại không có xe khả dụng gần đây, chúng tôi rất xin lỗi Quý khách vì sự bất tiện này",

  // <!-- Thông báo ko hỗ trợ đặt xe theo vùng địa chỉ -->
  booked_not_suport: "Hiện tại không hỗ trợ đặt xe vùng này",
  booked_not_support_car_type:
    "Không lấy được dữ liệu xe ở vùng này, bạn hãy thử lại",

  // <!-- Thông báo trong quá trình đặt xe -->
  book_driver_phone_empty: "Chưa lấy được số điện thoại của lái xe",

  // <!-- Thông báo đặt lịch hẹn -->
  alarm_history: "Không chọn được thời gian trong quá khứ để đặt lịch",
  alarm_max_date: "Lịch hẹn phải dưới 7 ngày",
  alarm_max_time: "Khoảng thời gian đặt xe tối đa là 8 tiếng",
  alarm_low: "Lịch hẹn phải trên 15 phút",
  alarm_from_and_to: "Khoảng thời gian đặt xe tối thiểu là 30 phút",
  alarm_was_schedule_booking_confirm:
    "Ứng dụng chỉ hỗ trợ một chuyến đặt lịch trong một thời điểm. Bạn có muốn hủy đặt lịch đã có không?",

  // <!-- Thông báo liên quan Menu -->
  booked_change_language_alert:
    "Bạn đang đặt taxi, vui lòng đổi ngôn ngữ sau khi hoàn thành",
  booked_not_book_taxi: "Bạn đang đặt taxi, vui lòng sử dụng chức năng này sau",

  // <!-- Thông báo lịch sử -->
  history_not_booking: "Bạn chưa có thông tin của chuyến đặt taxi nào",
  history_delete_finish: "Thông tin về chuyến đi đã được xóa thành công",
  history_delete_error:
    "Có lỗi trong quá trình xóa, bạn vui lòng thử lại lần sau",
  history_delete_schedule_finish: "Lịch hẹn của bạn đã được xóa",
  history_delete_shcedule_error:
    "Có lỗi trong quá trình hủy, bạn vui lòng thử lại lần sau",
  history_delete_alert: "Bạn có muốn xóa thông tin về chuyến đi này không?",

  // <!-- Các thông báo màn hình viewcar -->
  marker_title_catcher_user: "Xe đến điểm",

  // <!-- Các thông báo mã khuyến mại -->
  promotion_success_alert: "Mã khuyến mại hợp lệ",
  promotion_seccess_detail: "Bạn được khuyến mại:",
  promotion_fail_alert: "Mã khuyến mại không hợp lệ",
  promotion_fail_time_alert: "Mã khuyến mại đã quá hạn",
  promotion_fail_check: "Không kiểm tra được mã khuyến mại",

  // <!-- Gửi góp ý -->
  feedback_create_user: "Bạn cần đăng ký tài khoản trước khi gửi góp ý!",
  feedback_sent_finish:
    "Cảm ơn bạn đã góp ý với chúng tôi! Chúng tôi đã ghi nhận và sẽ hồi đáp bạn sớm nhất có thể",
  feedback_sent_not_finish:
    "Có lỗi trong quá trình gửi. Bạn vui lòng gửi lại hoặc gọi trực tiếp cho cho chúng tôi",
  feedback_required_field: "Bạn chưa nhập nội dung góp ý!",

  // <!-- Chia sẻ qua facebook -->
  share_facebook_success: "Cảm ơn bạn đã chia sẻ thông tin cho chúng tôi",

  // <!-- Thoát ứng dụng -->
  exit_app_alert: "Back thêm lần nữa để thoát ứng dụng",
  exit_app_confirm: "Bạn có muốn thoát ứng dụng?",

  // <!-- Thông báo yêu cầu cấp quyền cho ứng dụng -->
  permission_settings_alert:
    "Bạn vui lòng bật quyền chức năng cho ứng dụng để tiếp tục sử dụng!",
  permission_data_warning:
    "Bạn vui lòng tạm dừng chế độ tiết kiệm dữ liệu để quá trình đặt xe hoạt động tốt nhất!",

  address_confirm_empty: "Vui lòng chọn địa chỉ đến trước khi đặt xe!",

  // ======================== Màn hình rating ============================== //
  rating_title: "Đánh giá lái xe",
  rating_low: "Kém",
  rating_moderate: "Trung bình",
  rating_good: "Khá",
  rating_great: "Tốt",
  rating_excellent: "Rất tốt",
  rating_content: "Vui lòng đánh giá chất lượng lái xe trong chuyến đi của bạn",
  rating_content_v2: "Chuyến đi của bạn thế nào?",
  rating_yourname: "Tên của bạn",
  rating_type: "Loại đánh giá",
  rating_content_note: "Thông tin góp ý thêm",
  rating_btn_dismiss: "Bỏ qua",
  rating_btn_send: "Gửi",

  // màn hình khuyến mãi
  discount_first_install: "Khuyến mãi cài App mới",
  discount_enable: "Khả dụng",
  discount_disable: "Không khả dụng",
  discount_warn_once: "Lưu ý: mã khuyến mãi chỉ được sử dụng một lần duy nhất",
  discount_empty_news: "Hiện tại không có tin khuyến mãi nào!",
  discount_empty_codes: "Hiện tại không có mã khuyến mãi nào!",

  // Giá trị mặc định.
  empty_string: "",
  // Vehicle Select Dialog.
  vsd_title: "Chọn loại xe",
  vsd_select_car_description: "Hãy chọn loại xe và giá cước phù hợp!",
  vsd_money_unit: "VNĐ ",
  ...vi
};


let LANGUAGE_EN = {

  register_code_unknown: "Unknown",
  register_title: "Register",
  home_screen_title: "Booking taxi",
  home_history_title: "History",
  title_detail_history: "Trip Detail",
  home_promotion_title: "Promotion",
  home_alert_title: "Article",
  home_feedback_title: "Feedback",
  home_about_title: "About",
  home_help_title: "Help",

  feedback_fail: "Có lỗi xảy ra, vui lòng thử lại",

  search_address_title: "Search",
  search_address_number: "No",

  status_successful: "Successful",
  status_cancelled: "Cancelled",
  status_promation: "Promotion",

  about_content_one:
    "\tXe chất lượng cao - giá cước rẻ - phục vụ chuyên nghiệp.",
  about_content_two:
    "\tTheo dõi Xe đến đón, lộ trình và dự kiến giá cước chuyến đi.",
  about_content_three:
    "\tDễ dàng tương tác với tổng đài để được hỗ trợ tốt nhất.",
  about_content_four:
    "\tĐặt lịch trước với chúng tôi cho chuyến đi của bạn hoàn hảo hơn.",
  about_content_five: "\tLưu lại lịch sử để phản hồi hoặc tìm đồ thất lạc.",

  about_btn_share: "Share",
  about_btn_rate: "Rate",
  about_copyright: "©2018 Design by Binh Anh Electronics",

  // TaxiLibs ---------------------------------
  // <!-- Thông tin chung -->
  //app_name: "G7Taxi",
  // <!-- Các lable button -->
  btn_call: "Call operator",
  btn_call_driver: "Call driver",
  btn_retry: "Try again",
  btn_book_again: "Re booking",
  btn_cancel: "Cancel",
  btn_complete: "Finish",
  dialog_confirm_meetcar: "Have you checked in?",
  dialog_confirm_meetcar_yes: "Checked-in",
  dialog_rate_title: "Rating",
  dialog_rate_driver_name: "Driver name",
  dialog_rate_content: "Please rate the quality drive for your trip",
  dialog_rate_quality: "Quality type",
  dialog_rate_content_null: "Please rate before sending!",
  dialog_rate_content_empty:
    "Please enter your comment into the box to make the service better.",
  dialog_rate_send_fail: "Your feedback has been sent unsuccessfully",
  dialog_rate_content_note: "Additional information",
  dialog_rate_sent_btn: "Sent",

  booking_share_btn: "Booking share",
  book_button_new: "Book again",
  title_marker_center_no_car: "No taxis",
  book_button_meetcar: "Get on taxi",
  alert: "Warining",
  // <!-- Cảnh báo google play service chưa cài đặt -->
  update_google_service: "Please update Google services to lastest version!",
  update_software:
    "An update of this app, including a lots of new feature, is available on Play store. You should update to lastest version for better experience",
  // <!-- Cảnh báo gps, địa chỉ -->
  gps_not_enabled: "Please enable Location Service!",
  gps_network_not_get_location: "Fetching your current location…",
  waiting_notification_connected_gps: "Fetching your current location…",
  address_loadding: "Fetching address…",
  no_address: "Could not fetch address at this point",
  add_favorite_point_failt: "Add favorite point failt, please try again",
  delete_history_point_failt: "Something went wrong, please try again",
  no_network: "Please check your Internet connection!",
  no_search_result: "No results matched your key words!",
  confirm_not_network: "Please check your Internet connection",
  // <!-- Xử lý ngoại lệ -->
  not_connected_server: "Could not connect to server. Please try again later",
  connected_server_time_out:
    "Internet connection is unstable. Please re-connect to get latest booking info.",
  dialog_waiting_title: "Please wait a minute…",
  not_connected_server_retry_book:
    "An unexpected error has occurred. Please re-do your booking",
  // <!-- đăng ký tài khoản -->
  term_of_used: "Terms &amp; Conditions",
  user_profile_back: "User",
  accounts_user_default: "Register",
  accounts_user_profile: "User Profile",
  user_name_default: "User name",
  user_email_default: "Email",
  user_refcode_default: "Referral code",
  accounts_term_of_used: "I agree to",
  accounts_term_of_used_link: "Terms & Conditions",
  accounts_user_hint_phone: "Phone number(*)",
  user_register_title: "Register",
  user_verify_title: "Enter verification code",
  accounts_user_verify_code: "Enter verification code",
  accounts_user_active_ok: "Confirm",
  accounts_user_active_try: "00:05:00",
  user_profile_title: "Profile",
  user_profile_info_email: "Email:",
  user_profile_info_pass: "Password:",
  user_profile_info_phone: "Phone:",
  user_profile_info_phone_hint: "Phone number",
  user_profile_manager_hint_pass: "Password",
  user_profile_manager_hint_email: "Email",
  user_profile_manager_delete: "Delete account",
  manager_selecter_avatar: "Choose your profile picture",
  manager_selecter_album: "Photo library",
  manager_selecter_camera: "Camera",
  user_verify_try_btn: "Re-send SMS",
  user_verify_try_btn_time: "Re-send SMS after: ",
  accounts_user_active_has_code: "Has the activation code",
  accounts_user_active_cancel: "Cancel",
  profile_driver_blocked_btn: "Danh sách lái xe bị chặn",

  // <!-- màn hình tùy chọn hãng -->
  book_company_title: "Taxi companies",
  book_company_favorites: "Choose favourite companies",
  book_company_title_like: "Your favourite companies",
  book_company_title_normal: "Normal companies",
  book_company_found_option_title: "Search optionals",
  book_company_found_option_1: "Search car which is the nearest",
  book_company_found_option_2: "Search car in favourite companies",
  book_company_found_alert:
    "You have not favourite company, please choose favourite company to use this services!",
  book_company_like: "Favourites",
  book_company_block: "Dislike companies",

  // <!-- Màn hình cái đặt -->
  book_taxi_title: "Taxi Booking",
  book_confirm_title: "Confirm",
  book_taxi_btn: "Book",
  book_taxi_confirm: "Confirm booking",
  book_address: "Address",
  book_address_null: "Could not fetch address at this point",
  book_address_from: "Pick-up point",
  book_address_to: "Drop-off point",
  book_address_from_empty: "Your address is invalid",
  book_address_to_empty: "You do not choose pick-up point",
  book_not_support_top: "Not supported area",
  book_not_support_bottom: "Support",
  book_check_allow_call: "Allow receiving call from Taxi operator",
  book_address_reselect_a: "Pick-up location’s information is invalid",
  book_address_reselect_b: "Drop-off location’s information is invalid",
  book_address_to_airport: "Noi Bai airport",
  book_estimation_info:
    "Distance is estimated, and the price is subject to actual condition",

  book_taxi_return: "Taxi return",
  cartype_inner_city_tab: "Taxi",
  cartype_car_tab: "Car",

  // <!-- Màn hình chọn hãng taxi -->
  taxi_proceeding_menu_title: "Booking proceeding",
  // <!-- màn hình xác nhận yêu cầu đặt xe -->
  book_receive_taxi_company: "Your request is being processed. Please wait",
  book_cancel_des: "Do you want to cancel this booking?",
  book_datepicker_alert:
    "Pickup time should be at least 15 minutes from now to the next 7 days",
  book_create_user_alert: "You have to register before book a taxi",
  book_confirm_network_error: "Please check your network connection",
  book_time_title: "Set time",
  book_date_title: "Set date",
  book_notes_title: "Note",
  book_notes_hint_button: "Note",
  book_notes_hint_input:
    "Example: I'm going to the airport and bring a lot of luggage, etc…",
  book_notes_description: "Additional information for the driver",
  book_schedule_title: "Pickup time",
  book_alarm_waiting_title: "Schedule",
  book_alarm_cancel_title: "Cancelled",
  book_confirm_schedule_alert:
    "G7Taxi only supports one scheduled booking at a time. Do you want to cancel your current ones?",
  book_confirm_cancel_schedule_book: "Do you want to cancel your scheduled?",
  book_confirm_schedule_cancel: "Cancel schedule",
  book_schedule_cancel_btn: "Cancel booking",
  book_schedule_show_btn: "View details",
  book_confirm_promotion: "Promotion",
  book_taxi_promotion_description: "Enter promocode to get discount from G7Taxi",
  book_taxi_companies_book_item: "car",
  book_confirm_schedule_button: "Confirm",
  book_confirm_schedule_cancel_button: "Now",
  book_confirm_schedule_current_day: "Today",
  book_confirm_cartype_not_determine: "Cartype's fare not determined",
  book_carinfo_price_open: "Commencement rate up to #",
  book_carinfo_price_open_bike: "Commencement rate up to #",
  book_carinfo_price_open_detail: " VND/Km",
  book_carinfo_price_step_two: "to",
  book_carinfo_price_step_next_from: "From",
  book_carinfo_price_step_next_to: "upwards",
  book_carinfo_price_percent: "-#%",
  book_carinfo_price_distance: "fare of return\ntrip with distance\n> ",
  book_carinfo_price_wait: "Waiting time #",
  book_not_support_are: "Taxi booking is currently not supported in this area",
  // <!-- Đợi nhận thông tin từ hãng -->
  book_receive_taxi: "G7Taxi",
  book_receive_taxi_note_2:
    "G7Taxi # has successfully received your request. Please wait",
  book_receive_taxi_note_3: "Fetching driver's information…",
  book_receive_taxi_timeout:
    "Our server is currently busy, please call Taxi's operator",
  book_receive_taxi_not_relogin:
    "Cannot connect to server due to lost connection",
  book_not_enable_network: "Please check your Internet connection",
  book_connect_to_server_instability: "Internet connection is unstable",
  book_enable_network: "Connecting server…",
  book_taxi_not_network:
    "Thiết bị không có kết nối mạng, bạn vui lòng bật kết nối hoặc gọi điện đến tổng đài để tiếp tục đặt xe!",
  // <!-- Tìm kiếm địa chỉ -->
  book_search_ba_address: "Google",
  book_search_recent_address: "Recent",
  book_search_maps_address: "Google Maps",
  book_search_google_input:
    'To search with house no, use this format:\n"10 giai phong", "96 dinh cong", …\n(without punctuation marks and “so” or “no.”)',
  book_search_recent_alert: "You have not done any trip via G7Taxi",
  book_search_google_alert: "No addresses matched your key words",
  book_search_google_error: "An error has occurred, please try again later",
  book_search_google_auto: "Searching for nearby place…",
  book_search_google_gps_not_enable:
    "Location services have not been activated",
  book_selecter_address_btn: "Set start point",
  book_selecter_address_to_btn: "Set end point",
  book_search_latlng_point: "Current point",
  book_relogin_taxi_timeout:
    "Could not connect to BaSao Taxi system. Please call driver or try again later.",
  search_bar_hit: "Search",
  // <!-- Màn hình xem vị trí xe -->
  book_comfirm_distance: "Estimate information for closest taxi:",
  book_comfirm_minute_lable: "minute",
  book_step_option_btn: "Options",
  // <!-- Màn hình mời khách -->
  book_invite_subtitle: "Checked-in",
  book_invite_user_cancel:
    "Your taxi has arrived. If you want to cancel this booking, please call the driver",
  book_carinfo_subtitle: "Message",
  book_carinfo_description: "Taxi # is on the way",
  book_carinfo_description_contract: "Car no # is on the way",
  book_invite_description:
    "The driver informs that he / she has picked you up. Please verify or book another one",
  book_catcher_user_description_contract:
    "Car no # has arrived at your pickup location.",
  book_catcher_user_description: "Taxi # has arrived at your pickup location.",
  book_meet_car_confirm:
    "Lái xe đang ở xa vị trí của bạn. Bạn đã lên đúng xe # hay chưa?",
  book_cancel_btn: "Cancel",
  book_cancel_btn_success: "Success",
  book_invite_meet_car_btn: "Meet car",
  book_invite_not_meet_car_btn: "No taxi",
  book_invite_thanks_for_used:
    "Thank you for using G7Taxi's booking service. Have a good trip",
  book_operator_cancel_subtitle_notification: "G7Taxi: cancel",
  book_alert_catched_user:
    "The driver informs that he / she has picked you up. Please verify or book another one",
  book_alert_catched_user_not_driver_infor:
    "The driver informs that he / she has picked you up. Thank you for using G7Taxi service",
  // <!-- Màn hình đón khách thành công -->
  book_done_info_successful:
    "Thank you for using G7Taxi's booking service. Have a good trip",
  // <!-- Hủy quốc khác từ server -->
  book_operator_cancel_wrong:
    "Taxi #'s operator is dispatching a taxi for you. Please wait a few minutes",
  book_operator_cancel:
    "Taxi #'s operator is dispatching a taxi for you. Please wait a few minutes",
  book_operator_relogin_fail:
    "Your booking is finished unsuccessfully. Sorry for this inconvenience. Do you want to book another one?",
  book_driver_cancel:
    "Your taxi is having some issues. Sorry for this inconvenience. company is dispatching another taxi for you",
  book_driver_missed:
    "Taxi no # is having some issues. Sorry for this inconvenience.",
  book_driver_relogin_fail:
    "Your taxi is having some issues. Sorry for this inconvenience. Do you want to book another one?",
  // <!-- Thông tin viewcar -->
  taxi_back_taxi: "Taxi",
  taxi_back_time_waiting: "Time",
  taxi_back_a_to_b: "Estimate",
  taxi_back_a_to_b_sub: "A -&amp;gt; B",
  taxi_back_money: "Total fee",
  taxi_back_sale: "Discount (-#%)",
  taxi_back_money_vn: "VND",
  // <!-- Các label trong dialog gọi xe gần nhất -->
  car_number_sh: "Taxi identity",
  car_number_bsx: "Plate",
  distance_title: "Distance",
  seats_number: "seats",
  distance: "Distance: ",
  duration: "ETA: ",
  tracking_log: "Tracking log",
  // <!-- Các label trong dialog lựa chọn loại xe -->
  car_type: "Taxi type",
  taxi_title: "Taxi",
  car_type_all: "All",
  car_type_4_seat: "4 seats",
  car_type_7_seat: "7 seats",
  car_type_4_seat_airport: "4 seats airport",
  car_type_7_seat_airport: "7 seats airport",
  car_type_4_seat_low: "4 seats small",
  car_type_4_seat_large: "4 seats large",
  car_type_7_seat_small: "7 seats small",
  car_type_auto: "Taxis any",
  car_type_airport: "Airport",
  car_type_center: "Inner city",
  // <!-- Lịch sử đi xe -->
  history_title: "History",
  history_tab_book: "Taxi Booking",
  history_book_promotion: "Promotion",
  history_book_airport: "Airport",
  history_address_date: "Date:",
  history_address_from: "From:",
  history_address_to: "To:",
  history_address_not_define: "Not define",
  history_address_to_small: "to",
  history_book_taxi_shx: "Taxi identity:",
  history_retry_book_a_b: "Book A -> B",
  history_retry_book_b_a: "Book B -> A",
  history_yesterday: "Yesterday",
  history_days_ago: "Days ago",
  history_hours_ago: "Hours ago",
  history_recent: "Recent",
  // <!-- Thông tin trợ giúp -->
  feedback_manager_title: "Feedback",
  feedback_title: "We are looking forward to your feedback",
  feedback_content_title_hint: "Title",
  feedback_content_hint: "Content(*)",
  feedback_hotline: "0902 95 64 64",
  feedback_hotline_alert: "Customer service:",
  feedback_hotline_alert_b: "Fanpage",
  feedback_hotline_alert_c: "Website",
  feedback_hotline_alert_d: "Hotline",
  feedback_email_cskh: "G7Taxi.cskh@binhanh.com",
  feedback_website: "http://www.G7Taxi.com",
  feedback_fanpage_cskh: "https://www.facebook.com/G7Taxi",
  feedback_sent: "Sent",
  feedback_type_select_name: "Danh mục đánh giá",
  // <!-- Trợ giúp -->
  help_book_taxi: "Taxi booking instruction",
  help_cancel_book: "Cancel your schedule booking",
  help_book_taxi_one_header: "CAR TYPE SELECTION",
  help_book_taxi_one:
    "\n\n- You can change to another car type by touch on its icon. Selected car type will be highlighted.\
        \n\n- In order to switch between “City” and “Air port” cartype, simply touch on it or swipe left or right.",
  help_book_taxi_two_header: "Choose pick-up, drop-off point",
  help_book_taxi_two:
    "\n\n- Move the center point to your desired pick-up point. Then, touch on it to confirm. You can also change it by touch on its marker on the map.\
        \n\n- Or you can use the search function by touch on the address frame.",
  help_book_taxi_three_header: "Booking Confirmation",
  help_book_taxi_three:
    "\n\n- Your booking confirmation will be presented on the screen. You can also:\
        \n\n\t+ Change your booking time.\
        \n\n\t+ Add promo code, if available.\
        \n\n\t+ Send a addition note to your driver.\
        \n\n- Finally, press “Book” to send your books to G7Taxi’s system.",
  help_book_taxi_four_header: "Driver’s information",
  help_book_taxi_four:
    "\n\n- G7Taxi will dispatch a driver that satisfy your request.\
        \n\n- Your driver’s information will be visible on screen. You can call him / her directly.\
        \n\n- Your driver’s location will be updated continuously. You can catch your taxi proactively.",
  help_book_taxi_five_header: "Finish booking",
  help_book_taxi_five:
    "\n\n- After get on your taxi, please press “Get on taxi” to let the driver knows that he / she get the right person.\
        \n\n- Finally, press “Finish” to give your rating and feedback for this driver.",
  help_cancel_book_one_header: "Reminder",
  help_cancel_book_one:
    "\n\n- In case you have a schedule booking, app will display “Schedule booking” on the menu until it’s expired or cancelled.\
        \n\n- To cancel your booking, go to “History” function.",
  help_cancel_book_two_header: "Your schedule booking",
  help_cancel_book_two:
    "\n\n- A valid schedule booking will be placed on top on the list, with a blue “Schedule” status.\
        \n\n- Select it to view details.",
  help_cancel_book_three_header: "Cancel schedule booking",
  help_cancel_book_three:
    "\n\n- Your booking information will be displayed.\
        \n\n- You can cancel your booking by touch on “Cancel” button.",
  // <!-- Thông tin trợ giúp -->
  help_manager_title: "Help",
  help_manager_warrning:
    "Hiện tại không có thông tin hướng dẫn trợ giúp, vui lòng thử lại sau!",
  // <!-- Thông tin about -->
  about_manager_title: "About us",
  about_manager_sologan: "Luôn vươn tới sự hoàn thiện",
  contact_binhanh_hotline_txt: "Hotline:",
  help_about_version_app: "Version:",
  about_detail_default:
    "\tG7Taxi là một trong những doanh nghiệp đi đầu trong lĩnh vực vận chuyển khách bằng taxi tại Hà Nội.\
        \n\n\tVới số lượng trên 1.000 xe, đội ngũ lái xe chuyên nghiệp, giàu kinh nghiệm.\n\n\tG7Taxi luôn mong muốn là bạn đồng hành tin cậy và luôn sẵn sàng phục vụ Quí khách.",
  about_share_app: "Share",
  about_rate_app: "Rate app",
  //about_copyright: "Design by BinhAnh Electronics",
  version_required: "A new version must be updated to continue",
  // <!-- Url điều khoản sử dụng -->
  term_of_user_url: "http://125.212.226.61:6908/Home/Policy/EN",

  // <!-- String lib -->
  prefs_theme_key: "Theme",

  // <!-- Các lable button -->
  alert_dialog_title: "Message",
  alert_dialog_title_detail: "Detail",
  btn_ok: "Agree",
  btn_update: "Update",
  btn_delete: "Delete",
  btn_dismiss: "Dismiss",
  btn_exit: "Exit",
  btn_next: "Continue",
  btn_login: "Login",
  btn_logout: "Logout",
  btn_back: "Back",
  btn_reconnect: "Reconnect",
  btn_sent: "Sent",
  btn_setting: "Setting",
  btn_confirm: "Confirm",
  btn_restart: "Restart",
  btn_accept: "Accept",
  btn_finish: "Finish",
  btn_fast_book: "Now",
  btn_book_taxi: "Booking car",

  // <!-- Cảnh báo gps, địa chỉ -->
  gps_network_not_enabled: "Location Service is disabled",
  waiting_connected_gps: "Fetching your current location…",
  error_alert: "Error retrieving data from the server",
  server_waiting_retry: "Could not connect to server. Please try again later",
  not_server_infor: "Could not connect to operating center",
  gps_alert_loadscreen:
    "Ứng dụng cần dịch vụ vị trí để lấy địa chỉ hiện tại của bạn",

  // <!-- Thông báo relogin -->
  relogin_wating_connect: "Connecting to server",
  relogin_connect_finish: "Connected to server",
  relogin_connect_fail: "Not connected to server",

  // <!-- Thông báo trên menu khi đang có cuốc -->
  menu_state_title: "Booking proceeding",
  alarm_was_schedule_booking: "Scheduled booking",

  // <!-- đồng bộ dữ liệu -->
  sync_waiting_title: "Data is synchronized with server",
  sync_not_network: "Please enable network connection to using this function",
  sync_waiting_retry:
    "Not synchronized data, please check the connections and try again",

  // <!-- đăng ký tài khoản -->
  driver_info_nome: "Driver name",
  driver_info_plate: "Licence plate",
  driver_info_car_no: "Car no:",
  driver_info_car_color: "Color:",
  car_type_unknown: "Unknown",
  user_promotion: "Promotion",
  join_driver_app: "Lái xe cùng G7Taxi App",
  join_driver_app_url: "",
  about_version_app: "Version:",
  about_version_app_alert: "A new version updates, please select agree",
  search_google_input: "Enter keywords to find the address",
  search_google_alert: "No addresses matched your key words",

  // <!-- Thông báo footer -->
  footer_not_support_are: "Not supported area",
  footer_not_support_confirm:
    "Not supported area. Sorry for this inconvenience",

  search_address_from: "Set start point",
  search_address_to: "Set end point",
  search_address_i_m_going_to: "I'm going to...",
  search_address_to_confirm: "Address confirmation",

  search_address_to_confirm_from: "Confirmation start point",
  search_address_to_confirm_to: "Confirmation end point",
  profile_address_history_title: "History",
  profile_address_favorite_title: "Favorite",
  search_address_home: "Home",
  search_address_home_hint: "Add home address",
  search_address_home_null: "Please add your home address!",
  search_address_working: "Work",
  search_address_working_hint: "Add work address",
  search_address_work_null: "Please add your company address if available!",

  // <!-- Menu khuyến mại -->
  news_promotion_title: "News",
  news_promotion_empty: "No available promotion!",
  sales_promotion_empty: "You do not have any promo code!",
  sales_promotion_title: "Promotion",
  sales_promotion_only: "Attention: Promotional code is only used once",
  sales_item_used: "Consumed",
  sales_item_fulltime: "Expired",
  sales_item_availability: "Available",
  sales_item_des_availability: "Availability",
  sales_item_money: "Discount",
  sales_item_timer: "Expired Date:",

  // <!-- Loại cuốc đặt -->
  book_type_return: "Return",
  book_type_long: "Đường dài",
  book_type_contract: "Contract",
  book_finish: "Success",
  book_fail: "Cancelled",

  // <!-- Menu giá cước -->
  taxi_price_title: "Price",
  taxi_price_empty: "There are no data of fee!",
  taxi_price_note: "Price includes VAT, not including ferry bridge, yard.",
  taxi_fare_suggest: "You can reselect car type to booking.",

  // <!-- Thêm thông tin cho chi tiết lịch sử Phiệt Học-->
  history_book_km: "Distance:",
  history_book_total_time: "Total time:",
  postage_title: "Bills:",

  // <!-- Thông tin cước phí -->
  fare_title: "Bills",
  fare_total_label: "Base fee",
  fare_wait_label: "Waiting time",
  fare_extend_label: "Tolls and others",
  fare_sale_label: "Promotion",
  fare_pay_label: "Total",

  // <!-- Thông báo khi khách hàng kết thúc cuốc trước khi lái xe gửi bản tin DONE -->
  book_car_finish_not_fare:
    "Please wait until the end of the trip to have the most accurate payment.",
  book_car_not_fare:
    "Can not estimate moving charges, please try again to continue booking.",
  book_car_distance_min:
    "Distance too close, please check the destination to continue car booking!",

  language_vi_label: "Vietnamese",
  language_en_label: "English",

  customer_news_title: "News",
  customer_news_empty: "Currently, You have not new news!",

  support_title: "Customer service",
  support_about: "24/7 Customer Service Center",

  book_schedule_hour: "Hour",
  book_schedule_minute: "Minute",

  // <!-- Tài khoản -->
  user_register_phone_empty: "Phone number is required",
  user_register_name_empty:
    "Enter your name into the form to continue register please!",
  accounts_pattern_phone: "Your phone number is invalid, please check it again",
  accounts_pattern_email: "Your email is invalid, please check it again.",
  accounts_term_of_used_error:
    "You have to agree with the Terms &amp; Conditions",
  accounts_pattern_verify_code: "Verification code has 4 digit numbers",
  accounts_user_active_status:
    "A verification code has been sent to",
  account_validate_not_receive: "Bạn chưa nhận được mã?",
  user_profile_manager_delete_detail: "Do you want to delete your account?",
  user_not_delete_alert:
    "You could delete your account after finished booking taxi.",

  // <!-- Các lỗi khi đăng ký tài khoản -->
  user_register_message_one: "A verification code has been sent to your number",
  user_register_message_two:
    "An activation code has been sent to your number via SMS",
  user_register_message_three:
    "Your number is temporary locked. Please try again after #",
  user_register_message_three_sub:
    "Your number is temporary locked. Please contact us to unlock this number",
  user_register_message_four:
    "Your number is temporary locked. Please contact us to unlock this number",
  user_register_message_five:
    "Your phone number is invalid, please check it again",
  user_register_message_six:
    "You have tried to register too many times today . Please try again in the next 24 hours",
  user_register_message_sevent:
    "Your number is temporary locked. Please try again in the next 24 hours",
  user_create_message_eight: "",
  user_create_message_nine:
    "Your device is locked because of Terms &amp; Conditions violation. Please contact G7Taxi for further support",
  user_create_message_nine_sub:
    "Your account is temporary locked because of Terms &amp; Conditions violation. Please try again after #",
  user_register_teen:
    "Mã giới thiệu bạn đã nhập không chính xác, vui lòng kiểm tra và thử lại!",
  user_register_message_phone_change:
    "Your phone number has been changed, please use Register function.",
  user_create_input_error: "Invalid verification code",
  user_register_message_full_time:
    "Verification code expried. Please request a new code.",
  user_register_finish: "Your account is successfully activated",
  alert_not_connect_server:
    "Could not connect to server. Please try again later.",

  // <!-- Các thông báo update profile -->
  user_update_profile_succeed:
    "Your information has been updated successfully!",
  user_update_profile_fail: "Your information has failed to update!",
  // <!-- Thông báo xóa tài khoản thành công -->
  user_delete_profile_succeed: "Your account has been deleted successfully",
  user_delete_profile_fail: "An error has occurred, please try again",
  user_share_promotion_1: "Enter promotion code ",
  user_share_promotion_2: " to get endown when using app ",

  // <!-- thông báo sau khi đặt xe trong tương lai thành công -->
  booked_taxi_airport:
    "Your booking is successfully scheduled. Taxi G7Taxi will pick you up at!",
  booked_taxi_schedule:
    "Your booking is successfully scheduled. Taxi G7Taxi will pick you up at!",
  booked_taxi_schedule_cancel_success:
    "Your scheduled booking has been cancelled successfully",
  booked_taxi_cancel_success: "You have successfully cancelled your booking.",
  book_operator_set_car_fail:
    "Rất tiếc, không có xe khả dụng gần đây, chúng tôi rất xin lỗi Quý khách vì sự bất tiện này",
  booked_taxi_cancel_error:
    "Có lỗi xảy ra, bạn vui lòng liên hệ trực tiếp với hãng để huỷ chuyến đi.",
  booked_taxi_cancel_fail:
    "We could not cancel you booking. Please check your Internet connection!",
  booked_taxi_relogin_fail:
    "An unexpected error has occurred. Please re-do your booking.",
  booked_taxi_schedule_success:
    "Operator has received your booking information. Taxi operator will contact you for verification",
  booked_taxi_schedule_login_fail:
    "Your account information is invalid. Please registry again",
  booked_taxi_schedule_time_out:
    "Booking service is currently unavailable, please call Taxi's operator",
  booked_taxi_schedule_cancel:
    "Taxi # could not dispatch a taxi for you, please call Taxi's operator",
  booked_taxi_schedule_look:
    "Your account is temporary locked because of Terms &amp; Conditions violation. Please contact G7Taxi for support.",
  booked_taxi_schedule_look_time:
    "Your account is temporary locked because of Terms &amp; Conditions violation. Please try again after #",

  book_alert_network: "Please check your Internet connection!",

  // <!-- Thông báo ko hỗ trợ đặt xe theo vùng địa chỉ -->
  booked_not_suport: "Taxi booking is currently not supported in this area",
  booked_not_support_car_type:
    "Could not get available taxies, please try again",

  // <!-- Thông báo trong quá trình đặt xe -->
  book_driver_phone_empty: "Could not fetch driver's number",

  // <!-- Thông báo đặt lịch hẹn -->
  alarm_history: "You are not allowed to select a time in the past",
  alarm_max_date: "Schedule booking is not allowed over 7 days",
  alarm_max_time: "Maximum duration between From time and To time is 8 hours",
  alarm_low: "Schedule booking is not allowed under 15 minutes",
  alarm_from_and_to:
    "Minimum duration between From time and To time is 30 minutes",
  alarm_was_schedule_booking_confirm:
    "G7Taxi only supports one scheduled booking at a time. Do you want to cancel your current ones ?",

  // <!-- Thông báo liên quan Menu -->
  booked_change_language_alert:
    "You could change app language after finished booking taxi",
  booked_not_book_taxi:
    "You have to finish your booking before using this function",

  // <!-- Thông báo lịch sử -->
  history_not_booking: "No taxi schedule recorded",
  history_delete_finish:
    "This trip has been removed from your history successfully",
  history_delete_error: "An unexpected error has occurred. Please try again",
  history_delete_schedule_finish: "Your booking has been removed successfully",
  history_delete_shcedule_error:
    "An unexpected error has occurred. Please try again",
  history_delete_alert: "Do you want to remove this trip's history?",

  // <!-- Các thông báo màn hình viewcar -->
  marker_title_catcher_user: "Arrived",

  // <!-- Các thông báo mã khuyến mại -->
  promotion_success_alert: "Promo code is valid",
  promotion_seccess_detail: "Your discount:",
  promotion_fail_alert: "Promo code is invalid",
  promotion_fail_time_alert: "Promo code is expired",
  promotion_fail_check: "Could not validate promo code",

  // <!-- Gửi góp ý -->
  feedback_create_user: "You must have an account  in order to send feedback",
  feedback_sent_finish:
    "Thank you for your feedback. We will respond as soon as we can",
  feedback_sent_not_finish:
    "An error has occurred. Please try again or call us directly",
  feedback_required_field: "Your feedback is empty!",

  // <!-- Chia sẻ qua facebook -->
  share_facebook_success: "Thank your for sharing information about G7Taxi",

  // <!-- Thoát ứng dụng -->
  exit_app_alert: "Please back again to exit",
  exit_app_confirm: "Are you sure to close app?",

  // <!-- Thông báo yêu cầu cấp quyền cho ứng dụng -->
  permission_settings_alert:
    "Please turn on the app function right for continually using.",
  permission_data_warning:
    "Please temporarily cancel the economical data mode for booking process operating better!",

  address_confirm_empty: "Please select location before booking!",

  // ======================== Màn hình rating ============================== //
  rating_title: "Đánh giá lái xe",
  rating_low: "Low",
  rating_moderate: "Moderate",
  rating_good: "Good",
  rating_great: "Great",
  rating_excellent: "Excellent",
  rating_content: "Please rate the quality drive for your trip",
  rating_content_v2: "How was your trip?",
  rating_yourname: "User name",
  rating_type: "Quality type",
  rating_content_note: "Additional information",
  rating_btn_dismiss: "Dismiss",
  rating_btn_send: "Send",

  // màn hình khuyến mãi
  discount_first_install: "Khuyến mãi cài App mới",
  discount_enable: "Khả dụng",
  discount_disable: "Không khả dụng",
  discount_warn_once: "Lưu ý: mã khuyến mãi chỉ được sử dụng một lần duy nhất",
  discount_empty_news: "Hiện tại không có tin khuyến mãi nào!",
  discount_empty_codes: "Hiện tại không có mã khuyến mãi nào!",

  // Giá trị mặc định.
  empty_string: "",
  // Vehicle Select Dialog.
  vsd_title: "Car type selection",
  vsd_select_car_description: "Please select the vehicle with suitable charges!",
  vsd_money_unit: "VNĐ ",

  ...en
};

let strings = {
  app_name: Locate.getString("app_name"),
  version_name: Locate.getString("version_name"),
  sologan_name: Locate.getString("sologan_name"),
  register_title: Locate.getString("register_title"),
  register_code_exist: Locate.getString("register_code_exist"),
  register_phone_holder: Locate.getString("register_phone_holder"),
  register_name_holder: Locate.getString("register_name_holder"),
  register_code_holder: Locate.getString("register_code_holder"),
  register_email_holder: Locate.getString("register_email_holder"),
  register_text_agree_1: Locate.getString("register_text_agree_1"),
  register_text_agree_2: Locate.getString("register_text_agree_2"),
  register_text_lang_vi: Locate.getString("register_text_lang_vi"),
  register_text_lang_en: Locate.getString("register_text_lang_en"),

  register_code_1: Locate.getString("register_code_1"),
  register_code_2: Locate.getString("register_code_2"),
  register_code_3: Locate.getString("register_code_3"),
  register_code_4: Locate.getString("register_code_4"),
  register_code_5: Locate.getString("register_code_5"),
  register_code_6: Locate.getString("register_code_6"),
  register_code_7: Locate.getString("register_code_7"),
  register_code_8: Locate.getString("register_code_8"),
  register_code_9: Locate.getString("register_code_9"),
  register_code_10: Locate.getString("register_code_10"),
  register_code_11: Locate.getString("register_code_11"),
  register_code_locked: Locate.getString("register_code_locked"),
  register_code_unknown: Locate.getString("register_code_unknown"),

  register_require_phone: Locate.getString("register_require_phone"),
  register_require_phone_format: Locate.getString(
    "register_require_phone_format"
  ),
  register_require_email: Locate.getString("register_require_email"),
  register_require_email_format: Locate.getString(
    "register_require_email_format"
  ),
  register_require_agree: Locate.getString("register_require_agree"),

  validate_title: Locate.getString("validate_title"),
  validate_resend_code: Locate.getString("validate_resend_code"),
  validate_input_code: Locate.getString("validate_input_code"),
  validate_des: Locate.getString("validate_des"),

  home_screen_title: Locate.getString("home_screen_title"),
  home_history_title: Locate.getString("home_history_title"),
  home_promotion_title: Locate.getString("home_promotion_title"),
  home_alert_title: Locate.getString("home_alert_title"),
  title_detail_history: Locate.getString("title_detail_history"),
  home_feedback_title: Locate.getString("home_feedback_title"),
  home_about_title: Locate.getString("home_about_title"),
  home_help_title: Locate.getString("home_help_title"),

  book_confirm_title: Locate.getString("book_confirm_title"),

  feedback_fail: Locate.getString("feedback_fail"),

  search_address_title: Locate.getString("search_address_title"),
  search_address_number: Locate.getString("search_address_number"),

  about_content_one: Locate.getString("about_content_one"),
  about_content_two: Locate.getString("about_content_two"),
  about_content_three: Locate.getString("about_content_three"),
  about_content_four: Locate.getString("about_content_four"),
  about_content_five: Locate.getString("about_content_five"),
  about_btn_share: Locate.getString("about_btn_share"),
  about_btn_rate: Locate.getString("about_btn_rate"),
  about_copyright: Locate.getString("about_copyright"),

  waiting: Locate.getString("waiting"),
  invalid_network: Locate.getString("invalid_network"),

  status_successful: Locate.getString("status_successful"),
  status_cancelled: Locate.getString("status_cancelled"),
  status_promation: Locate.getString("status_promation"),

  btn_call: Locate.getString("btn_call"),
  btn_call_driver: Locate.getString("btn_call_driver"),
  btn_retry: Locate.getString("btn_retry"),
  btn_book_again: Locate.getString("btn_book_again"),
  btn_cancel: Locate.getString("btn_cancel"),
  btn_complete: Locate.getString("btn_complete"),
  dialog_confirm_meetcar: Locate.getString("dialog_confirm_meetcar"),
  dialog_confirm_meetcar_yes: Locate.getString("dialog_confirm_meetcar_yes"),
  dialog_rate_title: Locate.getString("dialog_rate_title"),
  dialog_rate_driver_name: Locate.getString("dialog_rate_driver_name"),
  dialog_rate_content: Locate.getString("dialog_rate_content"),
  dialog_rate_quality: Locate.getString("dialog_rate_quality"),
  dialog_rate_content_null: Locate.getString("dialog_rate_content_null"),
  dialog_rate_content_empty: Locate.getString("dialog_rate_content_empty"),
  dialog_rate_send_fail: Locate.getString("dialog_rate_send_fail"),
  dialog_rate_content_note: Locate.getString("dialog_rate_content_note"),
  dialog_rate_sent_btn: Locate.getString("dialog_rate_sent_btn"),

  booking_share_btn: Locate.getString("booking_share_btn"),
  book_button_new: Locate.getString("book_button_new"),
  title_marker_center_no_car: Locate.getString("title_marker_center_no_car"),
  book_button_meetcar: Locate.getString("book_button_meetcar"),
  alert: Locate.getString("alert"),

  update_google_service: Locate.getString("update_google_service"),
  update_software: Locate.getString("update_software"),

  gps_not_enabled: Locate.getString("gps_not_enabled"),
  gps_network_not_get_location: Locate.getString(
    "gps_network_not_get_location"
  ),
  waiting_notification_connected_gps: Locate.getString(
    "waiting_notification_connected_gps"
  ),
  address_loadding: Locate.getString("address_loadding"),
  no_address: Locate.getString("no_address"),
  add_favorite_point_failt: Locate.getString("add_favorite_point_failt"),
  delete_history_point_failt: Locate.getString("delete_history_point_failt"),
  no_network: Locate.getString("no_network"),
  no_search_result: Locate.getString("no_search_result"),
  confirm_not_network: Locate.getString("confirm_not_network"),

  not_connected_server: Locate.getString("not_connected_server"),
  connected_server_time_out: Locate.getString("connected_server_time_out"),
  dialog_waiting_title: Locate.getString("dialog_waiting_title"),
  not_connected_server_retry_book: Locate.getString(
    "not_connected_server_retry_book"
  ),
  no_phone_number: Locate.getString("no_phone_number"),

  term_of_used: Locate.getString("term_of_used"),
  user_profile_back: Locate.getString("user_profile_back"),
  accounts_user_default: Locate.getString("accounts_user_default"),
  accounts_user_profile: Locate.getString("accounts_user_profile"),
  user_name_default: Locate.getString("user_name_default"),
  user_email_default: Locate.getString("user_email_default"),
  user_refcode_default: Locate.getString("user_refcode_default"),
  accounts_term_of_used: Locate.getString("accounts_term_of_used"),
  accounts_term_of_used_link: Locate.getString("accounts_term_of_used_link"),
  accounts_user_hint_phone: Locate.getString("accounts_user_hint_phone"),
  user_register_title: Locate.getString("user_register_title"),
  user_verify_title: Locate.getString("user_verify_title"),
  accounts_user_verify_code: Locate.getString("accounts_user_verify_code"),
  accounts_user_active_ok: Locate.getString("accounts_user_active_ok"),
  accounts_user_active_try: Locate.getString("accounts_user_active_try"),
  user_profile_title: Locate.getString("user_profile_title"),
  user_profile_info_email: Locate.getString("user_profile_info_email"),
  user_profile_info_pass: Locate.getString("user_profile_info_pass"),
  user_profile_info_phone: Locate.getString("user_profile_info_phone"),
  user_profile_info_phone_hint: Locate.getString(
    "user_profile_info_phone_hint"
  ),
  user_profile_manager_hint_pass: Locate.getString(
    "user_profile_manager_hint_pass"
  ),
  user_profile_manager_hint_email: Locate.getString(
    "user_profile_manager_hint_email"
  ),
  user_profile_manager_delete: Locate.getString("user_profile_manager_delete"),
  manager_selecter_avatar: Locate.getString("manager_selecter_avatar"),
  manager_selecter_album: Locate.getString("manager_selecter_album"),
  manager_selecter_camera: Locate.getString("manager_selecter_camera"),
  user_verify_try_btn: Locate.getString("user_verify_try_btn"),
  user_verify_try_btn_time: Locate.getString("user_verify_try_btn_time"),
  accounts_user_active_has_code: Locate.getString(
    "accounts_user_active_has_code"
  ),
  accounts_user_active_cancel: Locate.getString("accounts_user_active_cancel"),
  profile_driver_blocked_btn: Locate.getString("profile_driver_blocked_btn"),

  book_taxi_title: Locate.getString("book_taxi_title"),
  book_taxi_btn: Locate.getString("book_taxi_btn"),
  book_taxi_confirm: Locate.getString("book_taxi_confirm"),
  book_address: Locate.getString("book_address"),
  book_address_null: Locate.getString("book_address_null"),
  book_address_from: Locate.getString("book_address_from"),
  book_address_to: Locate.getString("book_address_to"),
  book_address_from_empty: Locate.getString("book_address_from_empty"),
  book_address_to_empty: Locate.getString("book_address_to_empty"),
  book_not_support_top: Locate.getString("book_not_support_top"),
  book_not_support_bottom: Locate.getString("book_not_support_bottom"),
  book_check_allow_call: Locate.getString("book_check_allow_call"),
  book_address_reselect_a: Locate.getString("book_address_reselect_a"),
  book_address_reselect_b: Locate.getString("book_address_reselect_b"),
  book_address_to_airport: Locate.getString("book_address_to_airport"),
  book_estimation_info: Locate.getString("book_estimation_info"),

  book_taxi_return: Locate.getString("book_taxi_return"),
  cartype_inner_city_tab: Locate.getString("cartype_inner_city_tab"),
  cartype_car_tab: Locate.getString("cartype_car_tab"),

  book_company_title: Locate.getString("book_company_title"),
  book_company_favorites: Locate.getString("book_company_favorites"),
  book_company_title_like: Locate.getString("book_company_title_like"),
  book_company_title_normal: Locate.getString("book_company_title_normal"),
  book_company_found_option_title: Locate.getString(
    "book_company_found_option_title"
  ),
  book_company_found_option_1: Locate.getString("book_company_found_option_1"),
  book_company_found_option_2: Locate.getString("book_company_found_option_2"),
  book_company_found_alert: Locate.getString("book_company_found_alert"),
  book_company_like: Locate.getString("book_company_like"),
  book_company_block: Locate.getString("book_company_block"),

  taxi_proceeding_menu_title: Locate.getString("taxi_proceeding_menu_title"),

  book_receive_taxi_company: Locate.getString("book_receive_taxi_company"),
  book_cancel_des: Locate.getString("book_cancel_des"),
  book_datepicker_alert: Locate.getString("book_datepicker_alert"),
  book_create_user_alert: Locate.getString("book_create_user_alert"),
  book_confirm_network_error: Locate.getString("book_confirm_network_error"),
  book_time_title: Locate.getString("book_time_title"),
  book_date_title: Locate.getString("book_date_title"),
  book_notes_title: Locate.getString("book_notes_title"),
  book_notes_hint_button: Locate.getString("book_notes_hint_button"),
  book_notes_hint_input: Locate.getString("book_notes_hint_input"),
  book_notes_description: Locate.getString("book_notes_description"),
  book_schedule_title: Locate.getString("book_schedule_title"),
  book_alarm_waiting_title: Locate.getString("book_alarm_waiting_title"),
  book_alarm_cancel_title: Locate.getString("book_alarm_cancel_title"),
  book_confirm_schedule_alert: Locate.getString("book_confirm_schedule_alert"),
  book_confirm_cancel_schedule_book: Locate.getString(
    "book_confirm_cancel_schedule_book"
  ),
  book_confirm_schedule_cancel: Locate.getString(
    "book_confirm_schedule_cancel"
  ),
  book_schedule_cancel_btn: Locate.getString("book_schedule_cancel_btn"),
  book_schedule_show_btn: Locate.getString("book_schedule_show_btn"),
  book_confirm_promotion: Locate.getString("book_confirm_promotion"),
  book_taxi_promotion_description: Locate.getString(
    "book_taxi_promotion_description"
  ),
  book_taxi_companies_book_item: Locate.getString(
    "book_taxi_companies_book_item"
  ),
  book_confirm_schedule_button: Locate.getString(
    "book_confirm_schedule_button"
  ),
  book_confirm_schedule_cancel_button: Locate.getString(
    "book_confirm_schedule_cancel_button"
  ),
  book_confirm_schedule_current_day: Locate.getString(
    "book_confirm_schedule_current_day"
  ),
  book_confirm_cartype_not_determine: Locate.getString(
    "book_confirm_cartype_not_determine"
  ),
  book_carinfo_price_open: Locate.getString("book_carinfo_price_open"),
  book_carinfo_price_open_bike: Locate.getString(
    "book_carinfo_price_open_bike"
  ),
  book_carinfo_price_open_detail: Locate.getString(
    "book_carinfo_price_open_detail"
  ),
  book_carinfo_price_step_two: Locate.getString("book_carinfo_price_step_two"),
  book_carinfo_price_step_next_from: Locate.getString(
    "book_carinfo_price_step_next_from"
  ),
  book_carinfo_price_step_next_to: Locate.getString(
    "book_carinfo_price_step_next_to"
  ),
  book_carinfo_price_step_next: Locate.getString(
    "book_carinfo_price_step_next"
  ),
  book_carinfo_price_percent: Locate.getString("book_carinfo_price_percent"),
  book_carinfo_price_distance: Locate.getString("book_carinfo_price_distance"),
  book_carinfo_price_wait: Locate.getString("book_carinfo_price_wait"),
  book_not_support_are: Locate.getString("book_not_support_are"),

  book_receive_taxi: Locate.getString("book_receive_taxi"),
  book_receive_taxi_note_2: Locate.getString("book_receive_taxi_note_2"),
  book_receive_taxi_note_3: Locate.getString("book_receive_taxi_note_3"),
  book_receive_taxi_timeout: Locate.getString("book_receive_taxi_timeout"),
  book_receive_taxi_not_relogin: Locate.getString(
    "book_receive_taxi_not_relogin"
  ),
  book_not_enable_network: Locate.getString("book_not_enable_network"),
  book_connect_to_server_instability: Locate.getString(
    "book_connect_to_server_instability"
  ),
  book_enable_network: Locate.getString("book_enable_network"),
  book_relogin_taxi_timeout: Locate.getString("book_relogin_taxi_timeout"),
  book_taxi_not_network: Locate.getString("book_taxi_not_network"),

  book_search_ba_address: Locate.getString("book_search_ba_address"),
  book_search_recent_address: Locate.getString("book_search_recent_address"),
  book_search_maps_address: Locate.getString("book_search_maps_address"),
  book_search_google_input: Locate.getString("book_search_google_input"),
  book_search_recent_alert: Locate.getString("book_search_recent_alert"),
  book_search_google_alert: Locate.getString("book_search_google_alert"),
  book_search_google_error: Locate.getString("book_search_google_error"),
  book_search_google_auto: Locate.getString("book_search_google_auto"),
  book_search_google_gps_not_enable: Locate.getString(
    "book_search_google_gps_not_enable"
  ),
  book_selecter_address_btn: Locate.getString("book_selecter_address_btn"),
  book_selecter_address_to_btn: Locate.getString("book_selecter_address_to_btn"),
  book_search_latlng_point: Locate.getString("book_search_latlng_point"),
  search_bar_hit: Locate.getString("search_bar_hit"),

  book_comfirm_distance: Locate.getString("book_comfirm_distance"),
  book_comfirm_minute_lable: Locate.getString("book_comfirm_minute_lable"),
  book_step_option_btn: Locate.getString("book_step_option_btn"),

  book_invite_subtitle: Locate.getString("book_invite_subtitle"),
  book_invite_user_cancel: Locate.getString("book_invite_user_cancel"),
  book_carinfo_subtitle: Locate.getString("book_carinfo_subtitle"),
  book_carinfo_description: Locate.getString("book_carinfo_description"),
  book_carinfo_description_contract: Locate.getString(
    "book_carinfo_description_contract"
  ),
  book_invite_description: Locate.getString("book_invite_description"),
  book_catcher_user_description_contract: Locate.getString(
    "book_catcher_user_description_contract"
  ),
  book_catcher_user_description: Locate.getString(
    "book_catcher_user_description"
  ),
  book_meet_car_confirm: Locate.getString("book_meet_car_confirm"),
  book_cancel_btn: Locate.getString("book_cancel_btn"),
  book_cancel_btn_success: Locate.getString("book_cancel_btn_success"),
  book_invite_meet_car_btn: Locate.getString("book_invite_meet_car_btn"),
  book_invite_not_meet_car_btn: Locate.getString(
    "book_invite_not_meet_car_btn"
  ),
  book_invite_thanks_for_used: Locate.getString("book_invite_thanks_for_used"),
  book_operator_cancel_subtitle_notification: Locate.getString(
    "book_operator_cancel_subtitle_notification"
  ),
  book_alert_catched_user: Locate.getString("book_alert_catched_user"),
  book_alert_catched_user_not_driver_infor: Locate.getString(
    "book_alert_catched_user_not_driver_infor"
  ),

  book_done_info_successful: Locate.getString("book_done_info_successful"),

  book_operator_cancel_wrong: Locate.getString("book_operator_cancel_wrong"),
  book_operator_cancel: Locate.getString("book_operator_cancel"),
  book_operator_relogin_fail: Locate.getString("book_operator_relogin_fail"),
  book_driver_cancel: Locate.getString("book_driver_cancel"),
  book_driver_missed: Locate.getString("book_driver_missed"),
  book_driver_relogin_fail: Locate.getString("book_driver_relogin_fail"),

  taxi_back_taxi: Locate.getString("taxi_back_taxi"),
  taxi_back_time_waiting: Locate.getString("taxi_back_time_waiting"),
  taxi_back_a_to_b: Locate.getString("taxi_back_a_to_b"),
  taxi_estimates_a_to_b: Locate.getString("taxi_estimates_a_to_b"),
  car_contract_a_to_b: Locate.getString("car_contract_a_to_b"),
  taxi_back_a_to_b_sub: Locate.getString("taxi_back_a_to_b_sub"),
  taxi_back_money: Locate.getString("taxi_back_money"),
  taxi_back_sale: Locate.getString("taxi_back_sale"),
  taxi_back_money_vn: Locate.getString("taxi_back_money_vn"),

  car_number_sh: Locate.getString("car_number_sh"),
  car_number_bsx: Locate.getString("car_number_bsx"),
  distance_title: Locate.getString("distance_title"),
  seats_number: Locate.getString("seats_number"),
  distance: Locate.getString("distance"),
  duration: Locate.getString("duration"),
  tracking_log: Locate.getString("tracking_log"),

  car_type: Locate.getString("car_type"),
  taxi_title: Locate.getString("taxi_title"),
  car_type_all: Locate.getString("car_type_all"),
  car_type_4_seat: Locate.getString("car_type_4_seat"),
  car_type_7_seat: Locate.getString("car_type_7_seat"),
  car_type_4_seat_airport: Locate.getString("car_type_4_seat_airport"),
  car_type_7_seat_airport: Locate.getString("car_type_7_seat_airport"),
  car_type_4_seat_low: Locate.getString("car_type_4_seat_low"),
  car_type_4_seat_large: Locate.getString("car_type_4_seat_large"),
  car_type_7_seat_small: Locate.getString("car_type_7_seat_small"),
  car_type_auto: Locate.getString("car_type_auto"),
  car_type_airport: Locate.getString("car_type_airport"),
  car_type_center: Locate.getString("car_type_center"),

  history_title: Locate.getString("history_title"),
  history_tab_book: Locate.getString("history_tab_book"),
  history_book_promotion: Locate.getString("history_book_promotion"),
  history_book_airport: Locate.getString("history_book_airport"),
  history_address_date: Locate.getString("history_address_date"),
  history_address_from: Locate.getString("history_address_from"),
  history_address_to: Locate.getString("history_address_to"),
  history_address_not_define: Locate.getString("history_address_not_define"),
  history_address_to_small: Locate.getString("history_address_to_small"),
  history_book_taxi_shx: Locate.getString("history_book_taxi_shx"),
  history_retry_book_a_b: Locate.getString("history_retry_book_a_b"),
  history_retry_book_b_a: Locate.getString("history_retry_book_b_a"),
  history_yesterday: Locate.getString("history_yesterday"),
  history_days_ago: Locate.getString("history_days_ago"),
  history_hours_ago: Locate.getString("history_hours_ago"),
  history_recent: Locate.getString("history_recent"),

  feedback_manager_title: Locate.getString("feedback_manager_title"),
  feedback_title: Locate.getString("feedback_title"),
  feedback_content_title_hint: Locate.getString("feedback_content_title_hint"),
  feedback_content_hint: Locate.getString("feedback_content_hint"),
  feedback_hotline: Locate.getString("feedback_hotline"),
  feedback_hotline_alert: Locate.getString("feedback_hotline_alert"),
  feedback_hotline_alert_b: Locate.getString("feedback_hotline_alert_b"),
  feedback_hotline_alert_c: Locate.getString("feedback_hotline_alert_c"),
  feedback_hotline_alert_d: Locate.getString("feedback_hotline_alert_d"),
  feedback_email_cskh: Locate.getString("feedback_email_cskh"),
  feedback_website: Locate.getString("feedback_website"),
  feedback_fanpage_cskh: Locate.getString("feedback_fanpage_cskh"),
  feedback_sent: Locate.getString("feedback_sent"),
  feedback_type_select_name: Locate.getString("feedback_type_select_name"),

  help_book_taxi: Locate.getString("help_book_taxi"),
  help_cancel_book: Locate.getString("help_cancel_book"),
  help_book_taxi_one_header: Locate.getString("help_book_taxi_one_header"),

  help_book_taxi_two_header: Locate.getString("help_book_taxi_two_header"),
  help_book_taxi_two: Locate.getString("help_book_taxi_two"),

  help_book_taxi_three_header: Locate.getString("help_book_taxi_three_header"),
  help_book_taxi_three: Locate.getString("help_book_taxi_three"),

  help_book_taxi_four_header: Locate.getString("help_book_taxi_four_header"),
  help_book_taxi_four: Locate.getString("help_book_taxi_four"),

  help_book_taxi_five_header: Locate.getString("help_book_taxi_five_header"),
  help_book_taxi_five: Locate.getString("help_book_taxi_five"),

  help_cancel_book_one_header: Locate.getString("help_cancel_book_one_header"),
  help_cancel_book_one: Locate.getString("help_cancel_book_one"),

  help_cancel_book_two_header: Locate.getString("help_cancel_book_two_header"),
  help_cancel_book_two: Locate.getString("help_cancel_book_two"),

  help_cancel_book_three_header: Locate.getString(
    "help_cancel_book_three_header"
  ),
  help_cancel_book_three: Locate.getString("help_cancel_book_three"),

  help_manager_title: Locate.getString("help_manager_title"),
  help_manager_warrning: Locate.getString("help_manager_warrning"),

  about_manager_title: Locate.getString("about_manager_title"),
  about_manager_sologan: Locate.getString("about_manager_sologan"),
  contact_binhanh_hotline_txt: Locate.getString("contact_binhanh_hotline_txt"),
  help_about_version_app: Locate.getString("help_about_version_app"),
  about_detail_default: Locate.getString("about_detail_default"),

  about_share_app: Locate.getString("about_share_app"),
  about_rate_app: Locate.getString("about_rate_app"),
  version_required: Locate.getString("version_required"),

  term_of_user_url: Locate.getString("term_of_user_url"),

  prefs_theme_key: Locate.getString("prefs_theme_key"),

  alert_dialog_title: Locate.getString("alert_dialog_title"),
  alert_dialog_title_detail: Locate.getString("alert_dialog_title_detail"),
  btn_ok: Locate.getString("btn_ok"),
  btn_update: Locate.getString("btn_update"),
  btn_delete: Locate.getString("btn_delete"),
  btn_dismiss: Locate.getString("btn_dismiss"),
  btn_exit: Locate.getString("btn_exit"),
  btn_next: Locate.getString("btn_next"),
  btn_login: Locate.getString("btn_login"),
  btn_logout: Locate.getString("btn_logout"),
  btn_back: Locate.getString("btn_back"),
  btn_reconnect: Locate.getString("btn_reconnect"),
  btn_sent: Locate.getString("btn_sent"),
  btn_setting: Locate.getString("btn_setting"),
  btn_confirm: Locate.getString("btn_confirm"),
  btn_restart: Locate.getString("btn_restart"),
  btn_accept: Locate.getString("btn_accept"),
  btn_finish: Locate.getString("btn_finish"),
  btn_fast_book: Locate.getString("btn_fast_book"),
  btn_book_taxi: Locate.getString("btn_book_taxi"),

  gps_network_not_enabled: Locate.getString("gps_network_not_enabled"),
  waiting_connected_gps: Locate.getString("waiting_connected_gps"),
  error_alert: Locate.getString("error_alert"),
  server_waiting_retry: Locate.getString("server_waiting_retry"),
  not_server_infor: Locate.getString("not_server_infor"),
  gps_alert_loadscreen: Locate.getString("gps_alert_loadscreen"),

  relogin_wating_connect: Locate.getString("relogin_wating_connect"),
  relogin_connect_finish: Locate.getString("relogin_connect_finish"),
  relogin_connect_fail: Locate.getString("relogin_connect_fail"),

  menu_state_title: Locate.getString("menu_state_title"),
  alarm_was_schedule_booking: Locate.getString("alarm_was_schedule_booking"),

  sync_waiting_title: Locate.getString("sync_waiting_title"),
  sync_not_network: Locate.getString("sync_not_network"),
  sync_waiting_retry: Locate.getString("sync_waiting_retry"),

  driver_info_nome: Locate.getString("driver_info_nome"),
  driver_info_plate: Locate.getString("driver_info_plate"),
  driver_info_car_no: Locate.getString("driver_info_car_no"),
  driver_info_car_color: Locate.getString("driver_info_car_color"),
  car_type_unknown: Locate.getString("car_type_unknown"),
  user_promotion: Locate.getString("user_promotion"),
  join_driver_app: Locate.getString("join_driver_app"),
  join_driver_app_url: Locate.getString("join_driver_app_url"),
  about_version_app: Locate.getString("about_version_app"),
  about_version_app_alert: Locate.getString("about_version_app_alert"),
  search_google_input: Locate.getString("search_google_input"),
  search_google_alert: Locate.getString("search_google_alert"),

  footer_not_support_are: Locate.getString("footer_not_support_are"),
  footer_not_support_confirm: Locate.getString("footer_not_support_confirm"),

  search_address_from: Locate.getString("search_address_from"),
  search_address_to: Locate.getString("search_address_to"),
  search_address_i_m_going_to: Locate.getString("search_address_i_m_going_to"),
  search_address_to_confirm: Locate.getString("search_address_to_confirm"),

  search_address_to_confirm_from: Locate.getString("search_address_to_confirm_from"),
  search_address_to_confirm_to: Locate.getString("search_address_to_confirm_to"),
  profile_address_history_title: Locate.getString(
    "profile_address_history_title"
  ),
  profile_address_favorite_title: Locate.getString(
    "profile_address_favorite_title"
  ),
  search_address_home: Locate.getString("search_address_home"),
  search_address_home_hint: Locate.getString("search_address_home_hint"),
  search_address_home_null: Locate.getString("search_address_home_null"),
  search_address_working: Locate.getString("search_address_working"),
  search_address_working_hint: Locate.getString("search_address_working_hint"),
  search_address_work_null: Locate.getString("search_address_work_null"),

  news_promotion_title: Locate.getString("news_promotion_title"),
  news_promotion_empty: Locate.getString("news_promotion_empty"),
  sales_promotion_empty: Locate.getString("sales_promotion_empty"),
  sales_promotion_title: Locate.getString("sales_promotion_title"),
  sales_promotion_only: Locate.getString("sales_promotion_only"),
  sales_item_used: Locate.getString("sales_item_used"),
  sales_item_fulltime: Locate.getString("sales_item_fulltime"),
  sales_item_availability: Locate.getString("sales_item_availability"),
  sales_item_des_availability: Locate.getString("sales_item_des_availability"),
  sales_item_money: Locate.getString("sales_item_money"),
  sales_item_timer: Locate.getString("sales_item_timer"),

  book_type_return: Locate.getString("book_type_return"),
  book_type_long: Locate.getString("book_type_long"),
  book_type_contract: Locate.getString("book_type_contract"),
  book_finish: Locate.getString("book_finish"),
  book_fail: Locate.getString("book_fail"),

  taxi_price_title: Locate.getString("taxi_price_title"),
  taxi_price_empty: Locate.getString("taxi_price_empty"),
  taxi_price_note: Locate.getString("taxi_price_note"),
  taxi_fare_suggest: Locate.getString("taxi_fare_suggest"),

  history_book_km: Locate.getString("history_book_km"),
  history_book_total_time: Locate.getString("history_book_total_time"),
  postage_title: Locate.getString("postage_title"),

  fare_title: Locate.getString("fare_title"),
  fare_total_label: Locate.getString("fare_total_label"),
  fare_wait_label: Locate.getString("fare_wait_label"),
  fare_extend_label: Locate.getString("fare_extend_label"),
  fare_sale_label: Locate.getString("fare_sale_label"),
  fare_pay_label: Locate.getString("fare_pay_label"),

  book_car_finish_not_fare: Locate.getString("book_car_finish_not_fare"),
  book_car_not_fare: Locate.getString("book_car_not_fare"),
  book_car_distance_min: Locate.getString("book_car_distance_min"),

  language_vi_label: Locate.getString("language_vi_label"),
  language_en_label: Locate.getString("language_en_label"),

  customer_news_title: Locate.getString("customer_news_title"),
  customer_news_empty: Locate.getString("customer_news_empty"),

  support_title: Locate.getString("support_title"),
  support_about: Locate.getString("support_about"),

  book_schedule_hour: Locate.getString("book_schedule_hour"),
  book_schedule_minute: Locate.getString("book_schedule_minute"),

  user_register_phone_empty: Locate.getString("user_register_phone_empty"),
  user_register_name_empty: Locate.getString("user_register_name_empty"),
  accounts_pattern_phone: Locate.getString("accounts_pattern_phone"),
  accounts_pattern_email: Locate.getString("accounts_pattern_email"),
  accounts_term_of_used_error: Locate.getString("accounts_term_of_used_error"),
  accounts_pattern_verify_code: Locate.getString(
    "accounts_pattern_verify_code"
  ),
  accounts_user_active_status: Locate.getString("accounts_user_active_status"),
  account_validate_not_receive: Locate.getString("account_validate_not_receive"),
  user_profile_manager_delete_detail: Locate.getString(
    "user_profile_manager_delete_detail"
  ),
  user_not_delete_alert: Locate.getString("user_not_delete_alert"),

  user_register_message_one: Locate.getString("user_register_message_one"),
  user_register_message_two: Locate.getString("user_register_message_two"),
  user_register_message_three: Locate.getString("user_register_message_three"),
  user_register_message_three_sub: Locate.getString(
    "user_register_message_three_sub"
  ),
  user_register_message_four: Locate.getString("user_register_message_four"),
  user_register_message_five: Locate.getString("user_register_message_five"),
  user_register_message_six: Locate.getString("user_register_message_six"),
  user_register_message_sevent: Locate.getString(
    "user_register_message_sevent"
  ),
  user_create_message_eight: Locate.getString("user_create_message_eight"),
  user_create_message_nine: Locate.getString("user_create_message_nine"),
  user_create_message_nine_sub: Locate.getString(
    "user_create_message_nine_sub"
  ),
  user_register_teen: Locate.getString("user_register_teen"),
  user_register_message_phone_change: Locate.getString(
    "user_register_message_phone_change"
  ),
  user_create_input_error: Locate.getString("user_create_input_error"),
  user_register_message_full_time: Locate.getString(
    "user_register_message_full_time"
  ),
  user_register_finish: Locate.getString("user_register_finish"),
  alert_not_connect_server: Locate.getString("alert_not_connect_server"),

  user_update_profile_succeed: Locate.getString("user_update_profile_succeed"),
  user_update_profile_fail: Locate.getString("user_update_profile_fail"),

  user_delete_profile_succeed: Locate.getString("user_delete_profile_succeed"),
  user_delete_profile_fail: Locate.getString("user_delete_profile_fail"),
  user_share_promotion_1: Locate.getString("user_share_promotion_1"),
  user_share_promotion_2: Locate.getString("user_share_promotion_2"),

  booked_taxi_airport: Locate.getString("booked_taxi_airport"),
  booked_taxi_schedule: Locate.getString("booked_taxi_schedule"),
  booked_taxi_schedule_cancel_success: Locate.getString(
    "booked_taxi_schedule_cancel_success"
  ),
  booked_taxi_cancel_success: Locate.getString("booked_taxi_cancel_success"),
  booked_taxi_cancel_error: Locate.getString("booked_taxi_cancel_error"),
  booked_taxi_cancel_fail: Locate.getString("booked_taxi_cancel_fail"),
  booked_taxi_relogin_fail: Locate.getString("booked_taxi_relogin_fail"),
  booked_taxi_schedule_success: Locate.getString(
    "booked_taxi_schedule_success"
  ),
  booked_taxi_schedule_login_fail: Locate.getString(
    "booked_taxi_schedule_login_fail"
  ),
  booked_taxi_schedule_time_out: Locate.getString(
    "booked_taxi_schedule_time_out"
  ),
  booked_taxi_schedule_cancel: Locate.getString("booked_taxi_schedule_cancel"),
  booked_taxi_schedule_look: Locate.getString("booked_taxi_schedule_look"),
  booked_taxi_schedule_look_time: Locate.getString(
    "booked_taxi_schedule_look_time"
  ),

  book_alert_network: Locate.getString("book_alert_network"),

  book_operator_set_car_success: Locate.getString(
    "book_operator_set_car_success"
  ),
  book_operator_set_car_fail: Locate.getString("book_operator_set_car_fail"),

  booked_not_suport: Locate.getString("booked_not_suport"),
  booked_not_support_car_type: Locate.getString("booked_not_support_car_type"),

  book_driver_phone_empty: Locate.getString("book_driver_phone_empty"),

  alarm_history: Locate.getString("alarm_history"),
  alarm_max_date: Locate.getString("alarm_max_date"),
  alarm_max_time: Locate.getString("alarm_max_time"),
  alarm_low: Locate.getString("alarm_low"),
  alarm_from_and_to: Locate.getString("alarm_from_and_to"),
  alarm_was_schedule_booking_confirm: Locate.getString(
    "alarm_was_schedule_booking_confirm"
  ),

  booked_change_language_alert: Locate.getString(
    "booked_change_language_alert"
  ),
  booked_not_book_taxi: Locate.getString("booked_not_book_taxi"),

  history_not_booking: Locate.getString("history_not_booking"),
  history_delete_finish: Locate.getString("history_delete_finish"),
  history_delete_error: Locate.getString("history_delete_error"),
  history_delete_schedule_finish: Locate.getString(
    "history_delete_schedule_finish"
  ),
  history_delete_shcedule_error: Locate.getString(
    "history_delete_shcedule_error"
  ),
  history_delete_alert: Locate.getString("history_delete_alert"),

  marker_title_catcher_user: Locate.getString("marker_title_catcher_user"),

  promotion_success_alert: Locate.getString("promotion_success_alert"),
  promotion_seccess_detail: Locate.getString("promotion_seccess_detail"),
  promotion_fail_alert: Locate.getString("promotion_fail_alert"),
  promotion_fail_time_alert: Locate.getString("promotion_fail_time_alert"),
  promotion_fail_check: Locate.getString("promotion_fail_check"),

  feedback_create_user: Locate.getString("feedback_create_user"),
  feedback_sent_finish: Locate.getString("feedback_sent_finish"),
  feedback_sent_not_finish: Locate.getString("feedback_sent_not_finish"),
  feedback_required_field: Locate.getString("feedback_required_field"),

  share_facebook_success: Locate.getString("share_facebook_success"),

  exit_app_alert: Locate.getString("exit_app_alert"),
  exit_app_confirm: Locate.getString("exit_app_confirm"),

  permission_settings_alert: Locate.getString("permission_settings_alert"),
  permission_data_warning: Locate.getString("permission_data_warning"),
  address_confirm_empty: Locate.getString("address_confirm_empty"),

  // ======================== Màn hình rating ============================== //
  rating_title: Locate.getString("rating_title"),
  rating_low: Locate.getString("rating_low"),
  rating_moderate: Locate.getString("rating_moderate"),
  rating_good: Locate.getString("rating_good"),
  rating_great: Locate.getString("rating_great"),
  rating_excellent: Locate.getString("rating_excellent"),
  rating_content: Locate.getString("rating_content"),
  rating_type: Locate.getString("rating_type"),
  rating_content_note: Locate.getString("rating_content_note"),
  rating_btn_dismiss: Locate.getString("rating_btn_dismiss"),
  rating_btn_send: Locate.getString("rating_btn_send"),

  // màn hình khuyến mãi
  discount_enable: Locate.getString("discount_enable"),
  discount_disable: Locate.getString("discount_disable"),
  discount_warn_once: Locate.getString("discount_warn_once"),
  discount_empty_news: Locate.getString("discount_empty_news"),
  discount_empty_codes: Locate.getString("discount_empty_codes"),
  empty_string: Locate.getString("empty_string"),
  vsd_title: Locate.getString("vsd_title"),
  vsd_select_car_description: Locate.getString("vsd_select_car_description"),
  vsd_money_unit: Locate.getString("vsd_money_unit"),
  rating_content_v2: Locate.getString("rating_content_v2"),
};

export default strings;
export { Locate, LanguageLocate };
