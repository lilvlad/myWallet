import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import Feather from 'react-native-vector-icons/Feather';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import * as Animatable from 'react-native-animatable';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ForgotPasswordScreen = ({navigation}) => {
  const {resetPassword} = useContext(AuthContext);
  const [email, setEmail] = useState('');

  const [data, setData] = React.useState({
    mail: '',
    password: '',
    username: '',
    check_textInputChange: false,
    secureTextEntry: true,
    usernameTextEntry: false,
    isValidMail: true,
    isValidPassword: true,
    isValidUser: true,
  });

  const textInputChange = val => {
    //email validation
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (val.length === 0) {
      //email address must be enter
    } else if (reg.test(val) === false) {
      //enter valid email address
      setData({
        ...data,
        mail: val,
        check_textInputChange: false,
        isValidMail: false,
      });
    } else if (reg.test(val) === true) {
      //email validated
      setData({
        ...data,
        mail: val,
        check_textInputChange: true,
        isValidMail: true,
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          backgroundColor: '#4A68AB',
          borderBottomLeftRadius: 100,
          height: '25%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animatable.Image
          animation="fadeInDownBig"
          duration={1000}
          source={require('../assets/passwordReset.png')}
          style={styles.logo}
        />
      </View>

      <View style={{flex: 1, backgroundColor: '#4A68AB'}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'white',
            borderTopRightRadius: 100,
          }}
        />
        <Animatable.View animation="fadeInUpBig" duration={750}>
          <View style={{marginHorizontal: 30, marginVertical: 10}}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: -15,
              }}>
              <MaterialIcon
                name="keyboard-arrow-left"
                size={45}
                backgroundColor="#fff"
                color="#333"
                onPress={() => navigation.navigate('Login')}
              />
              <Text
                style={{
                  fontSize: 32,
                  marginBottom: 10,
                  color: '#333',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                  marginRight: 50,
                }}>
                Password Reset
              </Text>
            </View>
            {/* EMAIL DONE */}
            <View>
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 10,

                  textAlign: 'center',
                  justifyContent: 'center',
                }}>
                An email will be sent to your inbox with a link to reset your
                password.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.iconStyle}>
                <Feather name="mail" color={'#666'} size={20} />
              </View>
              <TextInput
                value={email}
                style={styles.input}
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#666"
                onChangeText={val => {
                  textInputChange(val);
                  setEmail(val);
                }}
              />
              {data.check_textInputChange ? (
                <Animatable.View
                  animation="bounceIn"
                  style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 5,
                  }}>
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidMail ? null : (
              <Animatable.View
                animation="fadeInLeft"
                duration={500}
                style={styles.inputErrorContainer}>
                <Text style={styles.errorMsg}>Enter a valid Email, please</Text>
              </Animatable.View>
            )}
            {data.check_textInputChange ? (
              <FormButton
                buttonTitle={'Send'}
                onPress={() => {
                  resetPassword(email), navigation.navigate('Login');
                }}
              />
            ) : null}
          </View>
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },

  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  logo: {
    height: 125,
    width: 125,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    textAlign: 'left',
    /* left: -60,
    top: -10, */
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputErrorContainer: {
    width: '100%',
    marginTop: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default ForgotPasswordScreen;
