/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-09-11 10:25:41
 * @modify date 2018-09-11 10:25:41
 * @desc [Hiện thị thông báo khi vị trí tìm kiếm ngoài vùng hỗ trợ]
*/
import * as React from "react";

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import images from '../../../../res/images';
import strings from "../../../../res/strings";

class LankmarkNotSupport extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<View style={styles.safeViewContainer}>
                <Image resizeMode="contain" source={images.ic_not_support_area} style={{width: 44, height: 44, marginTop: 16}}/>
                <Text style={{margin: 8}}>
                    {strings.footer_not_support_are}
                </Text>
			</View>
		);
	}
}

export default LankmarkNotSupport;

const styles = StyleSheet.create({
    safeViewContainer: {
        width: "100%",
        height: 110,
        backgroundColor: 'white',
        alignItems: 'center'
    },
});
