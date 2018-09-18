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
import BAAddress from "../../../../model/BAAddress";
import { Text } from "../../../../../module";
import colors from "../../../res/colors";

interface Props {
	carTypeViewModel: CarTypeViewModel;
	navigation?;
	addressHistorys?: Array<BAAddress>;
}

interface State {
	addressHistorys?: Array<BAAddress>;
}

/**
 * Địa chỉ gợi ý đi gần đây
 * @author Đv Hiện
 * Created on 17/08/2018
 */
class AddressSuggest extends React.Component<Props, State> {
	private carTypeViewModel: CarTypeViewModel;

	constructor(props: Props) {
		super(props);
		this.carTypeViewModel = props.carTypeViewModel;
		this.state = {
			addressHistorys: this.carTypeViewModel.getBookTaxiModel().addressHistorys || [],
		};
	}

	// Cập nhật lại thông tin xe được chọn
	_onPressAdress(addressHistory) {
		var baAddress: BAAddress = new BAAddress();
		baAddress.location = addressHistory.location;
		baAddress.formattedAddress = addressHistory.formattedAddress;
		baAddress.name = addressHistory.name;
		// gán cho điểm B
		this.carTypeViewModel.updateDstAddressToConfirm(baAddress);
	}

	public setAddressHistory(addressHistorys?: Array<BAAddress>){
		this.setState({addressHistorys:addressHistorys || []})
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					showsHorizontalScrollIndicator={false}
					data={this.state.addressHistorys}
					horizontal={true}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, separators }) => (
						<TouchableOpacity onPress={() => this._onPressAdress(item)}>
							<View style={styles.addressItem}>
								<Text textStyle={{ color: colors.colorGray, fontSize: 15 }} numberOfLines={1} text={item.formattedAddress} />
							</View>
						</TouchableOpacity>
					)}
				/>
				{this.state.addressHistorys.length<=0 && 
					<View style={styles.addressItem}>
						<Text text={"..."}/>
					</View>
				}
			</View>
		);
	}
}

export default AddressSuggest;

let cartypeWidth = Dimensions.get('window').width / 2.5;
const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 32,
	},
	addressItem: {
		width: cartypeWidth,
		height: 32,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.colorGray,
		paddingLeft: 8,
		marginLeft: 6,
		alignItems: "center",
		justifyContent: "center"
	},
});
