import * as React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';


import strings from "../../../../res/strings";
import { Image, Text, HorizontalIconInput, Button, Dialog } from "../../../../module";
import dimens from "../../../../res/dimens";
import fonts from "../../../../res/fonts";
import colors from "../../res/colors";

/**
 * Đăng ký tài khoản người dùng
 * @author thaolt
 * Created on 22/06/2018
 */

import ConfigParam from '../../../constant/ConfigParam';
import AbstractProfileScreen from '../../../component/user/AbstractProfileScreen';
import { RegisterStyles, ProfileStyles } from '../../../../../../app/styles';
import images from '../../res/images';


export default class ProfileScreen extends AbstractProfileScreen {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                {/* <BackHeaderWithEdit
                    title={strings.user_profile_title}
                    drawerBack={() => this._handleBackButton()}
                    drawerEdit={() => this._onEdit()}
                    imgSource={this.state.isEdit ? images.tick : images.ic_edit}
                /> */}

                <View style={{ height: "40%", alignItems: 'center', }}>
                    <Image resizeMode='stretch' source={images.profile_header_bg} imgStyle={{ position: 'absolute', top: 0, width: '100%', height: 220, tintColor: null }} />
                    <View style={{ width: "100%", height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ marginLeft: 10, marginTop: 5 }} onPress={() => this._handleBackButton()}>
                            <Image source={images.ic_back_home} imgStyle={{
                                width: 40, height: 40, tintColor: null,
                                marginLeft: dimens.profile_margin_back_header,
                                marginTop: dimens.profile_margin_back_header
                            }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginRight: 10, marginTop: 5 }} onPress={() => this._onEdit()}>
                            <Image source={this.state.isEdit ? images.tick : images.ic_profile_note} imgStyle={{
                                width: 30, height: 30, tintColor: null,
                                marginTop: dimens.profile_margin_back_header, marginRight: dimens.profile_margin_back_header
                            }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this._showDialogPickImage()} disabled={!this.state.isEdit}>
                        <Image
                            imgStyle={styles.drawerImage}
                            source={this.state.imageUri} />
                    </TouchableOpacity>

                    {ConfigParam.MODULE_REFERENCE_CODE &&
                        <TouchableOpacity onPress={() => this._shareRefId()}>
                            <Text style={{ color: colors.colorWhiteFull, marginTop: dimens.profile_margin_avatar, }}>
                                {strings.user_refcode_default + ': ' + this.user.phone}
                            </Text>
                        </TouchableOpacity>
                    }


                </View>

                <View style={{ paddingTop: 20, height: '50%',}}>
                    <HorizontalIconInput
                        container={ProfileStyles.horizontalIconInput_container_phone}
                        iconStyle={RegisterStyles.horizontalIconInput_iconStyle}
                        inputStyle={RegisterStyles.text}
                        placeholder={strings.register_phone_holder}
                        borderRadius={0}
                        value={this.user.phone}
                        icon={images.tel}
                        isEditable={false}
                    />

                    <HorizontalIconInput
                        ref={(ref) => {
                            this.focusName(ref)
                        }}
                        container={ProfileStyles.horizontalIconInput_container_phone}
                        iconStyle={RegisterStyles.horizontalIconInput_iconStyle}
                        inputStyle={RegisterStyles.text}
                        placeholder={strings.user_name_default}
                        value={this.user.name || ""}
                        borderRadius={0}
                        icon={images.user}
                        isEditable={this.state.isEdit}
                    // onChangeText={(text) => {
                    //     this.setState({
                    //         name: text,
                    //     });
                    // }}
                    />


                    <HorizontalIconInput
                        ref={(ref) => {
                            this.emailView = ref;
                        }}
                        container={ProfileStyles.horizontalIconInput_container_phone}
                        iconStyle={RegisterStyles.horizontalIconInput_iconStyle}
                        inputStyle={RegisterStyles.text}
                        placeholder={strings.user_email_default}
                        borderRadius={0}
                        icon={images.email}
                        value={this.user.email || ""}
                        isEditable={this.state.isEdit}
                    // onChangeText={(text) => {
                    //     this.setState({
                    //         email: text,
                    //     });
                    // }}
                    />

                </View>

                <View style={styles.footer}>
                    <Button
                        btnStyle={{
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            width: '100%',
                            borderWidth: dimens.border_width,
                            borderRadius: dimens.borderRadius,
                            borderColor: colors.colorSub
                        }}
                        text={strings.user_profile_manager_delete}
                        textStyle={{ color: colors.colorSub, }}
                        borderRadius={0}
                        onPress={() => {
                            this._onRemoveAcc();
                        }} />
                </View>
                <Dialog
                    visible={false}
                    onRequestClose={() => {
                        this.dialog._closeDialog();
                    }}
                    // title={"Thông báo trên dialog"}
                    title={null}
                    ref={ref => this.dialog = ref}
                    closeOnOutSide={true}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flex: 1,
        marginLeft: dimens.register_margin_btn_footer,
        marginRight: dimens.register_margin_btn_footer
    },
    drawerImage: {
        height: dimens.profile_height_avartar,
        width: dimens.profile_height_avartar,
        borderRadius: dimens.profile_corner_avartar,
        tintColor: null,
    },
    iconInput: {
        width: 30, height: 30,
        marginHorizontal: null,
        tintColor: null
    }
})
