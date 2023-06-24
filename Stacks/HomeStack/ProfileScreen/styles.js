import { StyleSheet } from 'react-native';
import Fonts from '../../../Assets/Fonts';
import { colors } from '../../../Utils/colors'


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },
    infoContainer: {
        marginTop: 30,
        height: "auto",
        // backgroundColor:'pink',
        width: "90%"
    },
    nameContainer: {
        height: 40,
        width: '100%',
        flexDirection: "row",
        marginBottom: 15,
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 24,
        color: colors.black,
        fontFamily: Fonts.Bold,
        alignSelf: 'center'
    },
    editButton: {
        height: 38,
        width: 120,
    },
    textStyle: {
        fontSize: 12,
        fontFamily: Fonts.SemiBold,
    },
    bottomContainer: {
        height: "auto",
        width: '100%',
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,

    },
    text1: {
        color: colors.placeHolder,
        width: "25%",
        fontFamily: Fonts.Regular,
    },
    text2: {
        color: colors.black,
        width: '75%',
        paddingHorizontal:10,
        fontFamily: Fonts.Regular,
    },
})

export default styles;
