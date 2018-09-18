import * as React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

interface Props {
    isCheck?;
    size?;
    onPress?;
    color?;
    container?;
}

interface State {

}


export default class Radio extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            isCheck: this.props.isCheck
        }
    }

    // _setCheck = () => {
    //     this.setState({ isCheck: true }, this.props.onPress)
    // }

    render() {
        let outSize = this.props.size;
        let inSize = this.props.size * 2 / 3;
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View
                    style={[
                        {
                            width: outSize ? outSize : 24,
                            height: outSize ? outSize : 24,
                            borderColor: this.props.isCheck ? (this.props.color ? this.props.color : 'green') : '#333333',
                            borderWidth: 2,
                            borderRadius: outSize ? outSize / 2 : 24 / 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        this.props.container
                    ]}
                >
                    <View
                        style={{
                            width: inSize ? inSize : 14,
                            height: inSize ? inSize : 14,
                            borderRadius: inSize ? inSize / 2 : 14 / 2,
                            backgroundColor: this.props.isCheck ? (this.props.color ? this.props.color : 'green') : 'white'
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