import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

function AppTextInput({ ...otherProps }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor={'grey'}
        style={styles.input}
        {...otherProps}
      />
    </View>
  );
}

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    borderColor: '#6BB6FC',
    borderRadius: 25,
    padding: 15,
    borderWidth: 3,
  },
});
