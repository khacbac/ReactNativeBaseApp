import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Modal,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import { SQLiteUtils } from "react-native-ba-libs";

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tables: [],
        }
    }

    componentDidMount() {
        this.getTableNames();
    }

    getTableNames = () => {
        SQLiteUtils.executeSql(`SELECT * FROM sqlite_master WHERE type='table'`)
            .then((success) => {
                const item = [];
                for (let i = 0; i < success.rows.length; i++) {
                    item.push(success.rows.item(i));
                }
                this.setState({ tables: item });
                console.log("List table = ", item)
            })
            .catch((err) => {

            })
    }

    _renderItem = ({ item }) => {
        const name = item.name;
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("TableInfo", { tablename: name });

            }}>
                <Text style={{
                    color: 'black',
                    padding: 15,
                    fontSize: 18
                }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.tables}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.name}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: 1, backgroundColor: 'grey' }} />
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});