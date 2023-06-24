import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
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
import AvatarComponent from '../../../../Components/AvatarComponent';
import Images from '../../../../Assets/Images';
import { BASE_URL, client, IMAGE_BASE_URL } from '../../../../Api/config';
import { Assets, AssetsList, SelectedItemIndex } from '../../../../Redux/Actions/UserAssets'
import {
  imageCount,
  sketchCount,
  videoCount,
  docCount,
  linkCount,
  noteCount,
  audioCount,
  total
} from '../../../../Redux/Actions/AssetCount'
import Header from '../../../../Components/Header';
import DetailModal from '../../../../Components/InpsoDetailModal';
import { TOTAL } from '../../../../Redux/Types/Index';
import axios from 'axios';
const { height } = Dimensions.get('window');

const SearchedData = ({ navigation }) => {

  const { loginUserData } = useSelector(state => state.Auth);
  const { assetName, keyword } = useSelector(state => state.FilterAsset)
  const { Total } = useSelector(state => state.AssetCount)
  const dispatch = useDispatch()

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [detailModal, setDetailModal] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [mediaType, setMediaType] = useState(assetName);


  useEffect(() => {
    setLoading(true);
    filteredApi(1);
  }, []);

  const filteredApi = (page) => {
    console.log("==== Filter API ===");
    const media =
      assetName === 'Images' ? 'image'
        : assetName === 'Sketches' ? 'sketch'
          : assetName === 'Audios' ? 'audio'
            : assetName === 'Videos' ? 'video'
              : assetName === 'Docs' ? 'doc'
                : assetName === 'Links' ? 'link' : 'note'


    let bodyFormData = new FormData();
    bodyFormData.append('name', media);
    bodyFormData.append('keyword', keyword);
    // console.log("Asset Name", assetName, keyword)
    console.log('media', media)
    // return false
    axios({
      method: 'post',
      url: `${BASE_URL}filter?page=` + page,
      data: {
        name: media,
        keyword: keyword
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + loginUserData?.token
      }
    }).then((response) => {
      console.log('Filtered Data---------------', response.data)
      if (response.data.status == 200) {
        setLoading(false);
        setTotalCount(response?.data?.data?.total)
        if (response?.data?.data?.current_page === 1) {
          console.log('In IF');
          if (data.length != 0) {
            setTotalPage(response?.data?.data?.last_page);
            setData(response?.data?.data?.data);
          } else {
            setTotalPage(response?.data?.data?.last_page);
            setData(response?.data?.data?.data);
          }
        } else {
          console.log('In Else');
          let tempArray = data
          tempArray.push(...response?.data?.data?.data);
          setData(tempArray);
        }
      } else {
        SimpleToast.show('Something went wrong');
      }
    }).catch((error) => {
      console.log('Filtered Error', error);
    })



    // client.post(`/filter?page=${page}`, bodyFormData, {
    //   headers: {
    //     Authorization: `Bearer ${loginUserData?.token}`,
    //   },
    // }).then(response => {
    //   console.log('filteredApi-response', response.data.data.data);
    //   if (response.data.status == 200) {
    //     setLoading(false);
    //     setTotalCount(response?.data?.data?.total)
    //     if (response?.data?.data?.current_page === 1) {
    //       console.log('In IF');
    //       if (data.length != 0) {
    //         setTotalPage(response?.data?.data?.last_page);
    //         setData(response?.data?.data?.data);
    //       } else {
    //         setTotalPage(response?.data?.data?.last_page);
    //         setData(response?.data?.data?.data);
    //       }
    //     } else {
    //       console.log('In Else');
    //       let tempArray = data
    //       tempArray.push(...response?.data?.data?.data);
    //       setData(tempArray);
    //     }
    //   } else {
    //     SimpleToast.show('Something went wrong');
    //   }
    // }).catch(err => {
    //   setLoading(false);
    //   SimpleToast.show('Something went wrong');
    //   console.log('filteredApi-err', err);
    // });
  };

  const deleteAssetApi = (id) => {

    let bodyFormData = new FormData();
    bodyFormData.append('id', id);
    bodyFormData.append('name', mediaType === 'Links' ? 'link' : mediaType === 'Notes' ? 'note' : 'media');

    client.post(`/deletefile`, bodyFormData, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log('deleteAssetApi', response.data);
      if (response.data.status == 200) {
        mediaType === 'Images' ?
          dispatch(imageCount(totalCount - 1))
          : mediaType === 'Sketches' ?
            dispatch(sketchCount(totalCount - 1))
            : mediaType === 'Audios' ?
              dispatch(audioCount(totalCount - 1))
              : mediaType === 'Videos' ?
                dispatch(videoCount(totalCount - 1))
                : mediaType === 'Docs' ?
                  dispatch(docCount(totalCount - 1))
                  : mediaType === 'Links' ?
                    dispatch(linkCount(totalCount - 1))
                    : dispatch(noteCount(totalCount - 1))

        dispatch(total(Total - 1))
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
    setData(data.filter((item) => {
      return item.id != id
    }))
    SimpleToast.show('Record deleted');
  }

  const renderSearchItem = ({ item, index }) => {
    return (
      item.media_type ?
        (
          (item?.media_type === 'image' || item.media_type === 'sketch') ?
            <Pressable
              activeOpacity={0.6}
              onPress={() => {
                setLoading(true)
                setDetailModal(true);
                setTimeout(() => {
                  setLoading(false)
                }, 1000);
                dispatch(Assets(item))
                dispatch(AssetsList(data))
                dispatch(SelectedItemIndex(index))
              }}
              style={[styles.imageContainer, { width: '31%' }]}>
              <AvatarComponent
                style={styles.Image}
                imageStyle={{ resizeMode: item.media_type === 'image' ? 'cover' : 'contain' }}
                source={`${item.file}`}
                // source={`${IMAGE_BASE_URL}${item.file}`}
                title={item.title}
              />
            </Pressable>
            :
            (item?.media_type === 'video' || item.media_type === 'audio') ?
              <Pressable
                onPress={() => {
                  setLoading(true)
                  setDetailModal(true);
                  setTimeout(() => {
                    setLoading(false)
                  }, 2000);
                  dispatch(Assets(item))
                  dispatch(AssetsList(data))
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
                <Image style={styles.playIcon} source={Images.play} resizeMode='contain' />

              </Pressable>
              :
              item?.media_type === 'doc' ?
                <Pressable
                  activeOpacity={0.6}
                  onPress={() => {
                    setLoading(true)
                    setDetailModal(true);
                    setTimeout(() => {
                      setLoading(false)
                    }, 1000);
                    dispatch(Assets(item))
                    dispatch(AssetsList(data))
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
                  <Image style={styles.docIcon} source={
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
                :
                null
        )
        :
        (
          <Pressable
            onPress={() => {
              setLoading(true)
              setDetailModal(true);
              setTimeout(() => {
                setLoading(false)
              }, 1000);
              dispatch(Assets(item))
              dispatch(AssetsList(data))
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
            <Image source={item.note ? Images.textFile : Images.link} style={styles.textFileIcon} />
          </Pressable>
        )
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={mediaType}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />
      <FlatList
        numColumns={3}
        data={data}
        extraData={data}
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
        renderItem={renderSearchItem}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={() => {
          if (!loading) return (
            <Text style={{ fontSize: 16, fontFamily: Fonts.Regular, marginTop: height / 2, alignSelf: 'center' }}>{'No Record Found'}</Text>
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
            filteredApi(val);
          }
        }}
      />



      <DetailModal
        type={mediaType}
        modalVisible={detailModal}
        quitClick={() => {
          setDetailModal(false);
        }}
        deleteItem={(id) => {
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
    elevation: 5,
  },
  videoContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'black'
  },
  docContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 1
  },
  docIcon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    height: 85,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 1
  },
  Image: {
    width: '100%',
    height: 85,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  playIcon: {
    width: 15,
    height: 15,
    tintColor: colors.white
  },
  textFileIcon: {
    width: 40,
    height: 40,

  }
});

export default SearchedData;
