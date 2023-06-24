import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'

import Fonts from '../Assets/Fonts'
import colors from '../Utils/colors'
import DeviceInfo from 'react-native-device-info'
const isTablet = DeviceInfo.isTablet();
const RadioButton = (props) => {

    return (
        props.subscribed ?
            <View style={[styles.mainContainer, props.mainRadioStyle]}>
                <View style={[styles.container, props.radioStyle]} />
                <Text style={[styles.radioText, { color: colors.gray, }]}>
                    {'Pay '}
                    <Text style={[styles.radioText, { color: colors.gray, fontWeight: 'bold' }]}>
                        {props.price}
                    </Text>
                    <Text style={[styles.radioText, { color: colors.gray }]}>
                        {' for '}
                    </Text>
                    <Text style={[styles.radioText, { color: colors.gray, fontWeight: 'bold' }]}>
                        {props.storage}
                    </Text>
                    {
                        !isTablet ?
                            <Text>
                                {"\n"}
                            </Text> : null
                    }

                    <Text style={[styles.radioText, { color: colors.gray }]}>
                        {'of storage'}
                    </Text>
                </Text>
            </View>
            :
            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.mainContainer, props.mainRadioStyle]}
                onPress={props.onPress}>
                <View style={[styles.container, props.radioStyle]} />
                {/* <Text style={[styles.radioText, { color: colors.gray }]}>{props.label}
                    <Text style={[styles.radioText, { fontWeight: 'bold' }]}>{props.priceText}</Text>
                </Text> */}

                <Text style={[styles.radioText, { color: colors.gray }]}>
                    {'Pay '}
                    <Text style={[styles.radioText, { color: colors.gray, fontWeight: 'bold' }]}>
                        {props.price}
                    </Text>
                    <Text style={[styles.radioText, { color: colors.gray }]}>
                        {' for '}
                    </Text>
                    <Text style={[styles.radioText, { color: colors.gray, fontWeight: 'bold' }]}>
                        {props.storage}
                    </Text>
                    {
                        !isTablet ?
                            <Text>
                                {"\n"}
                            </Text> : null
                    }
                    <Text style={[styles.radioText, { color: colors.gray }]}>
                        {'of storage'}
                    </Text>
                </Text>
            </TouchableOpacity>
    )
}

export default RadioButton

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 3,
        marginBottom: 5
    },
    container: {
        height: 20,
        width: 20,
        borderRadius: 360,
        backgroundColor: colors.white,
        elevation: 5,
        shadowOpacity: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
    },
    radioText: {
        color: colors.black,
        marginLeft: 15,
        fontFamily: Fonts.Regular
    },
})
