import * as React from "react";
import { View, StyleSheet } from "react-native";

import { Dialog, ToastModule } from "../../../module";

import UserModelView, { UserPage, UserPresenter } from "../../viewmodel/user/UserModelView";
import RegisterView from "./RegisterView";
import ValidateView from "./ValidateView";

interface Props {
  navigation;
}

interface State {
  screen: UserPage;
}

class UserActivity extends React.Component<Props, State>
  implements UserPresenter {
  protected userModelView: UserModelView;

  constructor(props) {
    super(props);
    this.userModelView = new UserModelView(this, this.props.navigation);
    this.state = {
      screen: UserPage.REGISTER
    };
  }

  _show() {
    if (this.state.screen == UserPage.REGISTER) {
      return this.getRegisterView();
    } else if (this.state.screen == UserPage.VERIFY) {
      return this.getValidateView();
    }
  }

  protected getRegisterView() {
    return <RegisterView userModelView={this.userModelView} />;
  }

  protected getValidateView() {
    return <ValidateView userModelView={this.userModelView} />;
  }

  public getDialog(): Dialog {
    return this.refs.dialog as Dialog;
  }

  render() {
    return (
      <View style={styles.container}>
        {this._show()}

        <Dialog ref="dialog" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: 'grey',
  }
});

export default UserActivity;
