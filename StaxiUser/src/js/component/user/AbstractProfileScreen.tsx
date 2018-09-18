import * as React from 'react';
import {
    View,
    Text,
    Share,
} from 'react-native';

import {
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
import { removeAcc, updateAcc } from "../../viewmodel/user/ProfileModelView";
import image from '../../../res/images';

/**
 * Đăng ký tài khoản người dùng
 * @author thaolt
 * Created on 22/06/2018
 */

import ImagePicker from "react-native-image-crop-picker";
import User from '../../sql/bo/User';
import { NativeAppModule } from '../../../module';
import SessionStore from '../../Session';

export interface Props {
    navigation
}

export interface State {
    isEdit: boolean;
    imageUri: any;
}


export default class AbstractProfileScreen extends React.Component<Props, State> {
    public dialog: Dialog;
    public user: User;

    /** định nghĩa số điện thoại */
    public nameView: HorizontalIconInput;
    public emailView: HorizontalIconInput;

    constructor(props) {
        super(props);

        this.user = SessionStore.getUser();

        this.state = {
            // email: this.user.email || "",
            // name: this.user.name || "",
            isEdit: false,
            imageUri: {},
        }

        this._loadProfileImage();
    }

    async _loadProfileImage() {
        //Lấy đường dẫn file ios, android
        var imgUser = await Utils.getFileNameFromUri(this.user.profileImageUri, image.ic_user_defatlt);
        
        this.nameView.getTextInput().setText(this.user.name);
        this.emailView.getTextInput().setText(this.user.email);

        this.setState({
            // email: this.user.email,
            // name: this.user.name,
            imageUri: imgUser,
        });
    }

    _handleBackButton() {
        this.props.navigation.goBack()
    }

    _onRemoveAcc() {
        if (SessionStore.isAvailableBooking() || SessionStore.isScheduleBooking()) {
            this._showToastMsg(strings.user_not_delete_alert);
        } else {
            PairAlert.get()
                .setTitle(strings.alert_dialog_title)
                .setMessage(strings.user_profile_manager_delete_detail)
                .setNegativeText(strings.btn_dismiss)
                .setNegativeStyle(AlertStyle.CANCLE)
                .setNegativePress(() => console.log('Cancel Pressed'))
                .setPositiveText(strings.btn_ok)
                .setPositivePress(() => this._doRemoveAcc())
                .show();
        }
    }
    //Xoá tài khoản
    async _doRemoveAcc() {
        let ret = await NativeAppModule.isEnableNetwork();
        if (ret) {
            const { params } = this.props.navigation.state;
            removeAcc(this.user.phone, this.user.email || "", this.user.password)
                .then((ret: { status: number, str: String }) => {
                    if (ret == null) {
                        this._showToastMsg(strings.user_delete_profile_fail);
                    } else {
                        this._showToastMsg(ret.str);
                        params.restartApp();
                    }
                })
                .catch((err) => {
                    this._showToastMsg(strings.user_delete_profile_fail);
                });
        } else {
            this._showToastMsg(strings.confirm_not_network);
        }
    }

    //Update tài khoản
    async _onEdit() {

        if (this.state.isEdit) {

            //validate form
            let name = this.nameView.getTextInput().getText();
            let email = this.emailView.getTextInput().getText();

            let validate = await this._validateForm(email);
            if (!validate) return;


            this._showDialogWaiting();

            let localFile = this.state.imageUri.uri;

            if (!localFile) {
                localFile = '';
            }

            let ret = await updateAcc(SessionStore.language, this.user.naCode, this.user.phone, this.user.password, this.user.uuid, email, name, localFile);
            this.dialog._closeDialog();
            //thong bao
            this._showToastMsg(ret.str);

            //cap nhat trangj thai khi thanh cong
            if (ret.status == 1) {
                const { params } = this.props.navigation.state;
                params.updateImage(this.state.imageUri);

                //bỏ focus cũ
                this.nameView = undefined;

                this.setState((pre) => ({
                    isEdit: !pre.isEdit,
                    // isFocus : true
                }));
            }
        } else {
            this.nameView = undefined;

            this.setState((pre) => ({
                isEdit: !pre.isEdit,
                // isFocus : true
            }));
        }
    }

    async _validateForm(email) {
        let ret = await NativeAppModule.isEnableNetwork();
        if (!ret) {
            this._showToastMsg(strings.invalid_network)
            return false;
        }

        if (!Utils.isEmpty(email) && !Utils.isValidEmail(email)) {
            this._showToastMsg(strings.accounts_pattern_email);
            if (this.emailView != undefined) {
                this.emailView.focus();
            }
            return false;
        }

        return true;
    }

    _showToastMsg(msg) {
        ToastModule.show(msg);
    }

    _showDialogWaiting() {
        this.dialog.showWaitingDialog("");
    }

    //Chọn ảnh
    _showDialogPickImage() {
        this.dialog._showDialog(
            <View style={{ flex: 1, }}>
                <Text style={{ color: color.colorMain, padding: 5, fontWeight: 'bold', }}>
                    {strings.manager_selecter_avatar}
                </Text>

                <HorizontalIconTextButton
                    container={{ backgroundColor: 'transparent', }}
                    textStyle={{ color: color.colorBlackFull, }}
                    text={strings.manager_selecter_camera}
                    border={0}
                    borderColor="transparent"
                    icon={images.ic_selected_camera}
                    onPress={() => {
                        this._openCamera()
                    }}
                />

                <HorizontalIconTextButton
                    container={{ backgroundColor: 'transparent', borderBottomWidth: 0, }}
                    textStyle={{ color: color.colorBlackFull, }}
                    text={strings.manager_selecter_album}
                    border={0}
                    borderColor="transparent"
                    icon={images.ic_selected_album}
                    onPress={() => {
                        this._openAlbum()
                    }}
                />
            </View>
            , false);
    }

    //Chia sẻ mã giới thiệu
    _shareRefId() {
        let msg = strings.user_share_promotion_1 + this.user.refID + strings.user_share_promotion_2 + strings.app_name;
        Share.share({
            message: msg,
            title: strings.app_name
        });
    }

    //Camera
    _openCamera() {
        ImagePicker.openCamera({
            width: 640,
            height: 720,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 720,
            compressImageQuality: 0.6,
            // includeBase64: true,
            includeExif: true,
            // cropping: true
        }).then((image) => {
            //Update state image
            this.dialog._closeDialog();
            this.setState({
                imageUri: { uri: Array.isArray(image) ? image[0].path : image.path },
            });

        }).catch(err => {
            this.dialog._closeDialog();
        });
    }

    //Album
    _openAlbum() {
        ImagePicker.openPicker({
            width: 640,
            height: 720,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 720,
            compressImageQuality: 0.6,
            // includeBase64: true,
            includeExif: true,
            multiple: false,
            // cropping: true
        }).then(image => {
            //Update state image
            this.dialog._closeDialog();
            this.setState({
                imageUri: { uri: Array.isArray(image) ? image[0].path : image.path },
            });
        }).catch(err => {
            this.dialog._closeDialog();
        });;
    }

    public focusName(ref) {
        if (ref == null || this.nameView != undefined) {
            return;
        }

        this.nameView = ref;

        if (this.state.isEdit) {
            ref.focus();
        } else {
            ref.unfocus();
        }
    }

    componentDidMount() {

    }
}
