import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Modal,
    Dimensions,
    TextInput,
    Platform,
} from 'react-native'

// import fonts from './../assets/fonts/'
import colors from '../Utils/colors'
import Images from '../Assets/Images/'
import AppButton from './AppButton';
import Fonts from '../Assets/Fonts'
const { width, height } = Dimensions.get('window')
const SaveLinkModal = (props) => {
    const {
        modalVisible,
        cancelClick,
        saveClick,
        disabled,
        value,
        onChangeText,
    } = props
    return (
        <Modal animationType='fade' transparent={true} visible={modalVisible}>
            <View style={{
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                flex: 1,
                padding: 15,
                justifyContent:'center'
            }}>
                <View style={{ flex: 0.5, borderRadius: 8 }}>
                    <View style={styles.buttonView}>
                        <AppButton
                            label={"CANCEL"}
                            labelStyle={{ fontSize: 10 }}
                            onPress={cancelClick}
                            btnStyle={styles.cancelBtn}
                        />
                        <AppButton
                            onPress={saveClick}
                            label={"SAVE"}
                            labelStyle={{ fontSize: 10 }}
                            btnStyle={{
                                backgroundColor: disabled ? colors.gray : colors.primary,
                                width: 80,
                                height: 30,
                                borderRadius: 5,
                                marginBottom: 10,
                            }}
                            disabled={disabled}
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        marginTop: 5,
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        backgroundColor: colors.white,
                        borderRadius:8
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: colors.white,
                            alignItems: 'center'
                        }}>
                            <Image
                                resizeMode='contain'
                                style={styles.warning}
                                source={Images.warning}
                            />
                            <Text style={styles.warningText}>{'Please include https:// in your links.'}</Text>

                        </View>

                        <TextInput
                            textAlignVertical={'top'}
                            style={[styles.textInput, {
                                height: Platform.OS === 'ios' ? 0 : null,
                                flex: Platform.OS === 'ios' ? 0.5 : 1
                            }]}
                            multiline={true}
                            placeholder={"Write or paste a link..."}
                            placeholderTextColor={'black'}
                            value={value}
                            onChangeText={onChangeText}
                            autoCapitalize='none'
                        ></TextInput>
                    </View>





                </View>
            </View>
        </Modal>
    );
}
export default SaveLinkModal
const styles = StyleSheet.create({
    textInput: {
        backgroundColor: colors.white,
        width: '100%',
        color: colors.black,
        // paddingBottom: 50,
        // marginTop: 5
    },
    buttonView: {
        width: '100%',
        height: 30,
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 30,
    },
    cancelBtn: {
        width: 80,
        height: 30,
        backgroundColor: colors.black,
        borderRadius: 5,
        marginBottom: 10,

    },
    warning: {
        height: 20,
        width: 20,
    },
    warningText: {
        fontSize: 13,
        fontFamily: Fonts.SemiBold,
        marginLeft: 5
    }
});




