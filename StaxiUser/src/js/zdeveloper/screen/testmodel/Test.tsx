import * as React from 'react';

import {
    StyleSheet,
    SafeAreaView,
    View,
    Picker,
    Alert,
    ScrollView
} from 'react-native';
import {
    Text,
    Dialog,
    Button,
    TextInput,
    Image,
    Radio,
    CheckBox,
    CircleImage,
    HorizontalIconInput,
    HorizontalIconTextButton,
    MultipleText,
    UnitAlert,
    PairAlert,
    ToastModule,
    ViewState
} from '../../../../module';
import {
    SimpleDialog,
} from '../../../../module/ui/alert/Dialog';
import IMAGE from '../../../../res/images';
import RatingBar from '../../../../module/ui/RatingBar';
import Triplet from '../../../../module/ui/alert/Triplet';

interface Props {

}

interface State {
    visibleDialog: boolean,
    radio1: boolean,
    radio2: boolean,
    radio3: boolean,
    radio4: boolean
}

/**
 * Màn hình chính giới thiệu công ty
 * @author Đv Hiện
 * Created on 27/06/2018
 */
class TestBaseComponent extends React.Component<Props, State> {

    private dialog: Dialog;

    private ratingBar: RatingBar;


    private multipleText: MultipleText;

    constructor(props) {
        super(props);
        this.state = {
            visibleDialog: false,
            radio1: true,
            radio2: false,
            radio3: false,
            radio4: false
        }
    }

    _setCheckRadio1 = () => {
        this.setState({
            radio1: true,
            radio2: false,
            radio3: false,
            radio4: false
        })
    }

    _setCheckRadio2 = () => {
        this.setState({
            radio1: false,
            radio2: true,
            radio3: false,
            radio4: false
        })
    }

    _setCheckRadio3 = () => {
        this.setState({
            radio1: false,
            radio2: false,
            radio3: true,
            radio4: false
        })
    }

    _setCheckRadio4 = () => {
        this.setState({
            radio1: false,
            radio2: false,
            radio3: false,
            radio4: true
        })
    }

    _showRatingDetail = () => {
        // Alert.alert(`Count = ${this.ratingBar.getNumRating()} --- Status = ${this.ratingBar.getStaus()}`)
    }

    _onAddText = () => {
        let text = "HoKhacBac"
        this.multipleText.addText([
            {
                text: text.slice(0, 2),
                textStyle: { color: 'red' }
            },
            {
                text: text.slice(2, 6),
                textStyle: { color: 'green' }
            },
            {
                text: text.slice(6, 9),
                textStyle: { color: 'yellow' }
            }
        ])
    }

    _showUnitAlert = () => {
        // UnitAlert.get()
        //     .setTitle("Thong bao")
        //     .setMessage("Message")
        //     .setPositiveText("OK")
        //     .show();

        // PairAlert.get()
        //     .setTitle("Thong Bao")
        //     .setMessage("Hey i am facing issue with my react-native app . Application get blocked when it fetches data from an api .Do we have any workaround with that .that api fetching should not block the ui and touch event. ")
        //     .setNegativeText("Ok")
        //     .setPositiveText("Cancel")
        //     .show();

        Triplet.get()
            .setTitle("Thong Bao")
            .setMessage("Hey i am facing issue with my react-native app . Application get blocked when it fetches data from an api .Do we have any workaround with that .that api fetching should not block the ui and touch event.")
            .setNegativeText("Ok")
            .setNegativeVisible(ViewState.GONE)
            .setNegativePress(() => {
                ToastModule.show("Xac nhan");
            })
            .setPositiveText("Cancel")
            .setPositivePress(() => {
                ToastModule.show("Cancel");
            })
            .setAskMeText("Ask me")
            .show();
    }

    _showAlertDialog = () => {
        // UnitAlert.get()
        //     .setTitle("Thong bao")
        //     .setMessage("Message")
        //     .setPositiveText("OK")
        //     .showDialog(this.dialog)

        // PairAlert.get()
        //     .setTitle("Thong Bao")
        //     .setMessage("Hey i am facing issue with my react-native app . Application get blocked when it fetches data from an api .Do we have any workaround with that .that api fetching should not block the ui and touch event.")
        //     .setNegativeText("Ok")
        //     .setPositiveText("Cancel")
        //     .showDialog(this.dialog);

        Triplet.get()
            .isVerticle(true)
            .setTitle("Thong Bao")
            .setMessage("Hey i am facing issue with my react-native app . Application get blocked when it fetches data from an api .Do we have any workaround with that .that api fetching should not block the ui and touch event.")
            .setNegativeText("Ok")
            .setNegativeVisible(ViewState.VISIBLE)
            .setNegativePress(() => {
                ToastModule.show("OK");
            })
            .setPositiveText("Cancel")
            .setPositiveVisible(ViewState.VISIBLE)
            .setPositivePress(() => {
                ToastModule.show("Cancel");
            })
            .setAskMeText("Ask me")
            .setAskMeVisible(ViewState.VISIBLE)
            // .show()
            .showDialog(this.dialog);
            
    }

    render() {

        let text = "Ho Khac Bac";

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{ alignItems: 'center' }}>
                        <Text
                            text="Màn hình about"
                            textStyle={{
                                color: 'green'
                            }}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                text="Red = "
                                textStyle={{
                                    color: 'green'
                                }}
                            />

                            <Text
                                text="Green"
                                textStyle={{ color: 'red' }} />

                        </View>

                        <RatingBar
                            ref={ref => {
                                this.ratingBar = ref
                            }}
                            onRating={(count, status) => Alert.alert(`Count -> ${count}`)}
                        />

                        <Button
                            text="Rating detail"
                            onPress={this._showRatingDetail}
                        />

                        <MultipleText
                            ref={ref => {
                                this.multipleText = ref;
                            }}
                        />

                        <Button
                            text="Add Text"
                            onPress={this._onAddText}
                        />

                        <Button
                            text="Show Unit Alert"
                            onPress={this._showUnitAlert}
                        />

                        <Button
                            text="Show Unit Alert From Dialog"
                            onPress={this._showAlertDialog}
                        />

                        <HorizontalIconTextButton
                            text="Đăng nhập facebook"
                            border={1}
                            borderColor="red"
                            onPress={() => { Alert.alert("Đăng nhập thành công") }}
                            borderRadius={5}
                        />

                        <Button
                            btnStyle={{ marginTop: 10 }}
                            onPress={() => {
                                // this.dialog.showSimpleDialog("Dialog Test","OK");
                                // this.dialog.showWaitingDialog("Đang đồng bộ dữ liệu");
                                // this.dialog.showInputDialog("placeholder", "confirmText", () => { }, () => { });
                                // this.dialog.showToast("Toast from Test");

                                this.dialog._showDialog(

                                    <SimpleDialog
                                        contentText="Đây là thông báo hiển thị trên dialog Đây là thông báo hiển thị trên dialog"
                                        confirmText="Close dialog"
                                        onConfirm={() => this.dialog._closeDialog()}
                                    />, false
                                )

                                //     // <WaittingDialog text="Đang đồng bộ dữ liệu"/>

                                //     // <InputDialog
                                //     //     placeholder="Nhập thông tin"
                                //     //     confirmText="Xác nhận"
                                //     // />

                                //     // <Toast
                                //     //     text="Đăng nhập thành công"
                                //     // />, true
                                // );
                                // setTimeout(() => {
                                //     this.dialog._showDialog(
                                //         <Toast
                                //             text="Đăng nhập thành công"
                                //         />, true
                                //     );
                                // }, 2000)
                            }}
                            text='Open dialog'
                            borderRadius={0}
                        />

                        <Button
                            btnStyle={{ marginTop: 10 }}
                            onPress={() => {
                                // this.dialog.showDialogWaitRequestV2()
                            }}
                            text='Open Watting Dialog'
                            borderRadius={0}
                        />

                        <TextInput
                            placeholder="Nhập username"
                            inputContainer={{ marginTop: 10 }}
                            borderRadius={0}
                        />
                        <HorizontalIconInput
                            container={{ marginTop: 10 }}
                            value="Màn hình about"
                            placeholder="nhap thong tin user"
                            borderRadius={10}
                        />

                        <Image
                            source={IMAGE.ic_user_defatlt}
                            imgStyle={{ width: 50, height: 50, marginTop: 10 }}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CircleImage
                                source={IMAGE.ic_user_defatlt}
                                size={150}
                                imgStyle={{ marginTop: 10, marginRight: 10 }}
                                tintColor="pink"
                            />

                            <CircleImage
                                source={IMAGE.ic_user_defatlt}
                                size={100}
                                imgStyle={{ marginTop: 10, marginRight: 10 }}
                                tintColor="green"
                            />

                            <CircleImage
                                source={IMAGE.ic_user_defatlt}
                                size={50}
                                imgStyle={{ marginTop: 10, marginRight: 10 }}
                                tintColor="red"
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox
                                isCheck={false}
                                size={72}
                                color='red'
                                container={{ marginRight: 10 }}
                            />
                            <CheckBox
                                isCheck={true}
                                size={60}
                                color='black'
                                container={{ marginRight: 10 }}
                            />
                            <CheckBox
                                isCheck={false}
                                size={48}
                                color='pink'
                                container={{ marginRight: 10 }}
                            />
                            <CheckBox
                                isCheck={true}
                                size={36}
                                color='blue'
                                container={{ marginRight: 10 }}
                            />
                            <CheckBox
                                isCheck={false}
                                size={24}
                                container={{ marginRight: 10 }}
                            />
                        </View>

                        <View>
                            <Radio
                                color="green"
                                container={{ marginTop: 10 }}
                                isCheck={this.state.radio1}
                                onPress={this._setCheckRadio1} />
                            <Radio
                                color='pink'
                                container={{ marginTop: 10 }}
                                isCheck={this.state.radio2}
                                onPress={this._setCheckRadio2} />
                            <Radio
                                color='blue'
                                container={{ marginTop: 10 }}
                                isCheck={this.state.radio3}
                                onPress={this._setCheckRadio3} />
                            <Radio
                                color='red'
                                container={{ marginTop: 10 }}
                                isCheck={this.state.radio4}
                                onPress={this._setCheckRadio4} />
                        </View>

                    </View>
                </ScrollView>

                <Dialog
                    ref={ref => {
                        this.dialog = ref
                    }}
                    visible={this.state.visibleDialog}
                    onRequestClose={() => {
                        this.dialog._closeDialog();
                    }}
                    title={"Thông báo trên dialog"}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        // justifyContent: 'center'
    },
});

export default TestBaseComponent;