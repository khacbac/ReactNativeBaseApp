import * as React from "react";

import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import strings from "../../../res/strings";
import { Text, ToastModule, PairAlert, AlertStyle } from "../../../module";
import colors from "../../../res/colors";
import BackHeader from "../../../module/ui/header/BackHeader";
import MediaManager from "../../../module/Media/MediaManager";
import Constants from "../../constant/Constants";
import TestViewModel from "../TestViewModel";
import { NativeAppModule } from "../../../module/base/NativeAppModule";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      justifyContent:'space-around',
    },
    btn: {
        backgroundColor: "red",
        height:44
    },
    text: {
        textAlign:'center',
        fontSize: 18, 
        color: "white",
    }
});

class TestModules extends React.Component<any, any> {

    private viewModel: TestViewModel;

    constructor(props) {
      super(props);

      this.viewModel = new TestViewModel()
    }

    componentDidMount() {
      console.log("TestModules componentDidMount");

    }
  
    private testShowingNotification() {
        console.log("TestModules testShowingNotification :");
        MediaManager.addNotification(strings.book_carinfo_subtitle, "Hi Chung");
    }

    private testPlayingSound() {
        console.log("TestModules testPlayingSound :");
        MediaManager.playRingtone(Constants.TIME_RING_TONE_LONG);
    }

    private testRemoveAllNotification() {
        console.log("TestModules testRemoveAllNotification :");
        MediaManager.removeNotification();
    }

    private startToUpdateLocation() {
      this.viewModel.startUpdatingLocation();
    }

    private stopToUpdateLocation() {
      this.viewModel.stopUpdatingLocation();
    }

    private showToast() {
      // ToastModule.show("Hi Chung",3)
      ToastModule.showWithGravity("Hi Chung",3)
    }

    private showAlert() {
      PairAlert.get()
      .setMessage(strings.book_invite_description)
      .setNegativeText(strings.book_button_new)
      .setNegativeStyle(AlertStyle.CANCLE)
      .setPositiveText(strings.book_button_meetcar)
      .show();

      setTimeout(() => {
          NativeAppModule.dismissTopView();
        },
        2000
      );
    }

    private renderFunctionButton() {
      
    }
  
    render() {
      return (
        <View style={styles.container}>
          <BackHeader
            title="Kiểm tra các chức năng của modules"
            drawerOpen={() => this.props.navigation.goBack()}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.testShowingNotification();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Tessting notification'}
          >
          </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.testPlayingSound();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Tessting play sound'}
          >
          </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.testRemoveAllNotification();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Tessting remove notifications'}
          >
          </Text>
          </TouchableOpacity>          
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.startToUpdateLocation();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Start to update location'}
          >
          </Text>
          </TouchableOpacity>   
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.stopToUpdateLocation();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Stop to update location'}
          >
          </Text>
          </TouchableOpacity>        
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.showToast();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Show toast'}
          >
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.showAlert();
            }}
          >
          <Text
            textStyle={styles.text}
            text = {'Dismis Alert'}
          >
          </Text>
          </TouchableOpacity>   
          
        </View>
      );
    }
}

export default TestModules;
  