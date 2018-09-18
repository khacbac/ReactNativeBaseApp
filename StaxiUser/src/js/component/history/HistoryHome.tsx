import * as React from "react";
import MenuHeader from '../../../module/ui/header/MenuHeader';
import strings from '../../../res/strings';

import {
    StyleSheet,
    SafeAreaView,
    View,
    SectionList
} from 'react-native';

import HistoryCell from './HistoryCell'
import colors from '../../../res/colors';
import { Text, Dialog, ToastModule } from '../../../module';
import ScreenName from '../../ScreenName';
import History from "../../sql/bo/History";
import { HttpView } from "../../../module";
import fonts from "../../../module/ui/res/dimen/fonts";
import dimensChild from "../../../res/dimens";
import LifeComponent from "../../../module/ui/LifeComponent";
import Presenter from "../../viewmodel/history/presenter/Presenter";
import IeHistory from "../../viewmodel/history/view/IeHistory";

export interface Props {
    navigation;
}

export interface State {
    list: Array<History>,
    sections: Array<any>,
    refreshing: boolean,
    emptyHistory: boolean,
}


class HistoryHome extends LifeComponent<any, any> implements IeHistory {

    private iePresenter: Presenter;

    private httpView: HttpView;

    constructor(props) {
        super(props);
        this.props.screenProps.mainNavigation.lockDrawer();
        this.iePresenter = new Presenter(this);

        this.state = {
            list: [],
            sections: [],
            refreshing: false,
            emptyHistory: false,
        };
    }

    componentDidMount() {
        super.componentDidMount()
    }

    /**
    * @Override
    */
    public setList(list: Array<History>): void {
        this.setState({ list })
    }

    /**
    * @Override
    */
    public setSections(sections: Array<any>): void {
        this.setState({ sections })
    }

    /**
    * @Override
    */
    public setRefresh(refreshing: boolean): void {
        this.setState({ refreshing })
    }

    /**
    * @Override
    */
    public setEmptyHistory(emptyHistory: boolean): void {
        this.setState({ emptyHistory: emptyHistory })
    }

    /**
    * @Override
    */
    public setMutipleState(state: any) {
        this.setState(state);
    }

    deleteItemHistory = (itemID) => {
        console.log("delete " , itemID);
        this.iePresenter.deleteItemHistory(itemID);
    }

    getDialog(): Dialog {
        return this.refs.dialog as Dialog;
    }

    notifyDeleteSuccess = () => {
        // this.getDialog().showToast(strings.history_delete_finish);
        ToastModule.show(strings.history_delete_finish);
    }

    notifyDeleteFail = () => {
        // this.getDialog().showToast(strings.history_delete_fail);
        ToastModule.show(strings.history_delete_error);
    }

    renderSeparator = () => {
        return <View style={{ height: dimensChild.history_margin_container, backgroundColor: colors.grayHeader }} />;
    };

    handleRefresh = () => {
        this.iePresenter.callToSynDataFromHTTP(this.state.list);
    };

    handleTouchingOnCell(item) {
        this.props.navigation.navigate(ScreenName.DETAIL_HISTORY, { data: item, deleteFunc: this.deleteItemHistory });
    }

    _renderItem = ({ item }) => {
        return <HistoryCell data={item} onPress={() => this.handleTouchingOnCell(item)} />
    }

    init(httpView) {

        if (this.httpView != null) return;

        this.httpView = httpView;

        this.doRequestHttpView();
    }

    public doRequestHttpView() {
        this.httpView.doRequestSimple(
            () => this.request(),
            (response) => this.reponse(response),
            (ex) => this.error(ex)
        );
    }

    private async request() {
        
        let res = await this.iePresenter.getLocalList();
        return res;
    }

    private reponse(res) {
        // console.log("response home ", res);
        if (res.length == 0) {
            //DB local trống thì chờ tiếp response từ server, nếu history trống thì sẽ thông báo sau.
            // this.setState({ emptyHistory: true })
        } else {
            this.iePresenter.localList = res;
            this.setMutipleState({
                list: res,
                sections: this.iePresenter.groupHistoryList(res),
                emptyHistory: false,
            });
        }
        this.iePresenter.callToSynDataFromHTTP(this.state.list);
    }

    private error(ex) {
        this.setState({emptyHistory: true});
        this.iePresenter.callToSynDataFromHTTP(this.state.list);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <MenuHeader
                    title={strings.home_history_title}
                    drawerOpen={() => {
                        // Mở khóa drawer khi về home.
                        this.props.screenProps.mainNavigation.unlockDrawer();
                        this.props.navigation.goBack();
                    }}
                    isBack
                />

                <HttpView style={{ flex: 1 }}
                    ref={(ref) => {
                        this.init(ref);
                    }}

                    alertNoResult={strings.history_not_booking}
                    alertError={strings.error_alert}
                    retryFunc={()=>this.doRequestHttpView()}
                >

                    {/* Text hiển thị trong trường hợp không có thông tin lịch sử nào */}
                    {this.state.emptyHistory ?
                        (<Text
                            textStyle={styles.emptyText}
                            text={strings.history_not_booking}
                        />)
                        :
                        (<SectionList
                            style={{ backgroundColor: colors.grayHeader }}
                            sections={this.state.sections}
                            renderItem={this._renderItem}
                            renderSectionHeader={({ section }) => <Text textStyle={styles.sectionHeader} text={section.title}></Text>}
                            keyExtractor={(_, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />)}
                </HttpView>

                <Dialog
                    onRequestClose={() => {
                        this.getDialog()._closeDialog();
                    }}
                    //title={"Thông báo trên dialog"}
                    title={null}
                    ref="dialog"
                    contentStyle={{ padding: 0 }}
                    topContainer={{ borderRadius: 0 }}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    // item: {
    //     padding: dimensChild.history_padding_bot_section_header,
    //     fontSize: 18,
    //     height: 44,
    // },
    sectionHeader: {
        paddingTop: dimensChild.history_padding_top_section_header,
        paddingLeft: dimensChild.history_padding_bot_section_header,
        paddingRight: dimensChild.history_padding_bot_section_header,
        paddingBottom: dimensChild.history_padding_bot_section_header,
        fontSize: fonts.sub_2,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: colors.grayHeader,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 56,
        paddingHorizontal: 8,
        color: colors.colorGrayDark
    }
});

export default HistoryHome;