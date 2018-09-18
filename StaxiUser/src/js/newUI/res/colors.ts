/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-12 09:26:05
 * @modify date 2018-09-12 09:26:05
 * @desc [Danh sách màu sử dụng cho giao diện mới newUI]
*/

import base_colors from "../../../module/ui/res/colors";
import extend_colors from "../../../../../app/colors";
import { libsColors } from "../../../res/colors";

// Màu chính
export default {
	...base_colors,
	...libsColors,

	//màu sử dụng riêng cho newUI
    colorMain: '#13B5C7',
	colorSub: '#F58757',
	colorDrawer: '#ffffff',
    colorDrawerHeader: "#13B5C7",
    colorDrawerSelected: "#8EC926",
	colorDrawerActive: "#F2F2F2",
	...extend_colors,
}