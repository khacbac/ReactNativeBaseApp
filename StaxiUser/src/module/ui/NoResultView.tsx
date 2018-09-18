import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import images from './res/drawable/images';
import fonts from './res/dimen/fonts';
import colors from './res/colors';

interface Props{
  style:{container?:object, tintColorImage?:any, colorText?: any};
  content:string;
  colorMain?:string;
}

interface State{
  content:string;
}

class NoResultView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    }
  }

  render() {
    return (
      <View style={this.props.style.container}>
        <View style={styles.container}>
          <Image style={[styles.icon, {tintColor:this.props.style.tintColorImage}]}
            source={images.error_view_cloud}
          />
          <Text style={[styles.alert, {color:this.props.style.colorText}]}>
            {this.state.content}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: 'column',
  },

  alert: {
    fontSize: fonts.body_2,
    flexWrap: 'wrap',
    marginVertical: 16
  },

  icon: {
    padding: 16,
    marginTop: 16,
    height: 60,
    width: 140,
    tintColor: colors.colorMain,
    resizeMode: 'contain'
  }
});

export default NoResultView;
