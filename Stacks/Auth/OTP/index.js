import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SimpleToast from 'react-native-simple-toast'
import { useSelector, useDispatch } from 'react-redux'
// --------------------------------------------------
import styles from './styles'
import AppButton from '../../../Components/AppButton'
import colors from '../../../Utils/colors'
import { client } from '../../../Api/config'
import OTPInput from '../../../Components/OTPInput'
import AlertModal from '../../../Components/AlertModal'
import { onRegister } from '../../../Redux/Actions/Register'

const OTP = ({ navigation }) => {

    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const [resendBtnDisable, setResendBtnDisable] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertModal, setAlertModal] = useState(false)

    const { registrationData } = useSelector(state => state.Auth)
    const dispatch = useDispatch()
    useEffect(() => {
        timerFunc()
          
        return()=>(
            timerFunc()
        )
    }, [])

    const timerFunc = () => {
        setTimer(60);
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && (
                    clearInterval(interval)
                )
                return lastTimerCount - 1;

            });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => {
            clearInterval(interval)
        }
    };

    const verifyOTPApi = () => {
        if (otp == '') {
            SimpleToast.show('Enter OTP')
        } else {
            setLoading(true)
            client.post('/otp_verification', {
                otp: otp,
                email: registrationData?.email
            }).then(response => {
                console.log('verifyOTPApi-response', response.data)
                if (response.data.status == 200) {
                    SimpleToast.show("Email Verified")
                    navigation.navigate('LoginScreen')
                    dispatch(onRegister(null))
                } else {
                    setAlertMessage(response.data.message)
                    setAlertModal(true)
                }
            }).catch(err => {
                SimpleToast.show('Something went wrong')
                console.log('verifyOTPApi-err', err)
            }).finally(() => {
                setLoading(false)
            })
        }

    };

    const resendOTPApi = () => {
        timerFunc()
        // console.log(userEmail);
        // return false
        client.post('/resend_otp', {
            email: registrationData?.email
        }).then(response => {
            console.log('resendOTPApi-response', response.data)
            if (response.data.status == 200) {
                SimpleToast.show("OTP Resent")
            } else {
                setAlertMessage(response.data.message)
                setAlertModal(true)
            }
        }).catch(err => {
            SimpleToast.show('Something went wrong')
            console.log('resendOTPApi-err', err)
        })
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
                extraHeight={50}>
                <Text style={styles.loginText}>{"Verify Account"}</Text>
                <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: -10 }}>
                    <Text style={styles.verifyText}>{"We've sent you a one-time verification code to your email. Enter it below:"}</Text>
                    {
                        timer > 0 &&
                        <Text style={styles.otpTime}>{timer}</Text>
                    }
                </View>
                <OTPInput
                    onComplete={(code) => {
                        setOtp(code)
                    }}
                />
                <AppButton
                    label={"VERIFY"}
                    onPress={() => verifyOTPApi()}
                    labelStyle={styles.labelStyle}
                    loading={loading}
                />
                {
                    timer == 0 &&

                    <AppButton
                        label={"RESEND OTP"}
                        btnStyle={[styles.btnStyle, { backgroundColor: colors.black }]}
                        onPress={() => {
                            resendOTPApi()
                        }}
                        labelStyle={styles.labelStyle}
                    // loading={loading}
                    />
                }
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.signUpStyle}>
                        {"Login with another account"}
                    </Text>
                </TouchableOpacity>

                <AlertModal
                    isVisible={alertModal}
                    onPress={() => setAlertModal(false)}
                    message={alertMessage}
                />

            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}

export default OTP

