import * as React from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";

import { createStackNavigator } from "react-navigation";

const items = [
  {
    title: "Thông tin Database",
    screen: "DatabaseInfo"
  },
  {
    title: "Test base component",
    screen: "Test"
  },

  {
    title: "Test bản đồ",
    screen: "CheckMap"
  },

  {
    title: "Test Media module",
    screen: "MediaModule"
  },
  {
    title: "Test move marker",
    screen: "MoveMarker"
  },

  {
    title: "Test vòng đời component",
    screen: "LifeCycleComponent"
  }
];

interface Props {
  navigation?;
  screenProps?
}

class DebugActivity extends React.Component<Props> {
  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
        onPress={() => {
          this.props.navigation.navigate(item.screen);
        }}
      >
        <Text style={{ fontSize: 18, color: "black" }}>{item.title}</Text>
        {/* <Icon name="pencil" color='black' style={{ fontSize: 18 }} type='FontAwesome' /> */}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Container
        navigation={this.props.screenProps}
        title="Dành cho nhà phát triển"
      >
        <FlatList
          data={items}
          renderItem={this._renderItem}
          keyExtractor={item => item.title}
          contentContainerStyle={{ padding: 10 }}
        />
      </Container>
    );
  }
}

class DebugList extends React.Component<Props> {
  render() {
    console.log("DebugList ", this.props.navigation);
    return (
      <DebugNavigator screenProps={this.props.navigation}/>
    );
  }
}

import DatabaseInfo from "./screen/database/DatabaseInfo";
import TableInfo from "./screen/database/TableInfo";
import Test from "./screen/testmodel/Test";
import CheckMap from "./screen/CheckMap";
import TestModules from "./screen/TestModules";
import MoveMarker from "./screen/map/MoveMarker";
import { Container } from "../../module/ui/Container";
import LifeCycleComponent from "./screen/LifeCycleComponent";

const DebugNavigator = createStackNavigator(
  {
    DebugActivity: {
      screen: DebugActivity
    },

    DatabaseInfo: {
      screen: DatabaseInfo
    },
    TableInfo: {
      screen: TableInfo
    },
    Test: {
      screen: Test
    },
  
    CheckMap: {
      screen: CheckMap
    },
  
    MediaModule: {
      screen: TestModules
    },
    MoveMarker: {
      screen: MoveMarker
    },
  
    LifeCycleComponent: {
      screen: LifeCycleComponent
    }
  },
  {
    headerMode: "none",
    initialRouteName: "DebugActivity"
  }
);

export default DebugList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  }
});
