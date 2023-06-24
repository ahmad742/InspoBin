import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  Keyboard,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
// ------------------------------------
import styles from './styles';
import colors from "../../../Utils/colors"
import InputField from '../../../Components/InputField';
import Images from '../../../Assets/Images';
import AppButton from '../../../Components/AppButton';
import Header from '../../../Components/Header';
import AlertModal from '../../../Components/AlertModal';
import { Profile } from '../../../Redux/Actions/Profile';
import { client } from '../../../Api/config';
import { stat } from 'react-native-fs';

const EditProfile = ({ navigation }) => {

  const { loginUserData } = useSelector(state => state.Auth);
  const { profileData } = useSelector(state => state.Profile);

  const [name, setName] = useState(profileData?.name);
  const [email, setEmail] = useState(profileData?.email);
  const [address, setAddress] = useState(profileData?.address);
  const [number, setNumber] = useState(profileData?.phone_number);
  const [dob, setDob] = useState(profileData?.dob);
  const [city, setCity] = useState(profileData?.city);
  const [state, setState] = useState(profileData?.state);
  const [country, setCountry] = useState(profileData?.country);
  const [datePicker, setDatePicker] = useState(false);
  const [zip, setZip] = useState(profileData?.zip);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const nameRef = useRef();
  const addressRef = useRef();
  const numberRef = useRef();
  const dobRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const countryRef = useRef();
  const zipRef = useRef();




  // ----------------------------------------------

  const dispatch = useDispatch();

  const handleConfirm = (date) => {

    setDatePicker(false);
    console.warn("A date has been picked: ", date);
    let strDate = moment(date).format('DD/MM/YYYY')
    setDob(strDate)
  };
  const editProfileApi = () => {
    setLoading(true);
    setSuccess(false)
    let body = {
      name: name,
      address: address,
      dob: dob,
      city: city,
      state: state,
      country: country,
      zip: zip,
      phone_number: number
    };
    console.log('edit body', body);
    client.post('/update_profile', body, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('editProfileApi-response', response.data);

        setLoading(false);
        Keyboard.dismiss()
        setTimeout(() => {
          setAlertModal(true);
        }, 300);
        setAlertMessage(response.data.message);
        setSuccess(true)
        dispatch(
          Profile({
            name: name,
            email: email,
            address: address,
            dob: dob,
            city: city,
            state: state,
            country: country,
            zip: zip,
            phone_number: number
          }),
        );
      } else {
        console.log('In else');
      }
    })
      .catch(err => {
        setLoading(false);
        SimpleToast.show('Something went wrong');
        console.log('editProfileApi-err', err);
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.appBackground,
      }}>
      <Header
        heading={'Edit Profile'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{paddingHorizontal: 15 }}
        extraHeight={150}>


        <InputField
          label={'Name'}
          onChangeText={val => setName(val)}
          value={name}
          placeholder={'John Doe'}
          inputFieldStyle={styles.inputField}
          keyBoardType={'default'}
          returnKeyType={'next'}
          fieldRef={nameRef}
          onSubmitEditing={() => {
            numberRef.current.focus()
          }}
        />
        <InputField
          label={'Email'}
          onChangeText={val => setEmail(val)}
          // value={email}
          editable={false}
          placeholder={email}
        />
        <InputField
          label={'Phone No'}
          onChangeText={val => setNumber(val)}
          value={number}
          keyBoardType={'number-pad'}
          placeholder={'031xxxxxxxx'}
          returnKeyType={'next'}
          fieldRef={numberRef}
          onSubmitEditing={() => {
            addressRef.current.focus()
          }}
        />
        <InputField
          label={'Address'}
          onChangeText={val => setAddress(val)}
          value={address}
          placeholder={'21 Corn Kiln Close, Peterborough, United..'}
          keyBoardType={'default'}
          returnKeyType={'next'}
          fieldRef={addressRef}
          onSubmitEditing={() => {
            cityRef.current.focus()
          }}
        />
        <InputField
          label={'Date of Birth'}
          // onChangeText={val => setDob(val)}
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
          label={'City'}
          onChangeText={val => setCity(val)}
          value={city}
          placeholder={'London'}
          keyBoardType={'default'}
          returnKeyType={'next'}
          fieldRef={cityRef}
          onSubmitEditing={() => {
            stateRef.current.focus()
          }}
        />
        <InputField
          label={'State'}
          onChangeText={val => setState(val)}
          value={state}
          placeholder={'London'}
          inputFieldStyle={styles.inputField}
          keyBoardType={'default'}
          returnKeyType={'next'}
          fieldRef={stateRef}
          onSubmitEditing={() => {
            zipRef.current.focus()
          }}
        />
        
        <InputField
          label={'Zip'}
          onChangeText={val => setZip(val)}
          value={zip}
          keyBoardType={'number-pad'}
          placeholder={'5808'}
          returnKeyType={'next'}
          fieldRef={zipRef}
          onSubmitEditing={() => {
            countryRef.current.focus()
          }}
        />
        <InputField
          label={'Country'}
          onChangeText={val => setCountry(val)}
          value={country}
          placeholder={'England'}
          keyBoardType={'default'}
          returnKeyType={'done'}
          fieldRef={countryRef}
          onSubmitEditing={() => {
            Keyboard.dismiss()
            
          }}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.goBack()

            }}
            style={styles.cancel}>
            <Text style={styles.cancel}>{'CANCEL'}</Text>
          </TouchableOpacity>
          <AppButton
            label={'SAVE'}
            loading={loading}
            btnStyle={styles.buttonStyle}
            onPress={() => editProfileApi()}
          />
        </View>

        <AlertModal
          isVisible={alertModal}
          onPress={() => {
            setAlertModal(false);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }}
          message={alertMessage}
          result={success}
        />

        <DateTimePickerModal
          isVisible={datePicker}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePicker(false)}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
