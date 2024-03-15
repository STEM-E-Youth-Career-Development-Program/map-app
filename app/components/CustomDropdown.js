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
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.header}>
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