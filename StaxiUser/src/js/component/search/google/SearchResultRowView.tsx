import * as React from 'react';

import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import IMAGES from '../../../../res/images';
import COLORS from '../../../../res/colors';
import STRINGS from '../../../../res/strings';

import {Text, Utils} from '../../../../module';

import AddressItem from '../../../viewmodel/search/autocomplete/AddressItem';

interface PropsSearchResult {
  onPressSearchResultItem: Function;
  data: AddressItem;
  onPressRightImage?;
}

interface StateSearchResult {
}

/** Component row kết quả tìm kiếm */
export default class SearchResultRowView extends React.Component<PropsSearchResult, StateSearchResult> {
    _getIconLeftResource(data) {
      if (data.type === AddressItem.HOME) {
        return IMAGES.ic_home;
      }
  
      if (data.type === AddressItem.WORKING) {
        return IMAGES.ic_working;
      }
  
      if (data.type === AddressItem.HISTORY) {
        return IMAGES.ic_menu_tracking;
      }
  
      return IMAGES.ic_location;
    }
  
    _getAddressName(data) {
      if (data.type === AddressItem.HOME || data.type === AddressItem.WORKING) {
        if (!Utils.isEmpty(data.name) && !Utils.isEmpty(data.formattedAddress)) {
          return `${data.name} (${data.formattedAddress})`;
        } else if (!Utils.isEmpty(data.formattedAddress)) {
          return `${data.formattedAddress}`;
        } else {
          return `${data.name}`;
        }
      }
  
      if (data.type === AddressItem.HISTORY) {
        return data.formattedAddress;
      }
  
      return data.name;
    }
  
    _getAddressFormat(data) {
      if (data.type === AddressItem.HOME) {
        return STRINGS.search_address_home;
      }
      
      if (data.type === AddressItem.WORKING) {
        return STRINGS.search_address_working;
      }
  
      if (data.type === AddressItem.HISTORY) {
        let deltaSecond = (new Date().getTime() - data.createTime)/1000;
        let deltaDay = Math.floor(deltaSecond/(24 * 3600));
  
        if (deltaDay === 1) {
          return STRINGS.history_yesterday;
        }
  
        if (deltaDay > 1) {
          return `${deltaDay} ${STRINGS.history_days_ago}`;
        }
  
        let deltaHour = Math.floor(deltaSecond/(3600));
        if (deltaHour > 0) {
          return `${deltaHour} ${STRINGS.history_hours_ago}`;
        }
        
        return STRINGS.history_recent;
      }
  
      return data.formattedAddress;
    }
    
    render () {
      let addressName = this._getAddressName(this.props.data);
      let addressFortmat = this._getAddressFormat(this.props.data);
      return (
        <TouchableOpacity onPress={() => {
          this.props.onPressSearchResultItem();
        }}>
        <View>
          <View style={styles.favoriteLocationRow}>
            <Image
              source={this._getIconLeftResource(this.props.data)}
              style={styles.favoriteIconLeft} />
  
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                marginLeft: 16,
                justifyContent: 'center',
                minHeight: 40,
              }}>
  
              {/* Tên địa chỉ */}
              {!Utils.isEmpty(addressName) && <Text
              numberOfLines={1}
              text={addressName}
              textStyle={{
                fontWeight: '500',
                fontSize: 16,
                color: COLORS.colorDarkMain,
              }}/>}
  
              {/* Mô tả địa chỉ, tạm thời k hiển thị vì chưa lấy đc từ response */}
              {!Utils.isEmpty(addressFortmat) && <Text
                numberOfLines={1}
                text={addressFortmat}
                textStyle={{
                  fontSize: 14,
                  color: COLORS.colorGrayDark,
                }}
              />}
            </View>
  
            {/* Icon xóa địa chỉ, chỉ hiển thị khi row là history address */}
            {(this.props.data.type === AddressItem.HISTORY) &&
              <TouchableOpacity onPress={this.props.onPressRightImage}>
                <Image
                  source={IMAGES.ic_delete}
                  style={styles.favoriteIconRight}
                />
              </TouchableOpacity>}
          </View>
          
          <View style={[styles.favoriteDivider, {margin: 4}]} />
        </View>
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
    favoriteLocationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 4,
    },
    favoriteIconLeft: {
      width: 24,
      height: 24,
      tintColor: COLORS.grayDarkSub,
    },
    favoriteIconRight: {
      width: 28,
      height: 28,
      tintColor: COLORS.grayDarkSub,
    },
    favoriteDivider: {
      width: '100%',
      backgroundColor: COLORS.colorDivider,
      height: 0.5,
    },
  });
  