import * as React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import {
    Text,
    Image,
    Button,
    CircleImage,
    NativeLinkModule,
    Utils,
} from '../../../../../module';
import ViewCarViewModel from "../../../../viewmodel/booking/viewcar/ViewCarViewModel";
import DriverInfo from "../../../../model/DriverInfo";
import VehicleInfo from "../../../../model/VehicleInfo";
import BookTaxiModel from "../../../../viewmodel/booking/BookTaxiModel";

import colors from '../../../../../res/colors';
import images from '../../../../../res/images';
import strings from "../../../../../res/strings";

export interface Props {
    viewCarViewModel: ViewCarViewModel;
}

export default class DriverView extends React.Component<Props> {
    private driverInfo: DriverInfo;
    private vehicleInfo: VehicleInfo;

    private rModel: BookTaxiModel;

    constructor(props: Props) {
        super(props);
        this.rModel = this.props.viewCarViewModel.getBookTaxiModel();
        this.driverInfo = this.rModel.driverInfo;
        this.vehicleInfo = this.rModel.vehicleInfo;
    }

    _onCarConfirm = () => {
        this.props.viewCarViewModel.confirmMeetCar();
    }

    _cancelBook() {
        this.props.viewCarViewModel.askUserForCancel();
    }

    _touchingOnPhone() {
        NativeLinkModule.openDialPhone(this.driverInfo.phone);
    }

    componentDidMount() {
        // Avatar lái xe
        if (this.rModel.driverInfo.avatarLink != null && !Utils.isEmpty(this.rModel.driverInfo.avatarLink)) {
            this.getDriverAvatar().setImageReview(this.rModel.driverInfo.avatarLink);
            this.getDriverAvatar().setTintColor(null);
        } else {
            this.getDriverAvatar().setImageRes(images.ic_user_menu);
            this.getDriverAvatar().setTintColor(colors.colorMain);
        }
    }

    private getDriverAvatar():CircleImage{
        return this.refs.driverAvatar as CircleImage;
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.topViewContainer}>
                    <View style={{ alignItems: 'center' }}>

                        <CircleImage
                            ref="driverAvatar"
                            source={images.ic_user_defatlt}
                            size={100}
                            tintColor={colors.colorMain}
                        />


                        <View style={styles.rateContainer}>
                            <View style={styles.rateContent}>
                                <Image
                                    source={images.ic_star}
                                    imgStyle={styles.starImg}
                                />
                                <Text
                                    text="5.0"
                                    textStyle={styles.txtRateCount}
                                />
                            </View>

                        </View>

                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text
                            text={this.driverInfo.name}
                            textStyle={styles.txtUserName}
                        />
                        <Text
                            text={`Số xe: ${this.vehicleInfo.carNo} - ${this.vehicleInfo.vehiclePlate}`}
                            textStyle={{}}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => this._touchingOnPhone()}
                    >
                        <CircleImage
                            source={images.ic_phone}
                            size={50}
                            tintColor={colors.colorMain}
                        />
                    </TouchableOpacity>

                </View>
                <View style={styles.btnContainer}>
                    <Button
                        text={strings.book_cancel_btn}
                        btnStyle={styles.btnCancel}
                        textStyle={{
                            color: colors.colorRed
                        }}
                        onPress={() => this._cancelBook()}
                    />
                    <View style={{ width: 10 }} />
                    <Button
                        text={strings.book_invite_meet_car_btn}
                        btnStyle={styles.btnBook}
                        textStyle={{
                            color: colors.colorMain
                        }}
                        onPress={this._onCarConfirm}
                    />
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhiteFull,
        padding: 10,
    },
    topViewContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rateContainer: {
        position: 'absolute',
        bottom: 0,
        left: 5,
        right: 5
    },
    rateContent: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        borderWidth: 1,
        borderColor: colors.colorGray,
        width: '100%',
        backgroundColor: colors.colorWhiteFull,
        justifyContent: 'center',
        paddingVertical: 2,
        alignItems: 'center'
    },
    starImg: {
        width: 16,
        height: 16,
        tintColor: colors.colorSub
    },
    txtRateCount: {
        fontWeight: 'bold',
        color: colors.colorSub,
        fontSize: 16,
        marginLeft: 10
    },
    txtUserName: {
        fontWeight: 'bold',
        color: colors.colorBlackFull,
        fontSize: 20
    },
    btnContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    btnCancel: {
        flex: 1,
        borderColor: colors.colorRed,
        borderWidth: 1,
        backgroundColor: colors.colorWhiteFull
    },
    btnBook: {
        flex: 1,
        borderColor: colors.colorMain,
        borderWidth: 1,
        backgroundColor: colors.colorWhiteFull
    }
});