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

// --------------------------------------

import colors from '../../../../Utils/colors';
import Images from '../../../../Assets/Images';
import { BASE_URL, client, IMAGE_BASE_URL } from '../../../../Api/config';
import DetailModal from '../../../../Components/InpsoDetailModal'
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import Header from '../../../../Components/Header';
import Fonts from '../../../../Assets/Fonts';
import axios from 'axios';
const { height } = Dimensions.get('window');

const Links = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
     // getAssetsApi(1);
    //  getLinks(1)
     if (data) {setLinks(data)}
     else{ getLinks(1) };
    }
  }, []);


  const getLinks = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=`+page,
      data: {
        name: 'link',
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+loginUserData?.token
      }


    }).then((response) => {
      console.log('getLinks---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.links?.current_page === 1) {
          console.log('In IF');
          if (links.length != 0) {
            setTotalPage(response?.data?.links?.last_page);
            setLinks(response?.data?.links?.data);
          } else {
            setTotalPage(response?.data?.links?.last_page);
            setLinks(response?.data?.links?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = links;
          tempArray.push(...response?.data?.links?.data);
          setLinks(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch((error) => {
      console.log('Link Error', error);
    })
  }


  const getAssetsApi = page => {

    let bodyFormData = new FormData();
    bodyFormData.append('name', 'link')

    client.post(`/dashboard?page=${page}`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('getAssetsApi-Links', response?.data?.links?.data);
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.links?.current_page === 1) {
          console.log('In IF');
          if (links.length != 0) {
            setTotalPage(response?.data?.links?.last_page);
            setLinks(response?.data?.links?.data);
          } else {
            setTotalPage(response?.data?.links?.last_page);
            setLinks(response?.data?.links?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = links;
          tempArray.push(...response?.data?.links?.data);
          setLinks(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch(err => {
      setLoading(false);
      SimpleToast.show('Something went wrong');
      console.log('getDashboardApi-err', err);
    });
  };

  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', 'link');

    client.post(`/deletefile`, body={id:id,name:'link'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Link)', response.data);
      if (response.data.status == 200) {
        console.log('Link deleted');
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
    setLinks(links.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Link deleted');

  }
  const filterForKeyword = () => {
    const filtered = links.filter((item) => item?.title === keyword)
    setLinks(filtered)
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
          dispatch(AssetsList(links))
          dispatch(SelectedItemIndex(index))
        }}
        style={[styles.textContainer, { width: '31%' }]}>
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
        <Image source={Images.link} style={styles.Image} />
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Links Pasted'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          //   backgroundColor: colors.appBackground,
          height: height,
        }}>

        <FlatList
          data={links}
          extraData={links}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          style={{ flexGrow: 1 }}
          ListEmptyComponent={() => {
            if (!loading) return (
              <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Links Found'}</Text>
            );
            return (
              <ActivityIndicator
                size={'large'}
                color={colors.primary}
                style={{ marginTop: height / 2 }}
              />
            );
          }}
          contentContainerStyle={{
            alignSelf: 'center',
            paddingHorizontal: 5,
            marginTop: 5,
            width: '100%',
          }}
          onEndReachedThreshold={0.5}
          onEndReached={value => {
            console.log('distance from end===', value);
            console.log('On end reached');

            let val = pageCount + 1;
            if (pageCount <= totalPage) {
              setPageCount(val);
              getLinks(val);
            }
          }}
        />

      </View>


      <DetailModal
        modalVisible={detailModal}
        type={'Links'}
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

    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 1
  },
  text: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: Fonts.SemiBold,
  },
  Image: {
    width: 40,
    height: 40,
  },
});

export default Links;
