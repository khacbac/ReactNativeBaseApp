import * as React from 'react';
import {
    View
} from 'react-native';
import strings from '../../../../res/strings';
import { Text } from '../../../../module';

export default class DiscountNews extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginTop:'40%'}}>
                <Text textStyle={{ fontSize: 15 }} text={strings.discount_empty_news}/>
            </View>
        );
    }
}