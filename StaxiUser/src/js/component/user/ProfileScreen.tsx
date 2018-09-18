import * as React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    Text,
    Share,
} from 'react-native';

import {
    Button,
    HorizontalIconInput,
    HorizontalIconTextButton,
    Utils,
    Dialog,
    PairAlert,
    AlertStyle,
    ToastModule,
} from '../../../module';

import color from "../../../res/colors";
import strings from '../../../res/strings'
import images from '../../../res/images';
import BackHeaderWithEdit from '../../../module/ui/header/BackHeaderWithEdit';
import fonts from "../../../module/ui/res/dimen/fonts";
import ConfigParam from "../../constant/ConfigParam";

/**
 * Đăng ký tài khoản người dùng
 * @author thaolt
 * Created on 22/06/2018
 */

import ImagePicker from "react-native-image-crop-picker";
import User from '../../sql/bo/User';
import { NativeAppModule } from '../../../module';
import SessionStore from '../../Session';
import AbstractProfileScreen from './AbstractProfileScreen';
import dimens from '../../../res/dimens';




export default class ProfileScreen extends AbstractProfileScreen {
    
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <BackHeaderWithEdit
                    title={strings.user_profile_title}
                    drawerBack={() => this._handleBackButton()}
                    drawerEdit={() => this._onEdit()}
                    imgSource={this.state.isEdit ? images.tick : images.ic_edit}
                />

                <View style={{ height: dimens.profile_height_info, backgroundColor: color.colorMain, alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => this._showDialogPickImage()} disabled={!this.state.isEdit}>
                        <Image
                            style={styles.drawerImage}
                            source={this.state.imageUri} />
                    </TouchableOpacity>

                    {ConfigParam.MODULE_REFERENCE_CODE &&
                        <TouchableOpacity onPress={() => this._shareRefId()}>
                            <Text style={{ color: color.colorWhiteFull, marginTop: dimens.profile_margin_avatar, }}>
                                {strings.user_refcode_default + ': ' + this.user.phone}
                            </Text>
                        </TouchableOpacity>
                    }


                </View>

                <HorizontalIconInput
                    container={{
                        marginLeft: dimens.register_margin_txtPhone,
                        marginRight: dimens.register_margin_txtPhone,
                    }}
                    placeholder={strings.register_phone_holder}
                    borderRadius={0}
                    value={this.user.phone}
                    icon={images.ic_phone}
                    isEditable={false}
                    inputStyle={styles.text}
                />

                <HorizontalIconInput
                    ref={(ref) => {
                        this.focusName(ref)
                    }}
                    container={{
                        marginLeft: dimens.register_margin_txtPhone,
                        marginRight: dimens.register_margin_txtPhone,
                    }}
                    placeholder={strings.user_name_default}
                    value={this.user.name || ""}
                    borderRadius={0}
                    icon={images.ic_person}
                    isEditable={this.state.isEdit}
                    // onChangeText={(text) => {
                    //     this.setState({
                    //         name: text,
                    //     });
                    // }}
                    inputStyle={styles.text}
                />


                <HorizontalIconInput
                    ref={(ref) => {
                        this.emailView = ref;
                    }}
                    container={{
                        marginTop: 0,
                        marginLeft: dimens.register_margin_txtPhone,
                        marginRight: dimens.register_margin_txtPhone,
                    }}
                    placeholder={strings.user_email_default}
                    borderRadius={0}
                    icon={images.ic_mail}
                    value={this.user.email || ""}
                    isEditable={this.state.isEdit}
                    // onChangeText={(text) => {
                    //     this.setState({
                    //         email: text,
                    //     });
                    // }}
                    inputStyle={styles.text}
                />

                <View style={styles.footer}>
                    <View style={styles.btnFooter}>
                        <Button
                            btnStyle={{
                                backgroundColor: "transparent",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: dimens.register_margin_top_txtPhone,
                                marginBottom: dimens.register_margin_txtPhone,
                                borderWidth: dimens.border_width,
                                borderRadius: dimens.borderRadius,
                                borderColor: color.colorSub
                            }}
                            text={strings.user_profile_manager_delete}
                            textStyle={{ color: color.colorSub, }}
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
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: fonts.text_size,
    },
    footer: {
        flex: 1,
        marginLeft: dimens.register_margin_txtPhone,
        marginRight: dimens.register_margin_txtPhone,
    },
    btnFooter: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    drawerImage: {
        height: dimens.profile_height_avartar,
        width: dimens.profile_height_avartar,
        borderRadius: dimens.profile_corner_avartar
    },
})
