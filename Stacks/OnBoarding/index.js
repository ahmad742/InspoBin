import React, { useState, useRef } from 'react'
import {
    SafeAreaView,
    View,
    ImageBackground,
    TouchableOpacity,
} from 'react-native'
import Images from '../../Assets/Images'
import colors from '../../Utils/colors'
import AppButton from '../../Components/AppButton'
import styles from './styles'
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();

const OnBoarding = ({ navigation }) => {

    const [indicator, setIndicator] = useState(0)

    return (
        <SafeAreaView style={styles.mainContainer}>
                <ImageBackground
                    source={isTablet?Images.Intro2:Images.Intro}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={"cover"}>
                    <AppButton
                        onPress={() => {
                            navigation.replace('AuthStack')
                        }}
                        btnStyle={styles.btnStyle}
                        label={"CONTINUE"}
                        labelStyle={{ color: colors.primary }}
                    />
                </ImageBackground> 
        </SafeAreaView>
    )
}

export default OnBoarding


