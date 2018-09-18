import * as React from 'react';
import {
    StyleSheet,
    View,
    Animated
} from 'react-native';
import colors from '../../res/colors';

interface Props {
    rippleContainer
}

interface State {
    fadeOut1: any,
    fadeOut2: any,
    fadeOut3: any,
    fadeOut4: any,
    fadeOut5: any,
}

export default class RippleBackground extends React.Component<Props, State> {

    private animation: Animated.CompositeAnimation;

    constructor(props) {
        super(props);
        this.state = {
            fadeOut1: new Animated.Value(1),
            fadeOut2: new Animated.Value(1),
            fadeOut3: new Animated.Value(1),
            fadeOut4: new Animated.Value(1),
            fadeOut5: new Animated.Value(1),
        }
    }

    componentDidMount() {
        const animate1 = Animated.timing(
            this.state.fadeOut1,
            {
                toValue: 0,
                duration: 2000,
                // delay: 250
            }
        );
        const animate2 = Animated.timing(
            this.state.fadeOut2,
            {
                toValue: 0,
                duration: 2000,
                // delay: 250
            }
        );
        const animate3 = Animated.timing(
            this.state.fadeOut3,
            {
                toValue: 0,
                duration: 2000,
                // delay: 500
            }
        );
        const animate4 = Animated.timing(
            this.state.fadeOut4,
            {
                toValue: 0,
                duration: 2000,
                // delay: 750
            }
        );
        const animate5 = Animated.timing(
            this.state.fadeOut5,
            {
                toValue: 0,
                duration: 2000,
                // delay: 1000
            }
        );
        const sequence = Animated.parallel([animate1, animate2, animate3, animate4, animate5]);
        const animated1 = Animated.loop(animate1);
        const animated2 = Animated.loop(animate2);
        const animated3 = Animated.loop(animate3);
        const animated4 = Animated.loop(animate4);
        const animated5 = Animated.loop(animate5);
        this.animation = Animated.stagger(500, [animated1, animated2, animated3, animated4, animated5]);
    }

    startAnimation() {
        if (this.animation != null) {
            this.animation.start();
        }
    }

    stopAnimation() {
        if (this.animation != null) {
            this.animation.stop();
        }
    }

    render() {

        const size1 = this.state.fadeOut1.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400, 300, 200, 100, 50]
        });
        const border1 = this.state.fadeOut1.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400 / 2, 300 / 2, 200 / 2, 100 / 2, 50 / 2]
        });

        const size2 = this.state.fadeOut2.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400, 300, 200, 100, 50]
        });
        const border2 = this.state.fadeOut2.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400 / 2, 300 / 2, 200 / 2, 100 / 2, 50 / 2]
        });

        const size3 = this.state.fadeOut3.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400, 300, 200, 100, 50]
        });
        const border3 = this.state.fadeOut3.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400 / 2, 300 / 2, 200 / 2, 100 / 2, 50 / 2]
        });

        const size4 = this.state.fadeOut4.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400, 300, 200, 100, 50]
        });
        const border4 = this.state.fadeOut4.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400 / 2, 300 / 2, 200 / 2, 100 / 2, 50 / 2]
        });

        const size5 = this.state.fadeOut5.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400, 300, 200, 100, 50]
        });

        const border5 = this.state.fadeOut5.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [400 / 2, 300 / 2, 200 / 2, 100 / 2, 50 / 2]
        });

        const fadeOut1 = this.state.fadeOut1;
        const fadeOut2 = this.state.fadeOut2;
        const fadeOut3 = this.state.fadeOut3;
        const fadeOut4 = this.state.fadeOut4;
        const fadeOut5 = this.state.fadeOut5;

        return (

            <View
                style={[styles.container, this.props.rippleContainer]}>


                <Animated.View
                    style={{
                        width: size1,
                        height: size1,
                        borderRadius: border1,
                        // transform: [{ rotate }, { rotateY: rotate}],
                        backgroundColor: colors.colorMain,
                        opacity: fadeOut1,
                        position: "absolute"
                    }}
                />
                <Animated.View
                    style={{
                        width: size2,
                        height: size2,
                        borderRadius: border2,
                        // transform: [{ rotate }, { rotateY: rotate}],
                        backgroundColor: colors.colorMain,
                        opacity: fadeOut2,
                        position: "absolute"
                    }}
                />


                <Animated.View
                    style={{
                        width: size3,
                        height: size3,
                        borderRadius: border3,
                        // transform: [{ rotate }, { rotateY: rotate}],
                        backgroundColor: colors.colorMain,
                        opacity: fadeOut3,
                        position: "absolute"
                    }}
                />

                <Animated.View
                    style={{
                        width: size4,
                        height: size4,
                        borderRadius: border4,
                        // transform: [{ rotate }, { rotateY: rotate}],
                        backgroundColor: colors.colorMain,
                        opacity: fadeOut4,
                        position: "absolute"
                    }}
                />

                <Animated.View
                    style={{
                        width: size5,
                        height: size5,
                        borderRadius: border5,
                        // transform: [{ rotate }, { rotateY: rotate}],
                        backgroundColor: colors.colorMain,
                        opacity: fadeOut5,
                        position: "absolute"
                    }}
                />


            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});