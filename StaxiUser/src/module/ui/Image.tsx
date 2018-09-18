import * as React from 'react';
import {
    StyleSheet,
    Image
} from 'react-native';
import uicolors from './res/colors';
import uidimens from './res/dimen/dimens';

interface Props {
    source?;
    imgStyle?;
    resizeMode?;
}

interface State {

}

export default class CusImage extends React.Component<Props, State> {
    render() {
        return (
            <Image
                source={this.props.source}
                style={[
                    styles.image,
                    this.props.imgStyle
                ]}
                resizeMode={this.props.resizeMode}

            />
        );
    }
}


const styles = StyleSheet.create({
    image: {
        width: uidimens.size_icon_input,
        height: uidimens.size_icon_input,
        tintColor: uicolors.colorMain
    },
});