import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

function Screen({ children, style }) {
  return (
    <ScrollView style={[styles.screen, style]} automaticallyAdjustKeyboardInsets={true}>
      <View style={[styles.view, style]}>{children}</View>
    </ScrollView>
  );
}

export default Screen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f3f3f3',
  },
  view: {
    paddingBottom: 70,
    flex: 1,
  },
});
