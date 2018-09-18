import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { SQLiteUtils } from '../../../../module';
// import * as SQLiteUtils from "react-native-ba-libs";
// import { STRING, COLOR } from 'res/values';
// import ViewWithHeader from './../../../../js/toolbar/ViewWithHeader';


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tablesInfos: [],
            name: this.props.navigation.getParam('tablename')
        }
    }

    componentDidMount() {
        this.getInfoTable(this.state.name);
    }

    getInfoTable = (tablename) => {
        SQLiteUtils.executeSql(`SELECT * FROM ${tablename}`)
            .then((success) => {
                const item = [];
                for (let i = 0; i < success.rows.length; i++) {
                    item.push(success.rows.item(i));
                }
                console.log("table info == ", item);
                this.setState({
                    tablesInfos: item
                })
            })
            .catch((err) => {

            })
    }


    _renderItemInfo = ({ item }) => {
        console.log("_renderItemInfo === ", Object.values(item));
        let index = 0;
        return (
            <View style={{ flexDirection: 'row' }}>

                {Object.values(item).map(row => {
                    index++;
                    return (
                        <Text
                            key={"item" + index}
                            style={[styles.text, { color: row ? 'black' : 'grey' }]}
                        >
                            {row ? row : "null"}
                        </Text>
                    )

                })}
            </View>
        )
    }

    render() {
        let index = 0;
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this.state.tablesInfos.length > 0 &&
                        <ScrollView horizontal>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    {Object.keys(this.state.tablesInfos[0]).map(item => {
                                        index++;
                                        return (
                                            <Text
                                                key={"item" + index}
                                                style={[styles.text, { color: "green", borderBottomWidth: 1 }]}
                                            >
                                                {item}
                                            </Text>
                                        )
                                    })}
                                </View>

                                <FlatList
                                    data={this.state.tablesInfos}
                                    renderItem={this._renderItemInfo}
                                    keyExtractor={(item, index) => "" + index}
                                    ItemSeparatorComponent={() => {
                                        return <View style={{ height: 1, backgroundColor: 'grey' }} />
                                    }} />
                            </View>

                        </ScrollView>}
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        width: 80,
        padding: 10,
        borderRightWidth: 0.5,
        borderColor: 'black',
        textAlign: 'center',
    }
});