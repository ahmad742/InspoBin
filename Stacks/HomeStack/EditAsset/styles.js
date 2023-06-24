import { StyleSheet } from "react-native"
import Fonts from "../../../Assets/Fonts"
import colors from "../../../Utils/colors"
const styles = StyleSheet.create({
    title: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.SemiBold,
    },
    desc: {
        fontSize: 12,
        color: colors.black,
        fontFamily: Fonts.Regular,
    },
    input: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        backgroundColor: colors.white,
        minHeight: 50,
        width: '99.5%',
        borderRadius: 10,
        elevation: 3,
        shadowOpacity: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        paddingHorizontal: 15
    },
    label: {
        color: colors.black,
        fontFamily: Fonts.SemiBold,
        marginLeft: 2,
    },
    descriptionText: {
        fontFamily: Fonts.Regular,
        color: colors.black,
    },
    buttonMainContainer: {
        // marginTop: 20,
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 16,
        // fontFamily: fonts.Medium,
        color: 'green',
    }


})
export default styles