import { StyleSheet } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import { colors } from '../../../Utils/colors'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
    },
    signupText: {
        color: colors.black,
        fontSize: 20,
        fontFamily: Fonts.Bold,
        marginTop: 30,
        marginBottom: 30,
    },
    leftIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    inputStyle: {
        paddingHorizontal: 15,
        width: '88%',
    },
    bottomTextStyle:
    {
        color: "#525252",
        fontFamily: Fonts.Regular,
    },
    signUpStyle: {
        color: colors.primary,
        fontFamily: Fonts.SemiBold,

    },
    btnStyle: {
        marginTop: 15,
        backgroundColor: colors.black
    },
    checkContainer: {
        marginTop: 12,
        marginBottom: 30,
    },
privacyContainer: {
        marginBottom: 30,
    },
    checkText: {
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    active: {
        backgroundColor: colors.primary,
        borderWidth: 0,
    },
    labelStyle: {
        fontSize: 14,
    },
})
export default styles

