import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Button } from '..';
import images from './res/drawable/images';
import fonts from './res/dimen/fonts';
import colors from './res/colors';

interface Props{
  style:{container: object, tintColor?: any, colorTxt?: any};
  subject:string;
  content:string;
  onPress:Function;
  btnRetry:string;
}

interface State{
  subject:string;
  content:string;
  btnRetry:string;
}

class ErrorView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      subject: this.props.subject,
      content: this.props.content,
      btnRetry: this.props.btnRetry,
    }
  }

  render() {
    return (
      <View style={[styles.container,this.props.style.container]}>
        <View style={styles.container}>
          <Image style={[styles.icon, {tintColor:this.props.style.tintColor?this.props.style.tintColor:colors.colorMain}]}
            source={images.error_view_cloud}
          />
          <Text style={styles.alertTitle}>
            {this.state.subject}
          </Text>
          <Text style={styles.alert}>
            {this.state.content}
          </Text>
          <Button btnStyle={[styles.btn, {backgroundColor:this.props.style.tintColor?this.props.style.tintColor:colors.colorMain}]} onPress={this.props.onPress && this.props.onPress} text={this.state.btnRetry.toLocaleUpperCase()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: 'column',
    justifyContent:'center'
  },

  btn: {
    padding: 15,
    backgroundColor: colors.colorMain,
    height: 45,
    borderRadius:4
    // alignItems: "center",
  },

  alertTitle: {
    fontSize: fonts.body_1,
    marginTop: 8,
    fontWeight: 'bold',
  },

  alert: {
    fontSize: fonts.body_2,
    flexWrap: 'wrap',
    marginVertical: 16
  },

  icon: {
    height: 60,
    width: 140,
    tintColor: colors.colorMain,
    resizeMode: 'contain'
  }
});

export default ErrorView;
