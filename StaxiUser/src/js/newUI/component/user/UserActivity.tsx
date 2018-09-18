import * as React from "react";

import RegisterView from "./RegisterView";
import ValidateView from "./ValidateView";
import UserActivityLib from "../../../../js/component/user/UserActivity"


class UserActivity extends UserActivityLib {


    constructor(props) {
        super(props);
    }


    protected getRegisterView(){
        return <RegisterView userModelView={this.userModelView} />;
    }

    protected getValidateView(){
        return <ValidateView userModelView={this.userModelView} />;
    }
}
export default UserActivity;