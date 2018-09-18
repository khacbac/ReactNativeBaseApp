import * as React from "react";
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Text,
    Button,
} from '../../../../../module';
import ViewCarViewModel from "../../../../viewmodel/booking/viewcar/ViewCarViewModel";
import Constants from "../../../../constant/Constants";

import colors from '../../../../../res/colors';
import strings from "../../../../../res/strings";
import IWaitDriverView from "../../../../viewmodel/booking/viewcar/IWaitDriverView";

export interface Props {
    viewCarViewModel: ViewCarViewModel;
    message?: string;
}

interface State {
    message: string;
    isShowButton:boolean;
}

export default class WaitDriverView extends React.Component<Props, State> implements IWaitDriverView{

    private viewCarViewModel: ViewCarViewModel;

    constructor(props: Props) {
        super(props);
        this.viewCarViewModel = this.props.viewCarViewModel;
        //hiện thị thông báo
        let message = strings.book_receive_taxi_note_2;
        message = message.replace(Constants.STRING_ARGS, props.viewCarViewModel.getBookTaxiModel().company.reputation);

        this.state = {
            message: props.message || message,
            isShowButton:this.viewCarViewModel.getBookTaxiModel().isStart()
        }
    }

    componentDidMount() { }

    _cancelBook() {
        if (this.viewCarViewModel) {
            this.viewCarViewModel.askUserForCancel();
        }
    }

    public showButton(){
        this.setState({isShowButton:true});
    }

    public hideButton(){
        this.setState({isShowButton:false});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text
                    text={this.state.message}
                    textStyle={styles.txtWaitCar}
                />
                {this.state.isShowButton && (<View style={styles.btnContainer}>
                    <Button
                        text={strings.book_cancel_btn}
                        btnStyle={styles.btnCancel}
                        textStyle={{
                            color: colors.colorRed
                        }}
                        onPress={() => this._cancelBook()}
                    />
                    <View style={{ width: 10 }} />
                    <Button
                        text={strings.book_invite_meet_car_btn}
                        btnStyle={styles.btnBook}
                        textStyle={{
                            color: colors.colorGray
                        }}
                        disabled={true}
                        activeOpacity={1}
                    />
                </View>)}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhiteFull,
        padding: 10,
    },
    txtWaitCar: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 18
    },
    btnContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    btnCancel: {
        flex: 1,
        borderColor: colors.colorRed,
        borderWidth: 1,
        backgroundColor: colors.colorWhiteFull
    },
    btnBook: {
        flex: 1,
        borderColor: colors.colorGray,
        borderWidth: 1,
        backgroundColor: colors.colorWhiteFull
    }
});