import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginModal from '../components/loginModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Event({
  image,
  heading,
  startDate,
  endDate,
  subject,
  distance,
  location,
  cost,
  active,
  organization,
  meal,
  navigation,
  allDetails
}) {

  if (Array.isArray(subject)) {
    subject = subject.join(', ');
  } else if (typeof subject === 'string') {
    subject = subject;
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const base64Image = `data:image/jpeg;base64,${image}`;

  const renderImage = () => {
    if (!image) {
      return <Image style={styles.image} source={require('../assets/STEME.png')} />;
    } else if (image.startsWith('http')) {
      return <Image style={styles.image} source={{ uri: image }} />;
    } else {
      return <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${image}` }} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const checkToken = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObject = JSON.parse(userData);
      
      if (userDataObject && userDataObject.data) {
        const token = userDataObject.data;
        if (token) {
          navigation.navigate('Update Event', { eventId: allDetails.id });
        } else {
          setModalVisible(true);
        }
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  return (
    <>
      <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('Event Details', { allDetails, distance })} style={styles.container}>
        <View style={styles.shadow}>
          {renderImage()}
        </View>
        <View style={styles.info}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={[styles.heading, { maxWidth: '70%' }]} numberOfLines={1} ellipsizeMode='tail'>{heading}</Text>
            {/* <Image style={styles.duplicate} source={require('../assets/duplicate.png')} /> */}
          </View>
          <Text style={{ fontSize: 12 }}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
          <View style={{ width: '73%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2.5 }}>
            <Text style={[styles.subjects, { maxWidth: '70%' }]} numberOfLines={1} ellipsizeMode='tail'>Subject : {subject}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 4 }}>
              <MaterialCommunityIcons name={'map-marker-outline'} size={12} style={{ alignSelf: 'center' }} />
              <Text style={{ fontSize: 11 }}>{distance.toFixed(2)} mi</Text>
            </View>
            <Text style={{ fontSize: 11 }}> ${cost}</Text>
            {/* <View style={{ flexDirection: 'row', marginHorizontal: 4 }}>
            <MaterialCommunityIcons name={'silverware-fork-knife'} size={12} style={{ alignSelf: 'center' }} />
            <Text style={{ fontSize: 11 }}> {meal}</Text>
          </View> */}
          </View>
        </View>
        {allDetails.eventStatus === 'Pending' && (
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={checkToken}>
            <Image style={styles.mapPin} source={require('../assets/edit.png')} />
          </TouchableOpacity>
        )}


        {allDetails.eventStatus === 'Active' && allDetails.eventType === 'Onsite' && (
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { navigation.navigate('Home', { eventId: allDetails.id }) }}>
            <Image style={styles.mapPin} source={require('../assets/mapPin.png')} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>



      <LoginModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

    </>
  );
}

export default Event;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1.2,
    width: '95%',
    height: 90,
    alignSelf: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  shadow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 75,
    height: 75,
    borderRadius: 100,
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 30,

  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '65%',
    marginLeft: 5,
  },
  mapPin: {
    marginLeft: 'auto',
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  duplicate: {
    width: 70,
    height: 15,
    marginLeft: 10,
    marginTop: 'auto',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  subjects: {
    fontSize: 11
  }
});