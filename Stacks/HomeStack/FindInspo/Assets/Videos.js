import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native'
import VideoPlayer from 'react-native-video-player';
import { Thumbnail } from 'react-native-thumbnail-video';
// --------------------------------------

import colors from '../../../../Utils/colors';
import Fonts from '../../../../Assets/Fonts';
import AppButton from '../../../../Components/AppButton';
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import Header from '../../../../Components/Header';
import DetailModal from '../../../../Components/InpsoDetailModal';
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
const { height } = Dimensions.get('window');

const Videos = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [detailModal, setDetailModal] = useState(false);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
    //  getAssetsApi(1);
    // getVideos(1)
    if (data) {setVideos(data)}
    else{ getVideos(1) };
    
    }
  }, []);

  const getVideos = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=`+page,
      data: {
        name: 'video',
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+loginUserData?.token
      }


    }).then((response) => {
      
      if (response.data.status == 200) {
        setLoading(false);
        if (response?.data?.videos?.current_page === 1) {
          console.log('In IF');
          if (videos.length != 0) {
            setTotalPage(response?.data?.videos?.last_page);
            setVideos(response?.data?.videos?.data);
            console.log('getVideos---------------', response.data)
          } else {
            setTotalPage(response?.data?.videos?.last_page);
            setVideos(response?.data?.videos?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = videos;
          tempArray.push(...response?.data?.videos?.data);
          setVideos(tempArray);

        }
      } else {
        console.log('===In else===');
      }
    }).catch((error) => {
      console.log('Videos Error', error);
    })
  }

  // const getAssetsApi = (page) => {

  //   let bodyFormData = new FormData();
  //   bodyFormData.append('name', 'video');

  //   client.post(`/dashboard?page=${page}`, bodyFormData, {
  //     headers: {
  //       Authorization: `Bearer ${loginUserData?.token}`,
  //     },
  //   }).then(response => {
  //     console.log('getAssetsApi-Media(Videos)', response?.data?.videos?.data);
  //     if (response.data.status == 200) {
  //       setLoading(false);
  //       if (response?.data?.videos?.current_page === 1) {
  //         console.log('In IF');
  //         if (videos.length != 0) {
  //           setTotalPage(response?.data?.videos?.last_page);
  //           setVideos(response?.data?.videos?.data);
  //         } else {
  //           setTotalPage(response?.data?.videos?.last_page);
  //           setVideos(response?.data?.videos?.data);
  //         }
  //       } else {
  //         console.log('In Else');
  //         let tempArray = videos;
  //         tempArray.push(...response?.data?.videos?.data);
  //         setVideos(tempArray);
  //       }
  //     } else {
  //       console.log('In else');
  //     }
  //   }).catch(err => {
  //     setLoading(false);
  //     SimpleToast.show('Something went wrong');
  //     console.log('getDashboardApi-err', err);
  //   });
  // };

  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', 'media');

    client.post(`/deletefile`, body={id:id,name:'media'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Video)', response.data);
      if (response.data.status == 200) {
        console.log('Video deleted');
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
    setVideos(videos.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Video deleted');

  }

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setLoading(true)
          setDetailModal(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          dispatch(AssetsList(videos))
          dispatch(SelectedItemIndex(index))
        }}
        style={[styles.videoContainer, { width: '31%' }]}>
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

        <Image style={styles.Image} source={Images.play} resizeMode='contain' />

      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Videos Uploaded'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />


      <FlatList
        numColumns={3}
        data={videos}
        extraData={videos}
        keyExtractor={(item, index) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          alignSelf: 'center',
          paddingHorizontal: 10,
          marginTop: 3,
          width: '100%'
        }}
        renderItem={renderItem}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={value => {
          console.log('my scroll begin');
        }}
        ListEmptyComponent={() => {
          if (!loading) return (
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Videos Uploaded'}</Text>
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
           getVideos(val);
          }
        }}
      />



      <DetailModal
        modalVisible={detailModal}
        type={'Videos'}
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
  videoContainer: {
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'black'
  },
  Image: {
    width: 15,
    height: 15,
    tintColor: colors.white
  },
});

export default Videos;
