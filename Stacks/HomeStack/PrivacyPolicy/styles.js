import { StyleSheet } from "react-native"
import Fonts from "../../../Assets/Fonts"
import { colors } from '../../../Utils/colors'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height:50,
        paddingHorizontal:15,
        justifyContent:'center',
        position: 'absolute',
        width: '100%',
        // opacity: 0.4,
        padding: 10,

    },
    leftIconStyle: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
        tintColor: colors.black,
        zIndex:999,
        left:10
    },
});

export default styles