import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NextButton from '../components/NextButton';

import Screen from '../components/Screen';

function LandingScreen({navigation}) {
  return (
    <Screen>
      <Text style={styles.title}>MapSTEM</Text>

      <View id="user" style={styles.user}>
        <Text style={styles.hello}>Hello User</Text>
        <Text id="line" style={styles.greeting}>
          Good Morning March 19th, 2023
        </Text>
      </View>

      <View style={styles.message}>
        <Text style={styles.info}>
          The STEME Youth Career Development Program's map STEM application
          tracks various events and activities in Science, Technology,
          Engineering, Math, and Entrepreneurship and makes it accessible and
          affordable for its users.
        </Text>
        <Text style={styles.check}>
          Check the events near you on a map by clicking the button below.
        </Text>
      </View>

      <NextButton
        title="View Events"
        onPress={() => navigation.navigate('Events')}
      />

    </Screen>
  );
}

export default LandingScreen;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 60,
    borderRadius: 10,
    marginVertical: 10,
  },
  user: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 25,
    height: 85,
    justifyContent: 'center',
    align: 'center',
  },
  hello: {
    fontWeight: 'bold',
    marginLeft: 12,
    marginTop: 7,
    textAlign: 'left',
  },
  greeting: {
    marginLeft: 12,
    marginBottom: 0,
    textAlign: 'left',
  },
  info: {
    textAlign: 'left',
    fontSize: 18,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 30,
  },
  check: {
    marginTop: 30,
    fontSize: 18,
    marginLeft: 16,
    marginRight: 16,
  },
  box: {
    borderRadius: 10,
    backgroundColor: '#272727',
    marginTop: 35,
    padding: 10,
    justifyContent: 'center',
    align: 'center',
  },
  buttontext: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});
