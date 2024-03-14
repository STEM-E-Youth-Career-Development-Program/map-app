import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function CustomDropdown({ label, data, value, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, item === value && styles.selectedOption]}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
    borderColor: '#999',
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomDropdown;