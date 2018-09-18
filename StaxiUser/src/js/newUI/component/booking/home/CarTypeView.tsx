/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-20 05:48:56
 * @modify date 2018-07-20 05:48:56
 * @desc [Lớp hiện thị danh sách loại xe và xe xung quanh]
 */

import * as React from "react";

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import CarTypeViewModel from "./CarTypeViewModel";
import VehiclePriceView from "../../../../component/booking/home/VehiclePriceView";
import colors from "../../../res/colors";
import { Text } from "../../../../../module";
import strings from "../../../../../res/strings";
import fonts from "../../../../../res/fonts";


var isShowCarPrice: boolean = false;

interface Props {
  carTypeViewModel: CarTypeViewModel;
  navigation?;
  vehicleTypes: Array<any>;
}

interface State {
  vehicleTypes: Array<any>;
}

class CarTypeView extends React.Component<Props, State>{

  private carTypeViewModel: CarTypeViewModel;

  constructor(props: Props) {
    super(props);
    this.carTypeViewModel = props.carTypeViewModel;

    this.state = {
      vehicleTypes: props.vehicleTypes||[],
    };
  }

  componentWillUnmount(){
  }

  public updateVehicles(vehicles){
    this.setState({vehicleTypes:vehicles}); 
  }

  private getVehiclePriceView():VehiclePriceView{
    return this.refs.vehiclePriceViewRef as VehiclePriceView;
  }

  // Cập nhật lại thông tin xe được chọn
  _onPressCarType(vehicleSelect) {
    if (!this.carTypeViewModel.checkActiveVehicleType(vehicleSelect)) {
      if(isShowCarPrice){
        isShowCarPrice = false;
        this.getVehiclePriceView().update(null);
      } else {
        isShowCarPrice = true;
        this.getVehiclePriceView().update(vehicleSelect);
      }
    } else {
      this.setState({
        vehicleTypes: this.state.vehicleTypes.map(item => {
          let isActive = item.vehicleId === vehicleSelect.vehicleId;
          if(isActive && isShowCarPrice && item.seat != 0){
             isShowCarPrice = true;
             this.getVehiclePriceView().update(item);
          }
          return {
            ...item,
            isActive: isActive
          };
        })
      });
    }
  }

  render() {

    // Carsize
    let cartypeWidth = Dimensions.get('window').width / this.state.vehicleTypes.length;
    if(cartypeWidth < 90){
      cartypeWidth = 90;
    }

    return (
      <View
        style={{
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center"
        }}
      >
        <View style={styles.container}>
          <View style={styles.carTypeBkg}>
            <Text
                textStyle={{
                  backgroundColor: colors.colorWhiteMedium,
                  padding: 6,
                  width: "100%",
                  textAlign: "center",
                }}
                text={strings.help_book_taxi_one_header}>
            </Text>
            <View
              style={{
                backgroundColor: "white",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.state.vehicleTypes}
                horizontal={true}
                keyExtractor={(item, index) => item.nameVi}
                renderItem={({ item, separators }) => (
                  <TouchableOpacity onPress={() => this._onPressCarType(item)}>
                    <View
                      style={{
                        backgroundColor: "white",
                        width: cartypeWidth,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        style={{
                          opacity: item.isActive ? 1 : 0.2,
                          width: 52,
                          height: 44
                        }}
                        source={this.carTypeViewModel.getIconCar(item.iconCode)}
                      />
                      <Text
                        textStyle={{
                          color: item.isActive ? colors.colorDark : colors.grayDarkSub,
                          fontSize: fonts.body_2
                        }}
                        text={item.nameVi}>
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <VehiclePriceView ref = "vehiclePriceViewRef"/>
        </View>
      </View>
    );
  }
}

export default CarTypeView;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0
  },
  carTypeBkg: {
    width: "100%",
    shadowColor: "#898989",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  carTypeSubBtn: {
    width: "94%",
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "white",
    shadowColor: "#898989",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    borderWidth: 1,
    borderColor: "#CCCCCC"
  },
  icon: {
    width: 48,
    height: 48
  },
  addressLayout: {
    width: "97%",
    // borderRadius: 8,
    backgroundColor: "transparent",
    marginTop: 6,
    // position: "absolute",
    // shadowColor: '#333333',
    // shadowOpacity: 0.8,
    shadowRadius: 5
    // shadowOffset: {height: 2, width: 2},
    // borderColor: '#DDDDDD',
    // borderWidth: 1,
  },
  overContainer: {
    position: 'absolute',
    flex: 1,
    display: 'flex',
    width: '100%',
    height: '100%',
  },
});
