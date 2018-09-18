// DIALOG CUSTOM //
import * as React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MenuHeader from '../../../../module/ui/header/MenuHeader';
import {
    HorizontalIconInput,
    Button,
    Text,
    Utils
} from '../../../../module';
;
import CheckSaleOffCodeHandler from '../../../http/home/CheckSaleOffCodeController';
import ConfirmBookView from './ConfirmBookView';
import dimens from "../../../../module/ui/res/dimen/dimens";
import dimensChild from "../../../../res/dimens";
import Constants from '../../../constant/Constants';

import images from '../../../../res/images';
import strings from '../../../../res/strings';
import colors from '../../../../res/colors';
import SessionStore from '../../../Session';
import BookTaxiModel from '../../../viewmodel/booking/BookTaxiModel';
import { getPromotions } from '../../../viewmodel/promotions/PromotionModelView';
import DiscountCode from '../../../newUI/component/promotion/DiscountCode';

interface Props {
    bookTaxiModel: BookTaxiModel,
    onConfirm: Function,
    onBack: Function,
    onCancel: Function,
}

interface State {
    focusInput: boolean,
    value: string,
    mPromotionAlert: string,
}

export default class ConfirmPromotionFragment extends React.Component<Props, State> {

    private main: ConfirmBookView;

    private prInput: HorizontalIconInput;

    private bookTaxiModel: BookTaxiModel;

    constructor(props) {
        super(props);
        this.bookTaxiModel = this.props.bookTaxiModel;
        this.state = {
            focusInput: true,
            value: this.bookTaxiModel.promotion,
            mPromotionAlert: "",
        }
    }

    public static create(bookTaxiModel, onBack, onCancel, onConfirm) {
        return <ConfirmPromotionFragment
            bookTaxiModel={bookTaxiModel}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={value => onConfirm(value)}
        />
    }

    /* Ước lượng lộ trình, giá cước di chuyển */
    public verifySaleCode(promotion, callback: Function, errorCB: Function) {
        CheckSaleOffCodeHandler.verifySaleCode(
            this.bookTaxiModel,
            promotion,
            SessionStore.getUser()
        )
            .then(response => callback(response))
            .catch(error => errorCB(error));
    }

    _onConfirm = () => {
        if (this.prInput.getTextInput().getText()) {
            // Trạng thái kiểm tra mã khuyến mại.
            let mPromotionAlert = "";
            // Hiển thị progress chờ check mã khuyến mại.
            this.setState({ focusInput: false });

            // Kiểm tra mã khuyến mại có hợp lệ không.
            this.verifySaleCode(
                this.prInput.getTextInput().getText(),
                response => {
                    this.setState({ focusInput: true })

                    this.bookTaxiModel.estimates = "";

                    // Nếu server trả về mã khuyến mại.
                    if (response.status.value == 0) {
                        mPromotionAlert = strings.promotion_success_alert;
                        if (!Utils.isEmpty(response.saleDetail.value)) {
                            mPromotionAlert = strings.promotion_seccess_detail + " " + response.saleDetail.value
                        }
                        // Delay 500 ms trước khi về confirm
                        setTimeout(() => {
                            this.props.onConfirm(this.prInput.getTextInput().getText());
                        }, 500);
                    } else if (response.status.value == 1) {
                        mPromotionAlert = strings.promotion_fail_alert;
                    } else if (response.status.value == 2) {
                        mPromotionAlert = strings.promotion_fail_time_alert;
                    } else if (response.status.value == 3) {
                        mPromotionAlert = strings.promotion_fail_check;
                    }
                    // Hiển thị trạng thái check mã khuyến mại.
                    this.setState({ mPromotionAlert });

                },
                error => {
                    mPromotionAlert = strings.alert_not_connect_server;
                    this.setState({ focusInput: true, mPromotionAlert })
                }
            )
        } else {
            this.props.onConfirm(this.prInput.getTextInput().getText());
        }
    }

    componentDidMount() {
        getPromotions()
            .then((ret) => {
                if (ret.length > 0) {
                    let listPromotion = ret.filter(item =>
                        (item.timeEnd.value === 0 && item.isUsed.value === false) || (item.timeEnd.value > 0 && item.isUsed.value === false && item.timeEnd.value * 1000 - Constants.DELTA_TIME_SERVER > Date.now())
                    );

                    // Cập nhật danh sách mã khuyến mại.
                    (this.refs.discountCode as DiscountCode).updatePromotions(listPromotion)
                }
            })
            .catch((err) => {
                (this.refs.discountCode as DiscountCode).updatePromotions([])
            });
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                <MenuHeader
                    title={strings.book_confirm_promotion}
                    isBack
                    drawerOpen={this.props.onBack}
                />
                <View style={{ flex: 1, padding: dimensChild.register_margin_txtPhone, }}>
                    {/* title mô tả */}
                    <Text
                        text={strings.book_taxi_promotion_description}
                        textStyle={styles.descriptionTxt} />

                    {/* </Text> */}
                    {/* input nhập mã khuyến mại */}
                    <HorizontalIconInput
                        ref={ref => {
                            this.prInput = ref
                        }}
                        placeholder={strings.book_confirm_promotion}
                        icon={images.ic_sale}
                        iconStyle={{
                            tintColor: colors.colorMain
                        }}
                        isEditable={this.state.focusInput}
                        container={{
                            borderWidth: dimens.border_width,
                            paddingRight: dimensChild.validate_padding_right_txt_code,
                            borderRadius: dimens.borderRadius,
                            borderColor: colors.colorGrayLight
                        }}
                        autoFocus={this.state.focusInput}
                        onChangeText={value => this.setState({ value })}
                        value={this.state.value}
                    />
                    {/* progress chờ check mã khuyến mại */}
                    {!this.state.focusInput && <ActivityIndicator size="large" color={colors.colorMain} />}

                    {/* show text trạng thái trả về khi check mã khuyến mại */}
                    {this.state.mPromotionAlert !== "" &&
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text text={this.state.mPromotionAlert} textStyle={{ fontSize: 16 }} />
                        </View>
                    }

                    {/* Danh sách mã khuyến mại */}
                    <DiscountCode
                        ref="discountCode"
                        useForDialog
                        onKMValue={(value) => {
                            this.prInput.getTextInput().setText(value);
                        }}
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            text={strings.btn_cancel}
                            btnStyle={styles.btnCancel}
                            textStyle={{
                                color: colors.colorSub
                            }}
                            onPress={this.props.onCancel}
                            disabled={!this.state.focusInput}
                        />
                        <View style={{ width: dimensChild.promotion_space_button }} />
                        <Button
                            text={strings.btn_confirm}
                            btnStyle={styles.btnConfirm}
                            onPress={this._onConfirm}
                            disabled={!this.state.focusInput}
                        />
                    </View>

                    {!this.state.focusInput && <View
                        style={styles.viewWaiting}
                    />}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    descriptionTxt: {
        color: colors.colorBlackFull,
        textAlign: 'center',
        padding: dimensChild.promotion_padding_title,
        width: '100%'
    },
    btnCancel: {
        flex: 1,
        borderColor: colors.colorSub,
        backgroundColor: colors.colorWhiteFull,
        alignItems: "center",
        marginTop: dimensChild.register_margin_top_txtPhone,
        borderWidth: dimens.border_width,
        borderRadius: dimens.borderRadius,
    },
    btnConfirm: {
        flex: 1,
        borderColor: colors.colorMain,
        backgroundColor: colors.colorMain,
        alignItems: "center",
        marginTop: dimensChild.register_margin_top_txtPhone,
        borderWidth: dimens.border_width,
        borderRadius: dimens.borderRadius,
    },
    viewWaiting: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        opacity: 0
    }
})
