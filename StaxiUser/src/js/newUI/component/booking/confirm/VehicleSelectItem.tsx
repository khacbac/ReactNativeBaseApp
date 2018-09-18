import * as React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    // Text
} from 'react-native';
import {
    Image,
    Text,
    Utils,
} from '../../../../../module';
import dimens from '../../../res/dimens';
import colors from '../../../res/colors';
import VehicleType from '../../../../sql/bo/VehicleType';
import strings from '../../../../../res/strings';
import images from '../../../res/images';
import ConfirmBookModel from './ConfirmBookModel';

interface Props {
    onItemPress?: any;
    itemHeight?: number;
    data?: { priceDetail: string, vehicleType: VehicleType };
    confirmBookModel: ConfirmBookModel
}

interface State {

}

export default class VehicleSelectItem extends React.Component<Props, State> {

    private itemHeight: number;

    private confirmBookModel: ConfirmBookModel;

    constructor(props) {
        super(props);

        this.itemHeight = this.props.itemHeight;

        this.confirmBookModel = this.props.confirmBookModel;

        this.state = {
            data: this.props.data
        }

    }

    render() {

        // Item  đang focus.
        let isFocus = this.props.data.vehicleType.getName() == this.confirmBookModel.rModel.getVehicleType().getName();

        return (
            <TouchableOpacity
                onPress={this.props.onItemPress}
                style={{
                    paddingHorizontal: dimens.dimen_fifteen,
                    height: this.itemHeight
                }}
            >
                <View style={[styles.itemContainer]}>
                    <Image
                        source={images[this.props.data.vehicleType.iconCode]}
                        imgStyle={[styles.iconLeft, {
                            tintColor: isFocus ? colors.colorMain : colors.colorGrayDark
                        }]}
                        resizeMode="contain"
                    />
                    <View style={{
                        flex: 1,
                        marginHorizontal: dimens.dimen_fifteen
                    }}>
                        <Text
                            textStyle={{
                                fontSize: 18,
                                color: isFocus ? colors.colorMain : colors.colorDark,
                            }}
                        >{this.props.data.vehicleType.getName()}</Text>

                        <Text
                            textStyle={{
                                fontSize: 14,
                                color: colors.colorGray
                            }}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >{strings.empty_string}</Text>
                    </View>
                    <View style={{
                        alignItems: 'flex-end'
                    }}>
                        {!Utils.isEmpty((this.props.data.priceDetail)) &&
                            <View style={{
                                flexDirection: 'row'
                            }}>

                                <Text
                                    textStyle={{
                                        fontSize: 16,
                                        color: isFocus ? colors.colorMain : colors.colorGray,
                                    }}
                                >{strings.vsd_money_unit}</Text>

                                <Text
                                    textStyle={{
                                        fontSize: 18,
                                        color: isFocus ? colors.colorMain : colors.colorDark,
                                    }}
                                >
                                    {this.props.data.priceDetail}
                                </Text>
                            </View>
                        }
                    </View>
                </View>
                <View style={styles.divider} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhiteFull,
        elevation: 5
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconRight: {
        tintColor: colors.colorGrayLight,
        width: dimens.size_icon_input_16,
        height: dimens.size_icon_input_16
    },
    iconLeft: {
        // width: dimens.size_icon_input_48,
        width: dimens.size_icon_input_32,
        height: dimens.size_icon_input_32,
        // tintColor: colors.colorGrayDark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.colorGrayLight,
        marginTop: 5
    }
});