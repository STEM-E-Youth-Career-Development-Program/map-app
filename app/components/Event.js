import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native';

function Event({
  heading,
  startDate,
  endDate,
  subject,
  distance,
  location,
  cost,
  active,
  organization,
}) {

  const navigation = useNavigation();

  if (Array.isArray(subject) == true) {
    subject = subject.join(', ')
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Event Details")}>
      <View
        style={styles.container}
      >
        <View style={styles.shadow}>
          <Image
            style={{ width: 70, height: 70 }}
            source={require('../assets/eventIcon.png')}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={{fontSize: 12}}>
            {startDate} - {endDate}
          </Text>
          <View style={{ width: '65%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 12}}>{subject}</Text>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons name={'map-marker-outline'} size={12} style={{alignSelf: 'center'}}/>
              <Text style={{fontSize: 12}}>{distance} mi</Text>
            </View>
            <Text style={{fontSize: 12}}>${cost}</Text>
          </View>
        </View>
        <Image style={styles.mapPin} source={require('../assets/mapPin.png')}/>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Event;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
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
    width: 50,
  },
  duplicate: {
    width: 70,
    height: 15,
    marginLeft: 10,
    marginTop: 'auto',
  },
});