import * as React from 'react';

import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';

import COLORS from '../../../../../../res/colors';
import images from '../../../../../../res/images';
import STRINGS from '../../../../../../res/strings';
import {TextInput} from '../../../../../../module';
import FocusAddress from '../../../../../viewmodel/search/FocusAddress';

interface SearchHeaderProps {
  onPressBackIcon;
  onPressMapIcon;
  onPressAddToAddress;
  initSrcFormatedAddress;
  initDstFormatedAddress;
  onSrcAddressTextChange;
  onDstAddressTextChange;
  onTextInputFocus(focusAddress: FocusAddress);
}

interface SearchHeaderState {}

export default class SearchHeaderNewUI extends React.Component<SearchHeaderProps, SearchHeaderState> {
  private srcTextInput: TextInput;
  private dstTextInput: TextInput;

  public setSrcTextInputText(text: string) {
    if (this.srcTextInput) {
      this.srcTextInput.setText(text);
    }
  }
  
  public setDstTextInputText(text: string) {
    if (this.dstTextInput) {
      this.dstTextInput.setText(text);
    }
  }

  public setSrcTextInputFocus() {
    if (this.dstTextInput) {
      this.dstTextInput.unFocus();
    }
    if (this.srcTextInput) {
      this.srcTextInput.setFocus();
    }
  }

  public setDstTextInputFocus() {
    if (this.srcTextInput) {
      this.srcTextInput.unFocus();
    }
    if (this.dstTextInput) {
      this.dstTextInput.setFocus();
    }
  }

  /** Lấy text điểm đi */
  public getSrcText(): string {
    if (this.srcTextInput) {
      return this.srcTextInput.getText();
    }

    return "";
  }
  
  /** Lấy text điểm đến */
  public getDstText(): string {
    if (this.dstTextInput) {
      return this.dstTextInput.getText();
    }

    return "";
  }

  render() {
    return (
      <View style={style.container}>
        {/* Icon back */}
        <View
          style={{
            width: 32,
            height: '100%',
            justifyContent: 'flex-start'
          }}
        >
          <TouchableOpacity onPress={this.props.onPressBackIcon}>
            <Image
              source={images.ic_arrow_back}
              style={{width: 32, height: 32, tintColor: '#19191A'}}
            />
          </TouchableOpacity>
        </View>

        {/* layout icon adress */}
        <View style={style.dotContainer}>
          <Image
            source={images.ic_oval}
            style={{width: 20, height: 20, tintColor: COLORS.colorMain}}
          />
          <View style={style.dividerHorizontal}/>
          
          <Image
            source={images.ic_oval}
            style={{width: 20, height: 20, tintColor: COLORS.colorSub}}/>
          {/* <Image
            source={images.ic_marker_end}
            style={{width: 32, height: 32}}
          /> */}
        </View>

        {/* Address detail view */}
        <View style={style.inputAddressContainer}>
          {/* Địa chỉ đi */}
          <TextInput
            ref={ref => {
              this.srcTextInput = ref;
            }}
            inputStyle={style.inputAddress}
            placeholder={STRINGS.search_address_from}
            placeholderTextColor="#9A9A9A"
            onChangeText={this.props.onSrcAddressTextChange}
            multiline={false}
            selectTextOnFocus={true}
            onFocus={() => {
              this.props.onTextInputFocus(FocusAddress.A_FOCUS);
            }}
            value={this.props.initSrcFormatedAddress}
          />

          {/* Divider */}
          <View style={style.dividerVertical} />

          {/* Địa chỉ đến */}
          <TextInput
            ref={ref => {
              this.dstTextInput = ref;
            }}
            inputStyle={style.inputAddress}
            placeholder={STRINGS.search_address_i_m_going_to}
            placeholderTextColor="#9A9A9A"
            onChangeText={this.props.onDstAddressTextChange}
            multiline={false}
            selectTextOnFocus={true}
            onFocus={() => {
              this.props.onTextInputFocus(FocusAddress.B_FOCUS);
            }}
            value={this.props.initDstFormatedAddress}
          />
        </View>
        {/* Icon map */}
        <TouchableOpacity onPress={this.props.onPressMapIcon}>
          <View style={style.mapButton}>
            <Image
              source={images.ic_map}
              style={{width: 24, height: 24, tintColor: '#1C1C1C'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: COLORS.colorWhiteFull,
  },
  mapButton: {
    width: 40,
    height: 40,
    marginLeft: 8,
    borderRadius: 20,
    justifyContent:'center', 
    alignItems: 'center',
    backgroundColor: "white",
    borderColor: '#1C1C1C',
    borderWidth: 1,
  },
  dotContainer: {
    flexDirection: 'column',
    width: 32,
    height: '100%',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  dividerHorizontal: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: COLORS.colorMain,
  },
  inputAddressContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 4,
  },
  inputAddress: {
    flex: 1, color: '#1C1C1C', minHeight: 36
  },
  dividerVertical: {
    width: '100%',
    backgroundColor: COLORS.colorGrayLight,
    height: 1,
    marginTop: 4,
    marginBottom: 4,
  }
});
