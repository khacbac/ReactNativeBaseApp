/**
 * @author Nguyễn Đức Lực
 * @email lucnd.icloud@gmail.com
 * @create date 2018-06-24 09:45:27
 * @modify date 2018-06-24 09:45:27
 * @desc [Hiện thị giao diện request http]
 */

import * as React from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView
} from "react-native";
import ErrorView from "./ErrorView";
import strings from "../../res/strings"
import NoResultView from "./NoResultView";
import colors from "./res/colors";

const Waiting = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

/** danh sách các loại action để sử dụng */
const enum RequestState {
  NONE,
  SUCCESS,
  LOADING,
  NO_RESULT,
  ERROR
}

interface Props {
  style:{containner: object, color:any};
  alertNoResult?: string;
  alertError?: string;
  retryFunc?:any
}

interface State {
  requestState: RequestState;
}

export default class HttpView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      requestState: props.requestState || RequestState.LOADING
    };
  }

  public showWaitingView() {
    this.setState({ requestState: RequestState.LOADING });
  }

  public showSuccessRequest() {
    this.setState({ requestState: RequestState.SUCCESS });
  }

  public showFailRequest() {
    this.setState({ requestState: RequestState.ERROR });
  }

  public showNoResultRequest() {
    this.setState({ requestState: RequestState.NO_RESULT });
  }

  /**
   * thực hiện request
   */
  doRequest = async (request, response, error) => {
    try {
      this.showWaitingView();
      let ret = await request();
      // console.log("Dữ liệu nhận được", ret);
      if (Array.isArray(ret)){
        if(ret.length == 0){
          this.showNoResultRequest();
        }else{
          this.showSuccessRequest();
          response(ret);
        }
      }else{
        if (ret) {
          this.showSuccessRequest();
          response(ret);
        } else {
          this.showNoResultRequest();
        }
      }
    } catch (ex) {
      this.showFailRequest();
      error(ex);
    }
  };


  doRequestSimple = async (request, response, error) => {
    try {
      this.showWaitingView();
      let ret = await request();
      
      this.showSuccessRequest();
      response(ret);
      
    } catch (ex) {
      this.showFailRequest();
      error(ex);
    }
  };

  retry = () => {
    if(this.props.retryFunc){
      this.props.retryFunc();
    }
  }

  _renderView(loadingType) {
    if (loadingType == RequestState.LOADING) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" color={this.props.style.color?this.props.style.color:colors.colorMain} />
        </View>
      );
    } else if (
      loadingType == RequestState.SUCCESS ||
      loadingType == RequestState.NONE
    ) {
      return this.props.children;
    } else if (loadingType == RequestState.NO_RESULT) {
      // return <Text style={{ color: colors.colorBlackFull, textAlign:'center' }}>{this.props.alertNoResult}</Text>;
      return <NoResultView content={this.props.alertNoResult} style={{container:this.props.style.containner, tintColorImage:this.props.style.color}}/>
    } else {
      //return this.props.errorView?this.props.errorView:<Text style={{ color: "red" }}>{this.props.alertError}</Text>;
      return <ErrorView subject={strings.home_alert_title} content={strings.feedback_fail} btnRetry={strings.btn_retry} style={{container:this.props.style.containner,tintColor: this.props.style.color
      }} onPress={this.retry}></ErrorView>
    }
  }

  render() {
    return (
      <SafeAreaView style={[{ backgroundColor: "#ffffff", flex: 1, justifyContent:"center" }, this.props.style.containner]}>
        {this._renderView(this.state.requestState)}
      </SafeAreaView>
    );
  }
}

/**
 * hiện thị dialog cho request trong view
 */
interface StateDialog {
  dialogLoading: boolean;
}
class HttpDialog extends React.Component<Props, StateDialog> {
  constructor(props) {
    super(props);
    this.state = {
      dialogLoading: false
    };
  }

  public show() {
    this.setState({ dialogLoading: true });
  }

  public dismiss() {
    this.setState({ dialogLoading: false });
  }

  /**
   * thực hiện request server
   */
  public doRequest = async (request, response) => {
    this.show();
    try {
      let ret = await request();
      // let responseJson = await ret.json();
      this.dismiss();
      console.log("Dữ liệu nhận được", ret);
      if (ret) {
        response(ret);
      } else {
        Alert.alert(this.props.alertNoResult);
      }
    } catch (error) {
      this.dismiss();
      console.log(error);
      Alert.alert(this.props.alertError);
    }
  };

  render() {
    return (
      <View>
        <View
          style={[{ backgroundColor: "#ffffff", flex: 1 }, this.props.style.containner]}
        >
          {this.props.children}
        </View>
        <Waiting loading={this.state.dialogLoading} />
      </View>
    );
  }
}

export { Waiting, RequestState, HttpDialog };

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  },

  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040"
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  }
});
