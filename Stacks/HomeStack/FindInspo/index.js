import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';

// ------------------------------------------------

import { Keyword } from '../../../Redux/Actions/Keyword';
import { assetName } from '../../../Redux/Actions/AssetName'
import {
  imageCount,
  sketchCount,
  videoCount,
  docCount,
  linkCount,
  noteCount,
  audioCount,
  total
} from '../../../Redux/Actions/AssetCount'
import Images from '../../../Assets/Images/';
import { styles } from './styles';
import colors from '../../../Utils/colors';
import InputField from '../../../Components/InputField';
import AppButton from '../../../Components/AppButton';
import Header from '../../../Components/Header';
import CategoryBtn from './CategoryBtn';
import Fonts from '../../../Assets/Fonts';
import AlertModal from '../../../Components/AlertModal';
import { client, IMAGE_BASE_URL } from '../../../Api/config';
import DetailModal from '../../../Components/InpsoDetailModal'
import { stat } from 'react-native-fs';

const { height } = Dimensions.get('window');


const FindInspo = ({ navigation }) => {

  const { loginUserData } = useSelector(state => state.Auth);
  const {
    NoOfImages,
    NoOfSketches,
    NoOfVideos,
    NoOfDocs,
    NoOfLinks,
    NoOfNotes,
    NoOfAudios,
    Total } = useSelector(state => state.AssetCount)
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const [keyword, setKeyword] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [userAssets, setUserAssts] = useState('');
  const [searchTitle, setSearchTitle] = useState('')

  // const isFocused = useIsFocused();

  const getUserAssets = () => {
    client.get('/getcount', {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('getUserAssets-response', response.data)
        setUserAssts(response.data)
        dispatch(total(response?.data?.totalcount))
      } else {
        console.log('In else');
      }
    }).catch(err => {
      SimpleToast.show('Something went wrong');
      console.log('getUserAssets-err', err);
    });
  };

  useEffect(() => {
    getUserAssets()
  }, [isFocused])

  const searchKeywordApi = () => {
    Keyboard.dismiss()
    dispatch(total(0))
    dispatch(Keyword(keyword))
    if (keyword == '') {
      SimpleToast.show('Please enter a keyword')
    } else {
      setLoading(true);
      let body = {
        keyword: keyword
      };
      client.post(`/search`, body, {
        headers: {
          Authorization: `Bearer ${loginUserData?.token}`,
        },
      }).then(response => {
        if (response.data.status == 200) {
          console.log('searchKeywordApi-response', response.data);
          setSearch(true)
          setLoading(false);
          dispatch(imageCount(response?.data?.countimages))
          dispatch(sketchCount(response?.data?.countsketches))
          dispatch(videoCount(response?.data?.countvideos))
          dispatch(docCount(response?.data?.countdocument))
          dispatch(linkCount(response?.data?.countlinks))
          dispatch(noteCount(response?.data?.countnotes))
          dispatch(audioCount(response?.data?.countaudios))
          dispatch(total(response?.data?.total))

        }
        else {
          SimpleToast.show('Something went wrong');
        }
      }).catch(err => {
        setLoading(false);
        SimpleToast.show('Something went wrong');
        console.log('searchKeywordApi-err', err);
      });
    }
  };


  const filteredApi = (type) => {
    // console.log("==== Filter API ===");
    // // const media =
    // //   assetName === 'Images' ? 'image'
    // //     : assetName === 'Sketches' ? 'sketch'
    // //       : assetName === 'Audios' ? 'audio'
    // //         : assetName === 'Videos' ? 'video'
    // //           : assetName === 'Docs' ? 'doc'
    // //             : assetName === 'Links' ? 'link' : 'note'


    // let bodyFormData = new FormData();
    // bodyFormData.append('name', "image");
    // bodyFormData.append('keyword', keyword);
    // // console.log("Asset Name", assetName, keyword)
    // // console.log('media', LoggedIn_User_Data: )
    // // return false
    // console.log("fomrData==>>",bodyFormData);
    // axios({
    //   method: 'post',
    //   url: `${BASE_URL}filter?page=` + page,
    //   data: {
    //     "name": "image",
    //     "keyword": keyword
    //   },
    //   // data:bodyFormData,
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': 'Bearer ' + loginUserData?.token
    //   }
    // }).then((response) => {
    //   console.log('Filtered Data---------------', response.data)

    // }).catch((error) => {
    //   console.log('Filtered Error', error?.response?.data?.data);
    // })
    const nav = (() => {
      switch (type) {
        case 'image':
          return 'Images'
          break;
        case 'video':
          return 'Videos'
          break;
        case 'sketch':
          return 'Sketches'
          break;
        case 'doc':
          return 'Docs'
          break;
        case 'link':
          return 'Links'
          break;
        case 'note':
          return 'Notes'
          break;
        case 'audio':
          return 'Audios'
          break;

        default:
          break;
      }
    })()
   
    const formData = new FormData()
    formData.append("name", type)
    formData.append("keyword", keyword)
    fetch(`https://inspobin.com/api/filter`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + loginUserData?.token
      },
      body: formData
    }).then((response) => {
      // console.log("Filter ==== API===>>>", JSON.stringify(response?.data));
      // navigation.navigate(nav, { data: response?.data?.data });
      return response.json()
    }).then((response) => {
      console.log("Filter ==== API===>>>", JSON.stringify(response?.data));
      navigation.navigate(nav, { data: response?.data?.data });
      // return response.json()
    }).catch((err) => {
      console.log("err===>>>", err);

    })

  };



  return (
    <View style={styles.container}>
      <Header
        heading={'Find Inspo'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
      />
      <View style={{ paddingHorizontal: 15 }}>

        <View style={styles.searchMainContainer}>
          <InputField
            label={'Search'}
            placeholder={'Keyword Search'}
            rightIcon={Images.searchIcon}
            labelStyle={{ color: colors.white, fontSize: 16 }}
            rightIconOnPress={() => searchKeywordApi()}
            onChangeText={(val) => setKeyword(val)}
            value={keyword}
            returnKeyType={'done'}
            onSubmitEditing={() => {
              Keyboard.dismiss()
            }}
          />
          <View style={styles.searchMainBtnContainer}>
            <AppButton
              label={'RESET'}
              onPress={() => {
                setSearch(false)
                setKeyword('')
                dispatch(imageCount(null))
                dispatch(sketchCount(null))
                dispatch(videoCount(null))
                dispatch(docCount(null))
                dispatch(linkCount(null))
                dispatch(noteCount(null))
                dispatch(audioCount(null))
                dispatch(total(userAssets?.totalcount))
              }}
              btnStyle={styles.searchBtnStyle}
              labelStyle={{
                color: colors.white,
                fontSize: 12,
                fontFamily: Fonts.SemiBold,
              }}
            />
            <AppButton
              label={'SEARCH'}
              onPress={() => {
                searchKeywordApi()
              }}
              btnStyle={[
                styles.searchBtnStyle,
                {
                  width: 80,
                  backgroundColor: colors.white,
                  marginRight: 0,
                },
              ]}
              labelStyle={{
                color: colors.black,
                fontSize: 12,
                fontFamily: Fonts.SemiBold,
              }}
              color={colors.primary}
            />
          </View>
        </View>

        {/* {
          (!loading && search && Total > 0) &&
          <View style={styles.mainContainerCategoryHeading}>
            <Text style={styles.total}>{`Results (${Total})`}</Text>
          </View>
        } */}
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}>

        {/* <CategoryBtn
          btnStyle={{ backgroundColor: colors.primary, marginTop: 15 }}
          iconStyle={{ tintColor: colors.white }}
          textStyle={{ color: colors.white }}
          headerName={`View All (${Total ?Total:0})`}
          clickAction={() => {
            navigation.navigate('ViewAll');
          }}
        /> */}

        {
          !loading && !search &&
          <View>

            <CategoryBtn
              headerName={`Images (${userAssets ? userAssets?.countimages : 0})`}
              clickAction={() => {
                navigation.navigate('Images');
              }}
            />
            <CategoryBtn
              headerName={`Sketches (${userAssets ? userAssets?.countsketches : 0})`}
              clickAction={() => {
                navigation.navigate('Sketches');
              }}
            />
            <CategoryBtn
              headerName={`Videos (${userAssets ? userAssets?.countvideos : 0})`}
              clickAction={() => {
                navigation.navigate('Videos');
              }}
            /><CategoryBtn
              headerName={`Docs (${userAssets ? userAssets?.countdocuments : 0})`}
              clickAction={() => {
                navigation.navigate('Docs');
              }}
            /><CategoryBtn
              headerName={`Links (${userAssets ? userAssets?.countlinks : 0})`}
              clickAction={() => {
                navigation.navigate('Links');
              }}
            />
            <CategoryBtn
              headerName={`Notes (${userAssets ? userAssets?.countnotes : 0})`}
              clickAction={() => {
                navigation.navigate('Notes');
              }}
            /><CategoryBtn
              headerName={`Audio (${userAssets ? userAssets?.countaudios : 0})`}
              clickAction={() => {
                navigation.navigate('Audios');
              }}
            />
          </View>
        }

        {
          loading &&
          <ActivityIndicator
            size={'large'}
            color={colors.primary}
            style={{ marginTop: height / 4 }}
          />
        }
        {
          (!loading && search && Total == 0) &&
          <Text style={styles.empty}>{`No Results Found`}</Text>
        }


        {
          (!loading && search) &&
          <>
            {
              NoOfImages > 0 &&
              <CategoryBtn
                headerName={`Images (${NoOfImages})`}
                clickAction={() => {
                  filteredApi('image')
                  // console.log('KEYWORD===>>',keyword);
                  // dispatch(assetName('Images'))
                }}
              />
            }

            {
              NoOfSketches > 0 &&
              <CategoryBtn
                headerName={`Sketches (${NoOfSketches})`}
                clickAction={() => {
                  // navigation.navigate('Sketches', { keyword: search ? keyword : !search });
                  // dispatch(assetName('Sketches'))
                  filteredApi('sketch')
                }}
              />
            }

            {
              NoOfVideos > 0 &&
              <CategoryBtn
                headerName={`Videos (${NoOfVideos})`}
                clickAction={() => {
                  // navigation.navigate('Videos', { keyword: search ? keyword : !search });
                  // dispatch(assetName('Videos'))
                  filteredApi('video')
                }}
              />
            }


            {
              NoOfDocs > 0 &&
              <CategoryBtn
                headerName={`Documents (${NoOfDocs})`}
                clickAction={() => {
                  // navigation.navigate('Docs', { keyword: search ? keyword : !search });
                  // dispatch(assetName('Docs'))
                  filteredApi('doc')
                }}
              />
            }

            {
              NoOfLinks > 0 &&
              <CategoryBtn
                headerName={`Links (${NoOfLinks})`}
                clickAction={() => {
                  // navigation.navigate('Links', { keyword: search ? keyword : !search });
                  // dispatch(assetName('Links'))
                  filteredApi('link')
                }}
              />
            }
            {
              NoOfNotes > 0 &&
              <CategoryBtn
                // headerName={`Notes (${userAssets ? userAssets?.countnotes : 0})`}
                headerName={`Notes (${NoOfNotes})`}
                clickAction={() => {
                  // navigation.navigate('Notes', { keyword: search ? keyword : !search });
                  // // navigation.navigate('SearchedData');
                  // dispatch(assetName('Notes'))
                  filteredApi('note')
                }}
              />
            }

            {
              NoOfAudios > 0 &&
              <CategoryBtn
                headerName={`Audio (${NoOfAudios})`}
                clickAction={() => {
                  // navigation.navigate('Audios', { keyword: search ? keyword : !search });
                  // // navigation.navigate('SearchedData');
                  // dispatch(assetName('Audios'))
                  filteredApi('audio')
                }}
              />
            }
          </>
        }





        <AlertModal
          isVisible={alertModal}
          onPress={() => {
            setAlertModal(false)
          }}
          message={alertMessage}
        />

      </KeyboardAwareScrollView>


    </View>
  );
};

export default FindInspo;
