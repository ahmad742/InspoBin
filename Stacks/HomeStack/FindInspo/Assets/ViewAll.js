import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
// --------------------------------------

import colors from '../../../../Utils/colors';
import Fonts from '../../../../Assets/Fonts';
import CategoryBtn from '../CategoryBtn';
import Images from '../../../../Assets/Images';
import Header from '../../../../Components/Header';

const { height } = Dimensions.get('window');

const ViewAll = ({ navigation }) => {




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'View All'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}>

        <CategoryBtn
          headerName={'Images'}
          clickAction={() => {
            navigation.navigate('Images');
          }}
        />
        <CategoryBtn
          headerName={'Sketches'}
          clickAction={() => {
            navigation.navigate('Sketches');
          }}
        />

        <CategoryBtn
          headerName={'Videos'}
          clickAction={() => {
            navigation.navigate('Videos');
          }}
        />

        <CategoryBtn
          headerName={'Docs'}
          clickAction={() => {
            navigation.navigate('Docs');
          }}
        />

        <CategoryBtn
          headerName={'Links'}
          clickAction={() => {
            navigation.navigate('Links');
          }}
        />

        <CategoryBtn
          headerName={'Notes'}
          clickAction={() => {
            navigation.navigate('Notes');
          }}
        />
        
        <CategoryBtn
          headerName={'Audio'}
          clickAction={() => {
            navigation.navigate('Audios');
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  mainContainer: {
    paddingHorizontal: 15,
    // backgroundColor:'pink'
  },
});

export default ViewAll;
