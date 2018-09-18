import * as  React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
} from 'react-native';
import uicolors from './res/colors';
import uidimens from './res/dimen/dimens';
import uifonts from './res/dimen/fonts';
import { PlatformOS } from '..';

interface Props {
    inputContainer?;
    placeholder?;
    placeholderTextColor?;
    borderRadius?;
    inputStyle?;
    onChangeText?;
    multiline?;
    numberOfLines?;
    autoFocus?;
    value?;
    editable?;
    onSubmitEditing?;
    keyboardType?;
    maxLength?;
    autoCapitalize?;
    selection?;
    returnKeyType?;
    clearButtonMode?;
    onFocus?;
    selectTextOnFocus?;
}

interface State {
    selection?;
    text: string;
}

export default class Input extends React.Component<Props, State> {

    private textInput: TextInput;

    constructor(props) {
        super(props);
        this.state = {
            selection: this.props.selection ? this.props.selection : { start: 0 },
            text: props.value || ""
        }
    }

    setFocus(selection?) {
        this.textInput.focus();

        if (selection !== undefined) {
            this.setState({
                selection: selection ? selection : { start: 0 }
            })
        }
    }

    unFocus() {
        this.textInput.blur();
    }

    isFocus() {
        return this.textInput.isFocused();
    }

    private onChangeText(text) {

        this.setState({ text: text })
        //callback
        this.props.onChangeText && this.props.onChangeText(text);
    }

    public setText(text, onChanged?: Function): void {
        this.setState({ text }, () => onChanged && onChanged());
    }

    public getText() {
        return this.state.text;
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.container, this.props.inputContainer]}>
                {PlatformOS.ios() ?
                    <TextInput
                        // ref="textInput"
                        ref={c => this.textInput = c}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={this.props.placeholderTextColor}
                        onChangeText={(text) => this.onChangeText(text)}
                        style={[styles.input, { borderRadius: this.props.borderRadius }, this.props.inputStyle]}
                        underlineColorAndroid='transparent'
                        multiline={this.props.multiline}
                        numberOfLines={this.props.numberOfLines}
                        autoFocus={this.props.autoFocus}
                        onFocus={this.props.onFocus}
                        selectTextOnFocus={this.props.selectTextOnFocus}
                        value={this.state.text}
                        editable={this.props.editable}
                        selection={this.state.selection}
                        onSubmitEditing={this.props.onSubmitEditing}
                        keyboardType={this.props.keyboardType}
                        returnKeyType={this.props.returnKeyType}
                        clearButtonMode={this.props.clearButtonMode}
                        maxLength={this.props.maxLength}
                        autoCapitalize={this.props.autoCapitalize}
                        onSelectionChange={(event) => {
                            this.setState({
                                selection: event.nativeEvent.selection,
                                // selectionChanged: this.state.selectionChanged + 1
                            })
                        }} /> :

                    <TextInput
                        // ref="textInput"
                        ref={c => this.textInput = c}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={this.props.placeholderTextColor}
                        onChangeText={(text) => this.onChangeText(text)}
                        style={[styles.input, { borderRadius: this.props.borderRadius }, this.props.inputStyle]}
                        underlineColorAndroid='transparent'
                        multiline={this.props.multiline}
                        numberOfLines={this.props.numberOfLines}
                        autoFocus={this.props.autoFocus}
                        onFocus={this.props.onFocus}
                        selectTextOnFocus={this.props.selectTextOnFocus}
                        value={this.state.text}
                        editable={this.props.editable}
                        selection={this.state.selection}
                        onSubmitEditing={this.props.onSubmitEditing}
                        keyboardType={this.props.keyboardType}
                        maxLength={this.props.maxLength}
                        autoCapitalize={this.props.autoCapitalize}
                    />
                }
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    input: {
        fontSize: uifonts.text_size,
        color: uicolors.colorBlackFull,
        // borderColor: COLOR.colorBlackFull,
        // borderWidth: dimens.border_width,
        width: '100%',
        paddingHorizontal: uidimens.padding_text_input,
        paddingVertical: uidimens.padding_text_input,
    }
});