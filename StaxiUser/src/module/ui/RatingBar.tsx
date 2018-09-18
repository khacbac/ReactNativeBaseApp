
import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from '..';
import uiimages from './res/drawable/images';
import uicolors from './res/colors';
import uidimens from './res/dimen/dimens';

interface Props {
    onRating?: any;
    ratingStyle?: any;
    data?: Array<any>;
}

interface State {
    numRating: number;
}

export default class RatingBar extends React.Component<Props, State> {

    private data: {
        index: 1,
        isRated: false,
        status: ""
    }[];

    constructor(props) {
        super(props);
        this.data = this.props.data ? this.props.data : [];
        this.state = {
            numRating: 0,
        }
    }

    // Sự kiện người dùng rating.
    public onRating(item): void {
        let ratingList: Array<any> = new Array<any>();
        let count = 0;
        this.data.forEach((data, index) => {
            if (index <= item.index) {
                count++;
                ratingList.push({
                    index: index,
                    isRated: true
                })
            } else {
                ratingList.push({
                    index: index,
                    isRated: false
                })
            }
        });
        let statusRating = this.getStatusRating(count);
        // call back.
        this.props.onRating(count, statusRating);
        this.setState({
            numRating: count,
        })
    }

    // Lấy sô sao người dùng đã chọn.
    public getNumRating(): number {
        return this.state.numRating;
    }

    public getStaus(): string {
        return this.state.numRating > 0 && this.data[this.state.numRating - 1].status;
    }

    // Lấy thông tin rating từ người dùng.
    public getStatusRating(num): string {
        return this.data[num - 1].status;
    }

    render() {
        return (
            <View style={[styles.ratingBar, this.props.ratingStyle]}>
                {this.data.map((item: { isRated: boolean, index: number }, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{ padding: uidimens.dimen_ten }}
                            onPress={() => this.onRating(item)}>
                            <Image
                                source={uiimages.ic_star}
                                imgStyle={[
                                    styles.imgStar,
                                    { tintColor: item.index < this.state.numRating ? uicolors.colorSub : uicolors.colorGray, }
                                ]}
                            />
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ratingBar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    imgStar: {
        width: uidimens.rt_default_width,
        height: uidimens.rt_default_height,
    },
})