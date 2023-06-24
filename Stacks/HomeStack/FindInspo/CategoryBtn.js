import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import _ from 'lodash';

// ----------------------------------------------
import images from '../../../Assets/Images';
import colors from '../../../Utils/colors';
import Fonts from '../../../Assets/Fonts';
import { IMAGE_BASE_URL } from '../../../Api/config';

export default Button = props => {
    const { clickAction, btnStyle,iconStyle,textStyle, headerName } = props;

    return (
        <View style={[styles.componentMainContainer, btnStyle]}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={props.clickAction}
                style={styles.componentHeaderContainer}>
                <Text style={[styles.componentHeaderText,textStyle]}>{headerName}</Text>
                <Image source={images.forwardIcon} style={[styles.downArrowStyle,iconStyle]} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    componentMainContainer: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        paddingTop: 0,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 18,
    },
    componentHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    componentHeaderText: {
        fontSize: 15,
        color: colors.black,
        fontFamily: Fonts.Regular,
    },
    downArrowStyle: {
        width: 11,
        height: 11,
        tintColor:colors.primary,
        resizeMode: 'contain',
    },
    galleryImage: {
        width: '100%',
        height: 85,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    uploadItemContainer: {
        width: '31%',
        height: 85,
        marginTop: 13,
        marginLeft: 4,
        marginRight: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
