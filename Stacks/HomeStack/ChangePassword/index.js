import React, { useRef, useState } from 'react'
import {
    SafeAreaView,
    Text,
    Keyboard,
    KeyboardAvoidingView,
    View,
    ScrollView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import SimpleToast from 'react-native-simple-toast'
// --------------------------------------
import styles from './styles'
import colors from '../../../Utils/colors'
import InputField from '../../../Components/InputField'
import AppButton from '../../../Components/AppButton'
import Images from '../../../Assets/Images'
import { client } from '../../../Api/config'
import AlertModal from '../../../Components/AlertModal'



const ChangePassword = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [alertModal, setAlertModal] = useState(false)
    const [passwordChanged, setPasswordChanged] = useState(false)
    const [oldVisible, setOldVisible] = useState(false)
    const [newVisible, setNewVisible] = useState(false)
    const [confirmNewVisible, setConfirmNewVisible] = useState(false)
    const [success, setSuccess] = useState(false)
    const oldPassRef = useRef()
    const newPassRef = useRef()
    const confirmNewPassRef = useRef()



    const { loginUserData } = useSelector(state => state.Auth)
    // useEffect(() => {
    //     console.log("Auth Token", loginUserData)
    // }, [])

    const changePasswordApi = () => {

        if (oldPassword == '' && newPassword == '' && confirmNewPassword == '') {
            SimpleToast.show('All fields are mandatory')
        } else if (oldPassword == '') {
            SimpleToast.show('Old Password Required')
        } else if (newPassword == '') {
            SimpleToast.show('New Password Required')
        } else if (newPassword.length < 6) {
            SimpleToast.show('Password should be 6 characters')
        } else if (confirmNewPassword == '') {
            SimpleToast.show('Confrim your new password')
        } else if (oldPassword === newPassword) {
            SimpleToast.show(`Old and New Password can't be same`)
        } else {
            let body = {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmNewPassword
            }
            setLoading(true)
            setSuccess(false)
            client.post('/update_password', body, {
                headers: {
                    'Authorization': `Bearer ${loginUserData.token}`
                }
            }).then(response => {
                console.log('changePasswordApi-response', response.data)
                if (response.data.status == 200) {
                    Keyboard.dismiss()
                    setAlertMessage(response.data.message)
                    setTimeout(() => {
                        setAlertModal(true)
                    }, 300);
                    setPasswordChanged(true)
                    setSuccess(true)

                } else {
                    setAlertMessage(response.data.message)
                    setAlertModal(true)
                }
            }).catch(err => {
                SimpleToast.show('Something went wrong')
                console.log('changePasswordApi-err', err)
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

            <Header
                heading={'Change Password'}
                rightIcon={Images.logoHeaderIcon}
                onRightAction={() => { navigation.navigate('ManageSubscription') }}
                leftIcon={Images.arrowIcon}
                onLeftAction={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                style={{ flexGrow: 1}}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15 }}
                extraHeight={150}>

                <InputField
                    label={"Old Password"}
                    placeholder={"Enter Old Password"}
                    inputFieldStyle={styles.inputField}
                    onChangeText={val => setOldPassword(val)}
                    value={oldPassword}
                    password={oldVisible ? false : true}
                    rightIconOnPress={() => setOldVisible(!oldVisible)}
                    autoCapitalize={'none'}
                    rightIcon={oldVisible ? Images.eye : Images.hidden}
                    returnKeyType={'next'}
                    fieldRef={oldPassRef}
                    onSubmitEditing={() => {
                        newPassRef.current.focus()
                    }}
                />
                <InputField
                    label={"New Password"}
                    placeholder={"Enter New Password"}
                    onChangeText={val => setNewPassword(val)}
                    value={newPassword}
                    password={newVisible ? false : true}
                    rightIconOnPress={() => setNewVisible(!newVisible)}
                    autoCapitalize={'none'}
                    rightIcon={newVisible ? Images.eye : Images.hidden}
                    returnKeyType={'next'}
                    fieldRef={newPassRef}
                    onSubmitEditing={() => {
                        confirmNewPassRef.current.focus()
                    }}
                />
                <InputField
                    label={"Confirm New Password"}
                    placeholder={"Confirm New Password"}
                    onChangeText={val => setConfirmNewPassword(val)}
                    value={confirmNewPassword}
                    password={confirmNewVisible ? false : true}
                    rightIconOnPress={() => setConfirmNewVisible(!confirmNewVisible)}
                    autoCapitalize={'none'}
                    rightIcon={confirmNewVisible ? Images.eye : Images.hidden}
                    returnKeyType={'done'}
                    fieldRef={confirmNewPassRef}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />
                <AppButton
                    label={"UPDATE PASSWORD"}
                    loading={loading}
                    onPress={() => changePasswordApi()}
                />
                <AlertModal
                    isVisible={alertModal}
                    onPress={() => {
                        setAlertModal(false)
                        passwordChanged && (
                            setTimeout(() => {
                                navigation.goBack()
                            }, 500)
                        )
                    }}
                    message={alertMessage}
                    result={success}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>

    )
}

export default ChangePassword


