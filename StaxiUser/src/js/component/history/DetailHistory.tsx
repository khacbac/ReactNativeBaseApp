import * as React from "react";
import MenuHeader from '../../../module/ui/header/MenuHeader';
import strings from '../../../res/strings';
import images from '../../../res/images';

import {
    StyleSheet,
    SafeAreaView,
    View,
    Dimensions,
    Linking,
    TouchableOpacity,
    FlatList
} from 'react-native';

import {
    Text,
    Image,
    HorizontalIconTextButton,
    Button,
    Dialog,
    PairAlert,
    LatLng,
    Utils,
    UserUtils
} from '../../../module';
import colors from '../../../res/colors';
import BAAddress from "../../model/BAAddress";
import History from "../../sql/bo/History";
import Language from "../../../module/model/Language";
import dimens from "../../../res/dimens";
import fonts from "../../../module/ui/res/dimen/fonts";
import ScreenName from "../../ScreenName";
import SessionStore from "../../Session";


export interface Props {
    navigation: any;
}

export interface State {
    
}

export enum FooterButtonState {
    StateOrigin = 1, BookAgain = 2
}

class DataDetail {
    leftButton: any;
    title: String;
    rightButton: any;
    clickFunc: Function;

    constructor(leftBT, title, rightBT, clickFunc){
        this.leftButton = leftBT;
        this.title = title;
        this.rightButton = rightBT;
        this.clickFunc = clickFunc;
    }
}


class DetailHistory extends React.Component<Props, State> {

    private params: History;
    private displayType: FooterButtonState = FooterButtonState.StateOrigin;
    private leftButtonHorizontal:HorizontalIconTextButton;
    private rightButtonHorizontal:HorizontalIconTextButton;
    constructor(props) {
        super(props);
        this.params = this.props.navigation.getParam('data') ? this.props.navigation.getParam('data')
        :{
            bookCode : 0,
            companyID :1,
            cartypeID : 0,
            companyName : "",
            cartypeVI : "",
            cartypeEN : "",
            createdTime : 0,
            bookTime : 0,
            fromAddress : "",
            fromLat : 0,
            fromLng : 0,
            fromName : "",
            toAddress : "",
            toLat : 0,
            toLng : 0,
            toName : "",
            userNote : "",
            promoCode : 0,
            bookType : 0,
            status : 0,
            nameDrive : "",
            plate : "",
            carNo : "",
            phoneNumber : "",
            imageLink : "",
            transportFee : 0,
            waitingFee : 0,
            additionFee : 0,
            discount : 0,
            trackingLog : '',
            havingGuestKm : '',
            totalSecond : 0,
            isShareBooking : false,
            isDeleted : false,

            
            dateFormat : "",
    
            shortTime : "",
    
            shortTimeTo : "",
            dateTo : "",
    
            totalFee : 0
        }
        this.state = {
            
        };
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "90%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "5%"
                }}
            />
        );
    };

    renderItemDetail = ({item})=>{
        return (
            <View style={{flexDirection:'row', height:dimens.history_detail_item_height}}>
                <TouchableOpacity
                    onPress={ ()=>{if (item.clickFunc != null) {item.clickFunc()}}}
                    style={{ height: dimens.history_detail_item_height, flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: dimens.history_detail_item_content_height }} >
                        <Image source={item.leftButton} imgStyle={{ width: dimens.history_detail_icon_height, height: dimens.history_detail_icon_height, marginLeft: dimens.history_detail_icon_margin_left }} />
                        <Text text={item.title} textStyle={{ marginLeft: dimens.history_detail_text_margin_left, flex: 1, fontSize: fonts.body_2 }} />
                        
                        <View>
                            <Image
                                source={item.rightButton}
                                imgStyle={{ width: dimens.history_detail_icon_height, height: dimens.history_detail_icon_height, marginRight: dimens.history_detail_icon_right_margin, tintColor: colors.colorMain }} />
                        </View>
                    </View>
                    {this.renderSeparator()}
                </TouchableOpacity>
            </View>
        );
    }

    openTrackingLog = ()=> {
        this.props.navigation.navigate(ScreenName.TRACKING_HISTORY, { tracklog: this.params.trackingLog });
    }

    openDetailFee = ()=> {
        let data = this.params;

        let dataDialog = [
            {
                label: strings.fare_total_label,
                title: UserUtils.formatMoney(data.transportFee),
                index: 0
            },
            {
                label: strings.fare_wait_label,
                title: UserUtils.formatMoney(data.waitingFee),
                index: 1
            },
            {
                label: strings.fare_extend_label,
                title: UserUtils.formatMoney(data.additionFee),
                index: 2
            },
            {
                label: strings.fare_sale_label,
                title: UserUtils.formatMoney(data.discount),
                index: 3
            },
            {
                label: strings.fare_pay_label,
                title: UserUtils.formatMoney(data.totalFee),
                index: 4
            },

        ]

        // Hiển thị dialog.
        this.getDialog()._showDialog(
            <View style={{ width: '100%', backgroundColor: colors.colorWhiteFull }}>
                <View style={{ padding: dimens.history_detail_fee_padding }}>
                    <Text
                        text={strings.fare_title}
                        textStyle={{ color: colors.colorMain, textAlign: 'center', fontSize: fonts.body_1 }} />
                </View>
                <View style={dialogStyles.indicator} />

                <View style={{ flex: 1, paddingTop: dimens.history_detail_fee_padding_top }}>
                    {dataDialog.map(item => {
                        let bg = item.index === 4 ? colors.colorGrayMain : colors.colorWhiteFull;
                        let txt = item.index === 4 ? { fontSize: fonts.body_2, fontWeight: 'bold' } : { fontSize: fonts.body_2 }
                        return (
                            <View
                                style={[dialogStyles.itemContainer, { backgroundColor: bg }]}
                                key={item.label}
                            >
                                <Text text={item.label} textStyle={txt} />
                                <Text text={item.title + " đ"} textStyle={txt} />
                            </View>
                        )
                    })}
                </View>

                <Button
                    text={strings.btn_ok.toUpperCase()}
                    btnStyle={{ width: "100%", padding: dimens.history_detail_fee_padding, backgroundColor: 'white' }}
                    textStyle={{ color: colors.colorMain, fontSize: fonts.body_2 }}
                    onPress={() => this.getDialog()._closeDialog()}>
                </Button>
            </View>, false

        )
    }

    confirmDelete(){
        PairAlert.get()
        .setTitle(strings.alert_dialog_title)
        .setMessage(strings.history_delete_alert)
        .setPositiveText(strings.btn_ok)
        .setPositivePress(() => {
            this.props.navigation.getParam('deleteFunc')(this.params.bookCode);
            this.backButton();
        })
        .setNegativeText(strings.btn_cancel)
        .show();
    }

    public getDialog():Dialog{
        return this.refs.dialog as Dialog;
    }

    /*lấy số điện thoại hãng */

	public getCompanyPhone(companyID: number) {
        let company = SessionStore.getCompanys().get(companyID);
        if (company != null) {
            return company.phone;
        }
		return '';
    }
    
    callHotLine() {
        
        let companyPhone = this.getCompanyPhone(this.params.companyID);
        Linking.openURL(`tel:` + companyPhone);
        
    }

    bookAgain() {
        if(this.params.toAddress == ""){
            //khi cuốc đặt chưa có địa chỉ đến thì về home luôn

            let data = this.params;
            var aAddress: BAAddress = new BAAddress();
            aAddress.location = new LatLng(data.fromLat, data.fromLng);
            aAddress.name = data.fromName;
            aAddress.formattedAddress = data.fromAddress;

            var bAddress: BAAddress = new BAAddress();
            bAddress.location = new LatLng(data.toLat, data.toLng);
            bAddress.name = data.toName;
            bAddress.formattedAddress = data.toAddress;

            this.backToHome(aAddress, bAddress);
        }else{
            this.setDisplayType(FooterButtonState.BookAgain);//book again
        }
    }

    btnLeftClick() {
        if (this.displayType == FooterButtonState.StateOrigin) {
            this.callHotLine();
        } else {

            let data = this.params;
            var aAddress: BAAddress = new BAAddress();
            aAddress.location = new LatLng(data.fromLat, data.fromLng);
            aAddress.name = data.fromName;
            aAddress.formattedAddress = data.fromAddress;

            var bAddress: BAAddress = new BAAddress();
            bAddress.location = new LatLng(data.toLat, data.toLng);
            bAddress.name = data.toName;
            bAddress.formattedAddress = data.toAddress;

            this.backToHome(aAddress, bAddress);
        }
    }

    btnRightClick() {
        if (this.displayType == FooterButtonState.StateOrigin) {
            this.bookAgain();
        } else {
            let data = this.params;
            var bAddress: BAAddress = new BAAddress();
            bAddress.location = new LatLng(data.fromLat, data.fromLng);
            bAddress.name = data.fromName;
            bAddress.formattedAddress = data.fromAddress;

            var aAddress: BAAddress = new BAAddress();
            aAddress.location = new LatLng(data.toLat, data.toLng);
            aAddress.name = data.toName;
            aAddress.formattedAddress = data.toAddress;

            this.backToHome(aAddress, bAddress);
        }
    }

    backToHome(srcAddress, dstAddress){
        this.props.navigation.popToTop();
        SessionStore.updateChange(srcAddress, dstAddress);
    }

    backButton() {
        if (this.displayType == FooterButtonState.StateOrigin) {
            this.props.navigation.goBack();
        } else {
            this.setDisplayType(FooterButtonState.StateOrigin);
        }
    }

    setDisplayType(displayType: FooterButtonState){
        this.displayType = displayType;
        switch(displayType){
            case FooterButtonState.StateOrigin:
                this.leftButtonHorizontal.setIcon(images.feedback_hotline);
                this.leftButtonHorizontal.setText(strings.btn_call.toUpperCase());
                this.rightButtonHorizontal.setText(strings.btn_book_again.toUpperCase());
            break;
            case FooterButtonState.BookAgain:
                this.leftButtonHorizontal.setIcon(images.ic_distance);
                this.leftButtonHorizontal.setText(strings.history_retry_book_a_b);
                this.rightButtonHorizontal.setText(strings.history_retry_book_b_a);
            break;
        }
    }

    /*Lấy thông tin xe*/
    getVehicleNameWithId = (_vehicleId) => {
        SessionStore.getVehicleTypes().forEach(item => {
            if (item.vehicleId === _vehicleId) {
                return item.nameVi;
            }
        })
    }

    _renderFromToInfo = ({ item, index }) => {
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', paddingBottom: dimens.history_detail_from_to_padding, paddingTop: dimens.history_detail_from_to_padding }} >
                    <View style={[styles.dotView, { backgroundColor: item.color }]}></View>
                    <View style={{ flexDirection: 'column', flex: 1, marginLeft: dimens.history_detail_view_marginLeft }} >
                        <Text textStyle={{ color: item.color, fontSize: fonts.body_2, flex: 1 }} text={item.book_from}>
                        </Text>
                        <View style={{ flex: 1 }}>
                            <Text textStyle={[styles.textDetail, { flex: 1, marginRight: dimens.history_detail_text_marginRight }]} text={item.address}>
                            </Text>
                        </View>
                        {item.time != "" && <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <Image source={images.ic_date} imgStyle={{ width: dimens.history_detail_from_to_icon_size, height: dimens.history_detail_from_to_icon_size }} />
                            <Text textStyle={[styles.textDetail, { flex: 1, marginLeft: dimens.history_detail_from_to_icon_margin_right }]} text={item.time}>
                            </Text>
                        </View>}
                    </View>
                </View>

                {this.renderSeparator()}
            </View>
        )
    }

    render() {

        var dataFromTo = [];

        dataFromTo.push({
            book_from: strings.book_address_from, address: this.params.fromAddress,
            time: this.params.shortTime + " - " + this.params.dateFormat,
            color: colors.colorMain
        });
        if(this.params.toAddress != ""){
            dataFromTo.push({
                book_from: strings.book_address_to, address: this.params.getToAddress(),
                time: this.params.status == 1 ?
                    (this.params.shortTimeTo + " - " + this.params.dateTo) : "",
                color: colors.colorSub
            });
        }

        var dataDetail = [];

        let carTypeTxt = SessionStore.language == Language.EN ? this.params.cartypeEN:this.params.cartypeVI;
        
        {/*  Booking Type */}
        dataDetail.push(new DataDetail(images.ic_menu_book, carTypeTxt, null, null))
        
        {/* Fee infor         */}
        dataDetail.push(new DataDetail(images.ic_dollar, UserUtils.formatMoney(this.params.transportFee) + " đ",
                images.ic_price, this.openDetailFee))
        {/* Promotion Info*/}
            {this.params.promoCode.length > 0 &&
            dataDetail.push(new DataDetail(
                        images.ic_menu_promotion,
                        this.params.promoCode,
                        null, null))
            }
        {/* During Time  */}
            {this.params.status == 1 &&
            dataDetail.push(new DataDetail(
                        images.ic_time_history,
                        strings.history_book_total_time + " " + this.params.totalSecond 
                        + " " + strings.book_schedule_minute,
                        null, null
                    ))
            }
        {/* Trip Log            */} /* chỉ vẽ khi server trả về trường trackingLog có dữ liệu */
            {this.params.trackingLog != "" && 
            dataDetail.push(new DataDetail(images.ic_distance, strings.tracking_log, images.ic_menu_about, this.openTrackingLog))}

        let driverInfo;
        if (this.params.status == 1) {
            driverInfo =
                <View style={{ flexDirection: 'row', height: dimens.history_detail_driver_size, alignItems: 'center' }} >
                    <View style={{
                        backgroundColor: colors.colorMain, justifyContent: 'center', alignItems: 'center', marginLeft: 10,
                        width: dimens.history_detail_driver_circle_size, height: dimens.history_detail_driver_circle_size,
                        borderRadius: dimens.history_detail_driver_circle_size/2
                    }}>
                        <Image
                            source={(this.params.imageLink == "") ? images.ic_user_defatlt : ({uri:this.params.imageLink})}
                            imgStyle={{ tintColor: null, flex: 1, width: dimens.history_detail_driver_circle_size - 2, height: dimens.history_detail_driver_circle_size - 2, resizeMode: 'contain', borderRadius: (dimens.history_detail_driver_circle_size - 2)/2 }} />
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: dimens.history_detail_driver_info_margin_top_bottom,
                        marginBottom: dimens.history_detail_driver_info_margin_top_bottom,
                        marginLeft: dimens.history_detail_driver_info_margin_left }}>
                        <Text
                            textStyle={styles.textBold}
                            text={this.params.nameDrive}
                        />
                        <Text
                            textStyle={styles.textBold}
                            text={this.params.phoneNumber}
                        />
                        <Text
                            textStyle={styles.textNormal}
                            text={strings.car_number_sh + ": " + this.params.carNo
                                + " - " + this.params.plate}
                        />
                    </View>
                </View>
        }



        return (
            <SafeAreaView style={styles.container}>

                <MenuHeader
                    title={strings.title_detail_history}
                    drawerOpen={() => this.backButton()}
                    imgRightBT={images.ic_delete}
                    pressRightBT={() => this.confirmDelete()}
                    isBack
                />
                {/* Driver Infor */}
                {driverInfo}

                {/* From, To infor */}
                <View>
                    <FlatList
                        data={dataFromTo}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderFromToInfo}
                    />
                </View>
                
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <FlatList
                        data = {dataDetail}
                        renderItem = {this.renderItemDetail}
                    />
                </View>
                <View style={styles.footerView}>

                    <HorizontalIconTextButton
                        ref={(ref) => this.leftButtonHorizontal = ref}
                        icon={images.feedback_hotline}
                        text={strings.btn_call.toUpperCase()}
                        textStyle={{ color: colors.colorSub, fontWeight: 'bold', fontSize: fonts.body_2, flex:null }}
                        iconStyle={{ tintColor: colors.colorSub, marginHorizontal:null }}
                        border={1}
                        borderColor={colors.colorSub}
                        container={{ backgroundColor: 'white', flex: 1, marginRight: dimens.history_detail_padding_5, marginBottom: 0,
                            borderColor: colors.colorSub, justifyContent:'center', alignItems:'center' }}
                        rootStyle = {{justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => { this.btnLeftClick() }}
                    />

                    <HorizontalIconTextButton
                        ref={(ref) => this.rightButtonHorizontal = ref}
                        icon={images.ic_distance}
                        text={strings.btn_book_again.toUpperCase()}
                        textStyle={{ color: 'white', fontWeight: 'bold', fontSize: fonts.body_2, flex:null }}
                        iconStyle={{ marginHorizontal:null }}
                        border={1}
                        borderColor={colors.colorMain}
                        container={{ backgroundColor: colors.colorMain, flex: 1, marginLeft: dimens.history_detail_padding_5, marginBottom: 0,
                            justifyContent:'center', alignItems:'center' }}
                        rootStyle = {{justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => { this.btnRightClick() }}
                    />
                </View>
                <Dialog
                    onRequestClose={() => {
                        this.getDialog()._closeDialog();
                    }}
                    //title={"Thông báo trên dialog"}
                    title={null}
                    ref="dialog"
                    contentStyle={{ padding: 0 }}
                    topContainer={{ borderRadius: 0 }}
                />
            </SafeAreaView>
        )
    }


}

//<Text style={styles.item}>{item.fromAddress}</Text>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    sectionHeader: {
        paddingTop: dimens.history_detail_padding_2,
        paddingLeft: dimens.history_padding_bot_section_header,
        paddingRight: dimens.history_padding_bot_section_header,
        paddingBottom: dimens.history_detail_padding_2,
        fontSize: fonts.body_2,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    textBold: {
        fontSize: fonts.body_2,
        fontWeight: 'bold',
        paddingTop: dimens.history_detail_padding_5,
        paddingBottom: dimens.history_detail_padding_5
    },
    textNormal: {
        fontSize: fonts.body_2,
    },
    dotView: {
        backgroundColor: colors.colorMain,
        borderRadius: dimens.history_detail_dot_size/2,
        width: dimens.history_detail_dot_size,
        height: dimens.history_detail_dot_size,
        marginLeft: dimens.history_detail_view_marginLeft,
        alignSelf: 'center'
    },
    textDetail: {
        fontSize: fonts.body_2
    },
    footerView: {
        width: Dimensions.get('window').width - 20,
        height: 50,
        marginLeft: dimens.history_detail_text_marginRight,
        marginBottom: dimens.history_detail_text_marginRight,
        flexDirection: 'row',
        marginTop: dimens.history_detail_text_marginRight
    }
});

const dialogStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: dimens.history_padding_bot_section_header
    },
    indicator: {
        width: '100%',
        height: 1,
        backgroundColor: colors.colorMain
    }
})

export default DetailHistory;