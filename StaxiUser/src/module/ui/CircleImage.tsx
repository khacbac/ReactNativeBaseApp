import * as React from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import uicolors from './res/colors';


interface Props {
    source?;
    size?;
    tintColor?;
    imgStyle?;
    resizeMode?;
}

interface State {
    size?;
    tintColor?;
    source?;
}

export default class CircleImage extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size ? this.props.size : 24,
            tintColor: this.props.tintColor ? this.props.tintColor : uicolors.colorMain,
            source: this.props.source
        }
    }

    /* Show ảnh với url */
    public setImageReview(url: string): void {
        this.setState({
            source: { uri: url }
        })
    }

    /* Show ảnh với resID */
    public setImageRes(resId): void {
        this.setState({
            source: resId
        })
    }

    public setTintColor(tintColor): void {
        this.setState({
            tintColor: tintColor
        })
    }

    render() {
        return (
            <Image
                source={this.state.source}
                style={[
                    {
                        width: this.state.size,
                        height: this.state.size,
                        tintColor: this.state.tintColor,
                        borderRadius: this.state.size / 2
                    },
                    this.props.imgStyle
                ]}
                resizeMode={this.props.resizeMode ? this.props.resizeMode : 'cover'}
            />
        );
    }
}
