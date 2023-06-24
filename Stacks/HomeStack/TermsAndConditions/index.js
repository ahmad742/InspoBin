import React from 'react'
import {
    View,
    SafeAreaView,
    TouchableOpacity,
    Image
} from 'react-native'
import { WebView } from 'react-native-webview';
import { BASE_URL,_Base } from '../../../Api/config';
// ----------------------------------------------
import styles from './styles'
import Images from '../../../Assets/Images'
import colors from '../../../Utils/colors';


const TermsAndConditions = ({ navigation }) => {
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor:colors.white }}>
           
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                    console.log('hiibshbja');
                }} >
                    <Image
                        style={[styles.leftIconStyle]}
                        source={Images.arrowIcon}
                    />
                </TouchableOpacity>
      
            <WebView
                source={{ uri: `https://inspobin.com/terms-condition` }}
                style={{ marginTop: 25 }}
            />
            
        </SafeAreaView>
    )
}

export default TermsAndConditions

