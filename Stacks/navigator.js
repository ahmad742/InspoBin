import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './Auth/authStack'
import Splash from './Splash'
import OnBoarding from './OnBoarding';
import HomeStack from './HomeStack/homeStack';


const Stack = createStackNavigator()
const navigator = () => {

    
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="OnBoarding" component={OnBoarding} />
                <Stack.Screen name="AuthStack" component={AuthStack} />
                <Stack.Screen name="HomeStack" component={HomeStack} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default navigator

const styles = StyleSheet.create({})
