import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native'

// --------------------------------------

import colors from '../../../../Utils/colors';
import AppButton from '../../../../Components/AppButton';
import AvatarComponent from '../../../../Components/AvatarComponent';
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import Header from '../../../../Components/Header';
import ImageDetailModal from '../../../../Components/InpsoDetailModal';
import Fonts from '../../../../Assets/Fonts';
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
const { height } = Dimensions.get('window');

const Sketches = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [imageDetailModal, setImageDetailModal] = useState(false);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // getSketch(1)
    //  getAssetsApi(1);
    if (data) {setImages(data)}
    else{ getSketch(1) };
    }
  }, []);

  const getSketch = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=`+page,
      data: {
        name: 'sketch',
      },

      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+loginUserData?.token
      }


    }).then((response) => {
      console.log('getSketches---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);
        if (response.data.status == 200) {
          setLoading(false);
  
          if (response?.data?.sketches?.current_page === 1) {
            console.log('In IF');
            if (images.length != 0) {
              setTotalPage(response?.data?.sketches?.last_page);
              setImages(response?.data?.sketches?.data);
            } else {
              setTotalPage(response?.data?.sketches?.last_page);
              setImages(response?.data?.sketches?.data);
            }
          } else {
            console.log('In Else');
            let array = images;
            array.push(...response?.data?.sketches?.data);
            setImages(array);
          }
        } else {
          SimpleToast.show('Something went wrong');
        }
      }
    }).catch((error) => {
      console.log('Sketches Error', error);
    })
  }




  const getAssetsApi = (page) => {

    let bodyFormData = new FormData();
    bodyFormData.append('name', 'sketch');

    client.post(`/dashboard?page=${page}`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('getAssetsApi-Sketches', response?.data?.sketches?.data);
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.sketches?.current_page === 1) {
          console.log('In IF');
          if (images.length != 0) {
            setTotalPage(response?.data?.sketches?.last_page);
            setImages(response?.data?.sketches?.data);
          } else {
            setTotalPage(response?.data?.sketches?.last_page);
            setImages(response?.data?.sketches?.data);
          }
        } else {
          console.log('In Else');
          let array = images;
          array.push(...response?.data?.sketches?.data);
          setImages(array);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch(err => {
      setLoading(false);
      SimpleToast.show('Something went wrong');
      console.log('getAssetsApi-err', err);
    });
  };
  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', 'media');

    client.post(`/deletefile`, body={id:id,name:'media'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Sketches)', response.data);
      if (response.data.status == 200) {
        SimpleToast.show('Sketch deleted');
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

  }

  const renderItem = ({ item, index }) => {
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
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.appBackground,
      }}>
      <Header
        heading={'Sketches'}
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
        keyExtractor={(item, index) => `${item.id}_${index}`}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          alignSelf: 'center',
          paddingHorizontal: 10,
          marginTop: 3,
          width: '100%',
        }}
        renderItem={renderItem}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={() => {
          if (!loading) return (
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Sketches Found'}</Text>
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
            getSketch(val);
          }
        }}
      />


      <ImageDetailModal
        type={'Sketches'}
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
    backgroundColor: colors.white,
    borderRadius: 10,

  },
  Image: {
    width: '100%',
    height: 85,
    borderRadius: 10,
  },
});

export default Sketches;
