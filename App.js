import { StyleSheet, View } from 'react-native';
import AppForm from './app/components/AppForm';
import AppFormField from './app/components/AppFormField';

export default function App() {
  return (
    <View style={styles.container}>
      <AppForm initialValues={{ name: '' }}>
        <AppFormField name={'name'} label={'Name'} />
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
});
