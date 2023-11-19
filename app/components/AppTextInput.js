import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

function AppTextInput({ myRef, icon, ...otherProps }) {
  return (
    <View style={styles.container}>
      <TextInput style={{ width: icon ? '90%' : '100%' }} ref={myRef} {...otherProps} />
      {icon &&
        <View style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-end' }}>{icon}</View>
      }
    </View>
  );
}

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    borderColor: '#999',
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
});
