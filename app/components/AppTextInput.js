import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

function AppTextInput({ myRef, ...otherProps }) {
  return (
    <View style={styles.container}>
      <TextInput ref={myRef} {...otherProps} />
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
