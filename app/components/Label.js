import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

function Label({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Text style={styles.label}>Please</Text>
    </TouchableWithoutFeedback>
  );
}

export default Label;

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
  },
});
