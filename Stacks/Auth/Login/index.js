import React, { useState, useRef } from 'react'
import {
    StyleSheet,
    Image,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SimpleToast from 'react-native-simple-toast'
import { useSelector, useDispatch } from 'react-redux'
// -------------------------------------
import styles from './styles'
import Images from '../../../Assets/Images/index'
import AppButton from '../../../Components/AppButton'
import InputField from '../../../Components/InputField'
import AlertModal from '../../../Components/AlertModal'
import colors from '../../../Utils/colors'
import { client, BASE_URL } from '../../../Api/config'
import { onLogin } from '../../../Redux/Actions/Login'
import {Storage} from '../../../Redux/Actions/Subscription'

const LoginScreen = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alertModal, setAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);


    const dispatch = useDispatch()
    const emailRef = useRef();
    const passwordRef = useRef();
    // const _keyboardDidShow = () => setKeyboardStatus(true);
    // const _keyboardDidHide = () => setKeyboardStatus(false);
    // Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    // Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    const loginApi = () => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email == '' && password == '') {
            SimpleToast.show('All fields are mandatory')
        } else if (email == '') {
            SimpleToast.show('Email Required')
        } else if (password == '') {
            SimpleToast.show('Password Required')
        } else if (reg.test(email) === false) {
            SimpleToast.show('Invalid Email Format')
        } else if (password.length < 2) {
            SimpleToast.show('Password should be 6 characters')
        } else {
            setLoading(true)
           
            client.post('/login', {
                email: email,
                password: password,
            }).then(response => {
                console.log('loginApi-response', response.data)
                if (response.data.status == 200) {
                    Keyboard.dismiss()
                    dispatch(onLogin({
                        ...response.data
                    }))
                    // dispatch(Storage(response?.data?.data?.storage))
                    SimpleToast.show("Login Successfull")
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomeStack' }],
                        })
                    }, 300);
                } else {
                    Keyboard.dismiss()
                    setAlertMessage(response.data.message)
                    setTimeout(() => {
                        setAlertModal(true)
                    }, 300);
                }
            }).catch(err => {
                SimpleToast.show('Something went wrong')
                console.log('loginApi-err', err)
            }).finally(() => {
                setLoading(false)
            })
        }

    };



    return (

        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.appBackground,
            }}>

            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='always'
                style={{ flexGrow: 1}}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15,  alignItems:'center'}}
                extraHeight={50}>

                <Image
                    source={Images.applogo}
                    style={styles.logo}
                />
                <Text style={styles.loginText}>{"Login to InspoBin"}</Text>

                <InputField
                    isLeftIcon={true}
                    label={"Email"}
                    onChangeText={val => setEmail(val)}
                    leftIcon={Images.EmailIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"johndoe@gmail.com"}
                    value={email}
                    autoCapitalize={'none'}
                    keyBoardType={'email-address'}
                    returnKeyType={'next'}
                    fieldRef={emailRef}
                    onSubmitEditing={() => {
                        passwordRef.current.focus()
                    }}

                />
                <InputField
                    isLeftIcon={true}
                    label={"Password"}
                    onChangeText={val => setPassword(val)}
                    leftIcon={Images.passwordIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"********"}
                    password={passwordVisible ? false : true}
                    rightIconOnPress={() => setPasswordVisible(!passwordVisible)}
                    value={password}
                    autoCapitalize={'none'}
                    rightIcon={passwordVisible ? Images.eye : Images.hidden}
                    returnKeyType={'done'}
                    fieldRef={passwordRef}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />
                <AppButton
                    label={"LOGIN"}
                    loading={loading}
                    onPress={() => loginApi()}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('ForgetPassword')}>
                    <Text style={styles.forgetStyle}>
                        {" Forgot Password?"}
                    </Text>
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={styles.bottomTextStyle}>
                        {"Don't have an account?"}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signUpStyle}>
                            {" Sign Up"}
                        </Text>
                    </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('ContactUs')}>
                        <Text style={styles.signUpStyle}>
                            {" Contact Us"}
                        </Text>
                    </TouchableOpacity>

                </View>
                <AlertModal
                    isVisible={alertModal}
                    onPress={() => setAlertModal(false)}
                    message={alertMessage}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}

export default LoginScreen

