import { StyleSheet, Dimensions } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import colors from '../../../Utils/colors'

const { height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mainContainer: {
        paddingHorizontal: 15,
        paddingTop:15
        // backgroundColor:'pink'
    },
    searchMainContainer: {
        padding: 20,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        backgroundColor: colors.primary,
        marginTop: 16
    },
    mainContainerCategoryHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    total: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.Bold,
    },
    empty: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.Regular,
        marginTop: height / 4,
        alignSelf: 'center'
    },
    viewAll: {
        fontSize: 14,
        marginTop:15,
        color: colors.primary,
        fontFamily: Fonts.Regular,
    },
    searchMainBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    searchBtnStyle: {
        backgroundColor: colors.primary,
        width: 60,
        height: 35,
        marginRight: 10
    },
    imageContainer: {
        height: 85,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    videoContainer: {
        height: 85,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: 'black'
    },
    docContainer: {
        height: 85,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: colors.white,
        elevation: 1
    },
    docIcon: {
        width: 40,
        height: 40,
    },
    textContainer: {
        height: 85,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: colors.white,
        elevation: 1
    },
    Image: {
        width: '100%',
        height: 85,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    playIcon: {
        width: 15,
        height: 15,
        tintColor: colors.white
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.SemiBold,
        color: colors.black
    },
    emptyList: {
        fontSize: 15,
        fontFamily: Fonts.Regular,
        color: colors.black,
        marginTop: 15,
        alignSelf: 'center'
    }
})
