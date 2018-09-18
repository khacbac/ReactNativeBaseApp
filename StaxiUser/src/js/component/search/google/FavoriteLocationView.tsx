import * as React from 'react';

import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import IMAGES from '../../../../res/images';
import COLORS from '../../../../res/colors';
import STRINGS from '../../../../res/strings';

import {Text, Utils} from '../../../../module';

interface PropsFavoriteLocation {
  homeLocationData;
  homeWorkingData;
  onPressAddHome;
  onPressAddWorking;
  onPressItem;
}

interface StateFavoriteLocation {}

/** Component địa điểm yêu thích */
export default class FavoriteLocationView extends React.Component<
  PropsFavoriteLocation,
  StateFavoriteLocation
> {
  _getHomeTextLocation() {
    if (Utils.isNull(this.props.homeLocationData)) {
      return STRINGS.search_address_home_hint;
    }

    if (
      !Utils.isEmpty(this.props.homeLocationData.name) &&
      !Utils.isEmpty(this.props.homeLocationData.formattedAddress)
    ) {
      return `${this.props.homeLocationData.name} (${
        this.props.homeLocationData.formattedAddress
      })`;
    } else if (!Utils.isEmpty(this.props.homeLocationData.formattedAddress)) {
      return `${this.props.homeLocationData.formattedAddress}`;
    } else {
      return `${this.props.homeLocationData.name}`;
    }
  }

  _getWorkingTextLocation() {
    if (Utils.isNull(this.props.homeWorkingData)) {
      return STRINGS.search_address_working_hint;
    }

    if (
      !Utils.isEmpty(this.props.homeWorkingData.name) &&
      !Utils.isEmpty(this.props.homeWorkingData.formattedAddress)
    ) {
      return `${this.props.homeWorkingData.name} (${
        this.props.homeWorkingData.formattedAddress
      })`;
    } else if (!Utils.isEmpty(this.props.homeWorkingData.formattedAddress)) {
      return `${this.props.homeWorkingData.formattedAddress}`;
    } else {
      return `${this.props.homeWorkingData.name}`;
    }
  }

  _getHomeImageRightSource() {
    if (Utils.isNull(this.props.homeLocationData)) {
      return IMAGES.ic_plus;
    }

    return IMAGES.ic_edit;
  }

  _getWorkingImageRightSource() {
    if (Utils.isNull(this.props.homeWorkingData)) {
      return IMAGES.ic_plus;
    }

    return IMAGES.ic_edit;
  }

  render() {
    return (
      <View style={styles.containerSub}>
        {/* Header */}
        <Text
          text={STRINGS.profile_address_favorite_title.toUpperCase()}
          textStyle={styles.textHeader}
        />
        {/* Nhà riêng */}
        <TouchableOpacity
          onPress={() => this.props.onPressItem(this.props.homeLocationData)}
        >
          <View style={styles.favoriteLocationRow}>
            <Image source={IMAGES.ic_home} style={styles.favoriteIconLeft} />

            <View style={{flex: 1, flexDirection: 'column', marginLeft: 16}}>
              <Text
                text={STRINGS.search_address_home}
                numberOfLines={1}
                textStyle={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: COLORS.colorDarkMain,
                }}
              />
              <Text
                text={this._getHomeTextLocation()}
                numberOfLines={1}
                textStyle={{
                  fontSize: 14,
                  color: COLORS.colorGrayDark,
                }}
              />
            </View>

            <TouchableOpacity onPress={this.props.onPressAddHome}>
              <Image
                source={this._getHomeImageRightSource()}
                style={styles.favoriteIconRight}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.favoriteDivider} />

        {/* Công ty */}
        <TouchableOpacity
          onPress={() => this.props.onPressItem(this.props.homeWorkingData)}
        >
          <View style={styles.favoriteLocationRow}>
            <Image source={IMAGES.ic_working} style={styles.favoriteIconLeft} />

            <View style={{flex: 1, flexDirection: 'column', marginLeft: 16}}>
              <Text
                text={STRINGS.search_address_working}
                numberOfLines={1}
                textStyle={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: COLORS.colorDarkMain,
                }}
              />
              <Text
                text={this._getWorkingTextLocation()}
                numberOfLines={1}
                textStyle={{
                  fontSize: 14,
                  color: COLORS.colorGrayDark,
                }}
              />
            </View>

            <TouchableOpacity onPress={this.props.onPressAddWorking}>
              <Image
                source={this._getWorkingImageRightSource()}
                style={styles.favoriteIconRight}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.favoriteDivider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerSub: {
    flexDirection: 'column',
    marginTop: 4,
    marginBottom: 4,
  },
  textHeader: {
    color: COLORS.grayDarkSub,
    fontSize: 17,
  },
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
