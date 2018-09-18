import * as React from 'react';
import { Image } from '..';
import {
    View,
    TouchableOpacity
} from 'react-native';
import uiimages from './res/drawable/images';
import uicolors from './res/colors';

interface Props {
    onPress?;
    btnStyle?;
    imgStyle?;
}

interface State {
    btnStyle;
    imgStyle;
    source;
}

export default class ButtonIconOnMap extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            btnStyle: this.props.btnStyle,
            imgStyle: this.props.imgStyle,
            source: uiimages.ic_my_location
        }
    }

    setImageResource(img, imgStyle?) {
        this.setState({
            source: img,
            imgStyle: imgStyle ? imgStyle : {}
        })
    }

    setBtnStyle(btnStyle) {
        this.setState({
            btnStyle: btnStyle
        })
    }


    render() {
        return (
            <View>
                <TouchableOpacity
                    style={[{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "white",
                        borderColor: uicolors.colorGray,
                        marginBottom: 12,
                        marginRight: 12,
                        alignItems: "center",
                        justifyContent: "center"
                    }, this.state.btnStyle]}
                    onPress={this.props.onPress}
                >
                    <Image
                        source={this.state.source}
                        resizeMode="contain"
                        imgStyle={[{
                            width: 28,
                            height: 28,
                            padding: 8,
                            tintColor: uicolors.colorGray
                        }, this.state.imgStyle]}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}