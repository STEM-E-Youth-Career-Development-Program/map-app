import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import InfoModal from './InfoModal';

function SearchBar({ onChangeText, value, onPressIcon, isList, ...otherProps }) {
  const searchRef = useRef(null);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.searchRow}>
        <View style={styles.container}>
          <Pressable onPress={() => searchRef.current.focus()}>
            <MaterialCommunityIcons name="magnify" size={30} />
          </Pressable>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder='Search for event'
              style={styles.textInput}
              ref={searchRef}
              onChangeText={onChangeText}
              value={value}
              {...otherProps}
            />
          </View>
          {/* <MaterialCommunityIcons name="microphone-outline" size={28} style={{ marginLeft: 'auto' }} /> */}
        </View>

        <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="information-outline" size={30} color={'#999999'} />
        </Pressable>

        <Pressable
          style={styles.container}
          onPress={onPressIcon}
        >
          {isList ?
            <Image source={require('./../assets/filter.png')} style={{ resizeMode: 'contain', width: 25, height: 25, tintColor: 'grey' }} />
            :
            <MaterialCommunityIcons name="format-list-bulleted" size={28} color={'#999999'} />
          }
        </Pressable>

      </View>

      <InfoModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  searchRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    // shadowColor: 'black',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .25,
    shadowRadius: 3.84,
  },
  textInput: {
    fontSize: 18,
    marginLeft: 10,
    width: '95%',
  },
  textInputContainer: {
    width: Dimensions.get('window').width * .45,
  },
});
