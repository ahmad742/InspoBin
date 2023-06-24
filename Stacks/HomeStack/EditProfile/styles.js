import { StyleSheet } from "react-native"
import Fonts from "../../../Assets/Fonts"
import colors from "../../../Utils/colors"

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        paddingHorizontal: 15
    },
    icon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        marginLeft: 140,
        tintColor: colors.primary,
    },
    buttonView: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    buttonStyle: {
        width: 175
    },
    cancel: {
        color: colors.primary,
        justifyContent: "center",
        alignItems: 'center',
        fontFamily: Fonts.SemiBold

    },
})

export default styles
