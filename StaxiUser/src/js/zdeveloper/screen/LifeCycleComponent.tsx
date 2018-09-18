import * as React from "react";

import { StyleSheet, View } from "react-native";
import { Container } from "../../../module/ui/Container";
import { Button, Text } from "../../../module";
import LifeComponent from "../../../module/ui/LifeComponent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around"
  },
  btn: {
    backgroundColor: "red",
    height: 44
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    color: "white"
  }
});

export default class LifeCycleComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {renderChild: true,text:'Init'};
  }

  componentDidMount() {
    console.log("LifeCycleComponent componentDidMount");

    setTimeout(() => {
      this.setState({renderChild: false})
    },
    1000);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Container navigation={this.props.navigation} title="Vòng đời Component">
        <Button btnStyle={{ margin: 10 }}>
          <Text>Kiểm tra</Text>
          {this.state.renderChild ? <LifeCycleView text={this.state.text}/> : null}
        </Button>
      </Container>
    );
  }
}

class LifeCycleView extends LifeComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {text: props.text};
  }

  componentDidMount() {
    super.componentDidMount();

    setTimeout(() => {
      
      this.setState({text: "Chung"})
    },
    2000);
  }

  componentWillUnmount() {
    // First way:
    // const componentClassWillUnmount = LifeComponent.prototype['componentWillUnmount'];

    // if (componentClassWillUnmount) {
    //   componentClassWillUnmount.apply(this);
    // }

    // Second way:
    this.isMouted = false

    
  }
  

  render() {
    return (
      <Text style={{ margin: 10 }}>
        {this.state.text}
      </Text>
    );
  }
}
