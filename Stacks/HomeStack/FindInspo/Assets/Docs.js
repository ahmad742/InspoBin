import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
// --------------------------------------

import colors from '../../../../Utils/colors';
import Fonts from '../../../../Assets/Fonts';
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import DetailModal from '../../../../Components/InpsoDetailModal';
import Header from '../../../../Components/Header';
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
const { height } = Dimensions.get('window');

const UploadedDocs = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [docs, setDocs] = useState([]);
  const [detailModal, setDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // getAssetsApi(1);
      // getDocs(1)
      if (data) {setDocs(data)}
      else{ getDocs(1) };
    }
  }, []);

  const getDocs = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=`+page,
      data: {
        name: 'doc',
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + loginUserData?.token
      }


    }).then((response) => {
      console.log('getDocs---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.docs?.current_page === 1) {
          console.log('In IF');
          if (docs.length != 0) {
            setTotalPage(response?.data?.docs?.last_page);
            setDocs(response?.data?.docs?.data);
          } else {
            setTotalPage(response?.data?.docs?.last_page);
            setDocs(response?.data?.docs?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = docs;
          tempArray.push(...response?.data?.docs?.data);
          setDocs(tempArray);
          if (keyword) filterForKeyword()
        }
      } else {
        SimpleToast.show('Something went wrong');

      }
    }).catch((error) => {
      console.log('Docs Error', error);
    })
  }




  const getAssetsApi = (page) => {

    let bodyFormData = new FormData();
    bodyFormData.append('name', 'doc');

    client.post(`/dashboard?page=${page}`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('getAssetsApi-Media(Docs)', response?.data?.docs?.data);
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.docs?.current_page === 1) {
          console.log('In IF');
          if (docs.length != 0) {
            setTotalPage(response?.data?.docs?.last_page);
            setDocs(response?.data?.docs?.data);
          } else {
            setTotalPage(response?.data?.docs?.last_page);
            setDocs(response?.data?.docs?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = docs;
          tempArray.push(...response?.data?.docs?.data);
          setDocs(tempArray);
          
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
    bodyFormData.append('name', 'media');

    client.post(`/deletefile`, body={id:id,name:'media'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Document)', response.data);
      if (response.data.status == 200) {
        console.log('Document deleted');
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
    setDocs(docs.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Document deleted');

  }
  const filterForKeyword = () => {
    const filtered = docs.filter((item) => item?.title === keyword)
    setDocs(filtered)
  }
  const renderItem = ({ item, index }) => {
    // console.log('Doc Item', item);
    return (
      <Pressable
        onPress={() => {
          setLoading(true)
          setDetailModal(true);
          setTimeout(() => {
            setLoading(false)
          }, 2000);
          dispatch(AssetsList(docs))
          dispatch(SelectedItemIndex(index))
        }}
        style={[styles.docContainer, { width: '31%' }]}>
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
        <Image style={styles.Image} source={
          item.file.includes('.pptx') ?
            Images.ppt :
            item.file.includes('.xlsx') ?
              Images.xls :
              item.file.includes('.docx') ?
                Images.doc :
                item.file.includes('.pdf') ?
                  Images.pdf
                  : null

        } resizeMode='contain' />

      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Docs Uploaded'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />


      <FlatList
        numColumns={3}
        data={docs}
        extraData={docs}
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
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Docs Uploaded'}</Text>
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
            getDocs(val);
          }
        }}
      />

      <DetailModal
        modalVisible={detailModal}
        type={'Docs'}
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
  docContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 1
  },
  Image: {
    width: 40,
    height: 40,
  },
});

export default UploadedDocs;
