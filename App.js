import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import AppTextInput from './app/components/AppTextInput';
import Label from './app/components/Label';

export default function App() {
  const myRef = useRef(null);

  return (
    <View style={styles.container}>
      <Label onPress={() => myRef.current.focus()} />
      <AppTextInput placeholder="Yh" myRef={myRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});
