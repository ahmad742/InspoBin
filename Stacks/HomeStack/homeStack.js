import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import images from '../../Assets/Images';

//====================Screens====================
import HomeScreen from './HomeScreen';
import Setting from './Setting';
import FindInspo from './FindInspo';
import ProfileScreen from './ProfileScreen';
import ChangePassword from './ChangePassword';
import ManageSubscription from './ManageSubscription';
import EditProfile from './EditProfile';
import PrivacyPolicy from './PrivacyPolicy';
import ContactUs from './ContactUs';
import Images from './FindInspo/Assets/Images';
import Sketches from './FindInspo/Assets/Sketches';
import Videos from './FindInspo/Assets/Videos'
import Links from './FindInspo/Assets/Links';
import Notes from './FindInspo/Assets/Notes';
import Docs from './FindInspo/Assets/Docs'
import Audios from './FindInspo/Assets/Audios'
import ViewAll from './FindInspo/Assets/ViewAll';
import SearchedData from './FindInspo/SearchedData/SearchedData';
import EditAsset from './EditAsset/index'
import TermsAndConditions from './TermsAndConditions';

//========================================
import colors from '../../Utils/colors';
import Fonts from '../../Assets/Fonts';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Home = createStackNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 80 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        },
        tabBarLabelStyle: { fontFamily: Fonts.SemiBold },
      }}>
      <Tab.Screen
        options={{
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <Image
              source={images.addIcon}
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? colors.primary : 'gray',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
        name="Add Inspo"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={images.searchIcon}
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? colors.primary : 'gray',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
        name="Find Inspo"
        component={FindInspo}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={images.userIcon}
              style={{
                height: 25,
                width: 25,
                tintColor: focused ? colors.primary : 'gray',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};
const HomeStack = () => {
  return (
    <Home.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={'TabStack'}
        component={TabStack}
      />
      <Stack.Screen name={'ChangePassword'} component={ChangePassword} />
      <Stack.Screen name={'ManageSubscription'} component={ManageSubscription} />
      <Stack.Screen name={'EditProfile'} component={EditProfile} />
      <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
      <Stack.Screen name={'ContactUs'} component={ContactUs} />
      <Stack.Screen name={'Images'} component={Images} />
      <Stack.Screen name={'Sketches'} component={Sketches} />
      <Stack.Screen name={'Videos'} component={Videos} />
      <Stack.Screen name={'Links'} component={Links} />
      <Stack.Screen name={'Notes'} component={Notes} />
      <Stack.Screen name={'Docs'} component={Docs} />
      <Stack.Screen name={'Audios'} component={Audios} />
      <Stack.Screen name={'ViewAll'} component={ViewAll} />
      <Stack.Screen name={'SearchedData'} component={SearchedData} />
      <Stack.Screen name={'EditAsset'} component={EditAsset} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />



    </Home.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
