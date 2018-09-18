/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-24 09:26:32
 * @modify date 2018-07-24 09:26:32
 * @desc [Hiện thị danh sách menu]
 */

import * as React from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";

import strings from "../res/strings";
import colors from "../res/colors";
import Language from "../module/model/Language";
import ScreenName from "./ScreenName";
import { Text, Image } from "../module";
import fonts from "../module/ui/res/dimen/fonts";
import Utils from "../module/Utils";
import SharedCache from "./constant/SharedCache";
import LogFile from "../module/LogFile";
import User from "./sql/bo/User";
import { MenuStyles } from "../../../app/styles";
import SessionStore from "./Session";
import dimens from "../res/dimens";
import images from "./newUI/res/images";

interface Props {
  navigation?;
  screenProps?;
  navigatorProps?;
}

interface State {
  indexSelected: number;
  imageUriUser: any;
}

class MainMenu extends React.Component<Props, State> {
  private leftMenu;

  // private mainNavigation: MainNavigator;

  private user: User;

  constructor(props) {
    super(props);

    // this.mainNavigation = this.props.navigatorProps.screenProps.mainNavigation;

    this.leftMenu = this.getLeftMenu();

    this.user = SessionStore.getUser();

    this.state = {
      indexSelected: 0,
      imageUriUser: images.ic_user_defatlt
    };

    this._uriImage(this.user);
  }

  private getLeftMenu() {
    // console.log("getLeftMenu %%%%%%%%%%%%%%%%%%%");
    let leftMenu = [
      {
        icon: images.ic_menu_car,
        title: strings.home_screen_title,
        screen: ScreenName.BOOKING
      },
      {
        icon: images.ic_history,
        title: strings.home_history_title,
        screen: ScreenName.HISTORY
      },
      {
        icon: images.ic_menu_promotions,
        title: strings.home_promotion_title,
        screen: ScreenName.PROMOTION
      },
      {
        icon: images.ic_menu_helps,
        title: strings.home_help_title,
        screen: ScreenName.HELP
      },
      {
        icon: images.ic_menu_feedback,
        title: strings.home_feedback_title,
        screen: ScreenName.FEEDBACK
      },
      {
        icon: images.ic_menu_intro,
        title: strings.home_about_title,
        screen: ScreenName.ABOUT
      }
    ];

    if (__DEV__) {
      leftMenu.push({
        icon: images.ic_menu_about,
        title: "Developer",
        screen: ScreenName.DEBUG_DEV
      });
    }

    return leftMenu;
  }

  componentDidMount() {}

  private async _uriImage(user) {
    let uriImage = await Utils.getFileNameFromUri(
      user.profileImageUri,
      images.ic_user_defatlt
    );
    this.setState({
      imageUriUser: uriImage
    });
  }

  private _gotoProfile() {
    this.props.navigatorProps.navigation.closeDrawer();
    if (this.user != null && this.user.isRegisted()) {
      this.props.navigatorProps.navigation.navigate(ScreenName.PROFILE, {
        restartApp: () => {
          this.restartApp();
        },
        updateImage: uriImage => {
          this.setState({
            imageUriUser: uriImage
          });
        }
      });
    } else {
      this.restartApp();
    }
  }

  private restartApp() {
    this.props.navigatorProps.screenProps.navigation.replace(
      ScreenName.LOAD_APP
    );
  }

  _renderContent = (item, index) => {
    let activeItem =
      this.state.indexSelected == index
        ? [styles.main_menu_active_item, MenuStyles.main_menu_active_item]
        : [styles.main_menu_inactive_item, MenuStyles.main_menu_inactive_item];
    return (
      <TouchableOpacity
        key={item.title}
        style={[styles.main_menu_drawerItem, activeItem]}
        onPress={() => {
          this.setState({ indexSelected: index });
          this.props.navigatorProps.navigation.closeDrawer();
          this.props.navigatorProps.navigation.navigate(item.screen);
        }}
      >
        <Image
          source={item.icon}
          imgStyle={
            this.state.indexSelected == index
              ? [
                  styles.main_menu_active_item_icon,
                  MenuStyles.main_menu_active_item_icon
                ]
              : [
                  styles.main_menu_inactive_item_icon,
                  MenuStyles.main_menu_inactive_item_icon
                ]
          }
        />
        <Text
          textStyle={
            this.state.indexSelected == index
              ? [
                  styles.main_menu_active_item_text,
                  MenuStyles.main_menu_active_item_text
                ]
              : [
                  styles.main_menu_inactive_item_text,
                  MenuStyles.main_menu_inactive_item_text
                ]
          }
          text={item.title}
        />
      </TouchableOpacity>
    );
  };
  async clickLanguage(lan: Language) {
    if (SessionStore.language == lan) return;
    //lưu ngôn ngữ
    await SharedCache.setLanguage(lan);

    //restart app
    this.restartApp();
  }

  render() {
    // console.log(`test_profile_image_drawer_render: ${JSON.stringify(this.state)}`)
    return (
      <SafeAreaView
        style={[styles.main_menu_container, MenuStyles.main_menu_container]}
      >
        <View
          style={[
            styles.main_menu_drawerHeader,
            MenuStyles.main_menu_drawerHeader
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              LogFile.e(`profile_test_0`);
              this._gotoProfile();
            }}
            style={[styles.main_menu_user_item, MenuStyles.main_menu_user_item]}
          >
            <Image
              imgStyle={[
                styles.main_menu_drawerImage,
                MenuStyles.main_menu_drawerImage
              ]}
              source={this.state.imageUriUser}
            />
          </TouchableOpacity>

          <View
            style={{
              width: "100%",
              alignItems: "center"
            }}
          >
            <Text
              textStyle={{
                color: colors.colorWhiteFull,
                fontSize: fonts.h6_20,
                fontWeight: "bold", 
                paddingBottom: dimens.menu_left_padding_text_bottom
              }}
              text={strings.accounts_user_profile}
            />
            <Text
              textStyle={{
                color: colors.colorWhiteFull,
                fontSize: fonts.body_1
              }}
              text={SessionStore.getUser().phone}
            />
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingTop: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.clickLanguage(Language.VN);
              }}
            >
              <Image
                imgStyle={[
                  styles.main_menu_flagImage,
                  MenuStyles.main_menu_flagImage,
                  {
                    opacity: SessionStore.language == Language.VN ? 1 : 0.5
                  }
                ]}
                source={images.ic_flagvn}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.clickLanguage(Language.EN);
              }}
            >
              <Image
                imgStyle={[
                  styles.main_menu_flagImage,
                  MenuStyles.main_menu_flagImage,
                  {
                    opacity: SessionStore.language == Language.EN ? 1 : 0.5
                  }
                ]}
                source={images.ic_flagen}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.leftMenu}
            renderItem={({ item, index }) => this._renderContent(item, index)}
          />
        </View>
        {/* <View
          style={[styles.main_menu_footer, MenuStyles.main_menu_footer]}
        >
          <Text
            textStyle={[styles.main_menu_footer_version, MenuStyles.main_menu_footer_version]}
            text={strings.version_name}
          />
        </View> */}
      </SafeAreaView>
    );
  }
}

/* Style chung cho ứng dụng */
const styles = StyleSheet.create({
  main_menu_container: {
    height: "100%",
    backgroundColor: colors.colorDrawer
  },
  main_menu_drawerHeader: {
    flexDirection:'column',
    justifyContent: "center",
    alignItems: "center",
    height: dimens.drawer_custom_container_info_height
  },
  main_menu_user_item: {
    borderRadius: dimens.drawer_custom_avatar_radius,
    width: dimens.drawer_custom_avatar_width,
    height: dimens.drawer_custom_avatar_width,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: dimens.menu_left_padding_avatar_bottom
  },

  main_menu_active_item: {
    backgroundColor: colors.white
  },

  main_menu_inactive_item: {
    backgroundColor: colors.colorDrawer
  },

  main_menu_active_item_icon: {
    width: dimens.size_icon_input,
    height: dimens.size_icon_input,
    // margin: 14,
    tintColor: colors.colorMain
  },

  main_menu_inactive_item_icon: {
    width: dimens.size_icon_input,
    height: dimens.size_icon_input,
    // margin: 14,
    tintColor: colors.white
  },

  main_menu_active_item_text: {
    marginLeft: dimens.drawer_custom_item_padding_icon_left,
    fontSize: fonts.text_size,
    color: colors.colorMain
  },

  main_menu_inactive_item_text: {
    marginLeft: dimens.drawer_custom_item_padding_icon_left,
    fontSize: fonts.text_size,
    color: colors.white
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
  },

  main_menu_footer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "100%",
    height: 30,
    marginBottom: 10
  },

  main_menu_footer_version: {
    color: "white",
    textAlign: "center",
    width: "100%",
    fontSize: 13,
    marginBottom: 0
  }
});

export default MainMenu;
