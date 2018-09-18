import * as React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import uiimages from './res/drawable/images';
import uidimens from './res/dimen/dimens';
import uicolors from './res/colors';

interface Props {
    isCheck?;
    container?;
    size?;
    color?;
    viewStyle?;
}

interface State {
    isCheck?;
}

export default class CheckBox extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            // bgColor: 'white',
            isCheck: this.props.isCheck
        }
    }

    toggleCheckBox = () => {
        this.setState({
            // bgColor: this.state.bgColor === 'white' ? 'green' : 'white',
            isCheck: !this.state.isCheck
        })
    }

    isCheck = () => {
        return this.state.isCheck
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.toggleCheckBox}
                style={this.props.container}
            >
                <View
                style={[{ width: this.props.size ? this.props.size : uidimens.cbx_size_icon_input,
                    height: this.props.size ? this.props.size : uidimens.cbx_size_icon_input,
                    borderColor: this.props.color ? this.props.color : uicolors.colorMain,
                    borderWidth: uidimens.border_width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: this.state.isCheck ? (this.props.color ? this.props.color : uicolors.colorMain) : uicolors.colorWhiteFull}, , this.props.viewStyle]}
                >
                    <Image
                        source={uiimages.tick}
                        style={{
                            width: this.props.size ? this.props.size : uidimens.cbx_size_icon_input,
                            height: this.props.size ? this.props.size : uidimens.cbx_size_icon_input,
                            tintColor: uicolors.colorWhiteFull
                        }}
                    />
                </View>
            </TouchableOpacity>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});