import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Event({ heading, date, subject }) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{ width: 85, height: 85 }}
          source={require('../assets/eventIcon.png')}
        />
      </View>
      <View>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.date}>{subject}</Text>
      </View>
      <View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
