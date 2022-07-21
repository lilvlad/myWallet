import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import Feather from 'react-native-vector-icons/Feather';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import * as Animatable from 'react-native-animatable';
import {TextInput} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const TestScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [userData, setUserData] = useState();
  //const [confirmPassword, setConfirmPassword] = useState();

  const {register, googleLogin} = useContext(AuthContext);

  const [data, setData] = React.useState({
    mail: '',
    password: '',
    check_textInputChange: false,
    check_textPasswordInputChange: false,
    secureTextEntry: true,
    isValidMail: true,
    isValidPassword: true,
  });

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
        check_textPasswordInputChange: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
        check_textPasswordInputChange: false,
      });
    }
  };

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
          source={require('../assets/mywallet-logo.png')}
          style={styles.logo}
        />
        <Animatable.Text
          animation="fadeInUpBig"
          duration={1000}
          style={{
            fontSize: 28,
            marginBottom: 20,
            color: '#fff',
            textAlign: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}>
          myWallet
        </Animatable.Text>
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
          {/* All wrapped Form */}
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
                Register
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* New Form Validation */}

              {/* EMAIL DONE */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email"
                  mode="outlined"
                  activeOutlineColor={data.isValidMail ? '#2e64e5' : '#ff0000'}
                  value={email}
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={val => {
                    textInputChange(val);
                    setEmail(val);
                  }}
                  left={
                    <TextInput.Icon
                      name={() => <Feather name="mail" size={24} />}
                    />
                  }
                  right={
                    <TextInput.Icon
                      name={() =>
                        data.check_textInputChange ? (
                          <Animatable.View animation="bounceIn">
                            <Feather
                              name="check-circle"
                              color="green"
                              size={20}
                            />
                          </Animatable.View>
                        ) : null
                      }
                      onPress={updateSecureTextEntry}
                    />
                  }
                />
              </View>
              {data.isValidMail ? null : (
                <Animatable.View
                  animation="fadeInLeft"
                  duration={500}
                  style={styles.inputErrorContainer}>
                  <Text style={styles.errorMsg}>
                    Enter a valid Email, please
                  </Text>
                </Animatable.View>
              )}

              {/* PASSWORD DONE */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={data.password}
                  style={styles.input}
                  activeOutlineColor={
                    data.isValidPassword ? '#2e64e5' : '#ff0000'
                  }
                  secureTextEntry={data.secureTextEntry ? true : false}
                  mode="outlined"
                  onChangeText={val => {
                    handlePasswordChange(val);
                    setPassword(val);
                  }}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Feather
                          name={data.secureTextEntry ? 'lock' : 'unlock'}
                          size={24}
                        />
                      )}
                    />
                  }
                  right={
                    <TextInput.Icon
                      name={() => (
                        <Feather
                          name={data.secureTextEntry ? 'eye-off' : 'eye'}
                          color="grey"
                          size={24}
                        />
                      )}
                      onPress={updateSecureTextEntry}
                    />
                  }
                />
              </View>
              {data.isValidPassword ? null : (
                <>
                  <Animatable.View
                    animation="fadeInLeft"
                    duration={500}
                    style={styles.inputErrorContainer}>
                    <Text style={styles.errorMsg}>
                      Password must be atleast 6 characters long.
                    </Text>
                  </Animatable.View>
                </>
              )}
              {/* END OF THE NEW VALIDATION FORM */}

              {data.check_textInputChange &&
              data.check_textPasswordInputChange ? (
                <>
                  <Animatable.View
                    animation="bounceIn"
                    duration={500}
                    style={styles.inputButtonContainer}>
                    <FormButton
                      buttonTitle="Register"
                      onPress={() => register(email, password)}
                    />
                  </Animatable.View>
                </>
              ) : null}

              <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                  By registering, you confirm that you accept our{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                  <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
                <Text style={styles.color_textPrivate}> and </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PrivacyPolicy')}>
                  <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.navButtonText}>
                  Have an account? Log In
                </Text>
              </TouchableOpacity>
              {Platform.OS === 'android' ? (
                <View>
                  <SocialButton
                    buttonTitle="Register with Google"
                    btnType="google"
                    color="#de4d41"
                    backgroundColor="#f5e7ea"
                    onPress={() => googleLogin()}
                  />
                  <SocialButton
                    buttonTitle="Sign Up with Facebook"
                    btnType="facebook"
                    color="#4867aa"
                    backgroundColor="#e6eaf4"
                    onPress={() => {
                      ToastAndroid.show(
                        'Facebook currently unavailable!',
                        ToastAndroid.CENTER,
                        ToastAndroid.LONG,
                      );
                    }}
                  />
                </View>
              ) : null}
            </ScrollView>
          </View>
        </Animatable.View>
      </View>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topView: {
    width: '100%',
    height: '80%',
    padding: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#fff',
  },
  bottomView: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    height: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
    textAlign: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 115,
    width: 115,
    resizeMode: 'cover',
    marginTop: 20,
  },

  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
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
    color: '#FF0000',
    fontSize: 15,
    marginTop: 10,
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
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
    height: windowHeight / 15,

    flexDirection: 'row',
    alignItems: 'center',
  },
  inputErrorContainer: {
    width: '100%',
    marginTop: -20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    padding: 10,
    justifyContent: 'center',
  },
  input: {
    /* padding: 10, */
    flex: 1,
    fontFamily: 'Lato-Regular',
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
