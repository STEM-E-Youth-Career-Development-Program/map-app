import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function NextButton({ title, onPress }) {
  return (
    <LinearGradient
        colors={['black', '#5A5A5A']}
        style={styles.button}
        locations={[0.1, 0.9]}
    >
        <TouchableWithoutFeedback onPress={onPress}>
            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{title}</Text>
        </TouchableWithoutFeedback> 
    </LinearGradient>
  );
}

export default NextButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 60,
    borderRadius: 10,
    marginVertical: 10,
  },
});
