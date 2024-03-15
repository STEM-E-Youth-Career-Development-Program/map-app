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
        <View style={styles.dropdownHeader}>
          <Text style={styles.selectedText}>
            {selectedItem ? `Picked: ${selectedItem}` : 'Select'}
          </Text>
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {data.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelect(item)}
              style={[styles.item, item === value && styles.selectedItem]}
            >
              <Text style={styles.itemText}>{item}</Text>
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
  dropdownHeader: {
    flex: 1,
    alignItems: 'flex-end',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown;