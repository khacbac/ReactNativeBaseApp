/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-20 05:48:40
 * @modify date 2018-07-20 05:48:40
 * @desc [Lớp xác nhận đặt xe]
 */

import * as React from "react";
import {
    StyleSheet,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Easing,
    BackHandler
} from "react-native";
import {
    Text,
    Image,
    ButtonIconOnMap,
    Utils,
} from "../../../../../module";
import ConfirmBookModel from "./ConfirmBookModel";

import VehicleSelectDialog from "./VehicleSelectDialog";
import BookingViewModel from "../../../../viewmodel/booking/BookingViewModel";
import BAAddress from "../../../../model/BAAddress";
import strings from "../../../../../res/strings";
import images from "../../../res/images";
import colors from "../../../res/colors";
import FocusAddress from "../../../../viewmodel/search/FocusAddress";
import AddressView from "../../../../component/booking/AddressView";
import dimens from "../../../../../res/dimens";
import BookTaxiModel from "../../../../viewmodel/booking/BookTaxiModel";
import VehicleType from "../../../../sql/bo/VehicleType";
import ConfirmBookPresenter from "./ConfirmBookPresenter";

const { width, height } = Dimensions.get('window');

interface Props {
    bookingViewModel: BookingViewModel;
    navigation;
}

interface State {
    taxiTypeName: string;
    imgCarType: {};
    cartypeTintColor;
    bottomSheetAnim: Animated.Value,
    showBottomSheet: boolean
}

class ConfirmBookView extends React.Component<Props, State> implements ConfirmBookPresenter {
    public bookingViewModel: BookingViewModel;

    public bookTaxiModel: BookTaxiModel;

    public confirmBookModel: ConfirmBookModel;

    /** địa chỉ đi*/
    private srcAddressView: AddressView;

    /** địa chỉ đến*/
    private dstAddressView: AddressView;

    // Text hiển thị số tiền ước lượng.
    private txtPrceEstimate: Text;

    // Text hiển thị số phút ước lượng khoảng cách giữa xe gần nhất mà người đặt.
    private txtEstimateTime: Text;

    // Text hiển thị tên loại xe được chọn.
    private txtTypeName: Text;

    // Mô tả loại xe được chọn.
    private txtDescription: Text;

    private btShow;

    private btHide;

    // Bottom sheet chọn loại xe.
    private vehicleSelectDialog: VehicleSelectDialog;

    /** vị trí bottom của nút Back */
    private YBottomOfBack: number;

    /** vị trí top của thông tin loại xe */
    private heightOfInforBox: number;


    constructor(props) {
        super(props);
        this.bookingViewModel = this.props.bookingViewModel;

        this.bookTaxiModel = this.bookingViewModel.getBookTaxiModel();
        this.confirmBookModel = new ConfirmBookModel(this, this.bookingViewModel);

        this.state = {
            taxiTypeName: this.bookTaxiModel.getVehicleType().getName(),
            // ảnh loại xe;
            imgCarType: images[this.bookTaxiModel.getVehicleType().iconCode],
            // Màu xe.
            cartypeTintColor: colors.colorMain,

            bottomSheetAnim: new Animated.Value(-700),

            showBottomSheet: false
        };

        this.YBottomOfBack = 0;
        this.heightOfInforBox = 0
    }

    getTopHeight() {
        return this.YBottomOfBack;
    }

    getBottomHeight() {
        return this.heightOfInforBox;
    }

    /**
	 * @override
	 */
    public updateEstimateInfo(estimate: string, taxiTypeName: string) { }

    /**
	 * @override
	 */
    public setConfirmSchedule(mTimeSchedule: string) { }

	/**
	 * @override
	 * Khởi tạo giá trị thông tin đặt lịch.
	 */
    public initialScheduleInfo(mTimeSchedule: string): void { }

    /**
	 * @override
	 * hiển thị bottom sheet.
	 */
    public showBottomSheet(): void {
        if (this.btHide) {
            this.btHide.stop()
        }
        this.btShow = Animated.timing(
            this.state.bottomSheetAnim,
            {
                toValue: 0,
                duration: 200,
                easing: Easing.linear
            }
        );
        this.btShow.start();
    }

    /**
	 * @override
	 * ẩn bottom sheet.
	 */
    public hideBottomSheet(): void {
        if (this.btShow) {
            this.btShow.stop();
        }
        this.btHide = Animated.timing(
            this.state.bottomSheetAnim,
            {
                toValue: -700,
                duration: 200,
                easing: Easing.linear
            }
        ).start();
    }

	/**
	 * @override
	 * Ước lượng giá và lộ trình.
	 */
    public estimatePrice = (
        isShowEstimate: boolean,
        priceEs: string,
        distanceAB: string,
        dstAddress: BAAddress
    ): void => {
        this.setEstimate();
    };

    /**
    * @override
    */
    public setConfirmNoteText(): void { };

    /**
    * @override
    */
    public setPromotionText(): void { };

    /**
    * @override
    */
    /* Cập nhật giao diện loại xe,giá cước */
    public setEstimate(): void {
        this.txtPrceEstimate.setText(this.bookTaxiModel.estimates);
        this.txtTypeName.setText(this.bookTaxiModel.getVehicleType().getName());
        this.setState({
            imgCarType: images[this.bookTaxiModel.getVehicleType().iconCode],
            cartypeTintColor: null
        }, () => this.hideBottomSheet());
    }


    /**
	 * @override
	 */
    public setConfirmBookModel() {
        this.vehicleSelectDialog.setConfirmBookModel(this.confirmBookModel);
    }

    /**
	 * @override
	 */
    public getVehicleSelect(): VehicleSelectDialog {
        return this.vehicleSelectDialog;
    }

    /**
	 * @override
	 */
    public getNavigation() {
        return this.props.navigation;
    }

    /**
	 * @override
	 */
    updateViewSrcAddress(baAddress: BAAddress) {
        if (this.srcAddressView == null) {
            return;
        }

        if (Utils.isNull(baAddress)) {
            this.srcAddressView.setInfo(strings.no_address, null);
            return;
        }
        this.bookTaxiModel.srcAddress = baAddress;
        this.srcAddressView.setAddress(baAddress.formattedAddress);
    }

    /**
	 * @override
	 */
    updateViewDstAddress(baAddress: BAAddress) {
        if (this.dstAddressView == null) {
            return;
        }

        if (Utils.isNull(baAddress)) {
            this.dstAddressView.setInfo(strings.no_address, null);
            return;
        }
        this.bookTaxiModel.dstAddress = baAddress;
        this.dstAddressView.setAddress(baAddress.formattedAddress);
    }

    onLayoutAtInforBox = (e) => {
        this.heightOfInforBox = e.nativeEvent.layout.height;
        this.confirmBookModel.animatedZoomOutWhenFinishLayOut();
    }

    onLayoutAtHeader = (e) => {
        this.YBottomOfBack = e.nativeEvent.layout.height;
        this.confirmBookModel.animatedZoomOutWhenFinishLayOut();
    }

    render() {
        return (
            <View style={styles.rootContainer}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: width,
                            bottom: this.state.bottomSheetAnim,
                            zIndex: 10,
                        }}>
                        <VehicleSelectDialog
                            container={{
                                width: '100%',
                                borderRadius: 10,
                                backgroundColor: colors.colorWhiteMedium
                            }}
                            confirmBookModel={this.confirmBookModel}
                            onPress={(datas) => this.confirmBookModel.updateVehicleType(datas)}
                            onHeaderTouchEnd={() => this.hideBottomSheet()}
                            vehicleTypes={this.confirmBookModel.getVehicleTypes(this.bookTaxiModel.srcAddress.location)}
                            ref={ref => this.vehicleSelectDialog = ref}
                        />
                    </Animated.View>

                    <View style={{
                        width: width,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        position: "absolute",
                        zIndex: 2,
                        top: 0
                    }}
                        onLayout={this.onLayoutAtHeader}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.confirmBookModel.clickHeaderBack();
                            }}
                            style={{
                                width: 44,
                                height: 44,
                                margin: 12,
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
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            width: width,
                            bottom: 0,
                            alignItems: 'center',
                            zIndex: 0
                        }}
                        onLayout={this.onLayoutAtInforBox}>
                        <View
                            style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}
                        >
                            <ButtonIconOnMap onPress={() => this.confirmBookModel.actionLocationBtn()} />
                        </View>

                        <View
                            onTouchEnd={() => this.showBottomSheet()}
                            style={{
                                width: '100%', alignItems: 'center', flex: 1,
                                paddingLeft: dimens.eight,
                                paddingRight: dimens.eight,
                                paddingBottom: dimens.eight,
                                marginLeft: dimens.dimen_zero
                            }}>
                            <View style={styles.carTypeSubBtn} />
                            <View style={styles.carTypeBtn}>
                                <Image
                                    resizeMode="contain"
                                    imgStyle={{
                                        width: 32,
                                        height: 32,
                                        tintColor: colors.colorMain
                                    }}
                                    source={this.state.imgCarType} />
                                <View style={{ flex: 1 }}>
                                    <View style={{
                                        marginLeft: dimens.dimen_ten,
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: "center",
                                    }}>
                                        <Text
                                            ref={ref => this.txtTypeName = ref}
                                            text={this.state.taxiTypeName}
                                            textStyle={{ color: colors.colorMain }} />
                                        <Text
                                            textStyle={{
                                                fontSize: 16,
                                                color: colors.colorMain,
                                            }}
                                            ref={ref => this.txtPrceEstimate = ref} />
                                    </View>

                                    <View style={{
                                        alignItems: "center",
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginLeft: dimens.dimen_ten
                                    }}>
                                        <Text
                                            text={strings.vsd_select_car_description}
                                            textStyle={{ color: colors.colorDarkLight, fontSize: 14 }}
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            ref={ref => this.txtDescription = ref} />
                                        <Text
                                            ref={ref => this.txtEstimateTime = ref}
                                            text={strings.empty_string}
                                            textStyle={{ color: colors.colorDarkLight, fontSize: 14 }} />
                                    </View>
                                </View>

                            </View>
                        </View>

                        <View style={styles.container}>
                            <View style={styles.addressLayout}>
                                <AddressView
                                    ref={ref => {
                                        this.srcAddressView = ref;
                                    }}
                                    address={this.confirmBookModel.rModel.srcAddress.formattedAddress}
                                    showRightSeperate={false}
                                    title={strings.book_address_from}
                                    leftIcon={images.ic_src_oval}
                                    editable={false}
                                    disabled={false}
                                    onPress={() => {
                                        this.confirmBookModel.toSearch(FocusAddress.A_FOCUS);
                                    }}
                                    onRightIconPress={() => {
                                        this.confirmBookModel.toSearch(FocusAddress.A_FOCUS);
                                    }} />

                                <View style={{
                                    width: '100%',
                                    height: 1,
                                    backgroundColor: colors.colorWhiteMedium,
                                    marginLeft: 40,
                                    marginRight: 12
                                }} />

                                <AddressView
                                    ref={ref => {
                                        this.dstAddressView = ref;
                                    }}
                                    rightIcon={this.confirmBookModel.getDstRightIcon()}
                                    showRightSeperate={false}
                                    address={this.confirmBookModel.main.getDefaultDstAddressName()}
                                    title={strings.book_address_to}
                                    leftIcon={images.ic_dst_oval}
                                    editable={false}
                                    disabled={false}
                                    onPress={() => {
                                        this.confirmBookModel.toSearch(FocusAddress.B_FOCUS);
                                    }} />

                                <View style={{
                                    backgroundColor: colors.colorMain,
                                    width: 1,
                                    height: 18,
                                    marginLeft: 20,
                                    marginTop: 33,
                                    position: "absolute"
                                }} />
                            </View>

                            {/* promotion and note view */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 8,
                                    paddingLeft: 8,
                                    paddingRight: 8,
                                    paddingTop: 6,
                                    paddingBottom: 4,
                                    borderColor: "#EEEEEE",
                                    borderWidth: 1
                                }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.confirmBookModel.actionNotesBtn()}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Image
                                            resizeMode="contain"
                                            imgStyle={{ width: 24, height: 24, tintColor: colors.colorDarkLight }}
                                            source={images.ic_confirm_note} />
                                        <Text
                                            text={strings.book_notes_hint_button}
                                            textStyle={{ color: colors.colorDarkLight }} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{ width: 1, backgroundColor: '#EEEEEE' }} />

                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.confirmBookModel.actionPromotionCodeBtn()}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Image
                                            resizeMode="contain"
                                            imgStyle={{ width: 24, height: 24, tintColor: colors.colorDarkLight }}
                                            source={images.ic_sale} />
                                        <Text
                                            text={strings.book_confirm_promotion}
                                            textStyle={{ color: colors.colorDarkLight }} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{ width: 1, backgroundColor: '#EEEEEE' }} />

                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.confirmBookModel.actionCall()}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Image
                                            resizeMode="contain"
                                            imgStyle={{ width: 24, height: 24, tintColor: colors.colorDarkLight }}
                                            source={images.ic_confirm_hotline} />
                                        <Text
                                            text={strings.btn_call}
                                            textStyle={{ color: colors.colorDarkLight }} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.btnBook}
                                onPress={() =>
                                    this.confirmBookModel.actionBooking((this.srcAddressView as AddressView).getAddress())
                                }>
                                <View style={styles.btnBookContent}>
                                    <Image
                                        resizeMode="contain"
                                        imgStyle={styles.btnBookRightIcon}
                                        source={images.ic_car_datxe} />
                                    <Text
                                        text={strings.book_taxi_btn.toUpperCase()}
                                        textStyle={styles.btnBookTxt} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </View >
        );
    }


    async componentDidMount() {
        await this.confirmBookModel.componentDidMount();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.confirmBookModel.componentWillUnmount();

        if (this.btShow) {
            this.btShow.stop();
        }

        if (this.btHide) {
            this.btHide.stop();
        }

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.confirmBookModel.clickHeaderBack();
        return true;
    }

}

export default ConfirmBookView;


const styles = StyleSheet.create({
    rootContainer: {
        justifyContent: 'space-between',
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: colors.colorWhiteFull,
        width: '96%',
        borderRadius: 8,
        marginBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        elevation: 3,
        shadowColor: '#898989',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: { height: 1, width: 1 },
    },
    btnBook: {
        flex: 1,
        borderColor: colors.colorMain,
        backgroundColor: colors.colorMain,
        alignItems: 'center',
        marginTop: 8,
        borderRadius: 8, height: 50
    },
    btnBookContent: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnBookRightIcon: {
        width: 35,
        height: 35,
        tintColor: colors.colorWhiteFull,
        marginRight: 8
    },
    btnBookTxt: {
        color: colors.colorWhiteFull,
        fontWeight: 'bold'
    },
    addressLayout: {
        bottom: 0,
        backgroundColor: 'white',
        width: '100%',
        height: 84
    },
    carTypeBtn: {
        width: '100%',
        height: 52,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#898989',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: { height: 1, width: 1 },
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    carTypeSubBtn: {
        width: '96%',
        height: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        shadowColor: '#898989',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowOffset: { height: 2, width: 2 },
        borderWidth: 1,
        borderColor: '#EEEEEE',
        zIndex: 0
    },
});