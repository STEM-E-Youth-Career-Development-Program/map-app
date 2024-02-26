import React, { useState, useEffect } from 'react';
import { View, Modal, Pressable, Text, StyleSheet, TouchableOpacity, AppState, Alert } from 'react-native';
import { Formik } from 'formik';
import AppFormField from "../components/AppFormField";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginModal = ({ isVisible, onClose }) => {

  const navigation = useNavigation();

  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  // const handleSubmit = async (values) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('Username', values.username);
  //     formData.append('Password', values.password);

  //     const response = await fetch('https://mapstem-api.azurewebsites.net/api/Auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: formData,
  //     });

  //     console.log('Response Status:', response.status);
  //     const responseData = await response.json();

  //     if (responseData.statusCode === 200) {
  //       console.log('Login successful:');
  //       // Store response data in local storage
  //       await AsyncStorage.setItem('userData', JSON.stringify(responseData));

  //       console.log('Login storage:', AsyncStorage);
  //     } else {
  //       const errorData = await response.json();
  //       console.error('Login Failed:', errorData.message || 'Unknown error');
  //       // Show error message to the user
  //       // setError('Login failed: ' + (errorData.message || 'Unknown error'));
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Show error message to the user
  //     // setError('Login failed: ' + error.message);
  //   }
  // };

  const handleSubmit = async (values) => {
    try {
        const formData = new FormData();
        formData.append('Username', values.username);
        formData.append('Password', values.password);

        const response = await fetch('https://mapstem-api.azurewebsites.net/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });


        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (responseData.statusCode === 200 ) { 
          console.log('Login successful:');
          await AsyncStorage.setItem('userData', JSON.stringify(responseData));
          console.log('Login storage:', AsyncStorage); // Log AsyncStorage
          const userData = await AsyncStorage.getItem('userData');
          console.log('Retrieved User Data:', userData); // Log retrieved data
            // navigation.navigate('Events')
        } else {
            Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Login failed: ' + error.message);
    }
};


  
  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Please Enter Details</Text>
            <Pressable
              style={styles.buttonClose}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
          </View>
          <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
          // validationSchema={validationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
              <View>
                <AppFormField name={"username"} label="User Name" isRequired={true}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholder="User Name"
                />
                <AppFormField name={"password"} label="Password" isRequired={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry
                />
                <LinearGradient
                  colors={['black', '#5A5A5A']}
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: '95%',
                    height: 60,
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  locations={[0.1, 0.9]}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: '95%',
                      height: 60,
                      borderRadius: 10,
                      marginVertical: 10,
                      backgroundColor: 'black',
                    }}
                    onPress={handleSubmit}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    color: "#999999",
    paddingHorizontal: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "justify",
    fontSize: 16,
    lineHeight: 22
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textStyle: {
    color: "grey",
    fontSize: 20,
  }
});

export default LoginModal;
