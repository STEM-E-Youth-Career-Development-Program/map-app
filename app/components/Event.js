import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

function Event(props) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{ width: 100, height: 100 }}
          source={require('../assets/eventIcon.png')}
        />
      </View>
      <View>
        <Text style={styles.heading}>Medical Workshop</Text>
        <Text style={styles.date}>Thurs, Mar 2023 - Sat Mar 32</Text>
        <Text style={styles.date}>Subject: science 🗼2.5 mi $25 🍴 yes</Text>
      </View>
      <View>
        <Text>Medical Workshop</Text>
      </View>
    </View>
  );
}

export default Event;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
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
