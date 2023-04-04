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
        <Text>Medical Workshop</Text>
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
    backgroundColor: 'red',
    alignItems: 'center',
  },
});
