/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-10 08:03:51
 * @modify date 2018-09-10 08:03:51
 * @desc [style cho toàn bộ ứng dụng]
 */

import { StyleSheet, Dimensions } from "react-native";
import dimens from "../StaxiUser/src/res/dimens";
import colors from "../StaxiUser/src/js/newUI/res/colors";
import fonts from "../StaxiUser/src/res/fonts";

/* Style chung cho ứng dụng */
const AppStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.colorMain
  },

  nagative_button: {
    backgroundColor: colors.colorMain
  },

  nagative_button_icon: {
    backgroundColor: colors.colorMain
  },

  nagative_button_text: {
    backgroundColor: colors.colorMain
  },

  positive_button: {
    backgroundColor: colors.colorMain
  },

  positive_button_icon: {
    backgroundColor: colors.colorMain
  },

  positive_button_text: {
    backgroundColor: colors.colorMain
  },
});

const MenuStyles = StyleSheet.create({
  main_menu_container: {
    backgroundColor: colors.white
  },
  main_menu_drawerHeader: {
    backgroundColor: colors.colorDrawerHeader
  },
  main_menu_user_item: {},

  main_menu_active_item: {
    backgroundColor: colors.colorDrawerActive
  },

  main_menu_inactive_item: {
    backgroundColor: colors.colorDrawer
  },

  main_menu_active_item_icon: {
    tintColor: colors.colorDark
  },

  main_menu_inactive_item_icon: {
    tintColor: colors.colorDark
  },

  main_menu_active_item_text: {
    color: colors.colorDark
  },

  main_menu_inactive_item_text: {
    color: colors.colorDark
  },

  main_menu_drawerImage: {},
  main_menu_flagImage: {},

  main_menu_footer: {},

  main_menu_footer_version: {
    color: colors.colorDark
  }
});

const FeedbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  text: {
    marginLeft: dimens.feedback_text_margin_left,
    marginRight: dimens.feedback_text_margin_right,
    marginTop: dimens.feedback_text_margin_top,
    color: colors.colorMain,
    textAlign: "center",
    fontSize: fonts.body_1,
    fontWeight: "bold"
  },
  input: {
    //borderRadius: 5,
    borderColor: colors.colorGray,
    width: Dimensions.get("window").width - 20,
    marginLeft: dimens.feedback_input_margin_left,
    fontSize: fonts.body_2,
    backgroundColor: "#c9c9c944",
    borderBottomColor: colors.colorGrayLight,
    borderBottomWidth: 1
  },
  inputview: {},

  footerView: {
    width: Dimensions.get("window").width - 20,
    height: 50,
    marginLeft: dimens.feedback_footerView_margin_left,
    marginBottom: dimens.feedback_footerView_margin_bottom,
    flexDirection: "row"
  }
});
const HistoryCellStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginLeft: dimens.history_margin_container,
    marginRight: dimens.history_margin_container,
    shadowColor: colors.colorGray,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: { height: 0, width: 0 },
    borderRadius: 8
  },

  headerContainer: {
    width: '84%',
    flexDirection: 'row',
    paddingTop: dimens.history_padding_item_cell,
    paddingRight: dimens.history_padding_item_cell,
    paddingBottom: dimens.history_padding_item_cell,
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.colorGrayLight,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: dimens.history_padding_item_cell,
  },
  viewLeft: {
    width: '10%',
    justifyContent: 'center',
    paddingVertical: 15
  },

  viewRight: {
    width: '90%',
    paddingVertical: 10
  },
  shortTime: {
    color: 'black',
    flex: 3,
    fontWeight: 'bold',
    fontSize: fonts.caption
  },
  statusTxt: {
    flex: 3,
    fontWeight: 'bold',
    fontSize: fonts.caption,
    textAlign: 'right',
    marginRight: 0
  },
  line: {
    backgroundColor: colors.colorMain,
    flex: 1,
    width: 1,
    marginVertical: 3,
    alignSelf: 'center'
  },
  dotTo: {
    backgroundColor: colors.colorSub,
    width: dimens.history_point_width,
    height: dimens.history_point_width,
    borderRadius: dimens.history_point_width_corner,
    alignSelf: 'center'
  },
  dotFrom: {
    backgroundColor: colors.colorMain,
    width: dimens.history_point_width,
    height: dimens.history_point_width,
    borderRadius: dimens.history_point_width_corner,
    alignSelf: 'center'
  },
  addressText: {
    color: 'black', flex: 15, fontSize: fonts.sub_2, marginRight: "5%"
  },
  fromAddressText: {
    marginBottom: 10
  }
});

const RegisterStyles = StyleSheet.create({
  //Logo
  logo: {
    width: dimens.register_width_logo,
    // width: '45%',
    height: dimens.register_height_logo,
    alignSelf: 'center',
    marginTop: dimens.register_margin_logo,
    marginBottom: dimens.register_margin_logo,
    tintColor: null,
    // backgroundColor:'grey',
  },
  container: {
    flex: 1,
    paddingLeft:dimens.register_padding_container,
    paddingRight:dimens.register_padding_container,
    backgroundColor:"white",
  },
  containerAgree: {
    justifyContent: 'flex-start',
    // backgroundColor:'green',
    // marginLeft: dimens.register_margin_txtPhone,
    // marginRight: dimens.register_margin_txtPhone,
    marginBottom: dimens.register_margin_txtPhone,
    marginTop: dimens.register_margin_top_cbx,
    flexDirection: "row",
  },
  containerLang: {
    // backgroundColor:'red',
    // paddingLeft: 4,
    marginTop: dimens.register_margin_txtPhone,
    marginLeft: dimens.register_margin_txtPhone,
    marginRight: dimens.register_margin_btn_footer,
    flexDirection: "row",
  },
  txtTitle: {
    borderColor: "grey",
    padding: dimens.register_margin_txtPhone
  },
  txtContent: {
    padding: dimens.register_margin_txtPhone
  },
  footer: {
    flex: 1,
    // marginLeft: dimens.register_margin_txtPhone,
    // marginRight: dimens.register_margin_txtPhone
  },
  btnFooter: {
    bottom: 0,
    position: "absolute",
    width: "100%"
  },
  //Input
  horizontalIconInput_container_phone: {
    // marginBottom: dimens.register_margin_top_txtPhone,
    marginLeft: dimens.register_margin_txtPhone,
    marginRight: dimens.register_margin_txtPhone,
    height:dimens.register_height_txtPhone,
  },
  text: {
    marginRight: (dimens.size_icon_input + dimens.margin_horizontal_icon_input * 2) * -1,
    fontSize: fonts.text_size,
    borderWidth: dimens.border_width,
    borderRadius: dimens.borderRadius,
    height:dimens.register_height_item_txtPhone,
  },
  horizontalIconInput_container_name: {
    marginTop: 0,
    marginLeft: dimens.register_margin_txtPhone,
    marginRight: dimens.register_margin_txtPhone,
  },
  horizontalIconInput_iconStyle: {
    tintColor: null,
    // width: 32,
    // height:32
  },
  //Agree
  checkbox_container: {
    marginLeft: dimens.register_margin_check_agree,
    justifyContent: 'center',
  },
  checkbox_viewStyle: {
    borderRadius: dimens.bordeCheckBoxRadius
  },
  container_text_agree: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  container_text_agree_1: {
    marginLeft: dimens.register_margin_txtPhone,
    fontSize: fonts.text_size,
  },
  container_text_agree_2: {
    color: colors.colorMain,
    fontSize: fonts.text_size
  },
  //Lang
  horizontalIconTextButton_vi_container: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  horizontalIconTextButton_vi_iconStyle: {
    width: dimens.register_icon_lang_size,
    height: dimens.register_icon_lang_size,
    marginHorizontal: dimens.register_icon_margin_lang,
  },
  //Footer
  button_register: {
    backgroundColor: colors.colorMain,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: dimens.borderRadius,
  }
});

const ValidateStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  btnBack: {
    marginTop: dimens.validate_back_header,
    marginLeft: dimens.validate_back_header,
  },
  containerInput:{
    marginTop:dimens.validate_margin_top_phone_number,
    marginLeft:dimens.register_padding_container,
    marginRight:dimens.register_padding_container,
  }
});

const ProfileStyles = StyleSheet.create({
    //Input
    horizontalIconInput_container_phone: {
      marginTop: dimens.register_margin_top_txtPhone,
      marginLeft: dimens.register_margin_btn_footer,
      marginRight: dimens.register_margin_btn_footer,
    },
});

const AbouUsStyles = StyleSheet.create({

});

const HistoryHomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  sectionList: {
    backgroundColor: colors.grayHeader
  },
  sectionHeader: {
    paddingTop: dimens.history_padding_top_section_header,
    paddingLeft: dimens.history_padding_bot_section_header,
    paddingRight: dimens.history_padding_bot_section_header,
    paddingBottom: dimens.history_padding_bot_section_header,
    fontSize: fonts.sub_2,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: colors.grayHeader,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 56,
    paddingHorizontal: 8,
    color: colors.colorGrayDark
  }
});

export { MenuStyles, FeedbackStyles, HistoryCellStyle, RegisterStyles, ValidateStyles, ProfileStyles, HistoryHomeStyle, AbouUsStyles };

export default AppStyles;
