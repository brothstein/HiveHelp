import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../assets/CreateAccountBackground.png';
import { useState } from 'react';

import { Alert } from 'react-native';

import { supabase } from '../supabase';

// Navigation
const CreateAccountScreen = () => {
  const navigation = useNavigation();
  const goToHomePage = () => {
    navigation.navigate('TabNavigator')
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [confirmEmailError, setConfirmEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    // Perform email validation here
    // For example, check if it's a valid email format
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    // Perform password validation here
    // For example, check if it meets certain criteria
    return password.length >= 6;
  };

  const handleBlurEmail = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleBlurConfirmEmail = () => {
    if (email !== confirmEmail) {
      setConfirmEmailError('Emails do not match');
    } else {
      setConfirmEmailError('');
    }
  };

  const handleBlurPassword = () => {
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleBlurConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  // const handleSubmit = () => {
  // if (!validateEmail(email)) {
  //   setEmailError('Invalid email format');
  //   return;
  // } else {
  //   setEmailError('');
  // }

  // if (email !== confirmEmail) {
  //   setConfirmEmailError('Emails do not match');
  //   return;
  // } else {
  //   setConfirmEmailError('');
  // }

  // if (!validatePassword(password)) {
  //   setPasswordError('Password must be at least 6 characters');
  //   return;
  // } else {
  //   setPasswordError('');
  // }

  // if (password !== confirmPassword) {
  //   setConfirmPasswordError('Passwords do not match');
  //   return;
  // } else {
  //   setConfirmPasswordError('');
  // }

  async function handleSubmit() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message, error.status)
    if (error) console.log(error.message, error.status)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    if (!session) console.log('Please check your inbox for email verification!')
    setLoading(false)
  if (!error){
    goToHomePage();
  }
  }




  return (
    <View style={styles.ultimatecontainer}>
      <View style={styles.pageContainer}>
        <Image source={BackgroundImage} style={styles.image} />
        <View style={styles.container}>
          <Text style={styles.text}>Name*</Text>
          <View style={styles.textContainer}>
            <View style={[styles.column, { alignItems: 'center' }]}>
              <TextInput style={[styles.input, { width: 95 }]}
                value={name}
                onChangeText={setName} />

            </View>
          </View>
          <Text style={styles.text}>Email*</Text>
          <TextInput style={styles.input} onChangeText={setEmail} onBlur={handleBlurEmail} />
          {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
          <Text style={styles.text}>Confirm Email*</Text>
          <TextInput style={styles.input} onChangeText={setConfirmEmail} onBlur={handleBlurConfirmEmail} />
          {confirmEmailError ? <Text style={{ color: 'red' }}>{confirmEmailError}</Text> : null}
          <Text style={styles.text}>Create Password*</Text>
          <TextInput style={styles.input} onChangeText={setPassword} onBlur={handleBlurPassword} />
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
          <Text style={styles.text}>Confirm Password*</Text>
          <TextInput style={styles.input} onChangeText={setConfirmPassword} onBlur={handleBlurConfirmPassword} />
          {confirmPasswordError ? <Text style={{ color: 'red' }}>{confirmPasswordError}</Text> : null}
          <TouchableOpacity style={[styles.button, { alignSelf: 'center' }, { paddingTop: 10 }]} disabled={loading} onPress={handleSubmit}>
            <Text>    Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ alignSelf: 'flex-start' }, { paddingBottom: 8 }, { paddingLeft: 70 }]}>
          <TouchableOpacity style={styles.button} onPress={goToHomePage}>
            <Text>  Click Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// Gets size of current device's scren
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  ultimatecontainer: {
    flex: 1
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 80
  },
  image: {
    width: width, // Set the width to the width of the screen
    height: height, // Set the height to the height of the screen
    resizeMode: 'cover',// Adjust the resizeMode as needed
    position: 'absolute'
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10
  },
  textContainer: {
    // height: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 30
  },
  button: {
    height: 40,
    width: 100,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10
  },
  text: {
    alignItems: 'flex-start' // Align text to the left
    // Add any other text styles as needed (font size, color, etc.)
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 1
  }
})

export default CreateAccountScreen;