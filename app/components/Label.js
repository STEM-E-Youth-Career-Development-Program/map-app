import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

function Label({ label, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableWithoutFeedback>
  );
}

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
  },
});
