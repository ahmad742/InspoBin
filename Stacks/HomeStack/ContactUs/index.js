import React, { useState } from 'react'
import {
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch, useSelector } from 'react-redux'
import SimpleToast from 'react-native-simple-toast'
import axios from 'axios'
import styles from './styles'
import Images from '../../../Assets/Images'
import Header from '../../../Components/Header'
import InputField from '../../../Components/InputField'
import AppButton from '../../../Components/AppButton'
import colors from '../../../Utils/colors'
import CheckBox from '../../../Components/CheckBox'
import ImagePickerModel from '../../../Components/ImagePickerModel'
import AlertModal from '../../../Components/AlertModal'
import { client } from '../../../Api/config'
import Fonts from '../../../Assets/Fonts'

const ContactUs = ({ navigation }) => {

    const { loginUserData } = useSelector(state => state.Auth)
    const { profileData } = useSelector(state => state.Profile);


    const [checkBox, isCheckBox] = useState(false)
    const [imageVisible, setImageVisible] = useState(false)
    const [imageOne, setImageOne] = useState(null)
    const [imageTwo, setImageTwo] = useState(null)
    const [imageThree, setImageThree] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    // const [name, setName] = useState(profileData?.name ? profileData?.name : '')
    const [email, setEmail] = useState('')
    // const [email, setEmail] = useState(profileData?.email ? profileData?.email : '')
    const [message, setMessage] = useState('')
    const [images, setImages] = useState([])
    const [alertMessage, setAlertMessage] = useState('')
    const [alertModal, setAlertModal] = useState(false)
    const [success, setSuccess] = useState(false)


    const removeImage = (val) => {

        const newList = images.splice(val, 1);
        setImages(newList);


        console.log('UpdateImages: ', JSON.stringify(images))

        setImageOne(images[0]);
        setImageTwo(images[1]);
        setImageThree(images[2]);



    }

    const contactUsApi = async () => {
        // if (name == '') {
        //             setAlertModal(true)
        //             setAlertMessage('Please enter your name')
        //         } else if (email == '') {
        //             setAlertModal(true)
        //             setAlertMessage('Please enter your email')
        //         } else if (message == '') {
        //             setAlertModal(true)
        //             setAlertMessage('Please write a message')
        //         } else {
        //             setLoading(true)
        //             setSuccess(false)
        //             let bodyFormData = new FormData();
        
        //             bodyFormData.append('name', name);
        //             bodyFormData.append('email', email);
        //             bodyFormData.append('message', message);
        //             if (images)
        //                 images.forEach((item) => {
        //                     bodyFormData.append(`file[]`, item)
        //                 })
        //             console.log("Contact Us body....", bodyFormData);
        // fetch('https://inspobin.com/api/contact_us', {
        //     method: 'post',
        //     headers: {
        //         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        //     },
        //      headers: {
        //             "Authorization": `Bearer ${loginUserData?.token}`,
        //             "Content-Type": "multipart/form-data"
        //         }
        //     body: 'foo=bar&lorem=ipsum'
        //     })
        //     .then(json)
        //     .then(function (data) {
        //     console.log('Request succeeded with JSON response', data);
        //     })
        //     .catch(function (error) {
        //     console.log('Request failed', error);
        //     });

    //     // console.log('images array', images);
    //     // return false;

        if (name == '') {
            setAlertModal(true)
            setAlertMessage('Please enter your name')
        } else if (email == '') {
            setAlertModal(true)
            setAlertMessage('Please enter your email')
        } else if (message == '') {
            setAlertModal(true)
            setAlertMessage('Please write a message')
        } else {
            setLoading(true)
            setSuccess(false)
            let bodyFormData = new FormData();

            bodyFormData.append('name', name);
            bodyFormData.append('email', email);
            bodyFormData.append('message', message);
            if (images)
                images.forEach((item) => {
                    bodyFormData.append(`file[]`, item)
                })
            console.log("Contact Us body....", bodyFormData);
            // return false;
            axios.post('https://inspobin.com/api/contact_us', bodyFormData, {
        //    await fetch(`https://inspobin.com/api/contact_us`,{
                headers: {
                    // "Authorization": `Bearer ${loginUserData?.token}`,
                    "Content-Type": "multipart/form-data"
                }
            }).then(response => {
                console.log('contactUsApi-response======>', response.data)
                if (response.data.status == 200) {
                    setLoading(false)
                    setAlertModal(true)
                    setAlertMessage(response?.data?.message)
                    setMessage('')
                    setImages([])
                    setImageOne(null)
                    setImageTwo(null)
                    setImageThree(null)
                    setSuccess(true)
                    isCheckBox(false)
                }
                else {
                    setLoading(false)
                    // SimpleToast.show(response.data.message);
                }
            }).catch(err => {
                setLoading(false)
                // SimpleToast.show('Something went wrong')
                console.log('contactUsApi-error', err)
            })
        }



    }

    

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.appBackground,
            }}>

            <Header
                heading={'Contact Us'}
                rightIcon={Images.logoHeaderIcon}
                onRightAction={() => { navigation.navigate('ManageSubscription') }}
                leftIcon={Images.arrowIcon}
                onLeftAction={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, alignItems: 'center' }}
                extraHeight={150}>


                <Image
                    source={Images.ContactImage}
                    style={styles.mainImage}
                />
                <InputField
                    label={"Name"}
                    placeholder={"Enter Name"}
                    onChangeText={(val) => setName(val)}
                    value={name}
                // editable={false}
                />
                <InputField
                    label={"Email"}
                    placeholder={"johndoe@gmail.com"}
                    onChangeText={(val) => setEmail(val)}
                    value={email}
                    keyBoardType={'email-address'}
                    autoCapitalize={'none'}
                // editable={false}
                />
                <InputField
                    multiLine={false}
                    label={"Message"}
                    placeholder={"Type your message"}
                    onChangeText={(val) => setMessage(val)}
                    value={message}
                    textAlignVertical={"top"}
                    returnKeyType={'done'}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}

                />
                <CheckBox
                    mainContainerStyle={{ marginTop: 30 }}
                    label={"Attach an image"}
                    onPress={() => { isCheckBox(!checkBox) }}
                    source={Images.checkIcon}
                    checkboxStyle={checkBox === true ? styles.active : ""}
                />
                {
                    checkBox &&
                    <View style={styles.imageContainer}>
                        {imageOne == null ?
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => setImageVisible(!imageVisible)}>
                                <Image
                                    source={Images.additionIcon}
                                    style={styles.addIcon}
                                />
                            </TouchableOpacity>
                            :
                            <View>
                                <Image
                                    source={{ uri: imageOne.uri }}
                                    style={{ height: 70, width: 70, resizeMode: 'cover', marginRight: 20, borderRadius: 4 }}
                                />
                                <TouchableOpacity onPress={() => removeImage(0)} style={{ position: 'absolute', top: 0, right: 10, width: 20, height: 20 }}>
                                    <Image
                                        source={Images.cancel}
                                        style={{ height: 20, width: 20, resizeMode: 'cover' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            imageTwo == null ?
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => setImageVisible(!imageVisible)}>
                                    <Image
                                        source={Images.additionIcon}
                                        style={styles.addIcon}
                                    />
                                </TouchableOpacity>
                                :

                                <View>

                                    <Image
                                        source={{ uri: imageTwo.uri }}
                                        style={{ height: 70, width: 70, resizeMode: 'cover', marginRight: 20, borderRadius: 4 }}
                                    />
                                    <TouchableOpacity onPress={() => removeImage(1)} style={{ position: 'absolute', top: 0, right: 10, width: 20, height: 20 }}>
                                        <Image
                                            source={Images.cancel}
                                            style={{ height: 20, width: 20, resizeMode: 'cover' }}
                                        />
                                    </TouchableOpacity>
                                </View>

                        }

                        {
                            imageThree == null ?
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => setImageVisible(!imageVisible)}>
                                    <Image
                                        source={Images.additionIcon}
                                        style={styles.addIcon}
                                    />
                                </TouchableOpacity>
                                :
                                <View>
                                    <Image
                                        source={{ uri: imageThree.uri }}
                                        style={{ height: 70, width: 70, resizeMode: 'cover', marginRight: 20, borderRadius: 4 }}
                                    />
                                    <TouchableOpacity onPress={() => removeImage(2)} style={{ position: 'absolute', top: 0, right: 10, width: 20, height: 20 }}>
                                        <Image
                                            source={Images.cancel}
                                            style={{ height: 20, width: 20, resizeMode: 'cover' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                }
                <AppButton
                    label={"SEND"}
                    btnStyle={{ marginTop: 30 }}
                    loading={loading}
                    onPress={() => contactUsApi()}
                />
                <Text style={styles.bottomInfo}>{"Please give us 24 to 72 hours to respond."}</Text>


                {/* ------------------------------Modal----------------------------- */}
                <ImagePickerModel
                    showPickerModel={imageVisible}
                    onHideModel={() => setImageVisible(!imageVisible)}
                    handleChoosePhoto={(data) => {
                        // console.log(data?.didCancel)
                        if (data?.didCancel === undefined) {
                            let imagesArray = [];
                            imagesArray = images
                            // console.log("Image URI", data?.assets[0])
                            // return false
                            const imageResponse = data.assets[0]
                            const imgData = { ...imageResponse, name: imageResponse?.fileName };
                            imagesArray.push(imgData)
                            console.log(images)
                            setImageOne(images[0])
                            setImageTwo(images[1])
                            setImageThree(images[2])
                            setImages(imagesArray)
                        }
                    }}
                />

                <AlertModal
                    isVisible={alertModal}
                    onPress={() => {
                        setAlertModal(false)
                    }}
                    message={alertMessage}
                    result={success}
                />
            </KeyboardAwareScrollView>

        </SafeAreaView>

    )
}

export default ContactUs

