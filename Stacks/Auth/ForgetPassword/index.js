import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    ScrollView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SimpleToast from 'react-native-simple-toast'
// --------------------------------------------------
import styles from './styles'
import colors from '../../../Utils/colors'
import AppButton from '../../../Components/AppButton'
import { client } from '../../../Api/config'
import AlertModal from '../../../Components/AlertModal'
import InputField from '../../../Components/InputField'
import Images from '../../../Assets/Images/index'


const ForgetPassword = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertModal, setAlertModal] = useState(false)
    const [apiSuccess, setApiSuccess] = useState(false)
    const [success, setSuccess] = useState(false)

    const ForgetPasswordApi = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email == '') {
            SimpleToast.show('Email Required')
        } else if (reg.test(email) === false) {
            SimpleToast.show('Invalid Email Format')
        } else {
            setLoading(true)
            setSuccess(false)
            client.post('/forget_password', {
                email: email
            }).then(response => {
                console.log('ForgetPasswordApi-response', response.data)
                if (response.data.status == 200) {
                    Keyboard.dismiss()
                    setTimeout(() => {
                        setAlertModal(true)
                    }, 300);
                    setAlertMessage('New Password has been sent to your email')
                    setApiSuccess(true)
                    setSuccess(true)
                } else {
                    Keyboard.dismiss()
                    setTimeout(() => {
                        setAlertModal(true)
                    }, 300);
                    setAlertMessage(response.data.message)
                }
            }).catch(err => {
                SimpleToast.show('Something went wrong')
                console.log('verifyOTPApi-err', err)
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
                keyboardShouldPersistTaps='handled'
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, alignItems: 'center' }}
                extraHeight={120}>

                <Text style={styles.forgetText}>{"Forget Password"}</Text>
                <View style={{ flexDirection: 'row', marginTop: 30, }}>
                    <Text style={styles.verifyText}>{"We'll send you a new password to your email. Enter it below:"}</Text>

                </View>

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
                />

                <AppButton
                    label={"Send"}
                    onPress={() => ForgetPasswordApi()}
                    labelStyle={styles.labelStyle}
                    loading={loading}
                />

                <View style={{ flexDirection: 'row', marginTop: 100 }}>
                    <Text style={styles.bottomTextStyle}>
                        {"Already have an account?"}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.signUpStyle}>
                            {" Sign In"}
                        </Text>
                    </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
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


                <AlertModal
                    isVisible={alertModal}
                    onPress={() => {
                        setAlertModal(false)
                        apiSuccess && (
                            setTimeout(() => {
                                navigation.goBack()
                            }, 300)
                        )
                    }}
                    message={alertMessage}
                    result={success}
                />

            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}

export default ForgetPassword

