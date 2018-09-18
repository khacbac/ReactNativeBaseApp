import * as React from "react";

import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image
} from "react-native";
import images from "../../../../res/images";
import dimensChild from "../../res/dimens";
import { Text } from "../../../../module";
import fonts from "../../../../res/fonts";
import colors from "../../../../res/colors";
import { HistoryCellStyle } from "../../../../../../app/styles";


interface Props {
    onPress,
    data
}

interface State {

}

class HistoryCell extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={styles.root} onPress={this.props.onPress} >
                <View style={[styles.container, HistoryCellStyle.container]} >
                    <View style={[styles.headerContainer, HistoryCellStyle.headerContainer]} >
                        <Image
                            source={images.ic_history_time}
                            resizeMode='contain'
                            style={{ width: dimensChild.history_icon_time_width, height: dimensChild.history_icon_time_width }}
                        />
                        <Text textStyle={[styles.shortTime, HistoryCellStyle.shortTime]} text={this.props.data.shortTime} />
                        {/* State */}
                        <Text textStyle={[styles.statusTxt, HistoryCellStyle.statusTxt, { color: this.props.data.getStateColor() }]} text={this.props.data.getStatusString()}/>
                    </View>

                    <View style={[styles.contentContainer, HistoryCellStyle.contentContainer]} >
                        <View style={[styles.viewLeft, HistoryCellStyle.viewLeft]}>
                            <View style={[styles.dotFrom, HistoryCellStyle.dotFrom]} />
                            <View style={[styles.line, HistoryCellStyle.line]}/>
                            <View style={[styles.dotTo, HistoryCellStyle.dotTo]} />
                        </View>
                        <View style={[styles.viewRight, HistoryCellStyle.viewRight]}>
                            <Text textStyle={[styles.addressText, HistoryCellStyle.addressText, styles.fromAddressText, HistoryCellStyle.fromAddressText]} text={this.props.data.fromAddress} />
                            <Text textStyle={[styles.addressText, HistoryCellStyle.addressText]} text={this.props.data.getToAddress()} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        paddingVertical: 5
    },
    container: {
        backgroundColor: 'white',
        marginLeft: dimensChild.history_margin_container,
        marginRight: dimensChild.history_margin_container,
        shadowColor: colors.colorGray,
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: { height: 0, width: 0 },
        borderRadius:8
    },
    headerContainer: {
        width: '84%',
        flexDirection: 'row',
        paddingTop: dimensChild.history_padding_item_cell,
        paddingRight: dimensChild.history_padding_item_cell,
        paddingBottom: dimensChild.history_padding_item_cell,
        alignItems: 'center',
        alignSelf:'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.colorGrayLight,
    },
    contentContainer: {
        flexDirection: 'row',
        paddingVertical: dimensChild.history_padding_item_cell,
    },
    viewLeft: {
        width: '10%',
        justifyContent:'center',
        paddingVertical: 15
    },

    viewRight: {
        width:'90%',
        paddingVertical:10
    },
    shortTime: {
        color: 'black',
        flex: 3,
        fontWeight: 'bold',
        fontSize: fonts.caption
    },
    statusTxt: {
        flex: 3,
        fontWeight: 'bold',
        fontSize: fonts.caption,
        textAlign: 'right',
        marginRight: 0
    },
    line: {
        backgroundColor: colors.colorMain,
        flex:1,
        width:1,
        marginVertical:3,
        alignSelf:'center'
    },
    dotTo: {
        backgroundColor: colors.colorSub,
        width: dimensChild.history_point_width,
        height: dimensChild.history_point_width,
        borderRadius: dimensChild.history_point_width_corner,
        alignSelf: 'center'
    },
    dotFrom: {
        backgroundColor: colors.colorMain,
        width: dimensChild.history_point_width,
        height: dimensChild.history_point_width,
        borderRadius: dimensChild.history_point_width_corner,
        alignSelf: 'center'
    },
    addressText: {
        color: 'black', flex: 15, fontSize: fonts.sub_2, marginRight: "5%"
    },
    fromAddressText: {
        marginBottom: 10
    }

});

export default HistoryCell;