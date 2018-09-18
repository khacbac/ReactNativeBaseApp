import * as React from "react";

import { StyleSheet, View } from "react-native";

import COLORS from "../../../res/colors";
import STRINGS from "../../../res/strings";

import { Dialog } from "../../../module";
import SearchBackHeader from "../../../module/ui/header/SearchBackHeader";
import { createMaterialTopTabNavigator } from "react-navigation";

import SearchAutoCompleteViewLib from "./google/SearchAutoCompleteViewLib";
import MapSearchTabViewLib from "./map/MapSearchTabViewLib";
import FocusAddress from "../../viewmodel/search/FocusAddress";
import SearchParams from "../../viewmodel/search/SearchParams";

interface Props {
  navigation;
}

interface State {
  searchText: string;
}

export default class SearchViewLib extends React.Component<Props, State> {
  public static AUTOCOMPLETE_DELAY_TIME: number = 500; // 500 ms
  public static SEARCH_PARAMS = "searchParams";

  protected searchParams: SearchParams;
  
  private isUnmounted: boolean = false;

  /** thời gian delay trước khi tìm kiếm khi nhập text */
  private _textChangeTimeOut;
  
  constructor(props) {
    super(props);

    const { params } = props.navigation.state;
    this.searchParams = params.searchParams;

    this._textChangeTimeOut = null;

    this.state = {
      searchText: "",
    };
  }

  componentDidMount() {
    // xóa timeout delay search text
    this._cleartCurrentTimeOut();
  }

  componentWillUnmount() {
    this.isUnmounted = true;

    // xóa timeout delay search text
    this._cleartCurrentTimeOut();
  }

  /**
   * Lấy title của màn hình
   */
  private _getTitleScreen() {
    let focusAddress: FocusAddress = this.searchParams.focusAddress;

    if (focusAddress === FocusAddress.A_FOCUS) {
      return STRINGS.search_address_from;
    } else if (focusAddress === FocusAddress.B_FOCUS) {
      return STRINGS.search_address_to;
    }

    return STRINGS.search_bar_hit;
  }

  /**
   * Trở lại màn hình trước và gửi dữ liệu kèm theo
   * @param {*} baAddress
   */
  public next(baAddress) {
    this.props.navigation.state.params.onNavigateResult(baAddress, this.searchParams.focusAddress);
    this.back();
  }

  /**
   * Trở lại màn hình trước
   */
  public back() {
    this.props.navigation.goBack();
  }

  /** Xóa search text trên header */
  public clearSearchText() {
    (this.refs.SearchBackHeaderRef as SearchBackHeader).clearSearchState();
  }

  public setAllowShowSearchView(isAllow) {
    (this.refs.SearchBackHeaderRef as SearchBackHeader).setAllowShowSearchView(isAllow);
  }

  /** Xóa timeout delay tìm kiếm địa chỉ theo text */
  private _cleartCurrentTimeOut() {
    if (this._textChangeTimeOut) {
      clearTimeout(this._textChangeTimeOut);
      this._textChangeTimeOut = null;
    }
  }

  /** Xử lý khi text tìm kiếm thay đổi */
  private _handleTextChange(textSearch) {
    this._cleartCurrentTimeOut();

    // Gọi hàm lấy địa chỉ từ server
    this._textChangeTimeOut = setTimeout(() => {
      if (this.isUnmounted) {
        return;
      }

      this.setState({
        searchText: textSearch
      });

      this._cleartCurrentTimeOut();
    }, SearchViewLib.AUTOCOMPLETE_DELAY_TIME);
  }

  public getDialog(): Dialog {
    return this.refs.dialog as Dialog;
  }

  public showDialogWaiting() {
      this.getDialog().showWaitingDialog(STRINGS.address_loadding);
  }

  public closeDialog() {
      this.getDialog()._closeDialog();
  }

  render() {
    const TITLE_SCREEN = this._getTitleScreen();
    return (
      <View style={styles.container}>
        {/* Search and back header */}
        <SearchBackHeader
          ref="SearchBackHeaderRef"
          title={TITLE_SCREEN}
          drawerBack={() => this.back()}
          placeholder={TITLE_SCREEN}
          placeholderTextColor={COLORS.colorWhiteFull}
          // underlineColorAndroid={COLORS.colorWhiteFull}
          onChangeText={text => this._handleTextChange(text)}
        />

        {/* Tab content */}
        <SearchTabNavigator
          screenProps={{
            searchText: this.state.searchText,
            setAddress: address => this.next(address),
            SearchHome: this,
            searchParams: this.searchParams,
          }}
        />
        {/* "AIzaSyBrRSMIC47KqLU3pwQs2EzN6QWTqnYBRf8" */}

        <Dialog
          visible={false}
          // title={STRINGS.address_loadding}
          ref="dialog"
        />
      </View>
    );
  }
}

const SearchTabNavigator = createMaterialTopTabNavigator(
  {
    Google: {
        screen: SearchAutoCompleteViewLib,
        navigationOptions: {
            title: STRINGS.book_search_ba_address
        },
    },
    Map: {
        screen: MapSearchTabViewLib,
        navigationOptions: {
            title: STRINGS.book_search_maps_address,
        }
    },
},
{
    tabBarOptions: {
        style: {
            backgroundColor: COLORS.colorMain
        },
        labelStyle: {
            fontSize: 15,
            fontWeight: 'normal',
        },
        upperCaseLabel: true,
        indicatorStyle: {
            backgroundColor:'white',
            height: 2
        }
    }
}
  // {
  //   Google: GoogleSearchTabViewV2,
  //   Map: MapSearchTabView
  // },
  // {
  //   initialRouteName: "Google",
  //   tabBarOptions: {
  //     activeTintColor: COLORS.colorMain,
  //     inactiveTintColor: COLORS.colorMain,
  //     style: {
  //       backgroundColor: COLORS.colorMain
  //     },
  //     labelStyle: {
  //       fontSize: 15,
  //       color: COLORS.colorWhiteFull
  //     },
  //     indicatorStyle: {
  //       height: 3,
  //       backgroundColor: COLORS.colorWhiteFull
  //     }
  //   }
  // }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.colorWhiteFull
  },
});
