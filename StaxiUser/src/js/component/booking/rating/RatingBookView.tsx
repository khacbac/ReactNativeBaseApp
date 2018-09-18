import * as React from "react";
import {
    StyleSheet,
    View,
    BackHandler,
    ScrollView,
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    CircleImage,
    Utils,
    UserUtils,
    ToastModule,
    RatingBar,
    MultipleText,
    WithTextInput,
} from '../../../../module';

import RatingStaus from "../../../viewmodel/rating/RatingStatus";
import IeRatingPresenter from "../../../viewmodel/rating/IeRatingPresenter";
import RatingPresenter from "../../../viewmodel/rating/RatingPresenter";
import IeRatingBookView from "../../../viewmodel/rating/IeRatingBookView";

import strings from '../../../../res/strings';
import colors from '../../../../res/colors';
import images from "../../../../res/images";
import dimens from "../../../../res/dimens";
import BookingViewModel from "../../../viewmodel/booking/BookingViewModel";
import BookTaxiModel from "../../../viewmodel/booking/BookTaxiModel";
import DoneInfo from "../../../tcp/recv/DoneInfo";
import ConfigParam from "../../../constant/ConfigParam";
import CarType from "../../../constant/CarType";



export interface Props {
    bookingViewModel: BookingViewModel;
}

export interface State {
    // ratingStars: Array<Object>;
    ratingStatus: RatingStaus;
    name: string,
    ratingCount: number,
    note: string;
    showFareLayout: boolean;
    totalMoney: string;
    showTotalMoney: boolean;
    showFareContractWaitLayout: boolean;
    showFareContractExtendLayout: boolean;
}

export default class RatingBookView extends React.Component<Props, State> implements IeRatingBookView {

    // Rating bar data.
    private ratingDatas: Array<any> = [
        {
            index: 0,
            isRated: false,
            status: strings.rating_low
        },
        {
            index: 1,
            isRated: false,
            status: strings.rating_moderate
        },
        {
            index: 2,
            isRated: false,
            status: strings.rating_good
        },
        {
            index: 3,
            isRated: false,
            status: strings.rating_great
        },
        {
            index: 4,
            isRated: false,
            status: strings.rating_excellent
        }
    ];

    private iePresenter: IeRatingPresenter;

    private bookingViewModel: BookingViewModel;

    private rModel: BookTaxiModel;

    private rateDriverAvatar: CircleImage;

    private ratingBar: RatingBar;

    private fareContractTotal: MultipleText;
    private fareContractWait: MultipleText;
    private fareContractExtend: MultipleText;
    private fareContractSale: MultipleText;
    private fareContractPay: MultipleText;

    constructor(props: Props) {
        super(props);

        this.bookingViewModel = this.props.bookingViewModel;

        this.iePresenter = new RatingPresenter(this, this.bookingViewModel);

        // Khởi tạo data.
        this.iePresenter.onInit();
    }

    /**
     * @override.
     */
    public onInit(): void {

        //ẩn header
        this.bookingViewModel.hideHeader();

        this.rModel = this.bookingViewModel.getBookTaxiModel();

        this.state = {
            ratingCount: 0,
            note: "",
            ratingStatus: strings.dialog_rate_quality,
            name: this.bookingViewModel.getBookTaxiModel().driverInfo.name,
            totalMoney: "",
            showTotalMoney: false,
            showFareContractWaitLayout: true,
            showFareContractExtendLayout: true,
            showFareLayout: false,
        }
    }

    // Rating bar data.
    private getRatingDatas(): Array<any> {
        return this.ratingDatas;
    }

    /**
     * @override.
     */
    public setContent(): void {
        if (this.rModel.doneInfo == null) {
            this.rModel.doneInfo = new DoneInfo();
        }

        // Avatar lái xe
        if (this.rModel.driverInfo.avatarLink != null && !Utils.isEmpty(this.rModel.driverInfo.avatarLink)) {
            this.rateDriverAvatar.setImageReview(this.rModel.driverInfo.avatarLink);
            this.rateDriverAvatar.setTintColor(null);
        } else {
            this.rateDriverAvatar.setImageRes(images.ic_user_menu);
            this.rateDriverAvatar.setTintColor(colors.colorMain);
        }

        /* Bảng giá cước cho xe hợp đồng */
        // LinearLayout fareDetailContractLayout = mLayout.findViewById(R.id.fare_detail_contract_layout);
        let showFareLayout = false;
        let showFareContractWaitLayout = true;
        let showFareContractExtendLayout = true;

        if (ConfigParam.MODULE_BOOKING_CAR && this.rModel.taxiType.type == CarType.CAR_CONTRACT
            || ConfigParam.MODULE_BOOKING_CAR && this.rModel.taxiType.type == CarType.BIKE) {
            showFareLayout = true;
            // Các màu text
            let darkColor = colors.grayDarkSub;
            let redColor = colors.colorRed;
            let greenColor = colors.colorGreenMain;
            // Tổng cước di chuyển
            let wordtoSpanTotal = UserUtils.formatMoney(this.rModel.doneInfo.money.value) + " đ";
            this.fareContractTotal.addText([
                {
                    text: wordtoSpanTotal.slice(0, wordtoSpanTotal.length - 2),
                    textStyle: { color: redColor }
                },
                {
                    text: wordtoSpanTotal.slice(wordtoSpanTotal.length - 2, wordtoSpanTotal.length - 1),
                    textStyle: { color: darkColor }
                },
                {
                    text: wordtoSpanTotal.slice(wordtoSpanTotal.length - 1, wordtoSpanTotal.length),
                    textStyle: { color: colors.colorGreenMain }
                }
            ])

            // // Tiền chờ
            if (this.rModel.doneInfo.waitMoney.value <= 0) {
                showFareContractWaitLayout = false;
            }
            let wordtoSpanWait = UserUtils.formatMoney(this.rModel.doneInfo.waitMoney.value) + " đ"
            this.fareContractWait.addText([
                {
                    text: wordtoSpanWait.slice(0, wordtoSpanWait.length - 2),
                    textStyle: { color: redColor }
                },
                {
                    text: wordtoSpanWait.slice(wordtoSpanWait.length - 2, wordtoSpanWait.length - 1),
                    textStyle: { color: darkColor }
                },
                {
                    text: wordtoSpanWait.slice(wordtoSpanWait.length - 1, wordtoSpanWait.length),
                    textStyle: { color: colors.colorGreenMain }
                }
            ])

            // // Tiền phụ phí
            if (this.rModel.doneInfo.moneyExtend.value <= 0) {
                showFareContractExtendLayout = false;
            }
            let wordtoSpanExtend = UserUtils.formatMoney(this.rModel.doneInfo.moneyExtend.value) + " đ"
            this.fareContractExtend.addText([
                {
                    text: wordtoSpanExtend.slice(0, wordtoSpanExtend.length - 2),
                    textStyle: { color: redColor }
                },
                {
                    text: wordtoSpanExtend.slice(wordtoSpanExtend.length - 2, wordtoSpanExtend.length - 1),
                    textStyle: { color: darkColor }
                },
                {
                    text: wordtoSpanExtend.slice(wordtoSpanExtend.length - 1, wordtoSpanExtend.length),
                    textStyle: { color: colors.colorGreenMain }
                }
            ])

            // // Tiền được khuyến mại
            let wordtoSpanSale = UserUtils.formatMoney(this.rModel.doneInfo.moneySale.value) + " đ"
            this.fareContractSale.addText([
                {
                    text: wordtoSpanSale.slice(0, wordtoSpanSale.length - 2),
                    textStyle: { color: greenColor }
                },
                {
                    text: wordtoSpanSale.slice(wordtoSpanSale.length - 2, wordtoSpanSale.length - 1),
                    textStyle: { color: darkColor }
                },
                {
                    text: wordtoSpanSale.slice(wordtoSpanSale.length - 1, wordtoSpanSale.length),
                    textStyle: { color: colors.colorGreenMain }
                }
            ])

            // // Tiền cần thanh toán
            let wordtoSpanPay = UserUtils.formatMoney((this.rModel.doneInfo.money.value + this.rModel.doneInfo.waitMoney.value + this.rModel.doneInfo.moneyExtend.value) - this.rModel.doneInfo.moneySale.value) + " đ";
            this.fareContractPay.addText([
                {
                    text: wordtoSpanPay.slice(0, wordtoSpanPay.length - 2),
                    textStyle: { color: redColor }
                },
                {
                    text: wordtoSpanPay.slice(wordtoSpanPay.length - 2, wordtoSpanPay.length - 1),
                    textStyle: { color: darkColor }
                },
                {
                    text: wordtoSpanPay.slice(wordtoSpanPay.length - 1, wordtoSpanPay.length),
                    textStyle: { color: colors.colorGreenMain }
                }
            ])

            this.setState({
                showFareLayout,
                showFareContractWaitLayout,
                showFareContractExtendLayout,
            })


        } else if (!ConfigParam.MODULE_BOOKING_CAR && this.rModel.doneInfo != null && this.rModel.doneInfo.money.value > 0) {
            showFareLayout = false;
            // Thông tin giá cước xe taxi
            let money = UserUtils.formatMoney(this.rModel.doneInfo.money.value) + " đ";


            this.setState({
                showFareLayout,
                showTotalMoney: true,
                totalMoney: money
            })
            // Lưu lại thông tin giá cước vào lịch sử
            this.rModel.estimates = money;
        }
    }

    _onRating = (count, status) => {
        this.setState({
            ratingStatus: status,
            ratingCount: count
        })
    }

    // Người dùng bỏ qua rating.
    private onExitRating(): void {
        this.iePresenter.onExitRating();
    }

    // Gửi rating lên server.
    private onSendRating(): void {
        this.iePresenter.onSendRating(this.state.ratingCount, this.state.note);
    }

    /**
     * @override.
     * Người dùng chưa rating.
     */
    public unRating(msg: string): void {
        ToastModule.show(msg);
    }

    /**
     * @override.
     * Người dùng rating < 3 cần thêm ghi chú.
     */
    public ratingUnNote(msg: string): void {
        ToastModule.show(msg);
    }

    /**
     * @override.
     * Rating không thành công.
     */
    public failSendRating(msg: string): void {
        ToastModule.show(msg);
    }

    public successRating(msg: string): void {
        ToastModule.show(msg);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.iePresenter.setContent();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        this.iePresenter.onBackPress();
        return true;
    }

    render() {
        return (

            <WithTextInput>
                <View style={styles.container}>

                    <ScrollView contentContainerStyle={styles.container}>

                        <View style={styles.content}>
                            <View style={{ alignItems: 'center' }}>
                                <CircleImage
                                    ref={ref => {
                                        this.rateDriverAvatar = ref
                                    }}
                                    source={images.ic_user_defatlt}
                                    size={100}
                                    tintColor={colors.colorMain}
                                    imgStyle={{
                                        marginTop: dimens.dimen_ten,
                                        borderWidth: dimens.dimen_three,
                                        borderColor: colors.colorMain,
                                    }}
                                    resizeMode='cover'
                                />

                                <Text
                                    text={this.state.name}
                                    textStyle={styles.txtUserName}
                                />

                                {this.state.showTotalMoney && <Text
                                    text={this.state.totalMoney}
                                    textStyle={{
                                        height: dimens.rt_money_total_height
                                    }}
                                />}

                                <Text
                                    text={strings.rating_content}
                                    textStyle={styles.txtRatingContent}
                                />
                                <Text
                                    text={this.state.ratingStatus}
                                    textStyle={styles.txtRatingStatus}
                                />

                                {/* phần view rating bar. */}
                                <RatingBar
                                    ref={ref => {
                                        this.ratingBar = ref
                                    }}
                                    data={this.getRatingDatas()}
                                    onRating={this._onRating}
                                    ratingStyle={styles.ratingBar}
                                />

                                <TextInput
                                    placeholder={strings.dialog_rate_content_note}
                                    inputContainer={{
                                        marginTop: dimens.confirm_note_margin_top_btn,
                                    }}
                                    inputStyle={{
                                        textAlignVertical: 'top',
                                        borderWidth: dimens.border_width,
                                        paddingRight: dimens.validate_padding_right_txt_code,
                                        margin: dimens.validate_padding_right_txt_code,
                                        borderRadius: dimens.borderRadius,
                                        borderColor: colors.colorGrayLight,
                                        height: dimens.confirm_note_height_input,
                                    }}
                                    autoFocus={false}
                                    multiline={true}
                                    numberOfLines={4}
                                    // value={this.state.value}

                                    onChangeText={text => this.setState({ note: text })}
                                />

                                {/* Thông tin cước cho app hợp đồng */}
                                {this.state.showFareLayout && <View style={{
                                    marginTop: dimens.dimen_ten,
                                    width: '95%',
                                }}>
                                    <Text
                                        text={strings.fare_title}
                                        textStyle={{
                                            color: colors.colorMain,
                                            fontWeight: 'bold',
                                            height: dimens.rt_fare_view_height,
                                            backgroundColor: colors.colorGrayLight,
                                            paddingLeft: dimens.rt_margin_right,
                                        }} />

                                    {/* Cước di chuyển */}
                                    <View style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: dimens.rt_padding_horixontal,
                                        height: dimens.rt_fare_view_height,
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            text={strings.fare_total_label}
                                            textStyle={{
                                                color: colors.colorDarkMain,
                                                flex: 1,
                                                marginRight: dimens.rt_margin_right,
                                            }} />

                                        <MultipleText
                                            container={{
                                                flex: 1
                                            }}
                                            ref={ref => {
                                                this.fareContractTotal = ref
                                            }} />
                                    </View>

                                    {/* Cước chờ */}
                                    {this.state.showFareContractWaitLayout && <View style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: dimens.rt_padding_horixontal,
                                        height: dimens.rt_fare_view_height,
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            text={strings.fare_wait_label}
                                            textStyle={{
                                                color: colors.colorDarkMain,
                                                flex: 1,
                                                marginRight: dimens.rt_margin_right,

                                            }} />

                                        <MultipleText
                                            container={{
                                                flex: 1
                                            }}
                                            ref={ref => {
                                                this.fareContractWait = ref
                                            }} />
                                    </View>}

                                    {/* Phụ phí */}
                                    {this.state.showFareContractExtendLayout && <View style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: dimens.rt_padding_horixontal,
                                        height: dimens.rt_fare_view_height,
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            text={strings.fare_extend_label}
                                            textStyle={{
                                                color: colors.colorDarkMain,
                                                flex: 1,
                                                marginRight: dimens.rt_margin_right,

                                            }} />

                                        <MultipleText
                                            container={{
                                                flex: 1
                                            }}
                                            ref={ref => {
                                                this.fareContractExtend = ref
                                            }} />
                                    </View>}

                                    {/* khuyến mãi */}
                                    <View style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: dimens.rt_padding_horixontal,
                                        height: dimens.rt_fare_view_height,
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            text={strings.fare_sale_label}
                                            textStyle={{
                                                color: colors.colorDarkMain,
                                                flex: 1,
                                                marginRight: dimens.rt_margin_right,

                                            }} />

                                        <MultipleText
                                            container={{
                                                flex: 1
                                            }}
                                            ref={ref => {
                                                this.fareContractSale = ref
                                            }} />
                                    </View>

                                    {/* Thanh toán */}
                                    <View style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: dimens.rt_padding_horixontal,
                                        height: dimens.rt_fare_view_height,
                                        alignItems: 'center'
                                    }}>
                                        <Text
                                            text={strings.fare_pay_label}
                                            textStyle={{
                                                color: colors.colorDarkMain,
                                                fontWeight: 'bold',
                                                flex: 1,
                                                marginRight: dimens.rt_margin_right,

                                            }} />

                                        <MultipleText
                                            container={{
                                                flex: 1
                                            }}
                                            ref={ref => {
                                                this.fareContractPay = ref
                                            }} />
                                    </View>

                                </View>}
                            </View>


                            <View style={styles.btnContainer}>
                                <Button
                                    text={strings.rating_btn_dismiss.toUpperCase()}
                                    btnStyle={styles.btnDismiss}
                                    textStyle={{
                                        color: colors.colorSub,
                                        fontWeight: 'bold'
                                    }}

                                    onPress={() => this.onExitRating()}
                                />
                                <View style={{ width: 10 }} />
                                <Button
                                    text={strings.rating_btn_send.toUpperCase()}
                                    btnStyle={styles.btnSend}
                                    textStyle={{
                                        color: colors.colorWhiteFull,
                                        fontWeight: 'bold'
                                    }}

                                    onPress={() => this.onSendRating()}
                                />
                            </View>

                        </View>
                    </ScrollView>

                </View>
            </WithTextInput>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.white
    },
    content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    imgStar: {
        width: 24,
        height: 24,
    },
    ratingBar: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
    },
    txtUserName: {
        marginTop: 10,
        fontWeight: 'bold'
    },
    txtRatingContent: {
        marginHorizontal: 30,
        marginTop: 10,
        textAlign: 'center'
    },
    txtRatingStatus: {
        marginTop: 10,
        color: colors.colorGray
    },
    noteInput: {
        marginHorizontal: 10,
        // marginTop: 10,
        width: '95%',
        backgroundColor: colors.colorGrayLight,
        borderColor: colors.colorDarkLight,
        borderBottomWidth: 1,
    },
    btnContainer: {
        flexDirection: 'row',
        margin: 10
    },
    btnDismiss: {
        flex: 1,
        borderColor: colors.colorSub,
        borderWidth: 1,
        backgroundColor: colors.colorWhiteFull
    },
    btnSend: {
        flex: 1,
        borderColor: colors.colorMain,
        borderWidth: 1,
        backgroundColor: colors.colorMain
    }
});