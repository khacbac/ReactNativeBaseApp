import * as React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  AlertButton,
} from "react-native";
import uicolors from "../res/colors";
import uidimens from '../res/dimen/dimens';

import Text from '../Text';
import colors from "../res/colors";
import dimens from "../res/dimen/dimens";
import ButtonMap from "./ButtonMap";

interface Props {
  onRequestClose?: Function;
  closeOnOutSide?: boolean;
  bottomContainer?: any;
  topContainer?: any;
  title?: any;
  contentStyle?: StyleProp<ViewStyle>;
  visible?: boolean;
}

interface State {
  visible?: any;
  topStyle?: any;
  children?: any;
  contentStyle?: any;
  title: any;
  showTitle: any;
}

export default class Dialog extends React.Component<Props, State> {


  constructor(props: Props) {
    super(props);
    this.state = {
      visible: props.visible || false,
      children: null,
      topStyle: styles.topContainer,
      contentStyle: styles.content,
      title: this.props.title ? this.props.title : null,
      showTitle: false
    };
  }

  _showDialog(children, isToast) {
    this.setState({
      visible: true,
      children: children,
      topStyle: styles.topContainer||{},
      contentStyle: styles.content || {},
      showTitle: true
    });
  }

  showDialogNoTitle(children) {
    this.setState({
      visible: true,
      children: children,
      topStyle: styles.topContainer,
      contentStyle: styles.content,
      showTitle: false
    });
  }

  // Hiển thị dialog cơ bản,không title,border,pading.
  showBaseDialog(children, topStyle?) {
    this.setState({
      visible: true,
      children: children,
      topStyle: [styles.topContainer, { borderRadius: 0 }, topStyle || {}],
      contentStyle: [styles.content, { padding: 0 }],
      showTitle: false
    });
  }

  // Hiển thị dialog full màn hình
  _showFragment(children) {
    this.setState({
      topStyle: styles.fragmentContainer,
      contentStyle: styles.contentFragment,
      visible: true,
      children: children,
      showTitle: false
    });
  }

  showSimpleDialog(contentText, confirmText = "", onConfirm?) {
    let simple = (
      <SimpleDialog
        contentText={contentText}
        onConfirm={onConfirm}
        confirmText={confirmText}
      />
    );
    this.setState({
      visible: true,
      children: simple,
      showTitle: true
    });
  }

  // Alert với các button hiển thị theo chiều dọc.
  private renderVAlertBtn(button: AlertButton, btnTxtStyle) {
    return <TouchableOpacity
      onPress={() => {
        this.dissmiss(button.onPress && button.onPress());
      }}
      style={{ width: '100%', paddingHorizontal: dimens.dimen_twenty, alignItems: 'center' }}>
      <View style={{
        height: dimens.borderRadius,
        backgroundColor: colors.colorGrayLight,
        width: '100%'
      }} />
      <View
        style={alertStyles.vButton}
      >
        <Text
          text={button.text}
          textStyle={btnTxtStyle}
        />
      </View>
    </TouchableOpacity>
  }

  // Alert với các button hiển thị theo chiều ngang.
  private renderHAlertBtn(button: AlertButton) {
    return <TouchableOpacity
      style={alertStyles.hButton}
      onPress={() => {
        this.dissmiss(button.onPress && button.onPress());
      }}
    >
      <Text
        text={button.text.toUpperCase()}
        textStyle={alertStyles.btnText} />
    </TouchableOpacity>
  }

  public showAlert(title?: string, message?: string, buttons?: Map<string, AlertButton>, options?: { cancelable: boolean, isVerticle: boolean }, type?: string) {
    let children = (options && options.isVerticle) ?
      <View style={{ paddingTop: dimens.dimen_twenty }}>
        <View style={alertStyles.content}>
          {title !== "" && <Text text={title} textStyle={[alertStyles.title, { color: colors.colorMain }]} />}
          <Text text={message} textStyle={alertStyles.message} />
        </View>

        <View style={alertStyles.vBottomContainer} >
          {buttons.get(ButtonMap.AskMe) && this.renderVAlertBtn(buttons.get(ButtonMap.AskMe), alertStyles.vABtnText)}
          {buttons.get(ButtonMap.Negative) && this.renderVAlertBtn(buttons.get(ButtonMap.Negative), alertStyles.vNBtnText)}
          {buttons.get(ButtonMap.Positive) && this.renderVAlertBtn(buttons.get(ButtonMap.Positive), alertStyles.vPBtnText)}
        </View>
      </View>
      :
      <View style={alertStyles.container}>
        <View style={alertStyles.content}>
          {title !== "" && <Text text={title} textStyle={alertStyles.title} />}
          <Text text={message} textStyle={alertStyles.message} />
        </View>

        <View style={alertStyles.hBottomContainer} >
          {buttons.get(ButtonMap.AskMe) && this.renderHAlertBtn(buttons.get(ButtonMap.AskMe))}
          {buttons.get(ButtonMap.Negative) && this.renderHAlertBtn(buttons.get(ButtonMap.Negative))}
          {buttons.get(ButtonMap.Positive) && this.renderHAlertBtn(buttons.get(ButtonMap.Positive))}
        </View>
      </View>;

    this.showBaseDialog(children, alertStyles.topStyle)

  }

  showWaitingDialog(title) {
    let waitting = <WaittingDialog text={title} />;
    this.setState({
      visible: true,
      topStyle: styles.topContainer,
      contentStyle: styles.content,
      children: waitting,
      showTitle: false
    });
  }

  showWaitingDialogNoTitle() {
    let waitting = <WaittingDialog text="loading..." />;
    this.setState({
      visible: true,
      topStyle: styles.topContainer,
      contentStyle: styles.content,
      children: waitting,
      showTitle: false
    });
  }

  showInputDialog(placeholder, confirmText, onChangeText, onPress) {
    let input = (
      <InputDialog
        placeholder={placeholder}
        confirmText={confirmText}
        onPress={onPress}
        onChangeText={onChangeText}
      />
    );
    this.setState({
      visible: true,
      children: input,
      showTitle: false
    });
  }

  _closeDialog() {
    this.setState({
      visible: false
    });
  }

  dissmiss(onDissmiss?) {
    this.setState({
      visible: false
    }, () => onDissmiss && onDissmiss());
  }

  renderView() {
    if (!this.state.showTitle) {
      return <View
        style={[
          { backgroundColor: "white" },
          this.props.topContainer,
          this.state.topStyle
        ]}
      >
        <View style={[this.state.contentStyle, this.props.contentStyle]}>{this.state.children}</View>
      </View>
    } else {
      return <View
        style={[
          { backgroundColor: "white" },
          this.props.topContainer,
          this.state.topStyle
        ]}
      >
        {this.state.title && (
          <View
            style={{
              borderTopLeftRadius: uidimens.dimen_ten,
              borderTopRightRadius: uidimens.dimen_ten,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: "black",
              borderBottomWidth: uidimens.dimen_one,
              paddingVertical: uidimens.dimen_ten,
              paddingHorizontal: uidimens.dimen_fifteen
            }}
          >
            <Text textStyle={styles.title} text={this.props.title} />
          </View>
        )}
        <View style={[this.state.contentStyle, this.props.contentStyle]}>{this.state.children}</View>
      </View>
    }
  }

  render() {
    return (
      // <SafeAreaView style={{width:'100%',height:'100%'}}>
      <Modal
        visible={this.state.visible}
        onRequestClose={() => this.props.onRequestClose && this.props.onRequestClose()}
        onDismiss={() => this.props.onRequestClose && this.props.onRequestClose()}
        transparent={true}
        animationType="fade"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View
              onTouchStart={() => {
                this.props.closeOnOutSide && this._closeDialog();
              }}
              style={[
                styles.bottomContainer,
                this.props.bottomContainer
              ]}
            />

            {this.renderView()}

          </View>
        </SafeAreaView>
      </Modal>
      // </SafeAreaView>

    );
  }
};

interface SPProps {
  container?: any;
  contentStyle?: any;
  contentTextStyle?: any;
  contentText?: any;
  btnRootStyle?: any;
  onConfirm?: any;
  btnStyle?: any;
  btnTextStyle?: any;
  confirmText?: any;
}

interface SPState {

}
// Dialog thông báo.
class SimpleDialog extends React.Component<SPProps, SPState> {
  render() {
    return (
      <View style={this.props.container}>
        <View style={[simple.contentStyle, this.props.contentStyle]}>
          <Text textStyle={[simple.contentTextStyle, this.props.contentTextStyle]} text={this.props.contentText} />
        </View>

        <View style={[simple.btnRootStyle, this.props.btnRootStyle]}>
          <TouchableOpacity
            onPress={this.props.onConfirm}
            style={[simple.btnStyle, this.props.btnStyle]}
          >
            <Text textStyle={[simple.btnTextStyle, this.props.btnTextStyle]} text={this.props.confirmText} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

interface WTProps {
  progressContainer?: any;
  text?: any;
  textContainer?: any;
  textStyle?: any;
}

interface WTState {

}
// Dialog waitting.
class WaittingDialog extends React.Component<WTProps, WTState> {
  render() {
    return (
      <View>
        <View
          style={[waitting.waittingContainer, this.props.progressContainer]}
        >
          <ActivityIndicator size="large" color={uicolors.colorMain} />
        </View>
        {this.props.text !== '' && (
          <View style={[waitting.textContainer, this.props.textContainer]}>
            <Text
              textStyle={[waitting.waittingText, this.props.textStyle]}
              text={this.props.text}
            />
          </View>
        )}
      </View>
    );
  }
}

interface WTV2Props {

}
interface WTV2State {

}
class WaittingDialogV2 extends React.Component<WTV2Props, WTV2State> {
  render() {
    return (
      <Dialog
        title={null}
      />
    )
  }
}

interface IPProps {
  placeholder?: any;
  placeholderTextColor?: any;
  inputStyle?: any;
  onChangeText?: any;
  value?: any;
  btnContainer?: any;
  onPress?: any;
  textStyle?: any;
  confirmText?: any;
}

interface IPState {

}
// Dialog input.
class InputDialog extends React.Component<IPProps, IPState> {
  render() {
    return (
      <View>
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          style={[input.txtInput, this.props.inputStyle]}
          underlineColorAndroid="transparent"
          onChangeText={this.props.onChangeText}
          value={this.props.value}
        />
        <View style={[input.btnContainer, this.props.btnContainer]}>
          <TouchableOpacity onPress={this.props.onPress}>
            <Text textStyle={[input.btnText, this.props.textStyle]} text={this.props.confirmText} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

interface TProps {
  text?: any;
}

interface TState {

}
// Dialog Toast
class Toast extends React.Component<TProps, TState> {
  render() {
    return (
      <View style={{ borderRadius: uidimens.dimen_ten }}>
        <View style={toast.bottom}>
          <Text textStyle={[toast.text, { opacity: uidimens.dimen_zero }]} text={this.props.text} />
        </View>
        <View style={{ borderRadius: uidimens.dimen_ten, position: "absolute" }}>
          <View style={toast.contentDisplay}>
            <Text textStyle={[toast.text, { width: "100%" }]} text={this.props.text} />
          </View>
        </View>
      </View>
    );
  }
}

// ===================================================================================== //

export { SimpleDialog, WaittingDialog, InputDialog, Toast };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomContainer: {
    opacity: 0.7,
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  topContainer: {
    position: "absolute",
    justifyContent: "center",
    // padding: 10,
    borderRadius: uidimens.dimen_ten,
    backgroundColor: "white",
    width: "80%"
  },
  fragmentContainer: {
    position: "absolute",
    backgroundColor: "white",
    width: "100%",
    height: "100%"
  },
  title: {
    fontWeight: "bold",
    fontSize: uidimens.dimen_twenty,
    color: "black"
    // marginBottom: 20,
  },
  content: {
    justifyContent: "center",
    padding: uidimens.dimen_ten
  },
  contentFragment: {
    padding: uidimens.dimen_zero
  }
});

const notify = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  contentText: {
    fontSize: 16,
    color: "black"
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: uidimens.dimen_ten
  },
  btnRightContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btnText: {
    fontSize: 16,
    color: uicolors.colorGreen,
    marginRight: uidimens.dimen_ten
  }
});

const input = StyleSheet.create({
  txtInput: {
    color: uicolors.colorBlackFull,
    fontSize: 18,
    borderColor: uicolors.colorBlackFull,
    borderWidth: 1
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  btnText: {
    color: uicolors.colorMain,
    fontSize: 18,
    padding: uidimens.dimen_ten
  }
});

const waitting = StyleSheet.create({
  waittingContainer: {
    padding: uidimens.dimen_ten,
    alignItems: "center"
  },
  textContainer: {
    padding: uidimens.dimen_ten,
    alignItems: "center"
  },
  waittingText: {
    fontSize: 16,
    color: uicolors.colorBlackFull
  }
});

const toast = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: uicolors.colorBlackFull,
    opacity: 0.7,
    borderRadius: uidimens.dimen_ten
  },
  bottom: {
    padding: uidimens.dimen_twenty,
    borderRadius: uidimens.dimen_ten,
    backgroundColor: "black",
    opacity: 0.7
  },
  contentDisplay: {
    padding: uidimens.dimen_twenty,
    borderRadius: uidimens.dimen_ten,
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    fontSize: 22,
    color: uicolors.colorWhiteFull,
    textAlign: "center"
    // position: 'absolute'
  }
});

const simple = StyleSheet.create({
  contentStyle: {
    flex: 1,
    marginBottom: uidimens.dimen_ten
  },
  contentTextStyle: {
    color: "black",
    fontSize: 18,
    textAlign: "center"
  },
  btnRootStyle: {
    flexDirection: "row",
    justifyContent: "center"
  },
  btnStyle: {
    paddingVertical: uidimens.dimen_five,
    paddingHorizontal: uidimens.dimen_ten,
    borderColor: "black",
    borderWidth: uidimens.dimen_one
  },
  btnTextStyle: {
    color: "black",
    fontSize: 16
  }
});

const alertStyles = StyleSheet.create({
  topStyle: {
    width: '85%',
    borderRadius: dimens.dimen_three,
  },
  container: {
    paddingVertical: dimens.dimen_twenty
  },
  content: {
    marginHorizontal: dimens.dimen_twenty
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: dimens.dimen_twenty
  },
  message: {
    marginBottom: dimens.dimen_thirty,
    fontSize: 16
  },
  vBottomContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hBottomContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  vButton: {
    marginVertical: dimens.dimen_fifteen,
    width: '100%',
    alignItems: 'center',
  },
  hButton: {
    marginRight: dimens.dimen_twenty
  },
  btnText: {
    color: colors.colorMain,
    fontSize: 14,
    fontWeight: 'bold'
  },
  vPBtnText: {
    color: colors.colorBlackFull,
    fontSize: 16,
  },
  vNBtnText: {
    color: colors.colorBlackFull,
    fontSize: 16,
  },
  vABtnText: {
    color: colors.colorRed,
    fontSize: 16,
  }
})
