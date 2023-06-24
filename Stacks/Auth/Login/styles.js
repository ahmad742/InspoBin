import { StyleSheet } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import { colors } from '../../../Utils/colors'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        paddingHorizontal:15
    },
    logo: {
        height: 200,
        width: 200,
        resizeMode: "contain",
        marginTop: 30,
    },
    loginText: {
        color: colors.black,
        fontSize: 20,
        fontFamily: Fonts.Bold,
        marginTop: 50,
        marginBottom: 30,
    },
    leftIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    bottomTextStyle: {
        color: "#525252",
        fontFamily: Fonts.Regular,
    },
    signUpStyle: {
        color: colors.primary,
        fontFamily: Fonts.SemiBold,

    },
    forgetStyle: {
        color: colors.primary,
        fontFamily: Fonts.Regular,
        marginTop:100

    }
})
export default styles

