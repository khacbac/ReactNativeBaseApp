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
import DriverInfo from "../../../../model/DriverInfo";
import VehicleInfo from "../../../../model/VehicleInfo";
import ViewCarViewModel from "../../../../viewmodel/booking/viewcar/ViewCarViewModel";
import BookTaxiModel from "../../../../viewmodel/booking/BookTaxiModel";
import newImages from "../../../res/images";
import colors from "../../../res/colors";
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
            this.getDriverAvatar().setImageRes(newImages.ic_user_menu);
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
                            source={newImages.ic_user_defatlt}
                            size={72}
                            tintColor={colors.colorMain}
                        />

                        <View style={styles.rateContainer}>
                            <View style={styles.rateContent}>
                                <Image
                                    source={newImages.ic_star}
                                    imgStyle={styles.starImg}
                                />
                                <Text
                                    text={this.driverInfo.rating?this.driverInfo.rating.toFixed(1) : "5.0"}
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
                            textStyle={{fontSize: 14, color: colors.colorGray}}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => this._touchingOnPhone()}
                    >
                        <View style={{alignItems: 'center'}}>
                            <CircleImage
                                tintColor={colors.colorMain}
                                source={newImages.ic_call_driver}
                            />
                            <Text
                                text={strings.btn_call_driver}
                                textStyle={{ fontSize: 14, color: colors.colorMain }}
                            />
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={styles.btnContainer}>
                    <Button
                        text={strings.book_cancel_btn}
                        btnStyle={styles.btnCancel}
                        textStyle={{
                            color: colors.colorWhiteFull
                        }}
                        onPress={() => this._cancelBook()}
                    />
                    <View style={{ width: 10 }} />
                    <Button
                        text={strings.book_invite_meet_car_btn}
                        btnStyle={styles.btnBook}
                        textStyle={{
                            color: colors.colorWhiteFull
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
		backgroundColor: colors.colorWhiteFull,
		margin: 8,
		borderRadius: 8
	},
	topViewContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rateContainer: {
		position: 'absolute',
		bottom: 0,
		left: 5,
		right: 5,
	},
	rateContent: {
		position: 'absolute',
		flexDirection: 'row',
		bottom: 0,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: colors.colorGrayLight,
		width: '100%',
		backgroundColor: colors.colorWhiteFull,
		justifyContent: 'center',
		paddingVertical: 2,
		alignItems: 'center',
	},
	starImg: {
		width: 16,
		height: 16,
		tintColor: colors.colorGray,
	},
	txtRateCount: {
		fontWeight: 'bold',
		color: colors.colorGray,
		fontSize: 14,
		marginLeft: 8,
	},
	txtUserName: {
		fontWeight: 'bold',
		color: colors.colorDarkLight,
		fontSize: 16,
	},
	btnContainer: {
		flexDirection: 'row',
		marginTop: 10,
	},
	btnCancel: {
		flex: 1,
		borderRadius: 8,
		height: 44,
		backgroundColor: colors.colorSub,
	},
	btnBook: {
		flex: 1,
		borderRadius: 8,
		height: 44,
		backgroundColor: colors.colorMain,
	},
});