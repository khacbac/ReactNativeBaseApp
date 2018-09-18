import React,{Component} from 'react';

import {
    StyleSheet,
    SafeAreaView,
    View,
    Text
} from 'react-native';

/**
 * Màn hình chính chức năng tin tức
 * @author Đv Hiện
 * Created on 27/06/2018
 */
class ArticleHome extends Component {
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <View>
                    <Text>
                        Màn hình thông báo
                    </Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default ArticleHome;