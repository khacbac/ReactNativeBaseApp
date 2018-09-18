export default class ActionsManagerWrapper {
    private requestState = {
        idRequest: 0,
        currentState: RequestState.NONE
    }

    private actionFunc: Function;
    private callback: Function;

    private log(msg: any, ...params: any[]) {
        // console.log(msg, params);
    }

    public doAction(action: () => Promise<any>, callback: (error:Error, result?:any) =>void) {
        if (!this.isRequestEnded()) {
            this.log('ActionsManagerWrapper 111 - add action vào queue, trạng thái request: ' + this.getCurrentRequestState())

            this.callback = callback;
            this.actionFunc = action;
            
            this.increaseRequestID();
            return;
        }

        this.callback = callback;
        
        this.increaseRequestID();
        this.resetRequestAction();
        this.setRequesting();

        this.request(action);
    }

    private request(action: Function){
        action()
        .then((result) => {
            this.log("ActionsManagerWrapper - THEN result: ", result);

            if (this.actionFunc !== undefined) {
                this.log('ActionsManagerWrapper 333 - THEN - gọi tiếp request geocoding khi nhận response, requestID: ' + this.getCurrentRequestID());

                this.setRequesting();
                let temp = this.actionFunc;
                this.resetRequestAction();
                return this.request(temp);
            }

            this.log('ActionsManagerWrapper 444 - THEN - kết thúc request trả về cho UI');

            this.setRequestSuccess();
            this.callback(null, result);
        })
        .catch((error: Error) => {
            if (this.actionFunc !== undefined) {
                this.log('ActionsManagerWrapper 333 - CATCH - gọi tiếp request geocoding khi nhận response, requestID: ' + this.getCurrentRequestID());
            
                this.setRequesting();
                let temp = this.actionFunc;
                this.resetRequestAction();
                return this.request(temp);
            }

            this.log('ActionsManagerWrapper 444 - CATCH - kết thúc request trả về cho UI');

            this.setRequestFailt();
            this.callback(error);
        });

        this.log('00000 -------------- Gọi request , id: ' + this.getCurrentRequestID());
    }

    public removeAction() {
        this.log('ActionsManagerWrapper - Xóa hết request đang lưu');
        this.resetRequestAction();
    }
    
    private resetRequestAction() {
        this.actionFunc = undefined;
    }

    public getCurrentRequestID(): number {
        return this.requestState.idRequest;
    }

    public getCurrentRequestState(): RequestState {
        return this.requestState.currentState;
    }

    public isRequestEnded(): boolean {
        return this.requestState.currentState == RequestState.NONE 
            || this.requestState.currentState == RequestState.REQUEST_SUCCESS 
            || this.requestState.currentState == RequestState.REQUEST_FAILT;
    }

    private increaseRequestID() {
        this.requestState = {idRequest: this.requestState.idRequest + 1, currentState: this.requestState.currentState};
    }
    
    private setRequesting() {
        this.requestState = {idRequest: this.requestState.idRequest, currentState: RequestState.REQUESTING};
    }

    private setRequestSuccess() {
        this.requestState = {idRequest: this.requestState.idRequest, currentState: RequestState.REQUEST_SUCCESS};
    }
    
    private setRequestFailt() {
        this.requestState = {idRequest: this.requestState.idRequest, currentState: RequestState.REQUEST_FAILT};
    }
}

export enum RequestState {
    NONE = 0,
    REQUESTING = 1,
    REQUEST_SUCCESS = 2,
    REQUEST_FAILT = 3,
  }