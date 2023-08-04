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
}) {
  if (meal == true) {
    meal = 'food';
  } else if (meal == false) {
    meal = 'food-off';
  }
  if (Array.isArray(subject) == true) {
    subject = subject.join(', ');
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}
      >
        <Image
          style={{ width: 70, height: 70 }}
          source={require('../assets/eventIcon.png')}
        />
      </View>
      <View>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={{ fontSize: 10 }}>
          {startDate} - {endDate}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 10 }}>
            Subject: {subject}
            {'   '}
          </Text>
          <Text style={{ fontSize: 10 }}>
            {distance} mi{'    '}
          </Text>
          <Text style={{ fontSize: 10 }}>
            ${cost}
            {'    '}
          </Text>
          <Text style={{ fontSize: 10 }}>{meal}</Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 100 }}>
        <MaterialCommunityIcons name="map-marker-radius" size={45} />
      </View>
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
