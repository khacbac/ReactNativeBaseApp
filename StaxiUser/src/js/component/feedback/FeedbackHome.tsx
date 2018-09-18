import * as React from "react";

import {
    StyleSheet,
    SafeAreaView,
    View,
    Dimensions,
    Alert,
    Linking
} from 'react-native';
import strings from '../../../res/strings';
import {
    Text,
    TextInput,
    HorizontalIconTextButton,
    ToastModule,
    BackHeader
} from '../../../module';
import images from '../../../res/images';
import colors from '../../../res/colors';
import {Dialog} from '../../../module';
import { sendFeedback } from '../../viewmodel/feedback/FeedbackModelView';
import Constants from '../../constant/Constants';
import WithTextInput from "../../../module/ui/WithTextInput";
import MainNavigator from "../../MainNavigation";
import fonts from "../../../module/ui/res/dimen/fonts";
import dimens from "../../../res/dimens";
import AppStyles, { HistoryCellStyle } from "../../../../../app/styles";


export interface State {
    title: string;
    contentTextInputValue: string;
    waiting: boolean;
}

export interface Props {
    navigation: any;
    screenProps;
}

class FeedbackHome extends React.Component<Props, State>{
    private mainNavigation: MainNavigator;
    constructor(props) {
        super(props);

        this.mainNavigation = this.props.screenProps.mainNavigation;
        this.mainNavigation.lockDrawer();

        this.state = { title: '', contentTextInputValue: '', waiting: false }
    }
    send_feedback = () => {
        if (this.state.contentTextInputValue.trim() == "") {
            Alert.alert(strings.feedback_required_field);
        } else {
            sendFeedback(this.state.title, this.state.contentTextInputValue)
                .then((ret) => {
                    if (ret.status) {
                        this.setState({ title: "", contentTextInputValue: "" });
                        ToastModule.show(strings.feedback_sent_finish);
                        setTimeout(() => { this.props.navigation.goBack() }, 2000);
                    } else {
                        ToastModule.show(strings.feedback_sent_not_finish);
                    }
                })
                .catch((err) => {
                    ToastModule.show(strings.feedback_sent_not_finish);
                });
        }
    }

    call_hotline() {
        Linking.openURL(`tel:` + Constants.phoneNumber);
    }


    /*** lấy đối tượng dialog */
    public getDialog(): Dialog {
        return this.refs.dialog as Dialog;
    }

    render() {
        if (!this.state.waiting) {
            this.refs.dialog && this.getDialog()._closeDialog();
        }
        return (
            <WithTextInput>
                <SafeAreaView style={styles.container}>
                    <BackHeader
                        title={strings.home_feedback_title}
                        drawerBack={() => {
                            // Mở khóa drawer khi về home.
                            this.mainNavigation.unlockDrawer();
                            this.props.navigation.goBack();
                        }} style = {AppStyles.header}/>
                    <View style={{ flex: 1,alignItems:'center' }}>

                        <Text text={strings.feedback_title} textStyle={styles.text}/>
                        <View style={[styles.inputview, { marginTop: 20 }]}>
                            <TextInput
                                placeholder={strings.feedback_content_title_hint}
                                placeholderTextColor={colors.colorGrayDark}
                                inputContainer={{ height: 44 }}
                                inputStyle={[styles.input, HistoryCellStyle.container,{marginLeft:null}]}
                                value={this.state.title}
                                onChangeText={(text) => this.setState({ title: text })}
                            />
                        </View>
                        <View style={[styles.inputview, { marginTop: 10, marginBottom: 10, flex:1 }]}>
                            <TextInput
                                value={this.state.contentTextInputValue}
                                placeholder={strings.feedback_content_hint}
                                placeholderTextColor={colors.colorGrayDark}
                                inputContainer={{ flex: 1 }}
                                inputStyle={[styles.input, HistoryCellStyle.container, {marginLeft:null}]}
                                onChangeText={(text) => this.setState({ contentTextInputValue: text })}
                                multiline
                                numberOfLines={5}
                            />
                        </View>

                        <View style={styles.footerView}>

                            <HorizontalIconTextButton
                                icon={images.feedback_hotline}
                                iconStyle={{ tintColor: colors.colorSub, marginHorizontal:null, marginRight: 5 }}
                                text={strings.feedback_hotline_alert_d.toUpperCase()}
                                border={1}
                                borderColor={colors.colorSub}
                                container={[{ backgroundColor: 'white', marginRight: 5},styles.btnContainer]}
                                rootStyle = {[{justifyContent: 'center', alignItems: 'center'}]}
                                textStyle={[{ color: colors.colorSub, font: fonts.body_2 },styles.commonBtn]}
                                onPress={() => { this.call_hotline() }}
                            />

                            <HorizontalIconTextButton
                                icon={images.feedback_send}
                                iconStyle={{marginHorizontal:null, marginRight: 5}}
                                text={strings.feedback_sent.toUpperCase()}
                                border={1}
                                borderColor={colors.colorMain}
                                rootStyle = {{justifyContent: 'center', alignItems: 'center'}}
                                container={[{ backgroundColor: colors.colorMain, marginLeft: 5 }, styles.btnContainer]}
                                textStyle={[{ color: 'white', font: fonts.body_2 }, styles.commonBtn]}
                                onPress={this.send_feedback}
                            />
                        </View>
                    </View>
                    <Dialog
                        onRequestClose={() => {
                            this.getDialog()._closeDialog();
                        }}
                        title={null}
                        ref="dialog"
                    />
                </SafeAreaView>
            </WithTextInput>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhiteMedium
    },
    text: {
        marginLeft: dimens.feedback_text_margin_left,
        marginRight: dimens.feedback_text_margin_right,
        marginTop: dimens.feedback_text_margin_top,
        color: colors.colorMain,
        textAlign: 'center',
        fontSize: fonts.body_1,
        fontWeight: 'bold'
    },
    input: {
        //borderRadius: 5,
        borderColor: colors.colorGray,
        marginLeft: dimens.feedback_input_margin_left,
        fontSize: fonts.body_2,
        backgroundColor: '#c9c9c944',
        borderBottomColor:colors.colorGrayLight,
        borderBottomWidth: 1,

    },
    inputview: {
        width:'90%'
    },

    footerView: {
        height: 50,
        width:'90%',
        marginBottom: dimens.feedback_footerView_margin_bottom,
        flexDirection: 'row'
    },
    btnContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius:8 
    },
    commonBtn: {
        fontWeight: 'bold',  
        paddingHorizontal: 0, 
        flex:null,
    }
});

export default FeedbackHome;