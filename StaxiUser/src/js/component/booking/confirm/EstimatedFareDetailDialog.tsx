/**
 * Dialog thông tin chi tiết cước phí di chuyển.
 */

import * as React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    Image,
    Text,
    Button,
    Utils,
} from '../../../../module';

import VehicleTypeDAO from '../../../sql/dao/VehicleTypeDAO';
import { VehicleWithPrice } from '../../../http/estimate/CalcPriceResponse';

import images from '../../../../res/images';
import colors from '../../../../res/colors';
import strings from '../../../../res/strings';

interface Props {
    childPrices: Array<VehicleWithPrice>,
    onPress: Function,
    onBtnOk: Function,
    estimateDatas: Array<any>
}

interface State {
    data: Array<any>
}

export default class EstimatedFareDetailDialog extends React.Component<Props, State> {

    private vehicleWithPrices: Array<VehicleWithPrice>;

    constructor(props) {
        super(props);
        this.vehicleWithPrices = this.props.childPrices;

        this.state = {
            data: this.props.estimateDatas
        }
    }

    public static create(childPrices, onPress, estimateDatas, onBtnOk) {
        return <EstimatedFareDetailDialog
            childPrices={childPrices}
            onPress={withPrice => onPress(withPrice)}
            estimateDatas={estimateDatas}
            onBtnOk={onBtnOk}
        />
    }

    _renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                onPress={() => this.props.onPress(this.vehicleWithPrices[index])}
                style={styles.itemContainer}>
                <Image
                    source={item.icon}
                    imgStyle={styles.iconLeft}
                    resizeMode="contain"
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text
                                text={item.carTypeName}
                            />
                            <Text
                                text={item.priceDetail}

                            />
                        </View>
                        <Image
                            source={images.ic_arrow_right}
                            imgStyle={styles.iconRight}
                        />
                    </View>
                    {/* Ẩn divider cho item cuối cùng của menu */}
                    {index < this.vehicleWithPrices.length - 1 && <View style={styles.divider} />}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.data.length !== 0 && <View style={{ flex: 1 }}>
                    <View
                        style={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottomColor: colors.colorMain,
                            borderBottomWidth: 2,
                            paddingVertical: 10,
                            paddingHorizontal: 15
                        }}
                    >
                        <Text
                            text={strings.taxi_price_title}
                            textStyle={{
                                color: colors.colorMain,
                                fontSize: 18
                            }}
                        />
                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Button
                        text={strings.btn_ok.toUpperCase()}
                        btnStyle={{
                            backgroundColor: colors.colorGrayLight
                        }}
                        textStyle={{
                            color: colors.colorBlackFull,
                            fontWeight: 'normal'
                        }}
                        onPress={this.props.onBtnOk}
                    />
                </View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    iconRight: {
        tintColor: colors.colorGrayLight,
        width: 18,
        height: 18
    },
    iconLeft: {
        borderColor: colors.colorBlackFull,
        borderWidth: 1,
        width: 36,
        height: 36,
        tintColor: null,
        marginVertical: 10,
        marginHorizontal: 5,

    },
    divider: {
        height: 1,
        backgroundColor: colors.colorGrayLight,
        marginTop: 5
    }
});