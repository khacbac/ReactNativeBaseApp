import * as React from 'react';

import {
    TouchableOpacity,
    StatusBar,
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";

import color from '../../../res/colors';
import images from "../../../res/images";
import dimens from "../res/dimen/dimens";
import fonts from "../res/dimen/fonts"

interface Props {
    drawerBack?: Function;
    drawerEdit?: Function;
    title?: string;
    imgSource?;
}

interface State {

}

/**
 * Component header back
 * @author ĐvHiện
 * Created on 05/06/2018
 */
class BackHeaderWithEdit extends React.Component<Props, State> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ width: '100%' }}>
                {/* <StatusBar
                    barStyle='light-content'
                    androidStatusBarColor={color.colorMain}
                    backgroundColor={color.colorMain}
                /> */}
                <View style={{ width: '100%', padding: dimens.padding_back_header, backgroundColor: color.colorMain, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.props.drawerBack()}>
                        <Image
                            source={images.ic_arrow_back}
                            resizeMode='contain'
                            style={{ width: dimens.size_icon_back_header, height: dimens.size_icon_back_header, tintColor: color.colorWhiteFull }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: fonts.text_size, padding: dimens.padding_back_header, fontWeight: 'bold', flex: 1, }}>
                        {this.props.title}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.props.drawerEdit()}>
                        <Image
                            source={this.props.imgSource}
                            resizeMode='contain'
                            style={{ width: dimens.size_icon_back_header, height: dimens.size_icon_back_header, tintColor: color.colorWhiteFull}} />
                    </TouchableOpacity>
                    {/* <Right /> */}
                </View>
            </View>
        );
    }
}


export default BackHeaderWithEdit;