import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native'
import VideoPlayer from 'react-native-video-player';
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
// --------------------------------------

import colors from '../../../../Utils/colors';
import Fonts from '../../../../Assets/Fonts';
import AppButton from '../../../../Components/AppButton';
import DetailModal from '../../../../Components/InpsoDetailModal'
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import Header from '../../../../Components/Header';

const { height } = Dimensions.get('window');

const Audios = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [detailModal, setDetailModal] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      //   console.log("Auth Token", loginUserData)
      setLoading(true);
      //getAssetsApi(1);
      // getAudios(1)
      if (data) {setAudios(data)}
      else{ getAudios(1) };
    }
  }, []);

  const getAudios = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=` + page,
      data: {
        name: 'audio',
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + loginUserData?.token
      }


    }).then((response) => {
      console.log('getaudios---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.audios?.current_page === 1) {
          console.log('In IF');
          if (audios.length != 0) {
            setTotalPage(response?.data?.audios?.last_page);
            setAudios(response?.data?.audios?.data);
          } else {
            setTotalPage(response?.data?.audios?.last_page);
            setAudios(response?.data?.audios?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = audios
          tempArray.push(...response?.data?.audios?.data);
          setAudios(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch((error) => {
      console.log('Audio Error', error);
    })
  }




  const getAssetsApi = (page) => {

    let bodyFormData = new FormData();
    bodyFormData.append('name', 'audio')

    client.post(`/dashboard?page=${page}`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('getAssetsApi-Media(Audios)', response.data.audios.data);
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.audios?.current_page === 1) {
          console.log('In IF');
          if (audios.length != 0) {
            setTotalPage(response?.data?.audios?.last_page);
            setAudios(response?.data?.audios?.data);
          } else {
            setTotalPage(response?.data?.audios?.last_page);
            setAudios(response?.data?.audios?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = audios
          tempArray.push(...response?.data?.audios?.data);
          setAudios(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch(err => {
      setLoading(false);
      SimpleToast.show('Something went wrong');
      console.log('getAssetsApi-Media(Audios)-err', err);
    });
  };

  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', 'media');

    client.post(`/deletefile`, body={'id':id,name:'media'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Audio)', response.data);
      if (response.data.status == 200) {
        console.log('Audio deleted');
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch(err => {
      SimpleToast.show('Something went wrong');
      console.log('deleteAssetApi-err', err);
    });
  };

  const deleteRecord = (id) => {
    console.log('in delete fn');
    setAudios(audios.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Audio deleted');
  }
  const filterForKeyword = () => {
    const filtered = audios.filter((item) => item?.title === keyword)
    setAudios(filtered)
  }
  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        activeOpacity={0.4}
        onPress={() => {
          setLoading(true)
          setDetailModal(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          dispatch(AssetsList(audios))
          dispatch(SelectedItemIndex(index))
        }}
        style={[styles.audioContainer, { width: '31%' }]}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          paddingHorizontal: 5,
          height: 25,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          width: '50%',
          backgroundColor: colors.white,
          elevation: 4
        }}>
          {
            item?.title?.length > 5 ?
              <Text>{item?.title.substring(0, 5) + '...'}</Text>
              :
              <Text>{item?.title}</Text>
          }
        </View>
        <Image style={styles.playIcon} source={Images.play} resizeMode='contain' />
      </Pressable>
    );
  };

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Audios Uploaded'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />
      <FlatList
        data={audios}
        extraData={audios}
        numColumns={3}
        keyExtractor={(item, index) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          alignSelf: 'center',
          paddingHorizontal: 5,
          marginTop: 5,
          width: '100%'
        }}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => {
          if (!loading) return (
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Audios Uploaded'}</Text>
          );
          return (
            <ActivityIndicator
              size={'large'}
              color={colors.primary}
              style={{ marginTop: height / 2 }}
            />
          );
        }}
        onEndReached={value => {
          console.log('On end reached');
          let val = pageCount + 1;
          if (pageCount <= totalPage) {
            setPageCount(val);
            getAudios(val);
          }
        }}
      />

      <DetailModal
        modalVisible={detailModal}
        type={'Audios'}
        quitClick={() => {
          setDetailModal(false);
        }}
        deleteItem={(id) => {
          // console.log(id);
          deleteRecord(id)
          deleteAssetApi(id)
        }}
        loading={loading}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'black'
  },
  playIcon: {
    width: 15,
    height: 15,
    tintColor: colors.white
  },
});

export default Audios;
