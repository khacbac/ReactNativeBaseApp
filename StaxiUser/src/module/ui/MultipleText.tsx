import * as React from 'react';

import {
    View
} from 'react-native';
import { Text } from '..';

interface Props {
    container?;
}

interface State {
    childrens;
    container;
}

export default class MultipleText extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            childrens: [],
            container: this.props.container
        }
    }

    setContainerStyle(container) {
        this.setState({ container });
    }

    addText(texts) {
        this.setState({
            childrens: [...this.state.childrens, ...texts]
        })
    }

    render() {
        return (
            <View style={[{ flexDirection: 'row' }, this.state.container]}>
                {this.state.childrens.map(item => {
                    return <Text text={item.text} textStyle={item.textStyle} />
                })}
            </View>
        )
    }
}