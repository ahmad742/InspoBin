import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustomBtn from '../../../Components/CustomBtn'
import styles from './styles'

const Setting = ({ navigation }) => {
    return (
        <SafeAreaView
            style={styles.mainContainer}
        >
            <CustomBtn
                label={"Manage Profile"}
                onPress={() => navigation.navigate('Profile')}
            />
            <CustomBtn
                label={"Privacy Policy"}
            />
            <CustomBtn
                label={"Report Bug Info"}
            />
            <CustomBtn
                label={"Contact Us"}
            />

        </SafeAreaView>
    )
}

export default Setting

