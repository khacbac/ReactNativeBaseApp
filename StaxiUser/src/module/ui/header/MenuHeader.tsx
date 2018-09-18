import * as React from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    StatusBar, 
    View,
    Text,
    Image,
	StyleProp,
	ViewStyle
} from "react-native";

import color from '../../../res/colors';
import images from "../../../res/images";
import dimens from "../res/dimen/dimens";
import fonts from "../res/dimen/fonts"

interface Props {
    drawerOpen?: Function;
    pressRightBT?: Function;
    isBack?: boolean;
    title?: string;
    inputStyle?;
	imgRightBT?;
	style?: StyleProp<ViewStyle>;
}

interface State {

}


class MenuHeader extends React.Component<Props, State> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View
				style={[{
					width: '100%',
					padding: dimens.padding_back_header,
					backgroundColor: color.colorMain,
					flexDirection: 'row',
					alignItems: 'center',
				}, this.props.style]}
			>
				{/* <StatusBar
                    barStyle='light-content'
                    androidStatusBarColor={color.colorMain}
                    backgroundColor={color.colorMain}
                /> */}
				<TouchableOpacity onPress={() => this.props.drawerOpen()}>
					<Image
						source={this.props.isBack ? images.ic_arrow_back : images.ic_menu}
						resizeMode="contain"
						style={{ width: dimens.size_icon_back_header, height: dimens.size_icon_back_header }}
					/>
				</TouchableOpacity>
				<Text style={[styles.input, this.props.inputStyle]}>{this.props.title}</Text>
				<TouchableOpacity onPress={() => this.props.pressRightBT()}>
					<Image
						source={this.props.imgRightBT}
						resizeMode="contain"
						style={{ width: dimens.size_icon_right_header, height: dimens.size_icon_right_header }}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
    input: {
        color: 'white',
        fontSize: fonts.text_size,
        padding: dimens.padding_back_header,
        fontWeight: 'bold',
        flex:1
    },
});

export default MenuHeader;