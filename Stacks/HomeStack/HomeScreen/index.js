import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { createThumbnail } from "react-native-create-thumbnail";
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-player';
import RNFS from 'react-native-fs'
import * as RNIap from 'react-native-iap';


// ---------------------------------------------------------
import Header from '../../../Components/Header';
import RadioButton from '../../../Components/RadioButton';
import images, { Images } from '../../../Assets/Images/';
import { styles } from './styles';
import colors from '../../../Utils/colors';
import InputField from '../../../Components/InputField';
import AppButton from '../../../Components/AppButton';
import WriteNoteModal from '../../../Components/WriteNoteModal';
import SaveLinkModal from '../../../Components/SaveLinkModal';
import RecordAudioModal from '../../../Components/AudioRecordModal';
import SignatureModal from '../../../Components/SignatureModal';
import AlertModal from '../../../Components/AlertModal';
import { BASE_URL, client, IMAGE_BASE_URL } from '../../../Api/config';
import { Profile } from '../../../Redux/Actions/Profile';
import { Subscribed_Package, Receipt } from '../../../Redux/Actions/Subscription'
import InspoType from '../../../Components/InspoType'
import axios from 'axios';
import UploadMediaModal from '../../../Components/UploadMediaModal';
import ImagePickerModel from '../../../Components/ImagePickerModel';
import MediaTypes from '../../../Components/MediaTypes';
const videoOptions = {
  width: 300,
  height: 300,
  quality: 0.2,
  mediaType: 'video',
};
const ImageOptions = {
  maxWidth: 500,
  maxHeight: 500,
  quality: 0.6,
  mediaType: 'photo',
};
const AudioOptions = {
  maxWidth: 500,
  maxHeight: 500,
  quality: 0.6,
  mediaType: 'audio',
};
const HomeScreen = ({ navigation }, props) => {

  let temArray = []

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [writeNoteVisible, setWriteNoteVisible] = useState(false);
  const [recordAudioVisible, setRecordAudioVisible] = useState(false);
  const [saveLinkVisible, setSaveLinkVisible] = useState(false);
  const [padVisible, setPadVisible] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [cameraPic, setCameraPic] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [audio, setAudio] = useState(null);
  const [writeNote, setWriteNote] = useState(null);
  const [saveLink, setSaveLink] = useState(null);
  const [singleFile, setSingleFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [alertModal, setAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [uploadMedialModal, setUploadMedialModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageVisible, setImageVisible] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [isAudio, setIsAudio] = useState(false)
  const [isDoc, setIsDoc] = useState(false)
  const [selectMediaType, setSelectMediaType] = useState(false)
  const [mediaAlertModal, setMediaAlertModal] = useState(false)
  const [mediaAlertMsg, setMediaAlertMsg] = useState('')
  const [imageOne, setImageOne] = useState(null)

  const titleRef = useRef();
  const keywordRef = useRef();

  const dispatch = useDispatch();
  const { loginUserData } = useSelector(state => state?.Auth);
  const { receipt, subscribedPackage } = useSelector(state => state.Subscription)
  const { profileData } = useSelector(state => state.Profile);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProfileApi();
      initIAP()
      console.log({ subscribedPackage });
      console.log({ receipt });
    }
  }, [isFocused]);

  const reset = () => {
    setCameraPic(null)
    setVideo(null)
    setSingleFile(null)
    setAudio(null)
    setSignatureImage(null)
    setWriteNote(null)
    setSaveLink(null)
    setThumbnail(null)
  }
  const {
    onHideModel,
    showPickerModel,
    handleChoosePhoto,
    handleChooseVideo,
    handleChooseAudio,
  } = props

  const onChooseFromLibraryPress = () => {
    launchImageLibrary(ImageOptions, onImagePickerResponse)
  }

  const onTakePhotoPress = () => {
    console.log('click on camera')
    launchCamera(ImageOptions, onImagePickerResponse)
  }
  const onChooseVideoFromLibraryPress = () => {
    launchImageLibrary(videoOptions, onVideoPickerResponse)
  }
  const onChooseAudioFromLibraryPress = () => {
    launchImageLibrary(AudioOptions, onAudioPickerResponse)
  }

  const onImagePickerResponse = (response) => {
    if (handleChoosePhoto && typeof handleChoosePhoto == 'function') {
      handleChoosePhoto(response)
      // console.log('Image from library', response)
    }
  }
  const onAudioPickerResponse = (response) => {
    if (handleChooseAudio && typeof handleChooseAudio == 'function') {
      handleChooseAudio(response)
      // console.log('Image from library', response)
    }
  }
  const onVideoPickerResponse = (response) => {
    if (handleChooseVideo && typeof handleChooseVideo == 'function') {
      handleChooseVideo(response)
      // console.log('Image from library', response)
    }
  }

  const onHideModelInner = () => {
    if (onHideModel && typeof onHideModel == 'function') {
      onHideModel()
    }
  }
  const subscribe = () => {

    let body = {
      package_id: subscribedPackage?.stripe_id,
      object: receipt,
      subscription_changes: 'create'
    };
    console.log('Bbody----', body);
    // return false
    client.post('/subscription', body, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('subscribe-responseJson', response.data)
      } else {
        console.log('subscribe-else', response.data.message)
      }
    }).catch(err => {
      console.log('subscribe-err1', err)
    })
  };

  const UnSubscribe = () => {
    let body = {
      subscription_changes: 'cancel'
    }
    client.post('/subscription', body, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('UnSubscribe-responseJson', response.data)
        getProfileApi()
      } else {
        console.log('UnSubscribe-else', response.data)
      }
    }).catch(err => {
      console.log('UnSubscribe-err', err)
    }).finally(() => {
    })
  };

  const initIAP = async () => {
    try {
      await RNIap.initConnection()
    } catch (error) {
      console.log('initConnection-error', error);
    }
    try {
      const currentPurchases = await RNIap.getAvailablePurchases();
      if (Array.isArray(currentPurchases) && currentPurchases.length > 0) {
        //console.log('currentPurchases-_purchase', currentPurchases)
        //subscribe()
      } else {
        console.log('Purchase Active', currentPurchases)
        UnSubscribe()
        dispatch(Subscribed_Package(null))
        dispatch(Receipt(null))

      }
    } catch (error) {
      console.log('err', error);
    }
  }


  // --------------Record Video---------------
  const videoPress = () => {
    reset()
    launchCamera(videoOptions, videoCallback);
  };
  const videoCallback = async (response) => {
    console.log("Video Click", response);
    if (response.didCancel) {
      console.log('Video Picker Canceled');
      setSelectedCategory(0)
    } else if (response.error) {
      console.log('Video picker error', response.error);
    } else {
      const videoSource = {
        name: (moment().format('x') + ".mp4"),
        uri: response.assets[0].uri,
        type: response.assets[0].type
      };
      setVideo(videoSource);
      Thumbnail(response.assets[0].uri)
    }
  };

  const Thumbnail = async (uri) => {
    try {
      const response = await createThumbnail({
        url: uri,
        timeStamp: 1000
      })
      console.log('thumbnail res...', response);
      const thumbnail = {
        uri: response?.path,
        type: response?.mime,
        name: (moment().format('x') + ".jpeg"),
      }
      setThumbnail(thumbnail)
    } catch (error) {

    }
  }
  // --------------Take Picture---------------
  const takePicture = () => {
    reset()
    launchCamera(ImageOptions, imageCallBack);
  };
  const imageCallBack = async response => {
    console.log('image click', response);
    if (response.didCancel) {
      console.log('Image Picker Canceled');
      setSelectedCategory(0)
    } else if (response.error) {
      console.log('image picker error', response.error);
    } else {
      const uploadImageSource = {
        name: moment().format('x') + ".jpeg",
        uri: response.assets[0].uri,
        type: "image/jpeg",
      };
      setCameraPic(uploadImageSource);
    }
  };

  // --------------Doc Picker---------------
  const selectOneFile = async () => {
    reset()
    setSuccess(false)
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
          DocumentPicker.types.ppt,
          DocumentPicker.types.xls,
          DocumentPicker.types.audio,
          DocumentPicker.types.images,
          DocumentPicker.types.allFiles,
          DocumentPicker.types.plainText,
          DocumentPicker.types.video,
        ],

      });
      console.log('Document Pick Response', res);
      const source = {
        name: res[0].name,
        type: res[0].type,
        uri: res[0].uri,
      };
      Thumbnail(res[0].uri)
      setSingleFile(source);
      if (res[0].name.includes('.JPG') || res[0].name.includes('.jpg') || res[0].name.includes('.PNG') || res[0].name.includes('.png') || res[0].name.includes('.jfif') || res[0].name.includes('.HEIC')) {
        setFileType('image');
      } else if (
        res[0].name.includes('.avi') ||
        res[0].name.includes('.h264') ||
        res[0].name.includes('.m4v') ||
        res[0].name.includes('.mkv') ||
        res[0].name.includes('.mov') ||
        res[0].name.includes('.mp4') ||
        res[0].name.includes('.mpg')
      ) {
        console.log('in video type');
        setFileType('video');
      } else if (res[0].name.includes('.xlsx') || res[0].name.includes('.pptx') || res[0].name.includes('.docx') || res[0].name.includes('.pdf') || res[0].name.includes('.key')) {
        console.log("check key file");
        if (res[0].name.includes('.key')) {
          alert('Sorry, that file type is not supported.');
          setSingleFile(null)
        }
        setFileType('doc');
      } else if (res[0].name.includes('.mp3') || res[0].name.includes('.pcm') || res[0].name.includes('.wav') || res[0].name.includes('.aiff') || res[0].name.includes('.aac') || res[0].name.includes('.ogg') || res[0].name.includes('.m4a')) {
        setFileType('audio');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setAlertModal(true)
        setAlertMessage('You did not select any file')
        setSelectedCategory(0)
      } else {
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const selectItemFunction = selectParam => {
    setSelectedCategory(selectParam);
  };

  const getProfileApi = () => {
    client.get('/view_profile', {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      console.log("getProfileApi ===>>>", response.data?.data?.free_trial);
      if (response.data.status == 200) {
        dispatch(
          Profile({
            ...response.data.data,
          }),
        );
        if(response.data?.data?.free_trial == 1){
          navigation.navigate('ManageSubscription')
        }
      } else {
        console.log('In else');
      }
    }).catch(err => {
      SimpleToast.show('Something went wrong');
      console.log('getProfileApi-err', err);
    });
  };

  const uploadMediaApi = (text) => {
    console.log("text==>>", text);
    // return false;
    if (title == '') {
      SimpleToast.show('Add Title');
    } else if (keywords == '') {
      SimpleToast.show('Add Keywords');
    }

    else {
      const tags = text.split(',');
      for (let tag of tags) {
        let array = keywordsArray;
        array.push(tag);
      }
      console.log('Keywords Array...', keywordsArray);
      setSuccess(false)
      setLoading(true);
      let bodyFormData = new FormData();

      bodyFormData.append('title', title);
      if (selectedCategory == 1) {
        console.log('Camera Pic Uploading....');
        bodyFormData.append('file', photo);
        bodyFormData.append('file_type', 'image');
      } else if (selectedCategory == 2) {
        console.log(' Record Video Uploading....', video);
        bodyFormData.append('file', video);
        bodyFormData.append('file_type', 'video');
      } else if (selectedCategory == 6) {
        console.log('Signature Uploading....');
        bodyFormData.append('sketch_url', signatureImage);
        bodyFormData.append('file_type', 'sketch');
      } else if (selectedCategory == 5) {
        console.log('Record Audio Uploading....');
        bodyFormData.append('file', audio);
        bodyFormData.append('file_type', 'audio');
      }
      keywordsArray.forEach(item => {
        bodyFormData.append(`key_words[]`, item);
      });
      //console.log("bbodydata ===>>>",bodyFormData);
      console.log('Body--->Upload_Media: ', JSON.stringify(bodyFormData));
      // return false;

      client.post('/upload_media', bodyFormData, {
        headers: {
          Authorization: `Bearer ${loginUserData?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => {
        console.log('uploadMediaApi-response======>', response.data);
        if (response.data.status == 200) {
          getProfileApi()
          setLoading(false);
          setKeywordsArray([]);
          setKeywords('');
          setTitle('');
          reset()
          setSelectedCategory(0);
          setSuccess(true)
          setTimeout(() => {
            setAlertModal(true);
          }, 500);
          setAlertMessage(response.data.message);
        } else {
          setLoading(false);
          setKeywordsArray([]);
          setKeywords('');
          setAlertModal(true)
          setAlertMessage(response?.data?.message)
        }
      }).catch(err => {
        setKeywordsArray([]);
        setKeywords('');
        setLoading(false);
        // SimpleToast.show(err)
        console.log('uploadMediaApi-error', err);
      });
    }
  };

  const uploadAnyFileaApi = text => {
    console.log('In upload any file FN.');

    if (title == '') {
      SimpleToast.show('Add Title');
    } else if (keywords == '') {
      SimpleToast.show('Add Keywords');
    }
    else if (selectMediaType == false) {
      console.log(" in selected mediau");
      setMediaAlertModal(true)
      setMediaAlertMsg('Please Select Media Type')
    }

    else {
      const tags = text.split(',');
      for (let tag of tags) {
        let array = keywordsArray;
        array.push(tag);
      }
      console.log('Keywords Array...', keywordsArray);
      setSuccess(false)
      setLoading(true);
      let bodyFormData = new FormData();

      bodyFormData.append('title', title);
      bodyFormData.append('file', singleFile);
      bodyFormData.append('file_type', fileType);

      keywordsArray.forEach(item => {
        bodyFormData.append(`key_words[]`, item);
      });

      console.log('Body--->Upload_Any_File: ', bodyFormData);


      client.post('/upload_multiple_media', bodyFormData, {
        headers: {
          Authorization: `Bearer ${loginUserData?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log('uploadAnyFileaApi-response======>', response.data);
          if (response.data.status == 200) {
            getProfileApi()
            setLoading(false);
            setKeywordsArray([]);
            setKeywords('');
            setTitle('');
            reset()
            setFileType(null);
            setSelectedCategory(0);
            setIsAudio(false)
            setIsDoc(false)
            setIsImage(false)
            setIsVideo(false)
            Keyboard.dismiss()
            setTimeout(() => {
              setAlertModal(true);
            }, 500);
            setAlertMessage(response.data.message);
            setSuccess(true)

          } else {
            setLoading(false);
            setAlertModal(true);
            setAlertMessage(response.data.message);
          }
        }).catch(err => {
          reset()
          setLoading(false);
          console.log('uploadAnyFileaApi-error', err?.response?.data);
        });
    }
  };

  const addLinkApi = (text, file) => {
    console.log('In Add LinkFn.', file);

    if (title == '') {
      SimpleToast.show('Add Title');
    } else if (keywords == '') {
      SimpleToast.show('Add Keywords');
    } else if (!saveLink.includes('https://')) {
      setAlertModal(true)
      setAlertMessage('Please include https:// in your links.')

    }
    else {
      const tags = text.split(',');
      for (let tag of tags) {
        let array = keywordsArray;
        array.push(tag);
      }
      console.log('Keywords Array...', keywordsArray);
      setSuccess(false)
      setLoading(true);
      let bodyFormData = new FormData();

      bodyFormData.append('link', saveLink);
      bodyFormData.append('title', title);
      bodyFormData.append('file', file);

      keywordsArray.forEach(item => {
        bodyFormData.append(`keyword[]`, item);
      });

      keywordsArray.forEach(item => {
        temArray.push(item);
      });

      axios({
        method: 'post',
        url: `${BASE_URL}/add_link`,
        data: {
          link: saveLink,
          title: title,
          keyword: temArray,
          // file: file
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + loginUserData?.token
        }


      }).then((response) => {
        console.log('Upload Link---------------', response.data)
        if (response.data.status == 200) {
          getProfileApi()
          setLoading(false);
          setKeywordsArray([]);
          setKeywords('');
          setTitle('');
          reset();
          setSelectedCategory(0);
          setAlertModal(true);
          setAlertMessage(response.data.message);
          setSuccess(true)
        } else {
          setLoading(false);
          setKeywordsArray([]);
          setKeywords('');
          setAlertModal(true);
          setAlertMessage(response.data.message);
        }
      }).catch((error) => {
        console.log('Upload Link Error', error);
      })




      // client.post('/add_link', bodyFormData, {
      //   headers: {
      //     Authorization: `Bearer ${loginUserData?.token}`,
      //   },
      // }).then(response => {
      //   console.log('addLinkApi-response======>', response.data);
      //   if (response.data.status == 200) {
      //     getProfileApi()
      //     setLoading(false);
      //     setKeywordsArray([]);
      //     setKeywords('');
      //     setTitle('');
      //     reset();
      //     setSelectedCategory(0);
      //     setAlertModal(true);
      //     setAlertMessage(response.data.message);
      //     setSuccess(true)
      //   } else {
      //     setLoading(false);
      //     setKeywordsArray([]);
      //     setKeywords('');
      //     setAlertModal(true);
      //     setAlertMessage(response.data.message);
      //   }
      // }).catch(err => {
      //   setLoading(false);
      //   SimpleToast.show('Something went wrong');
      //   console.log('addLinkApi-error', err);
      // });
    }
  };



  const addNoteApi = (text, file) => {
    console.log('In Add Note Fn.');
    if (title == '') {
      SimpleToast.show('Add Title');
    } else if (keywords == '') {
      SimpleToast.show('Add Keywords');
    } else {
      const tags = text.split(',');
      for (let tag of tags) {
        let array = keywordsArray;
        array.push(tag);
      }
      setSuccess(false)
      setLoading(true);
      let bodyFormData = new FormData();

      bodyFormData.append('title', title);
      bodyFormData.append('note', writeNote);
      bodyFormData.append('file', file);

      keywordsArray.forEach(item => {
        bodyFormData.append(`key_words[]`, item);
      });

      keywordsArray.forEach(item => {
        temArray.push(item);
      });



      axios({
        method: 'post',
        url: `${BASE_URL}/add_note`,
        data: {
          note: writeNote,
          title: title,
          key_words: temArray,
          // file: file
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + loginUserData?.token
        }


      }).then((response) => {
        console.log('Upload Note---------------', response.data)
        if (response.data.status == 200) {
          getProfileApi()
          setLoading(false);
          setAlertMessage(response.data.message);
          setAlertModal(true);
          setSelectedCategory(0);
          setKeywordsArray([]);
          setKeywords('');
          setTitle('');
          reset()
          setSuccess(true)
        } else {
          setLoading(false);
          setKeywordsArray([]);
          setKeywords('');
        }
      }).catch((error) => {
        console.log('Upload Note Error', error);
      })




      // client.post('/add_note', bodyFormData, {
      //   headers: {
      //     Authorization: `Bearer ${loginUserData?.token}`,
      //   },
      // }).then(response => {
      //   // console.log('addNoteApi-response======>', response.data)
      //   if (response.data.status == 200) {
      //     getProfileApi()
      //     setLoading(false);
      //     setAlertMessage(response.data.message);
      //     setAlertModal(true);
      //     setSelectedCategory(0);
      //     setKeywordsArray([]);
      //     setKeywords('');
      //     setTitle('');
      //     reset()
      //     setSuccess(true)
      //   } else {
      //     setLoading(false);
      //     setKeywordsArray([]);
      //     setKeywords('');
      //   }
      // }).catch(err => {
      //   setAlertMessage(response.data.message);
      //   setAlertModal(true);
      //   setLoading(false);
      //   SimpleToast.show('Something went wrong');
      //   console.log('addNoteApi-error', err);
      // });
    }
  };

  const createNoteFile = async (text) => {
    console.log('In create note file');
    var iospath = RNFS.DocumentDirectoryPath + moment().format('/x') + ".txt";
    var androidpath = RNFS.DownloadDirectoryPath + moment().format('/x') + ".txt";

    try {
      console.log('in try');
      await RNFS.writeFile(Platform.OS === 'ios' ? iospath : androidpath, text, 'utf8')
      console.log("createNoteFile-success", { uri: Platform.OS == 'ios' ? iospath : "file://" + androidpath, name: moment().format('/x') + ".txt", type: 'text/plain' });

      // const filePath = await RNFS.readFile(path)
      // console.log("createNoteFile-filePath", filePath);
      addNoteApi(keywords, obj = {
        uri: Platform.OS === 'ios' ? iospath : "file://" + androidpath,
        name: (moment().format('/x') + ".txt"),
        type: 'text/plain'
      })
    } catch (error) {
      console.log('in catch');
      console.log("createNoteFile-writeFile-err", error);
    }
  }

  const createLinkFile = async (text) => {
    var iospath = RNFS.DocumentDirectoryPath + moment().format('/x') + ".txt";
    var androidpath = RNFS.DownloadDirectoryPath + moment().format('/x') + ".txt";
    try {
      await RNFS.writeFile(Platform.OS === 'ios' ? iospath : androidpath, text, 'utf8')
      console.log("createLinkFile-success", { uri: Platform.OS == 'ios' ? iospath : "file://" + androidpath, name: moment().format('/x') + ".txt", type: 'text/plain' });

      // const filePath = await RNFS.readFile(path)
      // console.log("createLinkFile-filePath", filePath);
      addLinkApi(keywords, obj = {
        uri: Platform.OS == 'ios' ? iospath : "file://" + androidpath,
        name: (moment().format('/x') + ".txt"),
        type: 'text/plain'
      })
    } catch (error) {
      console.log("createLinkFile-writeFile-err", error);
    }
  }
  var photo = {
    uri: cameraPic?.uri,
    type: cameraPic?.type,
    name: cameraPic?.fileName,
  };
  return (

    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.appBackground,
      }}>
      <Header
        heading={'Add Inspo'}
        rightIcon={images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        enableOnAndroid={true}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15 }}
        extraHeight={150}>

        <View style={[styles.categoryMainContainer]}>
          <InspoType
            heading={'Take a Picture'}
            categoryImage={images.categoryCamera}
            onClickAction={() => {
              setImageVisible(!imageVisible);
              selectItemFunction(1)
            }}
            imageStyle={
              selectedCategory === 1 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 1 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 1
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
          <InspoType
            heading={'Record Video'}
            categoryImage={images.categoryPlay}
            onClickAction={() => {
              videoPress();
              selectItemFunction(2);
            }}
            imageStyle={
              selectedCategory === 2 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 2 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 2
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
          <InspoType
            heading={'Upload Media'}
            categoryImage={images.categoryUpload}
            onClickAction={() => {
              selectItemFunction(3);
              selectOneFile();
              // setImageVisible(true)
              // setUploadMedialModal(true)
            }}
            imageStyle={
              selectedCategory === 3 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 3 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 3
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
        </View>
        <View style={styles.categoryMainContainer}>
          <InspoType
            heading={'Save Link'}
            categoryImage={images.categoryAttach}
            onClickAction={() => {
              selectItemFunction(4);
              setSaveLinkVisible(true);
            }}
            imageStyle={
              selectedCategory === 4 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 4 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 4
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
          <InspoType
            heading={'Record Audio'}
            categoryImage={images.categoryVolume}
            onClickAction={() => {
              selectItemFunction(5);
              setRecordAudioVisible(true);

            }}
            imageStyle={
              selectedCategory === 5 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 5 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 5
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
          <InspoType
            heading={'Make a Sketch'}
            categoryImage={images.categorySignature}
            onClickAction={() => {
              selectItemFunction(6);
              setPadVisible(true);
            }}
            imageStyle={
              selectedCategory === 6 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 6 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 6
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
        </View>
        <View style={styles.categoryMainContainer}>
          <InspoType
            heading={'Write Note'}
            categoryImage={images.categoryEdit}
            onClickAction={() => {
              selectItemFunction(7);
              setWriteNoteVisible(true);
            }}
            imageStyle={
              selectedCategory === 7 ? { tintColor: colors.white } : null
            }
            textStyle={selectedCategory === 7 ? styles.activeText : null}
            containerStyle={
              selectedCategory === 7
                ? styles.activeBackground
                : styles.unActivectiveBackground
            }
          />
        </View>
        {selectedCategory === 3 && singleFile != null && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.previewText}>Select Media Type</Text>
            <View style={styles.bottomView}>
              <MediaTypes
                label={'Audio'}
                mainRadioStyle={styles.radioView}
                radioStyle={
                  isAudio === true ? styles.active : ''
                  // fileType === isAudio ? styles.active : ''
                }
                onPress={() => {
                  setIsAudio(true)
                  setIsDoc(false)
                  setIsImage(false)
                  setIsVideo(false)
                  setSelectMediaType(true)

                }}
              />
              <MediaTypes
                label={'Video'}
                mainRadioStyle={styles.radioView}
                radioStyle={
                  isVideo === true ? styles.active : ''
                }
                onPress={() => {
                  setIsAudio(false)
                  setIsDoc(false)
                  setIsImage(false)
                  setIsVideo(true)
                  setSelectMediaType(true)
                }}
              />
              <MediaTypes
                label={'Document'}
                mainRadioStyle={styles.radioView}
                radioStyle={
                  isDoc === true
                    ? styles.active
                    : ''
                }
                onPress={() => {
                  setIsAudio(false)
                  setIsDoc(true)
                  setIsImage(false)
                  setIsVideo(false)
                  setSelectMediaType(true)
                }}
              />
              <MediaTypes
                label={'Image'}
                mainRadioStyle={styles.radioViewImage}
                radioStyle={
                  isImage === true ? styles.active : ''
                }
                onPress={() => {
                  setIsAudio(false)
                  setIsDoc(false)
                  setIsImage(true)
                  setIsVideo(false)
                  setSelectMediaType(true)
                }}
              />
            </View>
          </View>
        )}
        {/* {selectedCategory === 1 && imageOne != null ? ( */}
        {selectedCategory === 1 && cameraPic != null ? (
          <>
            <View style={styles.mainContainerCategoryHeading}>
              <Text style={styles.previewText}>{'Preview'}</Text>
              <TouchableOpacity activeOpacity={0.6}
                onPress={() => setImageVisible(!imageVisible)}
              // onPress={() => takePicture()}
              >
                <Text style={styles.changeText}>{'Edit'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.componentContainer}>
              <Image source={cameraPic} style={styles.imageStyle} />
            </View>
          </>
        ) : selectedCategory === 2 && video != null ? (
          <>
            <View style={styles.mainContainerCategoryHeading}>
              <Text style={styles.previewText}>{'Preview'}</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => videoPress()}>
                <Text style={styles.changeText}>{'Edit'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.componentContainer}>
              <View style={styles.videoContainer}>

                <VideoPlayer
                  video={video}
                  style={{ width: 350, height: 180 }}
                  showDuration={true}
                  thumbnail={{ uri: thumbnail?.uri }}
                />

              </View>
            </View>
          </>
        ) :
          selectedCategory === 3 && singleFile != null ? (
            <>
              <View style={styles.mainContainerCategoryHeading}>
                <Text style={styles.previewText}>{'Preview'}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    selectOneFile();
                    setSingleFile(null)
                  }}>
                  <Text style={styles.changeText}>{'Edit'}</Text>
                </TouchableOpacity>
              </View>
              {fileType == 'audio' ? (
                <View style={styles.componentContainer}>
                  <View style={styles.videoContainer}>

                    <VideoPlayer
                      video={singleFile}
                      style={{ width: '100%', height: '100%', backgroundColor: colors.black }}
                      showDuration={true}
                    // thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                    />
                  </View>
                </View>
              ) : fileType == 'image' ? (
                <View style={styles.componentContainer}>
                  <Image source={singleFile} style={styles.imageStyle} />
                </View>
              ) : fileType == 'video' ? (
                <View style={styles.componentContainer}>
                  <View style={styles.videoContainer}>

                    <VideoPlayer
                      repeat={false}
                      resizeMode='contain'
                      video={singleFile}
                      style={{ width: 350, height: 180, backgroundColor: colors.black, }}
                      showDuration={true}
                      // videoWidth={1600}
                      // videoHeight={900}
                      thumbnail={{ uri: thumbnail?.uri }}
                    />
                  </View>
                </View>
              ) :
                singleFile?.type ==
                  'application/pdf' ||
                  'application/doc' ||
                  'application/ms-doc' ||
                  'application/msword' ||
                  'application/vnd.openxmlformats-' ||
                  'officedocument.wordprocessingml.document'
                  ? (
                    <View style={styles.componentContainer}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                          Linking.openURL(singleFile.uri),
                            console.log('singleFile?.type == .key===>>>', singleFile?.type)
                        }}>
                        <Text style={styles.urlText}>{singleFile.name}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
            </>
          ) : selectedCategory === 4 && saveLink != null ? (
            <>
              <View style={styles.mainContainerCategoryHeading}>
                <Text style={styles.previewText}>{'Preview'}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setSaveLinkVisible(true);
                  }}>
                  <Text style={styles.changeText}>{'Edit'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.componentContainer}>
                <Text style={styles.urlText}>{saveLink}</Text>
              </View>
            </>
          ) : selectedCategory === 5 && audio != null ? (
            <>
              <View style={styles.mainContainerCategoryHeading}>
                <Text style={styles.previewText}>{"Preview"}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setRecordAudioVisible(true)
                    setAudio(null)
                  }}
                >
                  <Text style={styles.changeText}>{"Re-record"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.componentContainer}>
                <VideoPlayer
                  video={{ uri: audio.uri }}
                  style={{ width: 350, height: 180, backgroundColor: colors.black }}
                  showDuration={true}
                  disableControlsAutoHide
                />

              </View>
            </>
          ) : selectedCategory === 6 && signatureImage != null ? (
            <>
              <View style={styles.mainContainerCategoryHeading}>
                <Text style={styles.previewText}>{'Preview'}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setPadVisible(true);
                  }}>
                  <Text style={styles.changeText}>{'Re-draw'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.componentContainer}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: 300, height: 150, alignSelf: 'center' }}
                  source={{ uri: signatureImage }}
                />
              </View>
            </>
          ) : selectedCategory === 7 && writeNote != null ? (
            <>
              <View style={styles.mainContainerCategoryHeading}>
                <Text style={styles.previewText}>{'Preview'}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setWriteNoteVisible(true);
                  }}>
                  <Text style={styles.changeText}>{'Edit'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.componentContainer}>
                <Text style={{ color: colors.black }}>{writeNote}</Text>
              </View>
            </>
          ) : (
            <></>
          )}


        <InputField
          noIcon={true}
          label={'Title'}
          onChangeText={val => setTitle(val)}
          value={title}
          placeholder={'Add Title'}
          mainCotainer={{ marginTop: 25 }}
          keyBoardType={'default'}
          returnKeyType={'next'}
          fieldRef={titleRef}
          onSubmitEditing={() => {
            keywordRef.current.focus()
          }}
        />
        <InputField
          noIcon={true}
          label={'Keywords (use commas)'}
          onChangeText={val => setKeywords(val)}
          value={keywords}
          iconStyle={styles.leftIconStyle}
          placeholder={'Type keywords here'}
          keyBoardType={'default'}
          returnKeyType={'done'}
          fieldRef={keywordRef}
          onSubmitEditing={() => {
            Keyboard.dismiss()
          }}
        />
        <AppButton
          label={'SAVE'}
          onPress={() => {
            selectedCategory == 1
              ? uploadMediaApi(keywords)
              : selectedCategory == 2
                ? uploadMediaApi(keywords)
                : selectedCategory == 3
                  ? uploadAnyFileaApi(keywords)
                  : selectedCategory == 4
                    ? createLinkFile(saveLink)
                    : selectedCategory == 5
                      ? uploadMediaApi(keywords)
                      : selectedCategory == 6
                        ? uploadMediaApi(keywords)
                        : selectedCategory == 7
                          ? createNoteFile(writeNote)
                          :
                          (
                            Keyboard.dismiss(),
                            setTimeout(() => {
                              setAlertModal(true)
                              console.log("selectedCategory++++++=====+++>>>>", selectedCategory);
                            }, 50),
                            setSuccess(false),
                            setAlertMessage('Please Upload Something')
                          )


          }}
          btnStyle={{ marginBottom: 25 }}
          loading={loading}
        />
        <View style={{ width: '100%', flexDirection: 'row', marginBottom: 25, }}>
          <Text style={{ color: colors.black, marginLeft: 15, fontSize: 16 }}>
            {'Power Tip: You can upload media and links in bulk using'}
            <TouchableOpacity
              onPress={() => Linking.openURL('https://inspobin.com')}
              style={{ justifyContent: 'center', alignItems: "center" }} >
              <Text style={{ color: colors.primary, fontSize: 16, textDecorationLine: 'underline' }}>
                {' https://inspobin.com '}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: colors.black, fontSize: 16 }}>
              {'on desktop.'}
            </Text>
          </Text>
        </View>

        {/* ------------------------------Custom Modals---------------------------- */}
        <WriteNoteModal
          value={writeNote}
          onChangeText={text => {
            setWriteNote(text)
          }}
          disabled={writeNote === null ? true : false}
          modalVisible={writeNoteVisible}
          saveClick={() => {
            setWriteNoteVisible(false);
          }}
          cancelClick={() => {
            setWriteNoteVisible(false);
            setSelectedCategory(0)
          }}
        />

        {/* <RecordAudioModal
          modalVisible={recordAudioVisible}
          cancelClick={() => {
            setRecordAudioVisible(false);
            setSelectedCategory(0)
          }}
          saveClick={() => {
            setRecordAudioVisible(false);
          }}
          setAudioRecorded={audioUri => {
            console.log('Recorded Audio...', audioUri);
           
            setPadVisible(false);
            setAudio({
              uri: Platform.OS == "ios" ? audioUri : "file://" + audioUri,
              name: (moment().format('x') +'.mp3'),
              type: 'audio',
            })
          }}
        /> */}
        <RecordAudioModal
          modalVisible={recordAudioVisible}
          cancelClick={() => {
            setRecordAudioVisible(false);
            setSelectedCategory(0)
          }}
          saveClick={() => {
            setRecordAudioVisible(false);
          }}
          setAudioRecorded={audioUri => {
            console.log('Recorded Audio...', audioUri);

            let audioType = audioUri?.split('.');
            console.log("audioType ===>>>", audioType);
            console.log("audioType?. lennght ===>>>", audioType?.length);
            setPadVisible(false);
            setAudio({
              uri: Platform.OS == "ios" ? audioUri : "file://" + audioUri,
              name: (moment().format('x') + audioType[audioType?.length]),
              type: 'audio/' + audioType[audioType?.length]
            })
          }}
        />

        <SaveLinkModal
          value={saveLink}
          onChangeText={text => {
            setSaveLink(text)
          }}
          disabled={saveLink?.length === 0 ? true : false}
          modalVisible={saveLinkVisible}
          saveClick={() => {
            setSaveLinkVisible(false);
          }}
          cancelClick={() => {
            setSaveLinkVisible(false);
            setSelectedCategory(0)

          }}
        />
        <SignatureModal
          modalVisible={padVisible}
          cancelClick={() => {
            setPadVisible(false);
            setSelectedCategory(0)

          }}
          setSignatureImage={signatureData => {
            // console.log('Final Sketch...', signatureUrl);
            setPadVisible(false);
            setSignatureImage(signatureData);
          }}
        />


        <AlertModal
          isVisible={alertModal}
          onPress={() => {
            setAlertModal(false);
          }}
          message={alertMessage}
          result={success}
        />
        <AlertModal
          isVisible={mediaAlertModal}
          onPress={() => {
            setMediaAlertModal(false);
          }}
          message={mediaAlertMsg}
          result={success}
        />


        <ImagePickerModel
          showPickerModel={imageVisible}
          onHideModel={() =>
            setImageVisible(!imageVisible)
            //  takePicture()
          }
          handleChoosePhoto={(value) => {
            
            console.log("value=====>>", value);
            if (!value?.didCancel) {
            console.log("Assets=====>>", value?.assets[0]);

              selectItemFunction(1);
              setCameraPic(value?.assets[0])
            }
          }}
        />


        <UploadMediaModal
          isVisibleMedia={uploadMedialModal}
          onNoPress={() => {
            setUploadMedialModal(false);
          }}
          // onImagePress={() => console.log('onImagePress')}
          onImagePress={() => {
            onHideModelInner(),
              setUploadMedialModal(false)
            setTimeout(() => {
              onChooseFromLibraryPress()
            }, 1000)

          }}
          onVideoPress={() => {
            onHideModelInner(),
              setUploadMedialModal(false)
            setTimeout(() => {
              onChooseVideoFromLibraryPress()
            }, 1000)
          }}
          onAudioPress={() => {
            onHideModelInner(),
              setUploadMedialModal(false)
            setTimeout(() => {
              onChooseAudioFromLibraryPress()
            }, 1000)
          }}
          onDocPress={() => {
            setUploadMedialModal(false)
            setTimeout(() => {
              selectOneFile()
            }, 1000)
          }}
          modalButtonText2={'Cancel'}

        />

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
