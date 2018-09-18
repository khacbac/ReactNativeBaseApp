import * as React from "react";
import images from '../../../res/images';

import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image
} from "react-native";

import {
    Text,
} from '../../../module';

import colors from "../../../res/colors";
import fonts from "../../../module/ui/res/dimen/fonts";
import dimensChild from "../../../res/dimens";

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
            <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPress} >
                <View style={styles.container} >
                    <View style={styles.headerContainer} >
                        <Image
                            source={images.ic_history_time}
                            resizeMode='contain'
                            style={{ width: dimensChild.history_icon_time_width, height: dimensChild.history_icon_time_width }}
                        />
                        <Text textStyle={styles.shortTime}>
                            {this.props.data.shortTime}
                        </Text>
                        {/* State */}
                        <Text style={[styles.statusTxt, { color: this.props.data.getStateColor() }]}>
                            {this.props.data.getStatusString()}
                        </Text>
                    </View>

                    <View style={styles.contentContainer} >
                        <View style={styles.contentChild} >
                            <View style={styles.dotFrom} />

                            <Text style={{ color: 'black', flex: 15, fontSize: fonts.sub_2, }}>
                                {this.props.data.fromAddress}
                            </Text>
                        </View>
                        <View style={styles.contentChild} >
                            <View style={styles.dotTo} />

                            <Text style={{ color: 'black', flex: 15, fontSize: fonts.sub_2, }}>
                                {this.props.data.getToAddress()}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginLeft: dimensChild.history_margin_container,
        marginRight: dimensChild.history_margin_container
    },
    headerContainer: {
        flexDirection: 'row',
        paddingTop: dimensChild.history_padding_item_cell,
        paddingRight: dimensChild.history_padding_item_cell,
        paddingBottom: dimensChild.history_padding_item_cell,
        // backgroundColor: 'grey',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'column',
        paddingBottom: dimensChild.history_padding_item_cell,
    },
    shortTime: {
        color: 'black',
        flex: 7,
        fontWeight: 'bold',
        fontSize: fonts.caption
    },
    statusTxt: {
        flex: 3,
        fontWeight: 'bold',
        fontSize: fonts.caption,
        textAlign: 'right',
        // marginRight: 10
    },
    contentChild: {
        flexDirection: 'row',
        paddingTop: dimensChild.history_padding_item_cell,
        paddingLeft: dimensChild.history_padding_left_item_cell,
        paddingRight: dimensChild.history_padding_item_cell,
        paddingBottom: dimensChild.history_padding_item_cell,
        // backgroundColor: 'red',
        justifyContent: 'center',
    },
    dotTo: {
        backgroundColor: colors.colorMain,
        width: dimensChild.history_point_width,
        height: dimensChild.history_point_width,
        borderRadius: dimensChild.history_point_width_corner,
        alignSelf: 'center',
        marginRight: dimensChild.history_padding_item_point,
    },
    dotFrom: {
        backgroundColor: colors.colorSub,
        width: dimensChild.history_point_width,
        height: dimensChild.history_point_width,
        borderRadius: dimensChild.history_point_width_corner,
        alignSelf: 'center',
        marginRight: dimensChild.history_padding_item_point,
    },

    fromAddres: {
        color: 'black', flex: 15
    },
    toAddress: {
        flex: 15
    },

});

export default HistoryCell;