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
import axios from 'axios';
import { BASE_URL } from '../../../../Api/config';
// --------------------------------------

import colors from '../../../../Utils/colors';
import AppButton from '../../../../Components/AppButton';
import Images from '../../../../Assets/Images';
import { client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets';
import Header from '../../../../Components/Header';
import DetailModal from '../../../../Components/InpsoDetailModal';
import Fonts from '../../../../Assets/Fonts';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const Notes = ({ navigation, route }) => {
  const data = route?.params?.data || ""
  console.log("API DATA=====>>>>>>>>>>", data)
  const { loginUserData } = useSelector(state => state.Auth);
  const dispatch = useDispatch()

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [detailModal, setDetailModal] = useState(false);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
     // getAssetsApi(1);
    //  getNotes(1)
     if (data) {setNotes(data)}
     else{ getNotes(1) };
    }
  }, []);

  const getNotes = (page) => {

    axios({
      method: 'post',
      url: `${BASE_URL}/dashboard?page=`+page,
      data: {
        name: 'note',
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+loginUserData?.token
      }


    }).then((response) => {
      console.log('getNotes---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.notes?.current_page === 1) {
          console.log('In IF');
          if (notes.length != 0) {
            setTotalPage(response?.data?.notes?.last_page);
            setNotes(response?.data?.notes?.data);
          } else {
            setTotalPage(response?.data?.notes?.last_page);
            setNotes(response?.data?.notes?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = notes;
          tempArray.push(...response?.data?.notes?.data);
          setNotes(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch((error) => {
      console.log('Notes Error', error);
    })
  }



  const getAssetsApi = (page) => {

    let bodyFormData = new FormData();
    bodyFormData.append('name', 'note')

    client.post(`/dashboard?page=${page}`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('getAssetsApi-notes', response?.data?.notes?.data);
      if (response.data.status == 200) {
        setLoading(false);

        if (response?.data?.notes?.current_page === 1) {
          console.log('In IF');
          if (notes.length != 0) {
            setTotalPage(response?.data?.notes?.last_page);
            setNotes(response?.data?.notes?.data);
          } else {
            setTotalPage(response?.data?.notes?.last_page);
            setNotes(response?.data?.notes?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = notes;
          tempArray.push(...response?.data?.notes?.data);
          setNotes(tempArray);
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
    bodyFormData.append('name', 'note');

    client.post(`/deletefile`, body={id:id,name:'note'}, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi-(Note)', response.data);
      if (response.data.status == 200) {
        console.log('Note deleted');
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
    setNotes(notes.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Note deleted');

  }
  const filterForKeyword = () => {
    const filtered = notes.filter((item) => item?.title === keyword)
    setNotes(filtered)
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
          dispatch(AssetsList(notes))
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
        <Image source={Images.textFile} style={styles.Image} />
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Notes Pasted'}
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
          paddingHorizontal: 10,
          //   backgroundColor: colors.appBackground,
          height: height,
        }}>

        <FlatList
          data={notes}
          extraData={notes}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{
            alignSelf: 'center',
            paddingHorizontal: 5,
            marginTop: 5,
            width: '100%',
          }}
          ListEmptyComponent={() => {
            if (!loading) return (
              <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Notes Found'}</Text>
            );
            return (
              <ActivityIndicator
                size={'large'}
                color={colors.primary}
                style={{ marginTop: height / 2 }}
              />
            );
          }}
          onEndReachedThreshold={0.5}
          onEndReached={value => {
            console.log('On end reached');
            let val = pageCount + 1;
            if (pageCount <= totalPage) {
              setPageCount(val);
              getNotes(val);
            }
          }}
        />

      </View>


      <DetailModal
        modalVisible={detailModal}
        type={'Notes'}
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
  title: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.SemiBold,
  },
  desc: {
    fontSize: 12,
    color: colors.black,
    fontFamily: Fonts.Regular,
  },
  Image: {
    width: 40,
    height: 40,
  },
});

export default Notes;
