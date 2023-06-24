import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import _ from 'lodash'

import colors from '../Utils/colors';
import Fonts from '../Assets/Fonts';

export default InspoType = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
                if (props.onClickAction && typeof props.onClickAction) {
                    props.onClickAction()
                }
            }}
            style={[styles.container, props.containerStyle]} >
            <Image
                source={props.categoryImage}
                style={[styles.imageStyle,props.imageStyle]}
            />
            <Text style={[styles.middleMainHeading, props.textStyle]}>{props.heading}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 90,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
       
    },
    middleMainHeading: {
        color: colors.gray,
        textAlign: 'center',
        fontSize:12,
        marginTop:3,
        width:'100%',
        fontFamily:Fonts.Regular,
    },
    imageStyle: {
        width: 30,
        height: 27,
        tintColor:colors.primary,
        resizeMode: 'contain'
    }
})
