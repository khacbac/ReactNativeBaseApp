import ScreenUtils from "../module/ui/res/dimen/ScreenUtils";
import fonts from "../module/ui/res/dimen/fonts";


function size(percent: number) {
    return ScreenUtils.dimentsSizer(percent);
}


export default {
    ...fonts,
}


