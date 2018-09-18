import * as React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import {createMaterialTopTabNavigator } from 'react-navigation';
import MenuHeader from '../../../module/ui/header/MenuHeader';
import strings from '../../../res/strings';
import colors from '../../../res/colors';
import DiscountCode from './DiscountCode';
import DiscountNews from './DiscountNews';
import fonts from "../../../module/ui/res/dimen/fonts";
import MainNavigator from '../../MainNavigation';

export interface State {
}

export interface Props {
    navigation: any;
    screenProps;
}

class PromotionScreen extends React.Component<Props, State> {

    private mainNavigation: MainNavigator;

    constructor(props) {
        super(props);
        this.mainNavigation = this.props.screenProps.mainNavigation;
        this.mainNavigation.lockDrawer();
    }


    render() {
        return (
            <View style={styles.container}>
                <MenuHeader
                    title={strings.home_promotion_title}
                    drawerOpen={() => {
                        // Mở khóa drawer khi về home.
                        this.mainNavigation.unlockDrawer();
                        this.props.navigation.goBack();
                    }}
                    isBack
                />
                <Tab />
            </View>
        );
    }
}

export default PromotionScreen;

const Tab = createMaterialTopTabNavigator(
    {
        MaKMScreen: {
            screen: DiscountCode,
            navigationOptions: {
                title: strings.sales_promotion_title
            },
        },
        TinKMScreen: {
            screen: DiscountNews,
            navigationOptions: {
                title: strings.news_promotion_title,
            }
        },
    },
    {

        // navigationOptions: ({ navigation }) => ({
        //     animationEnabled: true,
        // }),
        tabBarOptions: {
            style: {
                backgroundColor: colors.colorMain
            },
            labelStyle: {
                fontSize: fonts.text_size,
                fontWeight: 'normal',
            },
            upperCaseLabel: false,
            indicatorStyle: {
                backgroundColor: 'white',
                height: 2
            }
        }
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});