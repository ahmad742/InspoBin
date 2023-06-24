import { StyleSheet } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import { colors } from '../../../Utils/colors'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        paddingHorizontal: 1
    },
    loginText: {
        color: colors.black,
        fontSize: 20,
        fontFamily: Fonts.Bold,
        marginTop: 50,
        marginBottom: 30,
        alignSelf: 'center'
    },
    verifyText: {
        fontFamily: Fonts.Regular,
        color: colors.black,
        width: '90%',
    },
    otpTime: {
        color: colors.primary,
        textDecorationLine: 'underline',
        width: '10%',
    },
    otpContainerStyle: {
        marginTop: 30,
        marginBottom: 20,
    },
    signUpStyle: {
        color: colors.primary,
        fontFamily: Fonts.Regular,
        marginTop: 120,
        alignSelf: 'center'

    },
    btnStyle: {
        marginTop: 15,
    },
    labelStyle: {
        fontSize: 14,
    },
})
export default styles

