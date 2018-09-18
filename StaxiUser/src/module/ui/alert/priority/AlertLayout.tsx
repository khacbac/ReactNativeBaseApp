import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import COLORS from '../../../../res/colors';

import {Text, Utils} from '../../..';

import AlertModelManager from './AlertModelManager';
import AlertModel from './AlertModel';

interface Props {
}

interface State {
    activeMessage: string;
}

export default class AlertLayout extends React.Component<Props, State> {
    private modelManager: AlertModelManager;

    constructor(props) {
        super(props);
        this.modelManager = new AlertModelManager();
    }

    public show(alertModel?: AlertModel) {
        if (Utils.isNull(alertModel) || Utils.isEmpty(alertModel.msg)) {
              //Nếu hiện thị thông báo khác thông báo đang hiện thị gán thông báo bằng chính nó
            let active: AlertModel = this.modelManager.getActiveHightPriority();
            this.showText(active);
            return;
        }

        //Nếu hiện thị thông báo khác thông báo đang hiện thị gán thông báo bằng chính nó
        let active: AlertModel = this.modelManager.setAlertModel(alertModel);

        //hiện thị text
        this.showText(active);
    }

    /**
     * hiện thị text
     */
    private showText(active: AlertModel){
        if (Utils.isNull(active) || Utils.isEmpty(active.msg)) {
            return;
        }

        this.setState({
            activeMessage: active.msg,
        });
    }

    public setTextColor(textColor: string) {
        let currentActive = this.modelManager.getActive();
        if (!Utils.isNull(currentActive)) {
            currentActive.textColor = textColor;
        }

        this.forceUpdate();
    }

    /**
     * chỉ thiết lập theo text, và xóa hết tất cả các text trogn queue
     */
    public setText(msg: string){
        if (this.modelManager != null) {
            this.modelManager.clear();
        }

        this.setState({
            activeMessage: msg,
        });
    }

    /** Ẩn layout thông báo */
	private hideActiveAlert() {
		if (!this.isVisible()) {
			return;
        }
        
        this.modelManager.deactive();
        this.setState({
            activeMessage: null,
        });
	}
	
	/**
	 * ẩn thông báo với độ ưu tiên được quy định
	 */
	public hideAlertModel(priority: number) {

        //remove thông báo nếu có
        let alertModel: AlertModel = this.modelManager.remove(priority);
        
		if(Utils.isNull(alertModel)){
            this.hideActiveAlert();
            return;
        }

        this.setState({
            activeMessage: alertModel.msg,
        });
	}
	
	/**
	 * xóa hết thông báo
	 */
	public clear(){
		this.hideActiveAlert();
        this.modelManager.clear();
	}
	
	/**
	 * kiểm tra ẩn hay hiện
	 */
	public isVisible(): boolean{
		return !Utils.isNull(this.state) && !Utils.isEmpty(this.state.activeMessage);
	}

    public setModelManager(modelManager: AlertModelManager) {
        this.modelManager = modelManager;
    }

    _getBackgroundAlert(activeAlert: AlertModel) {
        if (Utils.isNull(activeAlert) || Utils.isEmpty(activeAlert.bgColor)) {
            return COLORS.colorRed;
        }

        return activeAlert.bgColor;
    }

    _getTextColorAlert(activeAlert: AlertModel) {
        if (Utils.isNull(activeAlert) || Utils.isEmpty(activeAlert.textColor)) {
            return COLORS.colorWhiteFull;
        }

        return activeAlert.textColor;
    }

    _getAlertMessage(activeAlert: AlertModel) {
        if (Utils.isNull(this.state)) return "";

        // ưu tiên lấy message của state
        if (!Utils.isEmpty(this.state.activeMessage)) {
            return this.state.activeMessage;
        }

        // lấy message của alert active
        if (Utils.isNull(activeAlert) || Utils.isEmpty(activeAlert.msg)) {
            return "";
        }

        return activeAlert.msg;
    }

    _getAlertView() {
        const activeAlert = this.modelManager.getActive();

        if (this.isVisible()) {
            return <TouchableOpacity onPress={() => {
                if (activeAlert && activeAlert.onClickListener) {
                    activeAlert.onClickListener();
                }
            }}>
                <View style={{flexDirection:'row',flexWrap: 'wrap'}}>
                    <Text text={this._getAlertMessage(activeAlert)} textStyle={[styles.alert, {
                        backgroundColor: this._getBackgroundAlert(activeAlert),
                        color: this._getTextColorAlert(activeAlert),
                    }]}/>
                </View>
            </TouchableOpacity>
        } else {
            // return <View style={{height: 0}}/>
            return null;
        }
    }

    render() {
        return this._getAlertView();
    }
}

const styles = StyleSheet.create({
    alert: {
        width: '100%',
        paddingLeft: 4,
        paddingRight: 4,
        textAlign: 'center',
        fontSize: 18,
    }
});