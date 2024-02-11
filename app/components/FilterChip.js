import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterChip = ({ value, onClose }) => {
  return (
    <View style={{ backgroundColor: 'black', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginRight: 5, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ color: 'white', marginRight: 5 }}>{value}</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterChip;
