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
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
// --------------------------------------

import colors from '../../../../Utils/colors';
import Fonts from '../../../../Assets/Fonts';
import AvatarComponent from '../../../../Components/AvatarComponent';
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import Header from '../../../../Components/Header';
import ImageDetailModal from '../../../../Components/InpsoDetailModal';

const { height } = Dimensions.get('window');

const Images_Pictures = ({ navigation, route }) => {

  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [imageDetailModal, setImageDetailModal] = useState(false);
  const [filterData, setFilterData] = useState([])

  const isFocused = useIsFocused()

  useEffect(() => {
    // console.log("loginUserData?.token===>>", loginUserData?.token);

    // console.log("in images");
    if (isFocused) {
      setLoading(true);
      // getAssetsApi(1);
      if (data) {setImages(data)}
      else{ getimages(1) };
      (function () {
        console.log(1);
        setTimeout(function () { console.log(2) }, 1000);
        setTimeout(function () { console.log(3) }, 0);
        console.log(4);
      })();
    }

  }, []);

  const getimages = (page) => {
    // return false

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=` + page,
      data: {
        name: 'image',
      },

      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + loginUserData?.token
      }


    }).then((response) => {
      // console.log('Get Images---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);
        if (response?.data?.images?.current_page === 1) {
          // console.log('In Images Component===>>>', response.data?.images?.data);
          if (images.length != 0) {
            setTotalPage(response?.data?.images?.last_page);
            setImages(response?.data?.images?.data);
          }
          else {
            setTotalPage(response?.data?.images?.last_page);
            setImages(response?.data?.images?.data);
          }
        } else {
          console.log('In Else ===');
          // if (keyword) {
          //   filterForKeyword()
          // }
          // else {
          let tempArray = images
          // console.log("in else ==>>>", tempArray);
          tempArray.push(...response?.data?.images?.data);
          setImages(tempArray);
          // console.log('Images response ', images);

          // }


        }
      } else {
        SimpleToast.show('Something went wrong');

      }

    }).catch((error) => {
      console.log('ImageError', error);
    })
  }

  const filterForKeyword = () => {
    const filtered = images.filter((item) => item?.title === keyword)
    // console.log("filltdf==>>", filtered);
    setImages(filtered)
  }

  // const getAssetsApi = (page) => {

  //   console.log(loginUserData?.token);
  //   console.log("PageParam", page);

  //   let bodyFormData = new FormData();
  //   bodyFormData.append('name', 'image');



  //   client.post(`/dashboard?page=${page}`, bodyFormData, {
  //     headers: {
  //       Authorization: 'Bearer 397|m6lHIP7TvcoIIZPxh82657sXEdWH56ZZbfy5GONK'
  //     },
  //   }).then(response => {
  //     console.log('getAssetsApi-Media(Images)', response);
  //     if (response.data.status == 200) {
  //       setLoading(false);

  //       if (response?.data?.images?.current_page === 1) {
  //         console.log('In IF');
  //         if (images.length != 0) {
  //           setTotalPage(response?.data?.images?.last_page);
  //           setImages(response?.data?.images?.data);
  //         } else {
  //           setTotalPage(response?.data?.images?.last_page);
  //           setImages(response?.data?.images?.data);
  //         }
  //       } else {
  //         console.log('In Else');
  //         let tempArray = images
  //         tempArray.push(...response?.data?.images?.data);
  //         setImages(tempArray);
  //       }
  //     } else {
  //       SimpleToast.show('Something went wrong');
  //     }
  //   }).catch(err => {
  //     setLoading(false);
  //     SimpleToast.show('Something went wrong');
  //     console.log('getAssetsApi-Media(Images)-err', err);
  //   });
  // };

  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', 'media');

    client.post(`/deletefile`, body = { id: id, name: 'media' }, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Images)', response.data);
      if (response.data.status == 200) {
        console.log('Image deleted');
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
    setImages(images.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Image deleted');
  }


  const renderItem = ({ item, index }) => {
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!', index);
    return (
      <Pressable
        activeOpacity={0.6}
        onPress={() => {
          setLoading(true)
          setImageDetailModal(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          dispatch(AssetsList(images))
          dispatch(SelectedItemIndex(index))

        }}
        style={[styles.imageContainer, { width: '31%' }]}>
        <AvatarComponent
          style={styles.Image}
          imageStyle={{ resizeMode: 'cover' }}
          source={`${item.file}`}

          // source={`${IMAGE_BASE_URL}${item.file}`}
          title={item.title}
        />
        {/* <Image style={{ width: '100%', height: 80, borderRadius: 10, }} resizeMode='cover' source={{ uri:item.file }} /> */}

        {/* <Image style={{ width: '100%', height: 80, borderRadius: 10, }} resizeMode='cover' source={{ uri: IMAGE_BASE_URL + item.file }} /> */}
      </Pressable>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Images'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />

      <FlatList
        numColumns={3}
        data={images}
        extraData={images}
        keyExtractor={(item, index) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          // flexGrow: 1,
          alignSelf: 'center',
          paddingHorizontal: 5,
          marginTop: 5,
          width: '100%',
        }}
        renderItem={renderItem}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={value => {
          console.log('my scroll begin');
        }}
        ListEmptyComponent={() => {
          if (!loading) return (
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Images Uploaded'}</Text>
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
            getimages(val);
          }
        }}
      />


      <ImageDetailModal
        type={'Images'}
        modalVisible={imageDetailModal}
        quitClick={() => {
          setImageDetailModal(false);
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
  imageContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  Image: {
    width: '100%',
    height: 85,
    borderRadius: 10,
  },
});

export default Images_Pictures;
