import * as React from "react";
import {
    StyleSheet,
    View,
    // TextInput,
    Image
} from 'react-native';
import uiimages from './res/drawable/images';
import uicolors from './res/colors';
import uidimens from './res/dimen/dimens';
import uifonts from './res/dimen/fonts';
import { TextInput } from "..";
import ITextInput from "./model/ITextInput";


// import { Platform, StatusBar, Dimensions } from "react-native"
// const { height, width } = Dimensions.get("window")

interface Props {
    borderRadius?: any;
    container?;
    isEditable?;
    iconStyle?;
    icon?;
    placeholder?;
    multiline?;
    numberOfLines?;
    onChangeText?;
    autoFocus?;
    keyboardType?;
    value?;
    maxLength?;
    autoCapitalize?;
    inputStyle?;
    selection?;
}

export default class HorizontalIconInput extends React.Component<Props> implements ITextInput {

    /** đối tượng text input */
    private textInput: TextInput;


    constructor(props) {
        super(props);
        console.log(`test_input_HorizontalIconInput`);

    }

    focus() {
        // let selection = { start: 0 };
        // this.textInput.setFocus(isFocus, selection);
        this.textInput.setFocus();
    }

    unfocus() {
        // this.textInput.blur();
        this.textInput.unFocus();
    }

    public getTextInput() {
        return this.textInput;
    }

    public getText(){
        return this.textInput.getText();
    }


    render() {
        // alert("daad",height);
        return (
            <View style={[styles.container, { borderRadius: this.props.borderRadius }, this.props.container]}>
                <Image
                    style={[
                        styles.icon,
                        this.props.iconStyle
                    ]}
                    source={this.props.icon ? this.props.icon : uiimages.ic_user_defatlt} />
                <TextInput
                    ref={ref => this.textInput = ref}
                    editable={this.props.isEditable}
                    placeholder={this.props.placeholder}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.numberOfLines}
                    onChangeText={this.props.onChangeText}
                    autoFocus={this.props.autoFocus}
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    maxLength={this.props.maxLength}
                    autoCapitalize={this.props.autoCapitalize}
                    selection={this.props.selection}
                    inputStyle={[
                        styles.input,
                        this.props.inputStyle
                    ]} 
                    />

            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        // flex:1,
        flexDirection: 'row',
        borderWidth: 0,
        // borderBottomWidth: uidimens.divider,
        // borderBottomColor: uicolors.colorGrayLight,
        height: uidimens.height_horizontal_icon_input,
        // width:'100%',
        // justifyContent:'center',
        alignItems: 'center',
        // backgroundColor: 'yellow',
    },
    icon: {
        width: uidimens.size_icon_input,
        height: uidimens.size_icon_input,
        marginHorizontal: uidimens.margin_horizontal_icon_input,
        tintColor: uicolors.colorMain,
    },
    input: {
        // paddingHorizontal: uidimens.padding_right_icon_input,
        color: uicolors.colorBlackFull,
        fontSize: uifonts.text_size,
        fontFamily: 'System',
    }

});