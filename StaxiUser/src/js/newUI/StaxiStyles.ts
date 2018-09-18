/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-10 08:03:51
 * @modify date 2018-09-10 08:03:51
 * @desc [style cho toàn bộ ứng dụng]
 */

import { StyleSheet } from "react-native";
import colors from "./res/colors";
import dimens from "../../res/dimens";
import fonts from "../../res/fonts";

/* Style chung cho ứng dụng */
const StaxiStyles = StyleSheet.create({
  main_menu_container: {
    height: "100%",
    backgroundColor: colors.colorDrawer
  },
  main_menu_drawerHeader: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: dimens.drawer_custom_container_info_height,
    paddingTop: dimens.drawer_custom_container_padding_top,
    backgroundColor: colors.colorDrawerHeader,
  },
  main_menu_user_item: {
    borderRadius: dimens.drawer_custom_avatar_radius,
    width: dimens.drawer_custom_avatar_width,
    height: dimens.drawer_custom_avatar_width,
    justifyContent: "center",
    alignItems: "center"
  },

  main_menu_active_item: {
    backgroundColor: colors.colorDrawerActive
  },

  main_menu_inactive_item: {
    backgroundColor: colors.colorDrawer
  },

  main_menu_active_item_icon: {
    width: dimens.size_icon_input,
    height: dimens.size_icon_input,
    // margin: 14,
    tintColor: colors.colorDark
  },

  main_menu_inactive_item_icon: {
    width: dimens.size_icon_input,
    height: dimens.size_icon_input,
    // margin: 14,
    tintColor: colors.colorDark
  },

  main_menu_active_item_text: {
    marginLeft: dimens.drawer_custom_item_padding_icon_left,
    fontSize: fonts.text_size,
    color:colors.colorDark
  },

  main_menu_inactive_item_text: {
    marginLeft: dimens.drawer_custom_item_padding_icon_left,
    fontSize: fonts.text_size,
    color:colors.colorDark
  },

  main_menu_drawerImage: {
    borderRadius: dimens.drawer_custom_avatar_radius,
    width: dimens.drawer_custom_avatar_width,
    height: dimens.drawer_custom_avatar_width,
    tintColor: null
  },
  main_menu_flagImage: {
    height: dimens.size_icon_input_32,
    width: dimens.size_icon_input_32,
    margin: dimens.drawer_custom_lang_margin,
    tintColor: null
  },
  main_menu_drawerItem: {
    flexDirection: "row",
    paddingLeft: dimens.drawer_custom_item_padding_left,
    paddingRight: dimens.drawer_custom_item_padding,
    paddingTop: dimens.drawer_custom_item_padding,
    paddingBottom: dimens.drawer_custom_item_padding,
    alignItems: "center"
  }
});
export default StaxiStyles;
