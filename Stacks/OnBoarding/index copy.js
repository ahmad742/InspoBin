import React, { useState, useRef } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

import Fonts from '../../Assets/Fonts'
import Images from '../../Assets/Images'
import colors from '../../Utils/colors'
import AppButton from '../../Components/AppButton'
import styles from './styles'
import CarouselDots from '../../Components/CarouselDots'

const width = Dimensions.get('window').width

const DATA = [
    {
        id: '1',
        Image: Images.Intro_1,
        mainHeading: 'FULLY FLEXIBLE HIRING',
        description: 'Drivers whenever you need them - for those \nbusy hours, holiday cover or right now.'
    },
    {
        id: '2',
        Image: Images.Intro_2,
        mainHeading: 'WORRY FREE, HASSLE FREE HIRING',
        description: 'All of our drivers are vetted and ready to \nwork all you need to do is tap hire!'
    },
    {
        id: '3',
        Image: Images.Intro_3,
        mainHeading: 'ZERO COMMISSION',
        description: "Your money is yours, We don't charge you \nany commission on your hires or orders."
    }
]

const OnBoarding = ({ navigation }) => {

    const [indicator, setIndicator] = useState(0)
    const [show, isShow] = useState(false)



    const renderItem = ({ item }) => {

        return (
            <View style={styles.renderItemContainer}>
                <ImageBackground
                    source={item.Image}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={"cover"}
                >
                    <CarouselDots
                        // skipPress={() => {
                        //     setIndicator(2)
                        //     listRef.current.scrollToIndex({ animated: true, index: 2, viewPosition: 2 });
                        // }}
                        selectedIndex={indicator}
                        count={3}
                        style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}
                    />
                    {

                        indicator === 2 ?
                            <AppButton
                                onPress={() => {
                                    if (indicator <= 1) {
                                        setIndicator(indicator + 1)
                                        listRef.current.scrollToIndex({ animated: true, index: indicator == 1 ? 2 : 1, viewPosition: indicator == 1 ? 2 : 1 });
                                    }
                                    else {

                                        navigation.replace('AuthStack')

                                    }
                                }}
                                btnStyle={styles.btnStyle}
                                label={"CONTINUE"}
                                labelStyle={{ color: colors.primary }}
                            />
                            : <></>
                    }
                </ImageBackground>
            </View>
        )
    }

    const onScrollEnd = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        setIndicator(pageNum)
    }
    const listRef = useRef(null);
    return (
        <SafeAreaView style={styles.mainContainer}>
            <FlatList
                scrollEnabled={true}
                pagingEnabled={true}
                ref={listRef}
                horizontal
                data={DATA}
                keyExtractor={(item, index) => `${item.id}_${index}`}
                scrollEventThrottl={1900}
                onMomentumScrollEnd={(e) => onScrollEnd(e)}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
            />
           
        </SafeAreaView>
    )
}

export default OnBoarding


