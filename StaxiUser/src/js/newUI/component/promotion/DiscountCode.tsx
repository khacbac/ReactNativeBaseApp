import * as React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { HttpView, Utils, Text, UserUtils } from '../../../../module';
import Constants from '../../../constant/Constants';
import strings from '../../../../res/strings';
import colors from '../../res/colors';
import dimens from '../../res/dimens';
import fonts from '../../res/fonts';
import PromotionCode from '../../../viewmodel/promotions/PromotionCode';
import { getPromotions } from '../../../viewmodel/promotions/PromotionModelView';

export interface State {
    promotions: Array<PromotionCode>;
    // stateData: StateData;
}

export interface Props {
    navigation?: any;
    onKMValue?: any;
    useForDialog?: any;
    promotions?: Array<PromotionCode>;
    // stateData?: StateData;
}
enum StateDiscount { Disable, Used, Enable }

export default class DiscountCode extends React.Component<Props, State> {
    private httpView: HttpView;
    constructor(props) {
        super(props);
        this.state = {
            promotions: null,
            // stateData: StateData.EmptyData,
        };
    }
    init(httpView) {

        if (this.httpView != null) return;

        this.httpView = httpView;

        this.doRequestHttpView();
    }

    public doRequestHttpView(){
        this.httpView.doRequest(
            () => this.request(),
            (response) => this.reponse(response),
            (ex) => this.error(ex)
        );
    }

    // cập nhật danh sách mã khuyến mại.
    updatePromotions = (promotions: Array<PromotionCode>) => {
        this.setState({
            promotions: promotions,
            // stateData: stateData
        });
    }

    private async request() {

        let res = await getPromotions();
        return res;
    }

    private reponse(ret) {
        if (ret.length > 0) {
            !this.props.useForDialog && this.updatePromotions(ret);
        }
    }

    private error(ex) {
    }

    componentDidMount() {
    }

    convertLongToDate(time) {
        return Utils.formatDateTime(time * 1000, "dd-MM-yyyy")
    }

    _renderItem = ({ item }) => {
        let timeEnd = item.timeEnd.value;
        var state: StateDiscount = StateDiscount.Enable;
        if (timeEnd > 0 && timeEnd * 1000 - Constants.DELTA_TIME_SERVER < Date.now()) {
            state = StateDiscount.Disable;
        } else if (item.isUsed.value) {
            state = StateDiscount.Used;
        } else {
            state = StateDiscount.Enable;
        }
        
        // Trạng thái của mã khuyến mại.
        var stateLB: string = "";
        // Màu nền header.
        var colorHeader: string = "";
        // Màu background text trạng thái.
        var colorBGStatus: string = "";
        // Màu code.
        var colorCode: string = "";
        //màu tiền
        var colorMoney: string = "";

        switch (state) {
            //trạng thái đã sử dụng
            case StateDiscount.Used:
                stateLB = strings.sales_item_used;
                colorHeader = colors.promotion_item_header_used_color;
                colorBGStatus = colors.promotion_item_used_color;
                colorCode = colors.promotion_item_used_color;
                colorMoney = colorCode;
                break;
            //trạng thái không khả dụng
            case StateDiscount.Disable:
                stateLB = strings.sales_item_fulltime
                colorHeader = colors.promotion_item_header_timeend_color;
                colorBGStatus = colors.promotion_item_timeend_color;
                colorCode = colors.promotion_item_timeend_color;
                colorMoney = colorCode;
                break;
            // trạng thái khả dụng
            case StateDiscount.Enable:
                stateLB = strings.sales_item_availability;
                colorHeader = colors.promotion_item_header_color;
                colorBGStatus = colors.promotion_item_divider_color;
                colorCode = colors.promotion_item_divider_color;
                colorMoney = colors.colorRed;
                break;
            default:
                break
        }

        return (
            <View style={[styles.container, { borderColor: colorBGStatus }]} >
                <View style={[styles.hdcontainer, { backgroundColor: colorHeader }]}>
                    <Text textStyle={styles.hdtitle} text={item.name.value}></Text>
                    <Text textStyle={[styles.hdstatus, { backgroundColor: colorBGStatus }]} text={stateLB}></Text>
                </View>
                <TouchableOpacity
                    disabled={this.props.useForDialog ? false : true}
                    style={styles.content}
                    onPress={() => this.props.onKMValue(item.code.value)}>
                    <View style={[styles.makmContainer, { borderRightColor: colorHeader }]}>
                        <Text textStyle={[styles.txtma, { color: colorCode }]} text={item.code.value}></Text>
                    </View>
                    <View style={styles.infocontent}>
                        <View style={styles.money}>
                            <Text textStyle={styles.firstinfo} text={strings.sales_item_money + ": "} />
                            <Text textStyle={[styles.price, {color: colorMoney}]} text={UserUtils.formatMoney(item.money.value) + " đ"} />
                        </View>
                        {
                            item.timeEnd.value == 0 ?
                                <Text textStyle={styles.secondinfo} text={strings.sales_item_des_availability} />
                                : (
                                    item.timeEnd.value >= Date.now()
                                        ? <Text textStyle={styles.secondinfo} text={strings.sales_item_fulltime} />
                                        :
                                        <Text textStyle={styles.secondinfo} text={(strings.sales_item_timer + " " + this.convertLongToDate(item.timeEnd.value))} />
                                )
                        }
                        <Text textStyle={styles.thirdinfo} text={item.count.value == 1 ? strings.discount_warn_once : ""} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let content;
        // if (this.state.stateData == StateData.EmptyData) {
        //     content = <Text textStyle={{ textAlign: 'center', fontSize: fonts.body_1 }} text={strings.discount_empty_codes}></Text>
        // } else {
            content = this.state.promotions && this.state.promotions.length > 0 &&
                <FlatList
                    data={this.state.promotions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                />
        // }
        return (
            <HttpView style={{ containner: {flex: 1}, color: colors.colorMain }}
                ref={(ref) => {
                    this.init(ref);
                }}

            alertNoResult={strings.discount_empty_codes}
            alertError={strings.error_alert}
            retryFunc={()=>this.doRequestHttpView()}>
                <View style={styles.rootContainer}>
                    {content}
                </View>
            </HttpView>
        );
    }

}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        width: "96%",
        alignSelf: 'center',
        borderColor: '#297FC8',
        borderWidth: 1,
        marginTop: dimens.promotion_item_padding,
        backgroundColor: colors.colorWhiteFull,
        borderRadius: 8,
        shadowColor: colors.colorGray,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: { height: 0, width: 0 },
        marginVertical: 5
    },
    hdcontainer: {
        backgroundColor: '#a2e0ff',
        flexDirection: 'row',
        padding: dimens.register_margin_txtPhone,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8
    },
    hdtitle: {
        flex: 1,
        color: 'black'
    },
    hdstatus: {
        color: 'white',
        fontSize: fonts.caption,
        backgroundColor: '#297FC8',
        padding: dimens.promotion_item_padding_status
    },
    content: {
        // backgroundColor: 'white',
        flexDirection: 'row'
    },
    makmContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: dimens.promotion_padding_title,
        borderRightColor: '#297FC8',
        borderRightWidth: 1
    },
    txtma: {
        color: '#297FC8',
        fontSize: fonts.h6_20,
        fontWeight: 'bold',
    },
    infocontent: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    money: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstinfo: {
        color: 'black',
        fontSize: fonts.body_1
    },
    price: {
        color: 'red',
        fontSize: fonts.body_1,
        fontWeight: 'bold'
    },
    secondinfo: {
        color: 'black',
        fontSize: 13,
        marginBottom: dimens.promotion_item_padding_status,
    },
    thirdinfo: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.colorGray
    }
});