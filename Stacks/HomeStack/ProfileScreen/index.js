import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';

// ---------------------------------------
import AppButton from '../../../Components/AppButton';
import CustomBtn from '../../../Components/CustomBtn';
import Header from '../../../Components/Header';
import styles from './styles';
import LogoutAlertModal from '../../../Components/AlertModal';
import CloseAlertModal from '../../../Components/AlertModal';
import colors from '../../../Utils/colors';
import Images from '../../../Assets/Images/index';
import { onLogout } from '../../../Redux/Actions/Logout';
import { Profile } from '../../../Redux/Actions/Profile';
import { client } from '../../../Api/config';
import { Subscribed_Package } from '../../../Redux/Actions/Subscription';

const ProfileScreen = ({ navigation }) => {
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [closeAccountAlert, setCloseAccountAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertMessagelink, setAlertMessageslink] = useState('');
  const [alertMessages, setAlertMessages] = useState('');
  const [loading, setLoading] = useState(false);

  const { profileData } = useSelector(state => state.Profile);
  const { loginUserData } = useSelector(state => state.Auth);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const logoutApi = () => {
    setLoading(true);
    client
      .get('/logout', {
        headers: {
          Authorization: `Bearer ${loginUserData.token}`,
        },
      })
      .then(response => {
        console.log('logoutApi-response', response.data);
        if (response.data.status == 200) {
          setLoading(false);
          setLogoutAlert(false);
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthStack' }],
            });
          }, 200);
          dispatch(onLogout());
        } else {
          console.log('In else');
        }
      })
      .catch(err => {
        setLoading(false);
        SimpleToast.show('Something went wrong');
        console.log('logoutApi-err', err);
      });
  };
  const closeAccount = () => {
    setLoading(true);
    let body = {
      id: profileData?.id
    }
    client.post('/deleteuser', body, {
      headers: {
        Authorization: `Bearer ${loginUserData.token}`,
      },
    })
      .then(response => {
        console.log('closeAccount-response', response.data);
        if (response.data.status == 200) {
          setLoading(false);
          SimpleToast.show('Account is closed')
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthStack' }],
            });
          }, 200);
          dispatch(onLogout());
        } else {
          console.log('In else');
        }
      })
      .catch(err => {
        setLoading(false);
        SimpleToast.show('Something went wrong');
        console.log('closeAccount-err', err);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        heading={'Profile'}
        rightIcon={Images.logoHeaderIcon}
        onRightAction={() => {
          navigation.navigate('ManageSubscription');
        }}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{profileData?.name}</Text>
              <AppButton
                onPress={() => navigation.navigate('EditProfile')}
                label={'EDIT PROFILE'}
                btnStyle={styles.editButton}
                labelStyle={styles.textStyle}
              />
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Email'}</Text>
              <Text style={styles.text2}>{profileData?.email}</Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Address'}</Text>
              <Text style={styles.text2}>
                {profileData?.address ? profileData?.address : '----------'}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Phone No'}</Text>
              <Text style={styles.text2}>
                {profileData?.phone_number ? profileData?.phone_number : '----------'}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Date of Birth'}</Text>
              <Text style={styles.text2}>
                {profileData?.dob ? profileData?.dob : '----------'}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'City'}</Text>
              <Text style={styles.text2}>
                {profileData?.city ? profileData?.city : '----------'}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'State'}</Text>
              <Text style={styles.text2}>
                {profileData?.state ? profileData?.state : '----------'}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Zip'}</Text>
              <Text style={styles.text2}>
                {profileData?.zip ? profileData?.zip : '----------'}
              </Text>
            </View>

            <View style={styles.bottomContainer}>
              <Text style={styles.text1}>{'Country'}</Text>
              <Text style={styles.text2}>
                {profileData?.country ? profileData?.country : '----------'}
              </Text>
            </View>

          </View>
          <CustomBtn
            label={'Change Password'}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <CustomBtn
            label={'Delete Account'}
            onPress={() => {
              setCloseAccountAlert(true)
              setAlertMessage('Before deleting your account be sure to log into')
              setAlertMessageslink(' https://inspobin.com' + " ")
              setAlertMessages('on desktop and click on the “Backup Bin” button to save a copy of any uploaded assets to your desktop. Deleting your account removes your account from our records immediately, along with any data associated with the account. The account cannot be recovered. If you have an active paid subscription you will no longer be billed after your current payment period ends. ')
            }}
          />
          <CustomBtn
            label={'Manage Subscription'}
            onPress={() => navigation.navigate('ManageSubscription')}
          />
          <CustomBtn
            label={'Contact Us'}
            onPress={() => navigation.navigate('ContactUs')}
          />
          <CustomBtn
            label={'Terms and Conditions'}
            onPress={() => navigation.navigate('TermsAndConditions')}
          />
          <CustomBtn
            label={'Privacy Policy'}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <CustomBtn label={'Log out'} onPress={() => {
            setLogoutAlert(true)
            setAlertMessage('Are you sure, you want to logout?')
            dispatch(Subscribed_Package(null))
          }} />
        </View>
      </ScrollView>

      <LogoutAlertModal
        isVisible={logoutAlert}
        loading={loading}
        message={alertMessage}
        twoButtons={true}
        onYesPress={() => logoutApi()}
        onNoPress={() => setLogoutAlert(false)}
        modalButtonText={'Yes'}
        modalButtonText2={'No'}
        buttonStyle={{ width: 100 }}
        
      />
      <CloseAlertModal
        isVisible={closeAccountAlert}
        loading={loading}
        message={alertMessage}
        furthermessage={alertMessages}
        link={alertMessagelink}
        twoButtons={true}
        onYesPress={() => closeAccount()}
        onNoPress={() => setCloseAccountAlert(false)}
        modalButtonText={'Delete Account'}
        modalButtonText2={'Cancel'}
      />

    </SafeAreaView>
  );
};

export default ProfileScreen;
