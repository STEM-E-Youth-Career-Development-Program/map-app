import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDropdown = ({ label, data, value, onSelect }) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.dropdownLabel}>{label}</Text>
    <View style={styles.dropdown}>
      {data.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.dropdownItem}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.dropdownItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default CustomDropdown;