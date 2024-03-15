import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomDropdown = ({ label, data, value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);

  const handleSelect = (item) => {
    onSelect(item);
    setSelectedItem(item);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text>{selectedItem ? `Picked: ${selectedItem}` : 'Select'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {data.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelect(item)}
              style={[styles.item, item === value && styles.selectedItem]}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  item: {
    padding: 10,
  },
  selectedItem: {
    backgroundColor: '#b2dfdb', // Highlight color for selected item
  },
});

export default CustomDropdown;