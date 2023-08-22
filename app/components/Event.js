import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Event({
  heading,
  startDate,
  endDate,
  subject,
  distance,
  cost,
  meal,
  active,
  organization
}) {
  
  if (meal==true) {
    meal='food'
  } else if (meal==false) {
    meal='food-off'
  };
  if (Array.isArray(subject) == true) {
    subject = subject.join(', ')
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadow}>
        <Image
          style={{ width: 70, height: 70 }}
          source={require('../assets/eventIcon.png')}
        />
      </View>
      <View style={styles.info}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Text style={styles.heading}>{heading}</Text>
          <Image style={styles.duplicate} source={require('../assets/duplicate.png')} />
        </View>
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
          <MaterialCommunityIcons name={meal} size={12} style={{alignSelf: 'center'}}/>
        </View>
      </View>
      <Image style={styles.mapPin} source={require('../assets/mapPin.png')}/>
    </View>
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