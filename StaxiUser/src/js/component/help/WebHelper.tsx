import * as React from "react";
import { WebView, View, ActivityIndicator } from "react-native";
import MenuHeader from "../../../module/ui/header/MenuHeader";
import strings from "../../../res/strings";
import colors from "../../../res/colors";
export interface Props {
    navigation: any
}

export interface State {
    waiting: boolean
}
class WebHelper extends React.Component<Props, State>{
    constructor(props){
        super(props);
        this.state = {waiting: true}
    }

    componentDidMount(){
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MenuHeader
                title={this.props.navigation.getParam('title', strings.home_help_title)}
                drawerOpen={()=>{this.props.navigation.goBack()}}
                isBack
                />
                
                {this.state.waiting && <ActivityIndicator size="large" color={colors.colorMain} />}
                <WebView
                source={{uri: this.props.navigation.getParam('uri', 'NO-URI')}}
                style={{marginTop:0}}
                onLoadEnd = {()=>{this.setState({waiting: false})}}
                />
            </View>
        )
    }
}

export default WebHelper;