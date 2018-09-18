import * as React from "react";

import {
    StyleSheet,
    SafeAreaView,
    View,
    Dimensions,
    Share,
    ScrollView
} from 'react-native';
import { Text, Image, HorizontalIconTextButton, NativeLinkModule } from '../../../module';
import MenuHeader from '../../../module/ui/header/MenuHeader';
import colors from '../../../res/colors';
import images from '../../../res/images';
import strings from '../../../res/strings'
import dimens from "../../../module/ui/res/dimen/dimens";
import dimensChild from "../../../res/dimens";
import MainNavigator from "../../MainNavigation";
import fonts from "../../../module/ui/res/dimen/fonts";
import drawables from "../../../../../app/drawables";


export interface State {
}

export interface Props {
    navigation: any;
    screenProps;
}

class AboutHome extends React.Component<Props, State> {

    private mainNavigation: MainNavigator;

    constructor(props) {
        super(props);
        this.mainNavigation = this.props.screenProps.mainNavigation;
        this.mainNavigation.lockDrawer();
    }

    renderLine() {
        return (
            <View style={{
                backgroundColor: colors.colorGrayLight,
                height: dimens.border_width,
                width: '100%'
            }}></View>
        )
    }
    render() {
        return (
            <SafeAreaView style={styles.safeViewContainer}>

                <MenuHeader
                    title={strings.home_about_title}
                    drawerOpen={() => {
                        // Mở khóa drawer khi về home.
                        this.mainNavigation.unlockDrawer();
                        this.props.navigation.goBack();
                    }}
                    isBack
                />
                <View style={styles.contentContainerStyle}>
                    <View style={styles.headerView}>
                        <Image imgStyle={{ width: dimensChild.about_home_logo_app_size, height: dimensChild.about_home_logo_app_size,
                            marginTop: dimensChild.about_icon_margin_top, tintColor: null }} source={drawables.about_logo} />
                        <View style={{ padding: 10 }}>
                            <Text textStyle={{ color: '#212121', fontSize: fonts.h6_20, textAlign:'center' }} text={strings.app_name}/>
                            <Text textStyle={{ color: '#212121', fontSize: fonts.body_2, textAlign:'center' }} text={strings.version_name} />
                            <Text textStyle={[styles.sologan]} text={strings.sologan_name} />
                        </View>
                    </View>
                    {/* <View style={styles.viewline}> </View> */}
                    {this.renderLine()}
                    <ScrollView style={styles.scroll}>
                        <View style={styles.contentView}>
                            <Text textStyle={styles.textContent} text={strings.about_content_one} />
                            <Text textStyle={styles.textContent} text={strings.about_content_two} />
                            <Text textStyle={styles.textContent} text={strings.about_content_three} />
                            <Text textStyle={styles.textContent} text={strings.about_content_four} />
                            <Text textStyle={styles.textContent} text={strings.about_content_five} />
                        </View>
                    </ScrollView>
                    {/* <View style={styles.viewline2}> </View> */}
                    {this.renderLine()}
                    <View style={styles.footerView}>
                        <View style={styles.buttonContainer}>
                            
                        <HorizontalIconTextButton
                                icon={images.ic_star}
                                text={strings.about_btn_rate.toUpperCase()}
                                border={1}
                                borderColor={colors.colorSub}
                                container={{ backgroundColor: 'white', flex: 1, marginRight: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}
                                rootStyle = {{justifyContent: 'center', alignItems: 'center'}}
                                textStyle={{ color: colors.colorSub, fontWeight: 'bold', fontSize: fonts.body_2, flex:null }}
                                iconStyle={{ tintColor: colors.colorSub, marginHorizontal:null }}
                                onPress={() => {
                                    NativeLinkModule.showAppStore()

                                    // let linkIOS = "itms-apps://itunes.apple.com/app/viewContentsUserReviews?id=1401914283"
                                    // let linkAndroid = 'market://details?id=com.binhanh.taxihunglong';
                                    // if (Platform.OS == 'ios') {
                                    //     Linking.canOpenURL(linkIOS).then(supported => {
                                    //         supported && Linking.openURL(linkIOS);
                                    //     }, (err) => {ToastModule.show(strings.feedback_fail)});
                                    // } else {
                                    //     Linking.canOpenURL(linkAndroid).then(supported => {
                                    //         supported && Linking.openURL(linkAndroid);
                                    //     }, (err) => {ToastModule.show(strings.feedback_fail)});
                                    // }
                                }}
                            />
                            <HorizontalIconTextButton
                                icon={images.about_share}
                                text={strings.about_btn_share.toUpperCase()}
                                border={1}
                                borderColor={colors.colorMain}
                                container={{ backgroundColor: colors.colorMain, marginLeft: 5, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }}
                                rootStyle = {{justifyContent: 'center', alignItems: 'center'}}
                                textStyle={{ color: 'white', fontWeight: 'bold', fontSize: fonts.body_2, flex:null }}
                                iconStyle={{ tintColor: 'white', marginHorizontal:null }}
                                onPress={() => {
                                    Share.share({
                                        message: 'G7 taxi HN',
                                        url: 'http://binhanh.com',
                                        title: 'G7'
                                    })
                                }}
                            />

                        </View>
                        <Text textStyle={{ fontSize: fonts.body_2, padding: 4, textAlign: 'center', color: 'gray' }} text={strings.about_copyright} />
                    </View>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeViewContainer: {
        flex: 1
    },

    contentContainerStyle: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },

    icon: {
        width: dimensChild.about_home_logo_app_size,
        height: dimensChild.about_home_logo_app_size
    },

    headerView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: dimensChild.about_header_height,
        marginBottom: dimensChild.about_content_padding_top
    },

    contentView: {
        marginLeft: dimensChild.about_content_margin,
        marginRight: dimensChild.about_content_margin,
        flex: 1
    },

    scroll: {
        flex: 1
    },

    contentScroll: {

    },

    footerView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 20,
        height: dimensChild.about_footer_height,
        paddingTop: dimensChild.about_footer_padding_top
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1
    },

    sologan: {
        color: colors.colorMain,
        fontWeight: 'bold',
        fontSize: fonts.body_2,
        textAlign: 'center'
    },

    textContent: {
        fontSize: fonts.body_2,
        marginTop: dimensChild.about_content_padding_top,
        textAlign: 'justify'
    },

    viewline: {
        backgroundColor: colors.colorGray,
        height: 1,
        width: '90%',
        marginTop: 10
    },

    viewline2: {
        height: 1,
        width: "90%",
        backgroundColor: "#CED0CE",
        marginLeft: "5%"
    }

});

export default AboutHome;