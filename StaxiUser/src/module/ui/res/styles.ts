import { StyleSheet } from "react-native";
import dimens from "./dimen/dimens";
import colors from "../../../res/colors";
import fonts from "../../../res/fonts";

export default StyleSheet.create({
    button: {
      paddingVertical: dimens.btn_padding_vertical,
      // paddingHorizontal: dimens.btn_padding_hoz,
      backgroundColor: colors.colorMain,
      alignItems: "center",
      justifyContent: "center"
    },
    text: {
      color: colors.colorWhiteMedium,
      fontWeight: "bold",
      fontSize: fonts.text_size
    }
  });