import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './Login'
import ForgetPassword from './ForgetPassword'
import SignUp from './SignUp'
import OTP from './OTP'
import TermsAndConditions from '../HomeStack/TermsAndConditions'
import ManageSubscription from '../HomeStack/ManageSubscription'
import PrivacyPolicy from '../HomeStack/PrivacyPolicy'
import ContactUs from '../HomeStack/ContactUs'

const Stack = createStackNavigator()
const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="OTP" component={OTP} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
            <Stack.Screen name={'ContactUs'} component={ContactUs} />



        </Stack.Navigator>
    )
}

export default AuthStack

const styles = StyleSheet.create({})
