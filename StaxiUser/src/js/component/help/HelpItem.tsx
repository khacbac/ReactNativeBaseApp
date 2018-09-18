import * as React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Image } from "../../../module";
import colors from "../../../res/colors";
import images from "../../../res/images";
import HelperRes from './HelperRes';
import Language from "../../../module/model/Language";
import fonts from "../../../module/ui/res/dimen/fonts";
import dimens from "../../../res/dimens";
import SessionStore from "../../Session";
export interface State {
}
export interface Props {
    // navigation: any;
    onPress: any;
    data: HelperRes;
}

class HelpItem extends React.Component <Props, State>{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <TouchableOpacity style = {styles.touchable} onPress={this.props.onPress}>
                <View style={styles.content}>
                    <View style={styles.dotContain}>
                        <View style={styles.dot} />
                    </View>
                    <Text text={SessionStore.language == Language.EN? this.props.data.TitleEN.value: this.props.data.TitleVI.value} textStyle={styles.title}/>
                    <Image source={images.ic_arrow_right} imgStyle={styles.arrow}/>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    touchable:{
        backgroundColor: 'white',
        height: 50,
        justifyContent: 'center'
    },
    content:{
        flexDirection: 'row',
    },
    dotContain:{
        flex:0.5,
        justifyContent: 'center'
    },
    dot:{
        backgroundColor:colors.colorMain,
        borderRadius: 5,
        width: 10,
        height: 10,
        marginLeft: dimens.help_item_dot_margin_left,
        alignSelf:'center',
    },
    title:{
        fontSize: fonts.body_2,
        color: 'black',
        paddingLeft: dimens.help_item_title_padding_left,
        flex:4
    },
    arrow:{
        width: 12,
        height: 12,
        marginRight: "5%",
    },
    line:{
        backgroundColor: colors.colorGrayLight,
        width: '90%',
        alignSelf:'center',
        height:1,
        position:'absolute',
        bottom: 0
    }
});

export default HelpItem;