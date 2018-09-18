import * as React from "react";
import {
    StyleSheet,
    View,
    BackHandler,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    CircleImage,
    Utils,
    ToastModule,
    RatingBar,
    Image,
    WithTextInput
} from '../../../../../module';

import BookingViewModel from "../../../../viewmodel/booking/BookingViewModel";
import IeRatingPresenter from "../../../../viewmodel/rating/IeRatingPresenter";
import RatingPresenter from "../../../../viewmodel/rating/RatingPresenter";
import IeRatingBookView from "../../../../viewmodel/rating/IeRatingBookView";
import BookTaxiModel from "../../../../viewmodel/booking/BookTaxiModel";
import DoneInfo from "../../../../tcp/recv/DoneInfo";

import strings from "../../../../../res/strings";
import images from "../../../res/images";
import colors from "../../../res/colors";
import dimens from "../../../res/dimens";

export interface Props {
    bookingViewModel: BookingViewModel;
}

export interface State {
    note: string;
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


    // hiển thị trạng thái rating.
    private txtRatingStatus: Text;

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
        // this.bookingViewModel.hideHeader();

        this.rModel = this.bookingViewModel.getBookTaxiModel();

        this.state = {
            note: "",
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
    }

    _onRating = (count: number, status: string) => {
        this.txtRatingStatus.setText(status.toUpperCase());
    }

    // Người dùng bỏ qua rating.
    private onExitRating(): void {
        this.iePresenter.onExitRating();
    }

    // Gửi rating lên server.
    private onSendRating(): void {
        this.iePresenter.onSendRating(this.ratingBar.getNumRating(), this.state.note);
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
                            <View style={{
                                alignItems: 'center',
                                backgroundColor: colors.colorWhiteFull,
                                flex: 3
                            }}>
                                {/* view title */}
                                <View style={{
                                    alignItems: 'center',
                                    marginTop: 15
                                }}>

                                    <Text
                                        text={strings.dialog_rate_title.toUpperCase()}
                                        textStyle={{
                                            fontSize: 20,
                                            color: colors.colorBlackFull
                                        }}
                                    />
                                </View>

                                {/* image avatar */}
                                <CircleImage
                                    ref={ref => {
                                        this.rateDriverAvatar = ref
                                    }}
                                    source={images.ic_user_defatlt}
                                    size={100}
                                    tintColor={colors.colorMain}
                                    imgStyle={{
                                        marginTop: 10
                                    }}
                                    resizeMode='cover'
                                />
                                {/* driver name */}
                                <Text
                                    text={this.bookingViewModel.getBookTaxiModel().driverInfo.name.toUpperCase()}
                                    textStyle={styles.txtUserName}
                                />

                                <Text
                                    text={strings.rating_content_v2}
                                    textStyle={styles.txtRatingContent}
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

                                <Text
                                    ref={ref => this.txtRatingStatus = ref}
                                    text={strings.dialog_rate_quality.toUpperCase()}
                                    textStyle={styles.txtRatingStatus}
                                />

                                <View style={{ flex: 1 }} />

                                <View style={{
                                    backgroundColor: colors.colorWhiteMedium,
                                    width: Dimensions.get('window').width,
                                }}>
                                    <View style={[styles.triangle]} />

                                </View>
                            </View>


                            {/* bottom view */}
                            <View style={{
                                flex: 2,
                                backgroundColor: colors.colorWhiteMedium,
                                paddingHorizontal: dimens.dimen_twenty
                            }}>
                                {/* nhập ghi chú */}
                                <TextInput
                                    placeholder={strings.dialog_rate_content_note}
                                    inputContainer={{
                                        marginTop: dimens.dimen_ten,
                                        padding: dimens.dimen_ten,
                                        backgroundColor: colors.colorWhiteFull,
                                        borderRadius: dimens.border_radius_5,
                                    }}
                                    inputStyle={{
                                        textAlignVertical: 'top',
                                        backgroundColor: colors.colorWhiteFull,
                                    }}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={text => this.setState({ note: text })}
                                />

                                {/* bottom button */}
                                <View style={styles.btnContainer}>
                                    <Button
                                        text={strings.rating_btn_dismiss.toUpperCase()}
                                        btnStyle={styles.btnDismiss}
                                        textStyle={{
                                            color: colors.colorWhiteFull,
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
                        </View>

                        {/* Icon back */}
                        <TouchableOpacity
                            onPress={() => {
                                this.iePresenter.onExitRating();
                            }}
                            style={{
                                position: 'absolute',
                                left: 12,
                                top: 12
                            }}
                        >
                            <Image
                                source={images.ic_back_home}
                                resizeMode="contain"
                                imgStyle={{
                                    width: 42,
                                    height: 42,
                                    tintColor: null
                                }}
                            />
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </WithTextInput>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.white
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.colorWhiteMedium,
    },
    imgStar: {
        width: 24,
        height: 24,
    },
    ratingBar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    txtUserName: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 22,
        color: colors.colorMain
    },
    txtRatingContent: {
        marginHorizontal: 30,
        marginTop: 10,
        textAlign: 'center'
    },
    txtRatingStatus: {
        marginTop: 10,
        color: colors.colorGray,
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    noteInput: {
        marginHorizontal: 10,
        width: '95%',
        backgroundColor: colors.colorWhiteMedium,
        borderColor: colors.colorDarkLight,
        borderBottomWidth: 1,
    },
    btnContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    btnDismiss: {
        flex: 1,
        borderRadius: 8,
        height: dimens.fb_bottom_btn_height,
        backgroundColor: colors.colorSub,
    },
    btnSend: {
        flex: 1,
        borderRadius: 8,
        height: dimens.fb_bottom_btn_height,
        backgroundColor: colors.colorMain,
    },
    triangle: {
        width: 0,
        height: 0,
        marginLeft: 30,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.colorWhiteFull
    }
});