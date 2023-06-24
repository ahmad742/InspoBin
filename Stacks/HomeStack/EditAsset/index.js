import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    SafeAreaView,
    Keyboard,
    Image,
    TextInput,
    Text,
    Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
// --------------------------------------

import colors from '../../../Utils/colors';
import InputField from '../../../Components/InputField';
import AppButton from '../../../Components/AppButton';
import Images from '../../../Assets/Images';
import { client } from '../../../Api/config';

import Header from '../../../Components/Header';
import { View } from 'react-native-animatable';
import styles from './styles';

const { height } = Dimensions.get('window');

const EditAsset = ({ route, navigation }) => {

    const { loginUserData } = useSelector(state => state.Auth);
    const { userAssets } = useSelector(state => state.Assets);

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [keyword, setKeyword] = useState('');
    const [link, setLink] = useState(userAssets?.link);
    const [note, setNote] = useState(userAssets?.note);
    const [keywordsArray, setKeywordsArray] = useState([]);
    const titleRef = useRef();
    const keywordRef = useRef();

    useEffect(() => {
        // console.log("In Edit", userAssets)
        let keywordTemp = '';
        userAssets?.keywords?.map((item, index) => (
            keywordTemp = keywordTemp + (index != 0 ? ', ' : '') + item.key_word
        ))
        setTimeout(() => {
            setTitle(userAssets?.title)
            setKeyword(keywordTemp)

        }, 500);
        // return ()=>{
        //     setKeyword('')
        //     setTitle('')
        // }
    }, []);

    const editAssetApi = (text) => {

        if (title == '') {
            SimpleToast.show('Add Title');
        } else if (keyword == '') {
            SimpleToast.show('Add Keywords');
        } else {
            const tags = text.split(',');
            for (let tag of tags) {
                let array = keywordsArray;
                array.push(tag);
            }
            setLoading(true);
            let bodyFormData = new FormData();
            bodyFormData.append('id', userAssets?.id);
            bodyFormData.append('title', title);
            keywordsArray?.forEach(item => {
                bodyFormData.append(`key_word[]`, item);
            });

            if (route?.params?.type === 'Links') {
                bodyFormData.append('media_type', 'link')
                bodyFormData.append('link', link)
            } else if (route?.params?.type === 'Notes') {
                bodyFormData.append('media_type', 'note')
                bodyFormData.append('note', note)
            } else {
                bodyFormData.append('media_type', 'media')
            }


            console.log('Body--->editAssetApi: ', bodyFormData);
            // return false
            client.post('/editmedia', bodyFormData, {
                headers: {
                    Authorization: `Bearer ${loginUserData?.token}`
                },
            }).then(response => {
                if (response.data.status == 200) {
                    console.log('editAssetApi-response======>', response.data);
                    setLoading(false)
                    SimpleToast.show('Updated Successfully')
                    setTimeout(() => {
                        navigation.goBack()
                    }, 700);
                } else {
                    setLoading(false);
                    console.log(response.data.message)
                    SimpleToast.show(response.data.message);
                }
            }).catch(err => {
                setLoading(false);
                SimpleToast.show(err);
                console.log('editAssetApi-error', err);
            });
        }
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.appBackground
        }}>
            <Header
                heading={'EditAsset'}
                rightIcon={Images.logoHeaderIcon}
                onRightAction={() => {
                    navigation.navigate('ManageSubscription');
                }}
                leftIcon={Images.arrowIcon}
                onLeftAction={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flexGrow: 1, paddingHorizontal: 15, paddingBottom: 20 }}
                keyboardShouldPersistTaps='handled'

            >

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
                    label={'Keywords'}
                    onChangeText={val => setKeyword(val)}
                    value={keyword}
                    placeholder={'Add Keywords'}
                    mainCotainer={{ marginTop: 10 }}
                    keyBoardType={'default'}
                    returnKeyType={'done'}
                    fieldRef={keywordRef}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />

                {
                    route?.params?.type === 'Links' &&
                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.label]}>{'Links'}</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={link}
                                multiline
                                onChangeText={(val) => setLink(val)}
                            />
                        </View>
                    </View>
                }

                {
                    route?.params?.type === 'Notes' &&
                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.label]}>{'Note'}</Text>
                        <View style={styles.input}>
                            <TextInput
                                value={note}
                                multiline
                                onChangeText={(val) => setNote(val)}
                            />
                        </View>
                    </View>
                }
                <AppButton
                    label={'Update'}
                    onPress={() => {
                        editAssetApi(keyword)
                    }}
                    btnStyle={{ marginTop: 25 }}
                    loading={loading}
                />

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default EditAsset;
