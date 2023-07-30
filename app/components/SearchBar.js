import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function SearchBar({ onChangeText, value, ...otherProps }) {
  const searchRef = useRef(null);

  return (
    <View style={styles.searchRow}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => searchRef.current.focus()}>
          <MaterialCommunityIcons name="magnify" size={30} />
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
        <MaterialCommunityIcons name="microphone-outline" size={30} style={{marginLeft: 'auto'}}/>
      </View>
      
      <Pressable style={styles.container}>
        <MaterialCommunityIcons name="information-outline" size={30} color={'#999999'} />
      </Pressable>

      <Pressable style={styles.container}>
        <MaterialCommunityIcons name="format-list-bulleted" size={30} color={'#999999'} />
      </Pressable>
    
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  container: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: 2}, 
    shadowOpacity: .25,
    shadowRadius: 3.84,
  },
  textInput: {
    fontSize: 18,
    marginLeft: 10,
    width: '100%',
  },
  textInputContainer: {
    width: Dimensions.get('window').width * .45,
  },
});
