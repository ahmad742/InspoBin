import React, { useState, useRef, useEffect } from 'react'
import {
    Image,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    ScrollView
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SimpleToast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux'
import * as RNIap from 'react-native-iap';
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// --------------------------------------------
import styles from './styles'
import Images from '../../../Assets/Images/index'
import AppButton from '../../../Components/AppButton'
import InputField from '../../../Components/InputField'
import colors from '../../../Utils/colors'
import CheckBox from '../../../Components/CheckBox'
import { client, BASE_URL } from '../../../Api/config'
import AlertModal from '../../../Components/AlertModal';
import PackagesModal from '../../../Components/PackagesModal'
import { onRegister } from '../../../Redux/Actions/Register'
import { Subscribed_Package, Receipt } from '../../../Redux/Actions/Subscription'
import FreeSubscription from '../../../Components/FreeSubscription';


const SKU_IDs = Platform.select({
    ios: ["com.inspobin.fiftygb", "com.inspobin.hundredgb", "com.inspobin.twohundredgb", "com.inspobin.threehundredgb"],
    android: ["com.inspobin.fiftygb", "com.inspobin.hundredgb", "com.inspobin.twohundredgb", "com.inspobin.threehundredgb"]
})


const SignUp = ({ navigation }) => {

    const [checkBox, setCheckBox] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [zip, setZip] = useState('')
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [subscription, setSubsciption] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [datePicker, setDatePicker] = useState(false);
    const [privacy, setPrivacy] = useState(false)
    const [descModal, setDescModal] = useState(false)



    const nameRef = useRef();
    const emailRef = useRef();
    const numberRef = useRef();
    const dobRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const countryRef = useRef();
    const zipRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const selectedPackageRef = useRef(null)
    const signUpDataRef = useRef(null)
    const { subscribedPackage } = useSelector(state => state.Subscription)
    const { registrationData } = useSelector(state => state.Auth)


    const dispatch = useDispatch()
    const Focused = useIsFocused()

    useEffect(() => {
        if (Focused) {
            initIAP()
            return () => {
                endIAP()
            }
        }
    }, [Focused])

    useEffect(() => {
        console.log({ registrationData });
    }, [registrationData])

    const handleConfirm = (date) => {

        setDatePicker(false);
        console.warn("A date has been picked: ", date);
        let strDate = moment(date).format('DD/MM/YYYY')
        setDob(strDate)
    };

    const initIAP = async () => {
        try {
            await RNIap.initConnection()
        } catch (error) {
            console.log('initConnection-error', error);
            setLoading(false)
        }

        try {
            const products = await RNIap.getSubscriptions(SKU_IDs);
            const products2 = await RNIap.getProducts(SKU_IDs);
            // console.log({ SKU_IDs }, { products }, { products2 });
            setLoading(false)
        } catch (error) {
            console.log('getSubscriptions-error', error);
            setLoading(false)
        }

        try {
            await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        } catch (error) {
            console.log('flushFailedPurchasesCachedAsPendingAndroid-error', error);
        }

        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
            console.log('purchaseUpdateSubscription-selectedPackageRef.current', selectedPackageRef.current);
            // console.log('purchaseUpdatedListener', purchase);
            const receipt = JSON.parse(purchase.transactionReceipt);
            if (receipt) {
                dispatch(Receipt(receipt))
                dispatch(Subscribed_Package(selectedPackageRef.current))
                dispatch(onRegister(signUpDataRef.current))
                subscriptionRegister(receipt, registrationData)
                await RNIap.finishTransaction(purchase, false);
            }
        });

        purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
            console.log('purchaseErrorListener', error);
            let message = ''
            if (error.code == 'E_ALREADY_OWNED') {
                message = 'You already own this item.'
                setSubsciption(false)
            } else if (error.code == 'E_USER_CANCELLED') {
                message = 'Payment is Cancelled.'
                setSubsciption(false)
            } else if (error.code == 'PROMISE_BUY_ITEM') {
                message = 'This item is not currently available.'
                setSubsciption(false)
            } else if (error.code == 'E_ITEM_UNAVAILABLE') {
                message = 'This item is not available.'
                setSubsciption(false)
            } else {
                message = 'Unable to purchase this item. Please try later.'
                setSubsciption(false)
            }
            //toast message
        });
    }

    const endIAP = async () => {
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove;
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove;
            purchaseErrorSubscription = null;
        }
        await RNIap.endConnection();
    }

    const requestSubscription = async (sku) => {
        console.log('requestSubscription- selectedPackageRef.current', selectedPackageRef.current);
        try {
            await RNIap.requestSubscription(sku);
            console.log('requestSubscription', 'succes-sku', sku);
        } catch (err) {
            console.log('requestSubscription-err', err.code, err.message);
            setLoading(false)
        }


    }


    const registerApi = () => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (name == '' && email == '' && password == '' && confirmPass == '') {
            SimpleToast.show('All fields are mandatory')
        } else if (name == '') {
            SimpleToast.show('Name Required')
        } else if (email == '') {
            SimpleToast.show('Email Required')
        } else if (reg.test(email) === false) {
            SimpleToast.show('Invalid Email Format')
        } else if (password == '') {
            SimpleToast.show('Password Required')
        } else if (confirmPass == '') {
            SimpleToast.show('Re-enter your password')
        } else if (password != confirmPass) {
            SimpleToast.show(`Password doesn't match`)
        } else if (password.length < 6) {
            SimpleToast.show('Password should be 8 characters')
        }
        else if (!checkBox) {
            setAlertModal(true)
            setAlertMessage('Please agree to our Terms & Conditions')
        }
        else if (!privacy) {
            setAlertModal(true)
            setAlertMessage('Please check privacy policy ')
        }
        else {
           setDescModal(true)
        }

    };
    const registeredData = () => {

        setLoading(true)
        console.log(name, email, password, confirmPass);
        // return false
        client.post('/signup', {
            name: name,
            email: email,
            password: password,
            confirm_password: confirmPass,
            subscription: '0',
            phone_number: number,
            address: address,
            city: city,
            state: state,
            country: country,
            zip: zip,
            dob: dob
        }).then(response => {
            console.log('registerApi-responseJson', response.data)
            if (response.data.status == 200) {
                Keyboard.dismiss()
                SimpleToast.show('Verify your email')
                dispatch(onRegister({
                    name: name,
                    email: email,
                    password: password,
                    confirm_password: confirmPass,
                    phone_number: number,
                    address: address,
                    state: state,
                    city: city,
                    country: country,
                    zip: zip,
                    dob: dob
                }))
                setTimeout(() => {
                    navigation.navigate('OTP')
                }, 300);
            } else {
                Keyboard.dismiss()
                setAlertMessage(response.data.messgae)
                setTimeout(() => {
                    setAlertModal(true)
                }, 300);
            }
        }).catch(err => {
            SimpleToast.show('Something went wrong')
            console.log('registerApi-err', err)
        }).finally(() => {
            setLoading(false)
        })
    };

    const SubscriptionModal = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (name == '' && email == '' && password == '' && confirmPass == '') {
            SimpleToast.show('All fields are mandatory')
        } else if (name == '') {
            SimpleToast.show('Name Required')
        } else if (email == '') {
            SimpleToast.show('Email Required')
        } else if (reg.test(email) === false) {
            SimpleToast.show('Invalid Email Format')
        } else if (number == '') {
            SimpleToast.show('Phone Number Required')
        } else if (address == '') {
            SimpleToast.show('Address Required')
        } else if (password == '') {
            SimpleToast.show('Password Required')
        } else if (confirmPass == '') {
            SimpleToast.show('Re-enter your password')
        } else if (password != confirmPass) {
            SimpleToast.show(`Password doesn't match`)
        } else if (password.length < 6) {
            SimpleToast.show('Password should be 8 characters')
        }
        else if (!checkBox) {
            setAlertModal(true)
            setAlertMessage('Please agree to our Terms & Conditions')
        }
        else if (!privacy) {
            setAlertModal(true)
            setAlertMessage('Please check privacy policy ')
        }
        else {
            Keyboard.dismiss()
            setSubsciption(true)
            dispatch(onRegister({
                name: name,
                email: email,
                password: password,
                confirm_password: confirmPass,
                phone_number: number,
                address: address,
                state: state,
                city: city,
                country: country,
                zip: zip,
                dob: dob
            }))
            setTimeout(() => {
                setVisible(true)
            }, 300);
        }
    }

    const subscriptionRegister = (receipt) => {
        setLoading(true)
        console.log('subscriptionRegister-----------------------', signUpDataRef?.current);
        let body = {
            name: signUpDataRef?.current?.name,
            email: signUpDataRef?.current?.email,
            password: signUpDataRef?.current?.password,
            confirm_password: signUpDataRef?.current?.confirm_password,
            subscription: '2',
            phone_number: signUpDataRef?.current?.phone_number,
            address: signUpDataRef?.current?.address,
            city: signUpDataRef?.current?.city,
            state: signUpDataRef?.current?.state,
            country: signUpDataRef?.current?.country,
            zip: signUpDataRef?.current?.zip,
            dob: signUpDataRef?.current?.dob,
            package_id: selectedPackageRef?.current?.stripe_id,
            subscription_details: receipt
        }
        // return false;
        client.post('/signup', body, {
        }).then(response => {
            if (response.data.status == 200) {
                console.log('subscriptipnRegister-200', response.data)
                SimpleToast.show('Verify your email')
                setTimeout(() => {
                    navigation.navigate('OTP')
                }, 300);
            } else {
                // dispatch(onRegister(null))
                console.log('subscriptipnRegister-else-failed', response.data)
                setAlertMessage(response.data.message)
                setTimeout(() => {
                    setAlertModal(true)
                }, 300);
            }
        }).catch(err => {
            // dispatch(onRegister(null))
            SimpleToast.show('Something went wrong')
            console.log('registerApi-err', err)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.appBackground,
            }}>

            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='always'
                style={{ flexGrow: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, alignItems: 'center' }}
                extraHeight={50}>

                <Text style={styles.signupText}>{"Sign up to InspoBin"}</Text>
                <InputField
                    isLeftIcon={true}
                    label={"Name"}
                    onChangeText={val => setName(val)}
                    value={name}
                    leftIcon={Images.userIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"John Doe"}
                    returnKeyType={'next'}
                    fieldRef={nameRef}
                    onSubmitEditing={() => {
                        emailRef.current.focus()
                    }}
                />
                <InputField
                    isLeftIcon={true}
                    label={"Email"}
                    onChangeText={val => setEmail(val)}
                    value={email}
                    leftIcon={Images.EmailIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"johndoe@gmail.com"}
                    autoCapitalize={'none'}
                    keyBoardType={'email-address'}
                    returnKeyType={'next'}
                    fieldRef={emailRef}
                    onSubmitEditing={() => {
                        numberRef.current.focus()
                    }}
                />
                <InputField
                    isLeftIcon={true}
                    label={"Phone"}
                    onChangeText={val => setNumber(val)}
                    value={number}
                    leftIcon={Images.number}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"031xxxxxxxx"}
                    autoCapitalize={'none'}
                    keyBoardType={'number-pad'}
                    returnKeyType={'next'}
                    fieldRef={numberRef}
                    onSubmitEditing={() => {
                        addressRef.current.focus()
                    }}
                    maxLength={15}
                />

                <InputField
                    label={'Date of Birth'}
                    value={dob}
                    placeholder={'10-11-1990'}
                    rightIcon={Images.calendarIcon}
                    rightIconStyle={styles.icon}
                    rightIconOnPress={() => {
                        setDatePicker(true)
                    }}
                    editable={false}
                    returnKeyType={'next'}
                    fieldRef={dobRef}
                />

                <InputField
                    isLeftIcon={true}
                    label={"Address"}
                    onChangeText={val => setAddress(val)}
                    value={address}
                    leftIcon={Images.address}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"Address"}
                    autoCapitalize={'none'}
                    keyBoardType={'default'}
                    returnKeyType={'next'}
                    fieldRef={addressRef}
                    onSubmitEditing={() => {
                        cityRef.current.focus()
                    }}
                />

                <InputField
                    isLeftIcon={true}
                    label={"City"}
                    onChangeText={val => setCity(val)}
                    value={city}
                    leftIcon={Images.address}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"City"}
                    autoCapitalize={'none'}
                    keyBoardType={'default'}
                    returnKeyType={'next'}
                    fieldRef={cityRef}
                    onSubmitEditing={() => {
                        stateRef.current.focus()
                    }}
                />

                <InputField
                    isLeftIcon={true}
                    label={"State"}
                    onChangeText={val => setState(val)}
                    value={state}
                    leftIcon={Images.address}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"State"}
                    autoCapitalize={'none'}
                    keyBoardType={'default'}
                    returnKeyType={'next'}
                    fieldRef={stateRef}
                    onSubmitEditing={() => {
                        zipRef.current.focus()
                    }}
                />


                <InputField
                    isLeftIcon={true}
                    label={"Zip"}
                    onChangeText={val => setZip(val)}
                    value={zip}
                    leftIcon={Images.address}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"Zip"}
                    autoCapitalize={'none'}
                    keyBoardType={'default'}
                    returnKeyType={'next'}
                    fieldRef={zipRef}
                    onSubmitEditing={() => {
                        countryRef.current.focus()
                    }}
                />

                <InputField
                    isLeftIcon={true}
                    label={"Country"}
                    onChangeText={val => setCountry(val)}
                    value={country}
                    leftIcon={Images.address}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"Country"}
                    autoCapitalize={'none'}
                    keyBoardType={'default'}
                    returnKeyType={'next'}
                    fieldRef={countryRef}
                    onSubmitEditing={() => {
                        passwordRef.current.focus()
                    }}
                />


                <InputField
                    isLeftIcon={true}
                    label={"Password"}
                    onChangeText={val => setPassword(val)}
                    value={password}
                    leftIcon={Images.passwordIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"********"}
                    password={passwordVisible ? false : true}
                    rightIconOnPress={() => setPasswordVisible(!passwordVisible)}
                    autoCapitalize={'none'}
                    rightIcon={passwordVisible ? Images.eye : Images.hidden}
                    returnKeyType={'next'}
                    fieldRef={passwordRef}
                    onSubmitEditing={() => {
                        confirmPasswordRef.current.focus()
                    }}
                />
                <InputField
                    isLeftIcon={true}
                    label={"Confirm Password"}
                    onChangeText={val => setConfirmPass(val)}
                    value={confirmPass}
                    leftIcon={Images.passwordIcon}
                    iconStyle={styles.leftIconStyle}
                    placeholder={"********"}
                    password={confirmPasswordVisible ? false : true}
                    rightIconOnPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    autoCapitalize={'none'}
                    rightIcon={confirmPasswordVisible ? Images.eye : Images.hidden}
                    returnKeyType={'done'}
                    fieldRef={confirmPasswordRef}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />
                <CheckBox
                    mainContainerStyle={styles.checkContainer}
                    label={"Accept Terms & Conditions"}
                    checkBoxText={styles.checkText}
                    onPress={() => { setCheckBox(!checkBox) }}
                    onLabelPress={() => navigation.navigate('TermsAndConditions')}
                    source={Images.checkIcon}
                    checkboxStyle={checkBox === true ? styles.active : ""}
                />
                <CheckBox
                    mainContainerStyle={styles.privacyContainer}
                    label={"Privacy Policy"}
                    checkBoxText={styles.checkText}
                    onPress={() => { setPrivacy(!privacy) }}
                    onLabelPress={() => navigation.navigate('PrivacyPolicy')}
                    source={Images.checkIcon}
                    checkboxStyle={privacy === true ? styles.active : ""}
                />
                <AppButton
                    label={"SIGN UP USING FREE TRIAL"}
                    btnStyle={{
                        backgroundColor: subscription ? colors.lightGrey : colors.primary
                    }}
                    onPress={() => {
                        registerApi()
                    }}
                    labelStyle={styles.labelStyle}
                    loading={subscription ? false : loading}
                    disabled={subscription}
                />
                <AppButton
                    label={"SIGN UP USING SUBSCRIPTION"}
                    btnStyle={styles.btnStyle}
                    onPress={() => {
                        SubscriptionModal()
                    }}
                    labelStyle={styles.labelStyle}
                    loading={subscription ? loading : false}
                />
                <View style={{ flexDirection: 'row', marginTop: 80 }}>
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

                <PackagesModal
                    isVisible={visible}
                    onClose={() => {
                        setVisible(false);
                        setSubsciption(false)
                    }}
                    termsofuse={() => {
                        navigation.navigate('TermsAndConditions'),
                            setVisible(false)
                    }}
                    privacypolicy={() => {
                        navigation.navigate('PrivacyPolicy'),
                            setVisible(false)
                    }}
                    onConfirm={() => {
                        setVisible(false);
                        selectedPackageRef.current = subscribedPackage
                        signUpDataRef.current = registrationData
                        // return false;
                        setTimeout(() => {
                            requestSubscription(
                                selectedPackageRef.current?.id == 1 ? SKU_IDs[0] :
                                    selectedPackageRef.current?.id == 2 ? SKU_IDs[1] :
                                        selectedPackageRef.current?.id == 3 ? SKU_IDs[2] :
                                            selectedPackageRef.current?.id == 4 ? SKU_IDs[3] : null

                            )
                        }, 1000);

                    }}
                />
                <DateTimePickerModal
                    isVisible={datePicker}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePicker(false)}
                />
                <FreeSubscription
                    openFreeModal={descModal}
                    onClose={() => {
                        setDescModal(false);
                    }}
                    termsofuse={() => {
                        navigation.navigate('TermsAndConditions')
                            setDescModal(false)
                    }}
                    privacypolicy={() => {
                        navigation.navigate('PrivacyPolicy'),
                            setDescModal(false)
                    }}
                    loading={loading}
                    onConfirmPress={()=>{
                        registeredData()
                        setDescModal(false)
                    }}
                    onCancelPress={()=>setDescModal(false)}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>


    )
}

export default SignUp

