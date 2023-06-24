import { StyleSheet } from 'react-native'
import Fonts from '../../../Assets/Fonts'
import colors from '../../../Utils/colors'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 5,
        alignItems: 'center',
    },
    mainContainer: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    categoryMainContainer: {
        width: '100%',
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    activeText: {
        color: colors.white
    },
    activeBackground: {
        width: '30%',
        backgroundColor: colors.primary
    },
    unActivectiveBackground: {
        width: '30%'
    },
    mainContainerCategoryHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%'
    },
    previewText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.Bold
    },
    changeText: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: Fonts.Regular,
    },
    componentContainer: {
        padding: 15,
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'

    },
    backgroundVideo: {
        width: '100%',
        height: 160,
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        borderRadius: 2,
        backgroundColor: colors.white,

    },
    playBtn: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    videoContainer: {
        height: 180,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        // backgroundColor:'pink'
    },
    imageStyle: {
        width: '100%',
        height: 150,
        resizeMode: 'contain'
    },
    urlText: {
        color: colors.primary
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width:'80%',
        alignSelf:'center'
    },
    radioView: {
        marginRight: 10,
        marginTop: 8
    },
    radioViewImage: {
        marginRight: 6,
        marginTop: 8
    },
    active: {
        borderColor: colors.primary,
        borderWidth: 5,
    },
    audioMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderRadius: 8,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: 15
    },
    playBtn: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    timerMainerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timerText: {
        color: colors.black,
        marginRight: 7,
        fontSize: 12
    },
    alert: {
        height: 25,
        width: 25
    }
})
