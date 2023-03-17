import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function PageHeader({ header }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{header}</Text>
    </View>
  );
}

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
});
