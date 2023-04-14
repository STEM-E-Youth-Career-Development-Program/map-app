import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { useFormikContext } from 'formik';

function SubmitButton({ title }) {
  const { handleSubmit } = useFormikContext();
  return (
    <TouchableWithoutFeedback onPress={handleSubmit}>
      <Text style={styles.button}>{title}</Text>
    </TouchableWithoutFeedback>
  );
}

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    borderRadius: 10,
    color: 'white',
    fontSize: 30,
    marginTop: 15,
    padding: 10,
    textAlign: 'center',
  },
});
