import React, { useState } from "react";
import { Text, FlatList, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import SimpleToast from "react-native-simple-toast";


import colors from '../Utils/colors';
import Fonts from '../Assets/Fonts/index'
import AppButton from '../Components/AppButton'
import RadioButton from '../Components/RadioButton'
import Images from '../Assets/Images/index'
import { Subscribed_Package } from '../Redux/Actions/Subscription'


const FreeSubscription = (props) => {

    const [selectedPackage, setSelectedPackage] = useState('')
    const { openFreeModal, onClose, } = props


    return (
        <Modal
            isVisible={openFreeModal}
            animationIn='fadeInRightBig'
            animationOut='fadeOutLeftBig'
            animationInTiming={700}
            animationOutTiming={700}
            onBackButtonPress={onClose}
        >

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, backgroundColor: colors.white, padding: 20, borderRadius: 20 }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => {
                    onClose()
                    setSelectedPackage('')
                }}
                    style={{ width: '100%', alignItems: 'flex-end' }}
                >
                    <Image source={Images.cancel} style={styles.cancel} resizeMode='contain' />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    <Text style={[styles.text1,{marginTop:30}]}>{'A '}
                        <Text style={{ fontWeight: 'bold' }}>
                            {' free trial '}
                        </Text>
                        <Text style={[styles.text1]}>
                            {' will be applied to your app billing account on confirmation. You will not be charged. You will get 7 days to use the app for free. You can cancel anytime within your app billing account settings. On the end of the 7th day your trial period will end. You will then be given 48 hours to choose if you want to select a paid subscription level to keep using the app. Any unused portion of the free trial will be forfeited if you purchase a subscription. If you choose not to subscribe after 48 hours then your trial account will be deleted. For more information, see our '}
                        </Text>
                        <TouchableOpacity onPress={props.termsofuse}>
                            <Text style={[styles.text1,
                            { textDecorationLine: 'underline', fontWeight: 'bold' }]}>
                                {'Terms of Use'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={[styles.text1]}>
                            {'  and  '}
                        </Text>
                        <TouchableOpacity onPress={props.privacypolicy}>
                            <Text style={[styles.text1,
                            { textDecorationLine: 'underline', fontWeight: 'bold' }]}>
                                {'Privacy Policy'}
                            </Text>
                        </TouchableOpacity>
                    </Text>
                </View>
                <AppButton
                    label={'Confirm'}
                    btnStyle={{
                        backgroundColor: colors.primary,
                        marginTop: 40
                    }}
                    onPress={props.onConfirmPress}
                    loading={props.loading}
                />
                <AppButton
                    label={'Cancel'}
                    btnStyle={{
                        backgroundColor: colors.primary,
                        marginTop: 20
                    }}
                    onPress={props.onCancelPress}
                />

            </View>

        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    heading: {
        color: colors.gray,
        marginTop: 20,
        fontFamily: Fonts.Regular,
    },
    radioView: {
        marginLeft: 5,
        marginTop: 10,
    },
    active: {
        borderColor: colors.primary,
        borderWidth: 5,
    },
    cancel: {
        height: 25,
        width: 25,
        alignSelf: 'flex-end'
    },
    text1: {
        color: colors.gray,
        fontFamily: Fonts.Regular,
        textAlign:'center'

    },
});

export default FreeSubscription;


