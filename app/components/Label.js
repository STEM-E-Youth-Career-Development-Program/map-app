import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

function Label({ label, onPress, isRequired }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Text style={styles.label}>
        {label}
        {isRequired && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
    </TouchableWithoutFeedback>
  );
}

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
  },
});
