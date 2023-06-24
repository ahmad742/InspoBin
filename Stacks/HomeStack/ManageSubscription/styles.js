import { StyleSheet } from 'react-native';
import Fonts from '../../../Assets/Fonts';
import { colors } from '../../../Utils/colors';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.appBackground,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  text1: {
    color: colors.gray,
    fontFamily: Fonts.Regular,
  },
  text2: {
    color: colors.black,
    marginTop: 10,
    fontFamily: Fonts.SemiBold,
  },
  bottomView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
    width: '95%',
    marginTop: 40,
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
  },
  radioView: {
    // marginLeft: "25%",
    marginTop: 10,

  },
  active: {
    borderColor: colors.primary,
    borderWidth: 5,
  },
  checkContainer: {
    marginTop:20,
    marginLeft: "1%",
    // backgroundColor:'red',
    width:'50%'
    // marginBottom: 30,
  },
  checkText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default styles;
