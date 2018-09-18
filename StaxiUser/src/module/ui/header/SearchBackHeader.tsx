import * as React from 'react';

import {
  TouchableOpacity,
  View,
  Image,
  Text,
  // TextInput,
} from 'react-native';

import color from '../../../res/colors';
import images from '../../../res/images';
import { TextInput } from '../..';

/**
 * Component header back
 * @author ĐvHiện
 * Created on 05/06/2018
 */
interface Props {
  onChangeText?: Function;
  drawerBack?: Function;
  title?: string;
  placeholder?;
  placeholderTextColor?;
  underlineColorAndroid?;
  inputStyle?;
}

interface State {
  isShowingSearchView: boolean;
  searchText: string;
  isAllowShowSearchView: boolean;
}

class SearchBackHeader extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isShowingSearchView: false,
      searchText: '',
      isAllowShowSearchView: false,
    };
  }

  clearSearchState() {
    this.setState({
      isShowingSearchView: false,
      searchText: '',
    });

    this.props.onChangeText('');
  }

  setAllowShowSearchView(isAllow) {
    this.setState({
      isAllowShowSearchView: isAllow
    });
  }

  _renderBackHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          padding: 8,
          backgroundColor: color.colorMain,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.drawerBack();
          }}
        >
          <Image
            source={images.ic_arrow_back}
            resizeMode="contain"
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>
        <View
          style={{
            height: 48,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              padding: 8,
              marginRight: 10,
              fontWeight: 'bold',
            }}
          >
            {this.props.title}
          </Text>
        </View>
        {/* <Right /> */}

        {this.state.isAllowShowSearchView &&
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isShowingSearchView: true,
              });
            }}
          >
            <Image
              source={images.ic_search_header}
              style={{ width: 32, height: 32, tintColor: color.colorWhiteFull }}
              resizeMode="contain"
            />
          </TouchableOpacity>}
      </View>
    );
  };

  _renderSearchHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          padding: 8,
          backgroundColor: color.colorMain,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            this.clearSearchState();
            this.props.drawerBack();
          }}>
          <Image
            source={images.ic_arrow_back}
            resizeMode="contain"
            style={{ width: 32, height: 32 }}
          />
        </TouchableOpacity>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 0.5,
          borderBottomColor: color.colorWhiteMedium,
        }}>
          <View style={{ flex: 1 }}>
            <TextInput
              ref="textInput"
              returnKeyType={'search'}
              autoFocus={true}
              inputStyle={[{
                marginLeft: 8,
                flex: 1,
                height: 48,
                fontSize: 18,
                fontWeight: 'bold',
                marginRight: 10,
                color: color.colorWhiteFull,

              }, this.props.inputStyle]}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              // clearButtonMode="while-editing"
              // underlineColorAndroid={this.props.underlineColorAndroid}
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({
                  searchText: text,
                });
                this.props.onChangeText(text);
              }}
              value={this.state.searchText}
            />
          </View>



          <TouchableOpacity onPress={() => {
            this.setState({
              searchText: "",
              isShowingSearchView: false
            }, () => {
              this.props.onChangeText('');
            });
          }}>
            <Image
              source={images.ic_cancel}
              resizeMode="contain"
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        </View>



        {/* {false && <TouchableOpacity onPress={() => {
          this.setState({
            searchText: '',
          }, () => {
            this.props.onChangeText('');
          });
        }}>
          <Image
            source={images.ic_cancel}
            resizeMode="contain"
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>} */}
      </View>
    );
  };

  render() {
    return (
      <View style={{ width: '100%' }}>
        {/* Nếu không cho phép hiển thị search view hoặc đang không show search view => hiển thị backview */}
        {(!this.state.isAllowShowSearchView ||
          !this.state.isShowingSearchView) &&
          this._renderBackHeader()}

        {this.state.isShowingSearchView &&
          this.state.isAllowShowSearchView &&
          this._renderSearchHeader()}
      </View>
    );
  }
}

export default SearchBackHeader;
