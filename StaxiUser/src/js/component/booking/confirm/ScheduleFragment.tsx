import * as React from 'react';

import {
    StyleSheet,
    View,
    Linking,
    ScrollView,
} from "react-native";
import {
    Text,
    HorizontalIconTextButton,
    TextInput,
    Button,
    PairAlert,
    Dialog,
    Utils,
    ToastModule
} from "../../../../module";
import MenuHeader from '../../../../module/ui/header/MenuHeader';
import AddressView from '../AddressView';
import ConfirmBookModel from '../../../viewmodel/booking/confirm/ConfirmBookModel';
import BookedHistory from '../../../sql/bo/BookedHistory';
import BookedHistoryDAO from '../../../sql/dao/BookedHistoryDAO';
import CarType from '../../../constant/CarType';
import Constants from '../../../constant/Constants';
import NetworkManager from '../../../../module/net/NetworkManager';
import BookedStep from '../../../constant/BookedStep';

import images from '../../../../res/images';
import fonts from '../../../../res/fonts';
import dimens from '../../../../res/dimens';
import strings from '../../../../res/strings';
import colors from "../../../../res/colors";
import BookingViewModel from '../../../viewmodel/booking/BookingViewModel';
import CancelScheduleHandler, { CancelScheduleReponseModel } from '../../../viewmodel/booking/confirm/CancelScheduleHandler';
import SessionStore from '../../../Session';

interface Props {
    onBack: Function;
    confirmBookModel: ConfirmBookModel;
    navigation;
}

interface State {
    showNotes: boolean;

    commentView: string;
    cmtFontStyle: string;
    showScheduleAlert: boolean;
}

export default class ScheduleFragment extends React.Component<Props, State> {

    private confirmBookModel: ConfirmBookModel;

    private mHistory: BookedHistory;

    private dialog: Dialog;

    private dstAddressLayout: AddressView;

    private srcAddressView: AddressView;

    private typeView: HorizontalIconTextButton;

    private currencyEstimate: HorizontalIconTextButton;

    private promotionView: HorizontalIconTextButton;

    private timeFromConfirm: HorizontalIconTextButton;

    private bookingViewModel: BookingViewModel;

    constructor(props) {
        super(props);
        // this.confirmBookModel = this.props.confirmBookModel;
        this.bookingViewModel = this.props.navigation.getParam("bookingViewModel");
        this.state = {
            showNotes: false,
            commentView: "",
            cmtFontStyle: "normal",
            showScheduleAlert: false
        }
    }

    async componentDidMount() {

        this.mHistory = await BookedHistoryDAO.getScheduleBookTaxi();

        // Địa chỉ đón
        this.srcAddressView.setAddress(this.mHistory.srcAddress.formattedAddress);

        // Địa chỉ đến
        if (this.mHistory.dstAddress != null
            && !Utils.isEmpty(this.mHistory.dstAddress.formattedAddress)) {
            this.dstAddressLayout.setAddress(this.mHistory.dstAddress.formattedAddress);
            this.dstAddressLayout.setVisibility(true);
        }

        // Hiển thị loại xe
        if (this.mHistory.taxiType != null) {
            let txtTypeView = "";
            if (this.mHistory.taxiType.type == CarType.AIR_PORT
                && this.mHistory.taxiType.vehicleId == Constants.CARTYPE_DEFAULT_AIRPORT_ID) {
                txtTypeView = strings.car_type_airport + " - " + this.mHistory.taxiType.getName();
            } else if (this.mHistory.taxiType.type == CarType.NORMAL
                && this.mHistory.taxiType.vehicleId == Constants.CARTYPE_DEFAULT_ID) {
                txtTypeView = strings.car_type_center + " - " + this.mHistory.taxiType.getName();
            } else {
                txtTypeView = this.mHistory.taxiType.getName();
            }
            this.typeView.setText(txtTypeView);
        }

        // Hiển thị giá tiền ước lượng nếu A và B
        if (this.mHistory.estimates != null && !Utils.isEmpty(this.mHistory.estimates)) {
            // Hiển thị giá tiền ước lượng
            this.currencyEstimate.setText(this.mHistory.estimates);
            this.currencyEstimate.setVisibility(true);
        }

        // Khuyến mại
        if (this.mHistory.promotion != null && !Utils.isEmpty(this.mHistory.promotion)) {
            this.promotionView.setText(this.mHistory.promotion);
            this.promotionView.setVisibility(true);
        }

        // Ghi chú
        if (this.mHistory.comment != null && !Utils.isEmpty(this.mHistory.comment)) {
            this.setState({
                showNotes: true,
                commentView: this.mHistory.comment,
                cmtFontStyle: 'italic'
            })
        }

        if (this.mHistory.catchedTime) {
            // Thời gian đặt lịch
            this.timeFromConfirm.setText(Utils.formatDateTime(this.mHistory.catchedTime, "HH:mm-dd/MM/yyyy"));
        }
    }

    actionCall() {
        Linking.openURL(
            "tel:" + encodeURIComponent(this.mHistory.company.phone)
        );
    }

    actionSchedule() {
        // kiểm tra kết nối mạng hay không
        NetworkManager.isConnected().then(response => {
            if (response) {
                PairAlert.get()
                    .setTitle(strings.alert_dialog_title)
                    .setMessage(strings.book_confirm_cancel_schedule_book)
                    .setNegativeText(strings.btn_dismiss)
                    .setNegativePress(() => { })
                    .setPositiveText(strings.btn_ok)
                    .setPositivePress(() => {
                        this.onActionSchedule();
                    })
                    .show();
            } else {
                ToastModule.show(strings.confirm_not_network);
            }
        }).catch(error => {
            ToastModule.show(strings.confirm_not_network);
        })
    }

    onActionSchedule() {
        CancelScheduleHandler.verifyCancelSchedule(this.mHistory.bookCode, this.mHistory.company.companyKey)
            .then(async (response: CancelScheduleReponseModel) => {
                let message: string = "";
                if (response.status.value) {
                    // Thông báo hủy đặt lịch thành công
                    message = strings.booked_taxi_schedule_cancel_success;
                    // Thiết lập lại thời gian đặt lịch
                    SessionStore.setScheduledBookTime(Date.now())

                    this.mHistory.isSchedule = false;
                    this.mHistory.isShareBooking = false;
                    this.mHistory.state = BookedStep.CLIENT_CANCEL;
                    this.mHistory.bookCode = "";
                    await BookedHistoryDAO.updateScheduleState(this.mHistory);
                    this.props.navigation.goBack();
                    this.bookingViewModel.showBookTaxiFragment(true);
                } else {
                    message = strings.history_delete_error;
                }
                ToastModule.show(message);
            }).catch(error => {
                ToastModule.show(strings.alert_not_connect_server);
            })
    }

    /**
   * Đóng dialog.
   */
    closeDialog() {
        this.dialog.dissmiss();
    }

    onDelete() {
        PairAlert.get()
            .setTitle(strings.alert_dialog_title)
            .setMessage(strings.history_delete_alert)
            .setNegativeText(strings.btn_dismiss)
            .setNegativePress(() => { })
            .setPositiveText(strings.btn_ok)
            .setPositivePress(() => {
                this.onScheduleCancel();
            })
            .show();
    }

    private onScheduleCancel(): void {
        this.onActionSchedule();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MenuHeader
                    title={strings.book_schedule_title}
                    isBack
                    drawerOpen={() => {
                        this.props.navigation.goBack();
                        this.bookingViewModel.showBookTaxiFragment(true);
                    }}
                    imgRightBT={images.ic_delete}
                    pressRightBT={() => this.onDelete()}
                />

                <View style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        <AddressView
                            disabled={true}
                            editable={false}
                            ref={ref => {
                                this.srcAddressView = ref
                            }}
                            address={strings.book_address}
                            showRightSeperate={false}
                            title={strings.book_address_from}
                            leftIcon={images.ic_oval}
                            style={{
                                borderWidth: 0,
                                borderBottomWidth: 1,
                            }}
                            leftIconStyle={{
                                tintColor: colors.colorMain
                            }}
                            titleStyle={{
                                color: colors.colorMain
                            }}
                        />
                        <AddressView
                            disabled={true}
                            editable={false}
                            ref={ref => {
                                this.dstAddressLayout = ref
                            }}
                            visible={false}
                            address={strings.book_address}
                            showRightSeperate={false}
                            title={strings.book_address_to}
                            leftIcon={images.ic_oval}
                            style={{
                                borderWidth: 0,
                                borderBottomWidth: 1,
                            }}
                            leftIconStyle={{
                                tintColor: colors.colorSub
                            }}
                            titleStyle={{
                                color: colors.colorSub
                            }}
                        />
                        {/* Loại xe */}
                        <HorizontalIconTextButton
                            ref={ref => {
                                this.typeView = ref
                            }}
                            disabled={true}
                            icon={images.ic_menu_book}
                            iconStyle={{
                                tintColor: colors.colorMain
                            }}
                            rootStyle={{
                                flex: 0
                            }}
                            container={{
                                backgroundColor: colors.colorWhiteFull
                            }}
                            text={strings.car_type}
                            textStyle={{
                                color: colors.colorGrayDark,
                                fontSize: fonts.sub_2,
                                fontWeight: 'bold'
                            }}
                        />

                        {/* Thời gian */}
                        <HorizontalIconTextButton
                            ref={ref => {
                                this.timeFromConfirm = ref
                            }}
                            disabled={true}
                            icon={images.ic_alarm}
                            iconStyle={{
                                tintColor: colors.colorMain
                            }}
                            rootStyle={{
                                flex: 0
                            }}
                            container={{
                                backgroundColor: colors.colorWhiteFull
                            }}
                            text={strings.duration}
                            textStyle={{
                                color: colors.colorGrayDark,
                                fontSize: fonts.sub_2,
                                fontWeight: 'bold'
                            }}
                        />

                        {/* Ước lượng */}
                        <HorizontalIconTextButton
                            ref={ref => {
                                this.currencyEstimate = ref
                            }}
                            visible={false}
                            disabled={true}
                            icon={images.ic_estimation_large}
                            iconStyle={{
                                tintColor: colors.colorMain
                            }}
                            rootStyle={{
                                flex: 0
                            }}
                            container={{
                                backgroundColor: colors.colorWhiteFull
                            }}
                            text={strings.taxi_back_a_to_b}
                            textStyle={{
                                color: colors.colorGrayDark,
                                fontSize: fonts.sub_2,
                                fontWeight: 'bold'
                            }}
                        />

                        {/* Mã khuyến mại */}
                        <HorizontalIconTextButton
                            ref={ref => {
                                this.promotionView = ref
                            }}
                            visible={false}
                            disabled={true}
                            icon={images.ic_sale}
                            iconStyle={{
                                tintColor: colors.colorMain
                            }}
                            rootStyle={{
                                flex: 0
                            }}
                            container={{
                                backgroundColor: colors.colorWhiteFull
                            }}
                            text={strings.book_confirm_promotion}
                            textStyle={{
                                color: colors.colorGrayDark,
                                fontSize: fonts.sub_2,
                                fontWeight: 'bold'
                            }}
                        />

                        {this.state.showNotes && <View
                            style={{
                                marginTop: dimens.scd_note_margin_top
                            }}
                        >
                            <Text
                                text={strings.book_notes_title}
                                textStyle={{
                                    fontWeight: 'bold'
                                }}
                            />
                            <TextInput
                                placeholder={strings.book_notes_title}
                                editable={false}
                                numberOfLines={3}
                                value={this.state.commentView}
                                inputStyle={{
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    textAlignVertical: 'top',
                                    backgroundColor: colors.colorGrayMain,
                                    fontStyle: this.state.cmtFontStyle
                                }}
                            />
                        </View>}

                        {this.state.showScheduleAlert && <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: dimens.scd_note_margin_top
                        }}>
                            <Text
                                text={strings.book_confirm_schedule_alert}
                                textStyle={{
                                    color: colors.colorBlackFull,
                                    fontSize: fonts.sub_2,
                                    textAlign: 'center'
                                }}
                            />
                        </View>}
                    </ScrollView>

                </View>


                <View style={{
                    flexDirection: 'row',
                    paddingLeft: dimens.confirm_book_view_padding_left,
                    paddingRight: dimens.confirm_book_view_padding_left,
                    paddingTop: dimens.confirm_book_view_padding_bot,
                    paddingBottom: dimens.confirm_book_view_padding_bot,
                }}>
                    <Button
                        text={strings.btn_call}
                        btnStyle={styles.btnCall}
                        textStyle={[styles.btnCallTxt]}
                        onPress={() => this.actionCall()}
                    />
                    <View style={{ width: dimens.promotion_space_button }} />
                    <Button
                        text={strings.book_confirm_schedule_cancel}
                        btnStyle={styles.btnBook}
                        textStyle={[styles.btnBookTxt]}
                        onPress={() => this.actionSchedule()}
                    />
                </View>

                {/* common dialog */}
                <Dialog // visible={this.state.visibleDialog}
                    // topContainer={this.state.dialogContainer}
                    // contentStyle={this.state.dialogContent}
                    onRequestClose={() => {
                        this.closeDialog();
                    }}
                    title={null} // title={null}
                    ref={dialog => (this.dialog = dialog)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnCall: {
        flex: 1,
        borderColor: colors.colorSub,
        backgroundColor: colors.colorWhiteFull,
        alignItems: "center",
        // marginTop: dimensChild.register_margin_top_txtPhone,
        borderWidth: 1,
        borderRadius: 1,
        paddingVertical: dimens.btn_padding_confirm_vertical,
    },
    btnCallTxt: {
        color: colors.colorSub,
        fontWeight: "bold"
    },
    btnBook: {
        flex: 1,
        borderColor: colors.colorMain,
        backgroundColor: colors.colorMain,
        alignItems: "center",
        // marginTop: dimensChild.register_margin_top_txtPhone,
        borderWidth: 1,
        borderRadius: 1,
        paddingVertical: dimens.btn_padding_confirm_vertical,
    },
    btnBookTxt: {
        color: colors.colorWhiteFull,
        fontWeight: "bold"
    },
})