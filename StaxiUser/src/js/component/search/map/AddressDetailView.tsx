import * as React from "react";

import {
    StyleSheet,
    View,
    Image,
    Dimensions,
  } from 'react-native';

import IMAGES from '../../../../res/images';
import COLORS from '../../../../res/colors';
import STRINGS from '../../../../res/strings';

import FocusAddress from '../../../viewmodel/search/FocusAddress';
import { Text, Utils, LifeComponent } from '../../../../module';

interface PropsAddress {
    focusAddress: FocusAddress;
    isShowHeader: boolean;
    containerStyle?;
    iconOvalStyle?;
    textAddress?;
  }
  
interface StateAddress {
}

export default class AddressDetailView extends LifeComponent<PropsAddress, StateAddress> {
  private textAddress: Text;

  constructor(props) {
    super(props);
  }
  
  public setInfo(isRequesting: boolean, addressText?: string) {
    if (Utils.isNull(this.textAddress)) return;

    this.textAddress.setText(this.getAddressText(isRequesting, addressText));
  }

  private getAddressText(isRequesting: boolean, addressText: string): string {
    if (isRequesting) {
      return STRINGS.address_loadding;
    }

    if (Utils.isEmpty(addressText)) {
      return STRINGS.no_address;
    }

    //return STRINGS.book_search_latlng_point;

    return addressText;
  }

  _getTitleAddressSource() {
    if (this.props.focusAddress === FocusAddress.A_FOCUS) {
      return STRINGS.book_address_from;
    } else if (this.props.focusAddress === FocusAddress.B_FOCUS) {
      return STRINGS.book_address_to;
    }

    return STRINGS.book_address;
  }

  _getTintColor() {
    if (this.props.focusAddress === FocusAddress.A_FOCUS) {
      return COLORS.colorMain;
    } else if (this.props.focusAddress === FocusAddress.B_FOCUS) {
      return COLORS.colorSub;
    }

    return COLORS.colorMain;
  }

  render() {
    return (
      // <View style={styles.overContainer}>
        // {/* View text component hiển thị địa chỉ request được */}
        <View style={[styles.addressTextContainer, this.props.containerStyle]}>
          <Image
            source={IMAGES.ic_oval}
            style={[styles.iconOval, this.props.iconOvalStyle, {tintColor: this._getTintColor(),}]}
          />

          {/* Text address */}
          <View style={{ flex: 1, flexDirection: 'column', marginLeft: 8 }}>
            {this.props.isShowHeader && 
              <Text
                text={this._getTitleAddressSource()}
                textStyle={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: this._getTintColor(),
                }}
              />
            }

            <Text
              ref={(ref) => { this.textAddress = ref }}
              text={STRINGS.address_loadding}
              numberOfLines={1}
              ellipsizeMode="tail"
              textStyle={[styles.textAddress, this.props.textAddress]}
            />
          </View>
        </View>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  overContainer: {
    position: 'absolute',
    // flex: 1,
    display: 'flex',
    width: Dimensions.get('window').width,
    justifyContent: 'center'
  },
  addressTextContainer: {
    flexDirection: 'row',
    borderColor: COLORS.colorGrayLight,
    borderWidth: 0.5,
    borderRadius: 2,
    paddingBottom: 2,
    paddingTop: 2,
    margin: 8,
    backgroundColor: COLORS.colorWhiteFull,
    alignItems: 'center',

    shadowColor: COLORS.colorBlackFull,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  iconOval: {
    width: 24,
    height: 24,
    margin: 4,
  },
  textAddress: {
    fontSize: 16,
    color: COLORS.colorDark,
  },
});
  