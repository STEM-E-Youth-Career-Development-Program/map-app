import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppTextInput from './app/components/AppTextInput';

export default function App() {
  return (
    <View>
      <AppTextInput placeholder="Please" />
    </View>
  );
}
