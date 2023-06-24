import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, ImageStore } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import SimpleToast from 'react-native-simple-toast'
import * as RNIap from 'react-native-iap';

// --------------------------------------------
import Images from '../../Assets/Images/index'
import { colors } from '../../Utils/colors'
import { client } from '../../Api/config'
import { Packages } from '../../Redux/Actions/Subscription'



const Splash = ({ navigation }) => {


    const { loginUserData } = useSelector(state => state.Auth)

    const { userEmail } = useSelector(state => state.Auth)

    const dispatch = useDispatch()


    useEffect(() => {

        getAllPackages()
        if (loginUserData) {
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeStack' }],
                })
            }, 2000);
        } else {
            setTimeout(() => {
                navigation.replace('OnBoarding')
            }, 2000)
        }

    }, [])

    const getAllPackages = () => {
        client.get('/all_packages', {
            headers: {
                Authorization: `Bearer ${loginUserData?.token}`,
            },
        }).then(response => {
            console.log('getAllPackages-response', response.data.data);
            if (response.data.status == 200) {
                dispatch(Packages(response?.data?.data))
            } else {
                console.log('In else');
            }
        }).catch(err => {
            SimpleToast.show('Something went wrong');
            console.log('getAllPackages-err', err);
        });
    };

    return (
        <View style={styles.mainContainer}>
            <Image
                source={Images.Splash}
                style={styles.splash}
            />
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    splash: {
        flex: 1
    },
})
