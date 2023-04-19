import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function SearchBar({ onChangeText, value, ...otherProps }) {
  const searchRef = useRef(null);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => searchRef.current.focus()}>
        <MaterialCommunityIcons name="magnify" size={33} />
      </TouchableWithoutFeedback>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          ref={searchRef}
          onChangeText={onChangeText}
          value={value}
          {...otherProps}
        />
      </View>
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    borderColor: '#999',
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    marginLeft: 10,
  },
  textInputContainer: {
    width: '100%',
  },
});
