import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function CustomDropdown({ label, data, value, onSelect }) {
  return (
    <View>
      <Text>{label}</Text>
      {data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onSelect(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default CustomDropdown;