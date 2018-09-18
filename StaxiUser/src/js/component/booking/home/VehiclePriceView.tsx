import * as React from "react";

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import colors from "../../../../res/colors";
import VehicleType from "../../../sql/bo/VehicleType";
import Price from "../../../sql/bo/Price";
import { Utils, UserUtils } from "../../../../module";
import PriceCode from "../../../viewmodel/booking/home/PriceCode";
import Congthuc from "../../../sql/bo/Congthuc";
import strings from "../../../../res/strings";
import fonts from "../../../../module/ui/res/dimen/fonts";
import SessionStore from "../../../Session";

interface State {
  vehicle: VehicleType;
  price: Price;

  distanceOpen: number,
  priceOpen: number;
  distanceLevel1From: number,
  distanceLevel1To: number,
  priceLevel1: number;
  distanceLevel2: number,
  priceLevel2: number;
}

/**
 * Màn hình bảng giá cước
 * @author Đv Hiện
 * Created on 24/07/2018
 */
class VehiclePriceView extends React.Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      vehicle:null,
      price: null,

      distanceOpen: 0,
      priceOpen: 0,
      distanceLevel1From: 0,
      distanceLevel1To: 0,
      priceLevel1: 0,
      distanceLevel2: 0,
      priceLevel2: 0
    }
  }

  /* Lấy thông tin giá theo loại xe được chọn */
  public getCompanyPriceV2(vehicle: VehicleType): Price {
    let arrayList: Array<Price> = SessionStore.getPrices();
    let companyPriceV2: Price;
    for (let i = 0; i < arrayList.length; i++){
      let priceV2: Price = arrayList[i];
          // Bỏ qua nếu không phải giá của công ty và loại xe hiện tại
      if (priceV2.companyId != vehicle.companyId || !priceV2.isVehicleTypesV2(vehicle.vehicleId)) {
            continue;
          }
          // // Bỏ qua nếu unvalidate ngày áp dụng
          // if (priceV2.priceApplyDate * 1000 > SharedCache.getServerTime()) {
          //   continue;
          // }
          // // Bỏ qua nếu unvalidate ngày kết thúc
          // if (priceV2.priceEndDate * 1000 < SharedCache.getServerTime() && (priceV2.priceEndDate != 0)) {
          //   continue;
          // }
          companyPriceV2 = priceV2;
          break;
        }
        
        return companyPriceV2;
  }

  public update(_vehicle: VehicleType){
    if(_vehicle == null){
      this.setState({
        price: null
      })
      return;
    }
    let _price: Price = this.getCompanyPriceV2(_vehicle);
    this.setState({
      vehicle: _vehicle,
      price: _price
    })
    this.getVehiclePrice(_price);
  }

  // Lấy giá cước theo type công thức json cũ
  private getMoney = (price: Price, id: number) => {
    let money: string = "Chưa xác định";
    if (price != null && price.priceFormulaJson != null){
      switch (id) {
			case PriceCode.PRICE_OPEN:
				return (money = JSON.parse(price.priceFormulaJson).Open + ' VNĐ/Km');
				//break;
			case PriceCode.PRICE_LEVEL_ONE:
				return (money = JSON.parse(price.priceFormulaJson).Level1 + ' VNĐ/Km');
				//break;
			case PriceCode.PRICE_LEVEL_TWO:
				return (money = JSON.parse(price.priceFormulaJson).Level2 + ' VNĐ/Km');
				//break;
      case PriceCode.PRICE_RETURN:
				return (money = "-" + price.downPercent2ways + ' %');
				//break;
		}
    }
    return money;
  }
 
  // Lấy giá cước theo level công thức json mới
  public getVehiclePrice = (price: Price) => {
    if(price == null || price.priceJson == null) {return}
    var prices: Array<Congthuc> = JSON.parse(price.priceJson).Congthuc;
    var isContractCar = true;
    if (prices.length > 2) {
      isContractCar = false;
    }
    for (let i = 0; i < prices.length; i++) {
      let congthuc: Congthuc = prices[i];
      // Nếu là giá mở cửa
      if (congthuc.lv == PriceCode.PRICE_OPEN) {
        this.setState({distanceOpen: congthuc.kt, priceOpen: congthuc.p});
      }
      if (congthuc.lv == PriceCode.PRICE_LEVEL_ONE) {
			this.setState({
				distanceLevel1From: congthuc.kf,
				distanceLevel1To: congthuc.kt,
				priceLevel1: congthuc.p,
			});
		}
      if (congthuc.lv == prices.length) {
        this.setState({ distanceLevel2: congthuc.kf, priceLevel2: congthuc.p });
      }
      // Nếu là xe hợp đồng thì chỉ có mức giá từ 0.1km trở đi
      if (isContractCar && congthuc.lv == prices.length) {
        this.setState({ distanceLevel2: congthuc.kf, priceLevel2: congthuc.p });
      }
    }
  }

  render() {
    if(this.state.price == null) {
      return(<View style={{display: "none"}}></View>)
    }
    return <View style={styles.safeViewContainer}>
			<View style={{ width: '100%', height: 1, backgroundColor: colors.colorGrayLight }} />
			<View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
				<View style={{ width: '70%' }}>
					<View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
						<Text style={{ color: colors.grayDarkSub, fontSize: fonts.body_2 }}>
							{strings.book_carinfo_price_open} {Utils.formatDistance(this.state.distanceOpen)}km
							{/* {this.state.price != null?this.state.price.nameVi:""} */}
						</Text>
						<Text style={{ color: colors.colorMain, textAlign: 'center', fontWeight: 'bold' }}>
							{UserUtils.formatMoney(this.state.priceOpen)} {strings.book_carinfo_price_open_detail}
						</Text>
					</View>
					<View style={{ width: '100%', height: 1, backgroundColor: colors.colorGrayLight }} />
					<View style={{ flexDirection: 'row', height: '50%' }}>
						<View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
              <Text style={{ color: colors.grayDarkSub, fontSize: fonts.body_2 }}>
								{strings.book_carinfo_price_step_next_from} {Utils.formatDistance(this.state.distanceLevel1From)}km {strings.book_carinfo_price_step_two} {Utils.formatDistance(this.state.distanceLevel1To)}km
							</Text>
							<Text style={{ color: colors.colorMain, textAlign: 'center', fontWeight: 'bold' }}>
								{UserUtils.formatMoney(this.state.priceLevel1)} {strings.book_carinfo_price_open_detail}
							</Text>
						</View>
						<View style={{ width: 1, height: '100%', backgroundColor: colors.colorGrayLight }} />
						<View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
							<Text style={{ color: colors.grayDarkSub, fontSize: fonts.body_2 }}>
								{strings.book_carinfo_price_step_next_from} {Utils.formatDistance(this.state.distanceLevel2)}km {strings.book_carinfo_price_step_next_to}
							</Text>
							<Text style={{ color: colors.colorMain, textAlign: 'center', fontWeight: 'bold' }}>
								{UserUtils.formatMoney(this.state.priceLevel2)} {strings.book_carinfo_price_open_detail}
							</Text>
						</View>
					</View>
				</View>
				<View style={{ width: 1, height: '100%', backgroundColor: colors.colorGrayLight }} />
				<View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: fonts.h6_20 }}>
						{this.getMoney(this.state.price, PriceCode.PRICE_RETURN)}
					</Text>
					<Text style={{ color: colors.colorDark, fontSize: fonts.body_2, textAlign: 'center', paddingLeft: 4, paddingRight: 4 }}>
						{strings.book_carinfo_price_distance} {this.state.price.beginKm2Ways} km
					</Text>
				</View>
			</View>
		</View>;
  }
}

export default VehiclePriceView;

const styles = StyleSheet.create({
  safeViewContainer: {
    width: "100%",
    height: 110,
    backgroundColor: 'white',
    alignItems: 'center'
  },
});
