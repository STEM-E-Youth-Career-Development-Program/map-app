import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

function Screen({ children, style }) {
  return (
    <ScrollView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </ScrollView>
  );
}

export default Screen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 10,
  },
  view: {
    paddingBottom: 40,
    flex: 1,
  },
});
