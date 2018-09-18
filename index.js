import { AppRegistry, YellowBox } from 'react-native';
import App from './StaxiUser/src/js/newUI/AppNewUI';

//ẩn Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window)
console.ignoredYellowBox = ['Remote debugger'];

console.disableYellowBox = true;

if(!__DEV__){
    console.log = () =>{};
}

AppRegistry.registerComponent('G7Taxi', () => App);


