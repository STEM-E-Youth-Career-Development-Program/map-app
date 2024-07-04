import React, { useState } from 'react';
import { View, Modal, Pressable, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import AppFormField from "../components/AppFormField";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (values) => {
    setLoading(true);
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

      if (responseData.statusCode === 200) {
        console.log('Login successful:');
        await AsyncStorage.setItem('userData', JSON.stringify(responseData));
        console.log('Login storage:', AsyncStorage);
        const userData = await AsyncStorage.getItem('userData');
        console.log('Retrieved User Data:', userData);

        Alert.alert('Login Successful', 'You have logged in successfully.', [
          { text: 'OK', onPress: onClose }
        ]);
      } else {
        Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Login failed: ' + error.message);
    } finally {
      setLoading(false); // set loading to false when the request is complete
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
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View>
                <AppFormField
                  name={"username"}
                  label="User Name"
                  isRequired={true}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholder="User Name"
                />
                <AppFormField
                  name={"password"}
                  label="Password"
                  isRequired={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#000" />
                ) : (
                  <LinearGradient
                    colors={['black', '#5A5A5A']}
                    style={styles.gradient}
                    locations={[0.1, 0.9]}
                  >
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.buttonText}>
                        Login
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    color: "#999999",
    paddingHorizontal: 10,
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
  },
  gradient: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 60,
    borderRadius: 10,
    marginVertical: 10,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 60,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  }
});

export default LoginModal;
