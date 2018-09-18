// DIALOG CUSTOM //
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { MenuHeader, TextInput, Button } from '../../../../module';
import strings from '../../../../res/strings';
import dimens from '../../../../res/dimens';
import colors from '../../../../res/colors';
import fonts from '../../../../res/fonts';

interface Props {
    onBack?: Function,
    onCancel?: Function,
    onConfirm?: Function;
    value?;
}

interface State {
    value: string
}

export default class ConfirmNotesFragment extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    public static create(onBack, onCancel, onConfirm, value) {
        return <ConfirmNotesFragment
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={value => onConfirm(value)}
            value={value}
        />
    }

    render() {
        return (
            <View style={{ width: '100%' }}>
                <MenuHeader
                    title={strings.book_notes_title}
                    isBack
                    drawerOpen={this.props.onBack}
                />

                <View style={{
                    paddingLeft: dimens.promotion_padding_title,
                    paddingRight: dimens.promotion_padding_title,
                    paddingBottom: dimens.promotion_padding_title,
                    paddingTop: dimens.confirm_note_padding_top_title
                }}>

                    <Text style={{
                        color: colors.colorBlackFull,
                        textAlign: 'center',
                        fontSize: fonts.body_1,
                        width: '100%'
                    }}>{strings.book_notes_description}</Text>

                    <TextInput
                        placeholder={strings.book_notes_hint_input}
                        inputContainer={{
                            marginTop: dimens.confirm_note_margin_top_btn,

                        }}
                        inputStyle={{
                            textAlignVertical: 'top',
                            borderWidth: dimens.border_width,
                            paddingRight: dimens.validate_padding_right_txt_code,
                            borderRadius: dimens.borderRadius,
                            borderColor: colors.colorGrayLight,
                            height: dimens.confirm_note_height_input,
                        }}
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        value={this.state.value}

                        onChangeText={value => this.setState({ value })}
                    />
                    <View style={{ flex: 1 }}>

                    </View>

                    <View style={{
                        flexDirection: 'row', marginTop: dimens.confirm_note_margin_top_btn,
                    }}>
                        <Button
                            text={strings.btn_cancel}
                            btnStyle={styles.btnCancel}
                            textStyle={{
                                color: colors.colorSub
                            }}
                            onPress={this.props.onCancel}
                        />
                        <View style={{ width: dimens.promotion_space_button }} />
                        <Button
                            text={strings.btn_confirm}
                            btnStyle={styles.btnConfirm}
                            onPress={() => this.props.onConfirm(this.state.value)}
                        />
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnCancel: {
        flex: 1,
        borderColor: colors.colorSub,
        backgroundColor: colors.colorWhiteFull,
        alignItems: "center",
        marginTop: dimens.register_margin_top_txtPhone,
        borderWidth: dimens.border_width,
        borderRadius: dimens.borderRadius,
    },
    btnConfirm: {
        flex: 1,
        borderColor: colors.colorMain,
        backgroundColor: colors.colorMain,
        alignItems: "center",
        marginTop: dimens.register_margin_top_txtPhone,
        borderWidth: dimens.border_width,
        borderRadius: dimens.borderRadius,
    },
})