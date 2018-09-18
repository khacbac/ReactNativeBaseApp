import * as React from "react";

import {
    StyleSheet,
    SafeAreaView,
    View,
    FlatList
} from 'react-native';
import MenuHeader from '../../../module/ui/header/MenuHeader';
import strings from '../../../res/strings';
import HelperRes from './HelperRes';
import { getHelper } from './HelpModelView';
import HelpItem from './HelpItem';
import { Text, ToastModule, HttpView } from '../../../module';
import ScreenName from '../../ScreenName';
import Language from "../../../module/model/Language";
import MainNavigator from "../../MainNavigation";
import fonts from "../../../module/ui/res/dimen/fonts";
import SessionStore from "../../Session";

export interface State {
    dataHelp: [HelperRes];
    // emptyData: boolean;
}

export interface Props {
    navigation: any;
    screenProps;
}

class HelpHome extends React.Component<Props, State> {

    private mainNavigation: MainNavigator;
    private httpView: HttpView;

    constructor(props) {
        super(props);

        this.mainNavigation = this.props.screenProps.mainNavigation;

        this.state = { dataHelp: null}
    }


    componentDidMount() {
    }


    init(httpView) {

        if (this.httpView != null) return;

        this.httpView = httpView;

        this.doRequestHttpView();
    }

    public doRequestHttpView(){
        this.httpView.doRequest(
            () => this.request(),
            (response) => this.reponse(response),
            (ex) => this.error(ex)
        );
    }

    private async request() {
        
        let res = await getHelper();
        return res;
    }

    private reponse(ret) {
        
        if (ret.length > 0) {
            this.setState({ dataHelp: ret });
        } else {
            this.setState({ dataHelp: ret });
        }
    }

    private error(ex) {
        ToastModule.show(strings.feedback_fail);
    }

    openWebView(item) {
        if (SessionStore.language == Language.EN) {
            this.props.navigation.navigate(ScreenName.WEBHELPER, { uri: item.LinkEN.value, title: item.TitleEN.value });
        } else {
            this.props.navigation.navigate(ScreenName.WEBHELPER, { uri: item.LinkVI.value, title: item.TitleVI.value });
        }
    }

    render() {
        let content;
        // if (this.state.emptyData) {

        //     content = <Text text={strings.help_manager_warrning} textStyle={styles.text_warning} />

        // } else {
            content = <FlatList style={{ marginTop: 0 }}
                data={this.state.dataHelp}
                renderItem={
                    ({ item }) => <HelpItem data={item} onPress={() => this.openWebView(item)} />
                }
            />
        // }
        return (
            <SafeAreaView style={styles.container}>
                <MenuHeader
                    title={strings.home_help_title}
                    drawerOpen={() => {
                        // Mở khóa drawer khi về home.
                        this.mainNavigation.unlockDrawer();
                        this.props.navigation.goBack();
                    }}
                    isBack />
                <HttpView style={{ flex: 1 }}
                    ref={(ref) => {
                        this.init(ref);
                    }}

                    alertNoResult={strings.help_manager_warrning}
                    alertError={strings.error_alert}
                    retryFunc= {()=>this.doRequestHttpView()}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                        {content}


                    </View>
                </HttpView>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    text_warning: {
        fontSize: fonts.body_2,
        textAlign: 'center'
    }
});

export default HelpHome;