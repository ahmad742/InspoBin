import { Dimensions, StyleSheet } from "react-native"
import Images from "../../Assets/Images"
import colors from '../../Utils/colors'




const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    renderItemContainer: {
        width: Dimensions.get('window').width,
        height: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        // marginLeft:5
    },
    btnStyle: {
        width: "90%",
        position: "absolute",
        bottom: '3%',
        alignSelf: 'center',
        borderColor: colors.primary,
        backgroundColor: colors.white
    },
})

export default styles