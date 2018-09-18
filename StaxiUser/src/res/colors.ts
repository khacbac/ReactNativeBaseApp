/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-12 09:25:39
 * @modify date 2018-09-12 09:25:39
 * @desc [Danh sách màu sử dụng cho toàn thư viện]
*/

import colorModule from "../module/ui/res/colors";
import appColors from "../../../app/colors";

export const libsColors = {
  colorDrawerSelected: "#8EC926",
  // Mã màu màn hình khuyến mại.
  promotion_item_header_color: "#B1DFF6",
  promotion_item_timeend_color: "#898989",
  promotion_item_header_used_color: "#CCCCCC",
  promotion_item_divider_color: "#299EEB",
  promotion_item_used_color: "#FFB83C"
};

// Màu chính
export default {
  ...colorModule,
  ...libsColors,
  ...appColors
};
