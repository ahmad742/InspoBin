import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image
} from 'react-native'
import { WebView } from 'react-native-webview';
import {_Base} from '../../../Api/config'
// ----------------------------------------------
import Images from '../../../Assets/Images'
import styles from './styles'
import colors from '../../../Utils/colors'

const PrivacyPolicy = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:colors.white }}>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }} >
                <Image
                    style={[styles.leftIconStyle]}
                    source={Images.arrowIcon}
                />
            </TouchableOpacity>
            <WebView
                source={{ uri: `https://inspobin.com/privacy` }}
                style={{ marginTop: 45 }}
            />

        </SafeAreaView>
    )
}



export default PrivacyPolicy