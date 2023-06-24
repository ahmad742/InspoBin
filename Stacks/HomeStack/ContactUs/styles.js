import { StyleSheet } from "react-native"
import Fonts from "../../../Assets/Fonts"
import colors from "../../../Utils/colors"
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.background,
        alignItems: 'center',
        paddingHorizontal: 15,

    },
    mainImage: {
        height: 300,
        width: 300,
        resizeMode: 'contain',
    },
    msgField: {
        height: 150,
        width: "100%"
    },
    active: {
        backgroundColor: colors.primary,
        borderWidth: 0,
    },
    imageContainer: {
        flexDirection: "row",
        height: 80,
        width: '100%',
        //   backgroundColor: 'red',
        marginTop: 30,
    },
    addIcon: {
        height: 70,
        width: 70,
        resizeMode: 'contain',
        marginRight: 20
    },
    bottomInfo: {
        color: colors.black,
        fontFamily:Fonts.Regular,
        marginTop: 20
    },


})
export default styles