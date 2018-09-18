/**
 * Dialog thông tin chi tiết cước phí di chuyển.
 */

import * as React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import {
    Image,
    Text,
    UserUtils,
} from '../../../../../module';

import images from '../../../res/images';
import colors from '../../../res/colors';
import VehicleType from '../../../../sql/bo/VehicleType';
import dimens from '../../../res/dimens';
import VehicleSelectItem from './VehicleSelectItem';
import strings from '../../../../../res/strings';
import { CalcPriceResponse, VehicleWithPrice } from '../../../../http/estimate/CalcPriceResponse';
import ConfirmBookModel from './ConfirmBookModel';

interface Props {
    onPress?: Function,
    onBtnOk?: Function,
    vehicleTypes?: Array<any>,
    container?: {},
    onHeaderTouchEnd?: any;
    confirmBookModel?: ConfirmBookModel;
}

interface State {
    data: Array<{ priceDetail: string, vehicleType: VehicleType }>;
}

export default class VehicleSelectDialog extends React.Component<Props, State> {

    private vehicleTypes: Array<VehicleType> = new Array<VehicleType>();

    private confirmBookModel: ConfirmBookModel;

    private itemHeight: number;

    constructor(props) {
        super(props);
        this.vehicleTypes = this.props.vehicleTypes;
        this.confirmBookModel = this.props.confirmBookModel;
        this.itemHeight = (Dimensions.get('window').height / 3) / this.vehicleTypes.length;
        this.state = {
            data: [],
        }
    }

    public setConfirmBookModel(confirmBookModel: ConfirmBookModel) {
        this.confirmBookModel = confirmBookModel;
    }

    public setData(calcPrice: CalcPriceResponse) {
        let data = [];
        let childPrices = calcPrice.childPrices.value;
        for (let i = 0; i < this.vehicleTypes.length; i++) {
            let vehicleType = this.vehicleTypes[i];
            let withPrice = childPrices.find(item => {
                return item.carType.value === vehicleType.vehicleId;
            });
            // giá cước.
            let priceDetail = strings.empty_string;
            if (withPrice) {
                if (withPrice.price.value > 0) {
                    priceDetail = UserUtils.formatMoneyToK(withPrice.price.value);
                }
            }

            // đối với loại xe tất cả
            if (vehicleType.vehicleId === 0) {
                if (calcPrice.priceMax.value > 0) {
                    priceDetail =
                        UserUtils.formatMoneyToK(calcPrice.priceMin.value) +
                        " - " +
                        UserUtils.formatMoneyToK(calcPrice.priceMax.value)
                } else {
                    if (calcPrice.priceMin.value > 0) {
                        priceDetail = UserUtils.formatMoneyToK(calcPrice.priceMin.value);
                    }
                }
            }

            // Get tên loại xe theo ngôn ngữ.
            data.push({
                // giá cước.
                priceDetail: priceDetail,
                vehicleType: vehicleType
            });
        }
        this.setState({
            data: data
        })
    }

    componentDidMount() {
        this.setData(new CalcPriceResponse())
    }

    _renderItem = ({ item, index }) => {
        return (
            <VehicleSelectItem
                itemHeight={this.itemHeight}
                data={item}
                onItemPress={() => this.props.onPress(item)}
                confirmBookModel={this.confirmBookModel}
            />
        )
    }

    render() {
        return (
            <View style={[styles.container,]}>
                {this.vehicleTypes.length !== 0 && <View style={[{
                    flex: 1,
                    backgroundColor: colors.colorWhiteMedium,
                    height: this.itemHeight * this.state.data.length + dimens.vsd_header_height + 60,
                }, this.props.container]}>
                    <TouchableOpacity activeOpacity={1} onPress={this.props.onHeaderTouchEnd}>
                        <View
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: dimens.dimen_ten,
                                flexDirection: 'row',
                                height: dimens.vsd_header_height,
                                width: '100%',
                            }}
                        >
                            <Text
                                text={strings.vsd_title}
                                textStyle={{
                                    color: colors.colorGrayDark,
                                    fontSize: 20,
                                    marginLeft: dimens.dimen_ten,
                                }}
                            />

                            <View
                                style={{
                                    backgroundColor: colors.colorGrayLight,
                                    height: dimens.dimen_four,
                                    width: dimens.dimen_thirty,
                                    position: 'absolute',
                                    left: Dimensions.get("window").width / 2 - dimens.dimen_fifteen,
                                    right: dimens.dimen_zero,
                                    top: dimens.dimen_ten,
                                    borderRadius: 2
                                }}>

                            </View>

                            <Image
                                source={images.ic_help_48}
                                imgStyle={{
                                    tintColor: colors.colorGray,
                                    width: dimens.size_icon_input_28,
                                    height: dimens.size_icon_input_28,
                                }}
                            />

                        </View>
                    </TouchableOpacity>

                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                            backgroundColor: colors.colorWhiteFull
                        }}
                    />

                    <View style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: 'white',
                        justifyContent: 'flex-end'
                    }}>
                        <ImageBackground
                            resizeMode="stretch"
                            source={images.drawer_footer_bkg}
                            style={{ width: '100%', height: 50 }}
                        />
                    </View>
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: dimens.size_icon_input_48,
        height: dimens.size_icon_input_48,
        tintColor: null,

    },
    divider: {
        height: 1,
        backgroundColor: colors.colorGrayLight,
        marginTop: 5
    }
});