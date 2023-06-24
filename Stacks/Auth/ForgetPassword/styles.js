import { StyleSheet } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import { colors } from '../../../Utils/colors'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',

    },
    forgetText: {
        color: colors.black,
        fontSize: 20,
        fontFamily: Fonts.Bold,
        marginTop: 50,
        marginBottom: 30,
    },
    verifyText: {
        fontFamily: Fonts.Regular,
        color: colors.black,
        width: '90%',
        marginBottom: 20
    },
    leftIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    inputStyle: {
        paddingLeft: 15,
    },
    bottomTextStyle: {
        color: "#525252",
        fontFamily: Fonts.Regular,
    },
    signUpStyle: {
        color: colors.primary,
        fontFamily: Fonts.SemiBold,

    },
    btnStyle: {
        marginTop: 15,
    },
    labelStyle: {
        fontSize: 14,
    },
})
export default styles

