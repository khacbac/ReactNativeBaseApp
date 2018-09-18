import * as React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import uiimages from './res/drawable/images';
import uicolors from './res/colors';
import uidimens from './res/dimen/dimens';
import uifonts from './res/dimen/fonts';

import Text from './Text';

interface Props {
    icon?: any;
    iconStyle?: any;
    disabled?: boolean;
    onPress?;
    rootStyle?;
    borderRadius?;
    border?;
    borderColor?;
    container?;
    textStyle?;
    text?: string;
    visible?: boolean;
    numberOfLines?;
    ellipsizeMode?;
};

interface State {
    icon?;
    text?;
    visible?;
    txtColor?;
    textStyle?;
};

export default class HorizontalIconTextButton extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            icon: this.props.icon || uiimages.ic_user_defatlt,
            text: this.props.text || "",
            textStyle: this.props.textStyle,
            visible: this.props.visible !== undefined ? this.props.visible : true
        }
    }

    setIcon(icon) {
        this.setState({
            icon: icon,
        })
    }

    setText(text) {
        this.setState({ text })
    }

    setTextStyle(textStyle) {
        this.setState({ textStyle })
    }

    getText() {
        return this.state.text;
    }

    setVisibility(visible) {
        this.setState({ visible })
    }

    render() {
        return (
            <TouchableOpacity
                disabled={this.props.disabled}
                onPress={this.props.onPress}
                style={[{ flexDirection: 'row', flex: 1, }, this.props.rootStyle]}>
                {this.state.visible && <View
                    style={[
                        styles.container,
                        {
                            borderRadius: this.props.borderRadius,
                            borderWidth: this.props.border ? this.props.border : 0,
                            borderColor: this.props.borderColor ? this.props.borderColor : uicolors.colorBlackFull
                        },
                        this.props.container
                    ]}>
                    <Image
                        style={[
                            styles.icon,
                            this.props.iconStyle,
                        ]}
                        source={this.state.icon} />
                    <Text
                        textStyle={[
                            styles.text,
                            this.state.textStyle
                        ]}
                        ellipsizeMode={this.props.ellipsizeMode}
                        numberOfLines={this.props.numberOfLines}
                        text={this.state.text} />
                </View>}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: uidimens.padding_verhicle_text_input,
        flex: 1,
        backgroundColor: uicolors.colorMain,
        alignItems: 'center',
        borderWidth: 0,
        // borderBottomWidth: dimens.divider,
        // borderBottomColor: COLOR.colorGrayLight,
        height: uidimens.height_horizontal_icon_input,
    },
    icon: {
        width: uidimens.size_icon_input,
        height: uidimens.size_icon_input,
        marginHorizontal: uidimens.margin_horizontal_icon_input,
        // tintColor: COLOR.colorWhiteFull
    },
    text: {
        paddingHorizontal: uidimens.padding_right_icon_input,
        color: uicolors.colorWhiteFull,
        fontSize: uifonts.text_size,
        flex: 1
    }
});


// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         borderWidth: 0,
//         borderBottomWidth: dimens.divider,
//         borderBottomColor: COLOR.colorGrayLight,
//         height: dimens.height_horizontal_icon_input,
//         alignItems: 'center',
//         // backgroundColor: 'red',
//     },
//     icon: {
//         width: dimens.size_icon_input,
//         height: dimens.size_icon_input,
//         marginHorizontal: dimens.margin_horizontal_icon_input,
//         tintColor: COLOR.colorMain
//     },
//     input: {
//         paddingHorizontal: dimens.padding_right_icon_input,
//         flex: 1,
//         color: COLOR.colorBlackFull,
//         fontSize: fonts.text_size,
//         fontFamily: 'System',
//     }

// });