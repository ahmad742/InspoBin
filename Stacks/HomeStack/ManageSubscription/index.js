import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, SafeAreaView, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedCircularProgress from 'react-native-animated-circular-progress';
import ProgressCircle from 'react-native-progress-circle'
//import * as RNIap from 'react-native-iap';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import SimpleToast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Images from '../../../Assets/Images';
import Header from '../../../Components/Header';
import AppButton from '../../../Components/AppButton';
import RadioButton from '../../../Components/RadioButton';
import AlertModal from '../../../Components/AlertModal';
import CheckBox from '../../../Components/CheckBox';
import styles from './styles';
import colors from '../../../Utils/colors';
import { client } from '../../../Api/config'
import { Subscribed_Package, Receipt } from '../../../Redux/Actions/Subscription'


const SKU_IDs = Platform.select({
  ios: ["com.inspobin.fiftygb", "com.inspobin.hyndredgb", "com.inspobin.twohundredgb", "com.inspobin.threehundredgb"],
  android: ["com.inspobin.fiftygb", "com.inspobin.hundredgb", "com.inspobin.twohundredgb", "com.inspobin.threehundredgb"]
})

let purchaseUpdateSubscription = null
let purchaseErrorSubscription = null

const ManageSubscription = ({ navigation }) => {
  let StorageLeft = ''


  const { loginUserData } = useSelector(state => state.Auth);
  const { packages, subscribedPackage, storage } = useSelector(state => state.Subscription)
  const { profileData } = useSelector(state => state.Profile);

  const selectedPackageRef = useRef(null)

  const [selectedPackage, setSelectedPackage] = useState(subscribedPackage ? subscribedPackage : null);

  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [usage, setUsage] = useState(0);
  const [total, setTotal] = useState(StorageLeft);
  const [checkBox, setCheckBox] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [termsCondition, setTermsCondition] = useState(false)
  const [space, setSpace] = useState('')

  const dispatch = useDispatch()
  const Focused = useIsFocused()

  useEffect(() => {
    selectedPackageRef.current = subscribedPackage

    let percentage = (profileData?.consumed_storage * 100) / profileData?.storage
    let consumedStorage = profileData?.consumed_storage / 1048576
    StorageLeft = profileData?.storage - profileData?.consumed_storage
    setTotal(StorageLeft == 0 ? StorageLeft : ((StorageLeft / (1024*1024)).toFixed(4)))
    setPercentage(percentage)
    setUsage(consumedStorage == 0 ? consumedStorage : (Math.round(consumedStorage * 100) / 100).toFixed(2))
    console.log({ selectedPackage });
    console.log({ subscribedPackage });
    initIAP()
    return () => {
      endIAP()
    }
  }, [profileData])

  const subscribe = (receipt) => {

    let body = {
      package_id: selectedPackageRef?.current?.stripe_id,
      object: receipt,
      subscription_changes: 'create'
    };
    console.log("body====>>>", body);

    client.post('/subscription', body, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('subscribe-responseJson', response.data)
        SimpleToast.show('Packaged Subscribed Successfully')
      } else {
        console.log('subscribe-else', response.data.message)
        console.log('subscribe-responseJson', response.data.data)
        setSpace(response.data.data)
      }
    }).catch(err => {
      // SimpleToast.show('Something went wrong')
      console.log('subscribe-err', err)
    }).finally(() => {
      setLoading(false)
    })
  };

  const UnSubscribe = () => {

    let body = {
      subscription_changes: 'cancel'
    };
    console.log({ body });

    client.post('/subscription', body, {
      headers: {
        Authorization: `Bearer ${loginUserData?.token}`,
      },
    }).then(response => {
      if (response.data.status == 200) {
        console.log('UnSubscribe-responseJson', response.data)
        SimpleToast.show('Packaged UnSubscribe Successfully')

      } else {
        console.log('UnSubscribe-else', response.data)
      }
    }).catch(err => {
      SimpleToast.show('Something went wrong')
      console.log('UnSubscribe-err', err)
    }).finally(() => {
      setLoading(false)
    })
  };
  const initIAP = async () => {
    try {
      await RNIap.initConnection()
      console.log('initConnection', 'success');
    } catch (error) {
      console.log('initConnection-error', error);
      setLoading(false)
    }
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {

      //console.log('purchaseUpdatedListener', purchase);
      const receipt = JSON.parse(purchase.transactionId);
      if (receipt) {
        console.log("receipt===>>>", receipt);
        dispatch(Receipt(receipt))
        dispatch(Subscribed_Package(selectedPackageRef.current))
        console.log('im here');
        subscribe(receipt)
        await RNIap.finishTransaction(purchase, false);
      }
    });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
      let message = ''
      if (error.code == 'E_ALREADY_OWNED') {
        message = 'You already own this item.'
      } else if (error.code == 'E_USER_CANCELLED') {
        message = 'Payment is Cancelled.'
      } else if (error.code == 'PROMISE_BUY_ITEM') {
        message = 'This item is not currently available.'
      } else if (error.code == 'E_ITEM_UNAVAILABLE') {
        message = 'This item is not available.'
      } else {
        message = 'Unable to purchase this item. Please try later.'
      }
      //toast message
    });

    try {
      const currentPurchases = await RNIap.getAvailablePurchases();
      if (Array.isArray(currentPurchases) && currentPurchases.length > 0) {
        // console.log('currentPurchases-_purchase', currentPurchases)
      } else {
        UnSubscribe()
        console.log('Purchase Active', currentPurchases)
      }
    } catch (error) {
      setLoading(false)
    }

    try {
      const products = await RNIap.getSubscriptions(SKU_IDs);
      // const products2 = await RNIap.getProducts(SKU_IDs);
      // const products = await getProducts(productIds)
      //console.log({ SKU_IDs }, { products }, { products2 });
      setLoading(false)
    } catch (error) {
      console.log('getSubscriptions-error', error);
      setLoading(false)
    }

    console.log('purchase-Listener-allset');


    // try {
    //   await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
    // } catch (error) {
    //   console.log('flushFailedPurchasesCachedAsPendingAndroid-error', error);
    // }
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
    console.log('sku-sku', sku);

    if (selectedPackage == null) {
      setAlertModal(true)
      setAlertMessage('Please choose a package to subscribe.')
    } else if (!checkBox) {
      setAlertModal(true)
      setAlertMessage('Please check Terms of Use.')
    }
    else if (!privacy) {
      setAlertModal(true)
      setAlertMessage('Please check Privacy Policy.')
    }
    else {
      try {
        console.log("======== SUBBSCRIPTION TESTINBG =========");
        await RNIap.requestSubscription(sku);
        console.log('requestSubscription', 'succes-sku', sku);
      } catch (err) {
        console.log('requestSubscription-err', err.code, err.message);
        setLoading(false)
      }
    }

  }

  const renderItem = ({ item }) => {
    return (
      subscribedPackage ?
        <RadioButton
          storage={item.storage + " GB "}
          price={'$' + item.price + " monthly "}
          subscribed={true}
          mainRadioStyle={styles.radioView}
          onPress={() => {
            setSelectedPackage(item);
            selectedPackageRef.current = item
            console.log('selectedPackageRef.current===>>>', selectedPackageRef.current)
          }}
          radioStyle={(selectedPackage?.id == item.id) ? styles.active : ''}
        />
        :
        <RadioButton
          // label={'Pay ' + '$' + ' monthly ' + 'for' + ' ' + item.storage + ' GB' + ' of storage'}
          // priceText={item.price + '$'}
          storage={item.storage + " GB "}
          price={'$' + item.price + " monthly "}
          mainRadioStyle={styles.radioView}
          onPress={() => {
            setSelectedPackage(item);
            selectedPackageRef.current = item
            // console.log('selectedPackageRef.current===>>>', selectedPackageRef.current)
          }}
          radioStyle={(selectedPackage?.id == item.id) ? styles.active : ''}
        />

    );
  };

  const CheckStorage = () => {
    let storage = profileData?.consumed_storage
    if (storage > 1) { storage = (storage / 1048576).toFixed(4) + " GB" }
    // else if (storage >= 1024) { storage = (storage / 1024).toFixed(2) + " MB" }
    // else if (storage > 1) { storage = storage + " GB" }
    // else if (storage == 1) { storage = storage + " bytes" }
    else { storage = "0 GB" }
    return storage;

  }
  const FreeSpace = () => {
    let TotalSpaceLeft = total
    if (TotalSpaceLeft > 1) { TotalSpaceLeft = (TotalSpaceLeft/ 1048576).toFixed(4) }
    else { TotalSpaceLeft = "0 GB" }
    return TotalSpaceLeft;

  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <Header
        heading={'Manage Subscription'}
        // rightIcon={Images.logoHeaderIcon}
        onRightAction={() => { }}
        leftIcon={Images.arrowIcon}
        onLeftAction={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, alignItems: 'center', paddingBottom: 20 }}
        extraHeight={150}>

        {/* <AnimatedCircularProgress
          backgroundColor="gray"
          color="#0078ef"
          startDeg={0}
          endDeg={300}
          radius={100}
          duration={1000}
          innerRadius={40}
          innerBackgroundColor={'white'}
        /> */}
        <ProgressCircle
          percent={percentage}
          radius={100}
          borderWidth={40}
          color={colors.primary}
          shadowColor="#999"
          bgColor="#fff"
        >
        </ProgressCircle>

        <Text style={styles.text1}>{`${CheckStorage()} used of ${profileData?.storage / 1048576 + " GB"}`}</Text>
        <Text style={styles.text2}>{`${(total)} GB left`}</Text>
        <View style={styles.bottomView}>
          <FlatList
            data={packages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
          <View style={{ borderBottomColor: 'black', borderBottomWidth: 0.3, marginTop: 10, width: '100%', alignSelf: 'center' }}></View>

          <View >

            <CheckBox
              mainContainerStyle={styles.checkContainer}
              label={"Terms of Use (EULA)"}
              checkBoxText={styles.checkText}
              onPress={() => { setCheckBox(!checkBox) }}
              onLabelPress={() => navigation.navigate('TermsAndConditions')}
              source={Images.checkIcon}
              checkboxStyle={checkBox === true ? styles.active : ""}
            />
            <CheckBox
              mainContainerStyle={styles.checkContainer}
              label={"Privacy Policy"}
              checkBoxText={styles.checkText}
              onPress={() => { setPrivacy(!privacy) }}
              onLabelPress={() => navigation.navigate('PrivacyPolicy')}
              source={Images.checkIcon}
              checkboxStyle={privacy === true ? styles.active : ""}
            />
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 0.3, marginTop: 10, width: '100%', alignSelf: 'center' }}></View>

            <View>
              {subscribedPackage != selectedPackage ?
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                  <Text style={[styles.text1]}>{'A '}</Text>

                  <Text style={{ fontWeight: 'bold' }}>
                    {"$" + selectedPackage.price + " monthly purchase "}
                  </Text>
                  <Text style={[styles.text1]}>
                    {'will be applied to your app billing account on confirmation. Subscriptions will automatically renew unless canceled within 24 hours before the end of the current period. You can cancel anytime within your app billing account settings. Any unused portion of a free trial will be forfeited if you purchase a subscription. For more information, see our '}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditions')}>
                    <Text style={[styles.text1,
                    { textDecorationLine: 'underline' }]}>
                      {'Terms of Use'}
                    </Text>
                  </TouchableOpacity>

                  <Text style={[styles.text1]}>
                    {' and '}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={[styles.text1,
                    { textDecorationLine: 'underline' }]}>
                      {'Privacy Policy'}
                    </Text>
                  </TouchableOpacity>
                </View>


                : null}
            </View>


            <AppButton
              label={subscribedPackage ? 'SUBSCRIBED' : 'SUBSCRIBE'}
              btnStyle={{
                marginTop: 20,
                backgroundColor: subscribedPackage ? colors.lightGrey : colors.primary
              }}
              onPress={() => {
                subscribedPackage ?
                  (
                    setAlertModal(true),
                    setAlertMessage('Please cancel previous subscription first.')
                  )
                  :

                  requestSubscription(
                    selectedPackage?.id == 1 ? SKU_IDs[0] :
                      selectedPackage?.id == 2 ? SKU_IDs[1] :
                        selectedPackage?.id == 3 ? SKU_IDs[2] :
                          selectedPackage?.id == 4 ? SKU_IDs[3] : null

                  )

              }
              }
            />
          </View>
        </View>

      </KeyboardAwareScrollView>
      <AlertModal
        isVisible={alertModal}
        onPress={() => setAlertModal(false)}
        message={alertMessage}
      />
    </SafeAreaView>
  );
};

export default ManageSubscription;
