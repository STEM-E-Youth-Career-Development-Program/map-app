import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Event({ heading, startDate, endDate, subject, distance, cost, meal }) {
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
          style={{ width: 85, height: 85, borderRadius: 85 }}
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
      <View style={{ marginHorizontal: 70 }}>
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
});
