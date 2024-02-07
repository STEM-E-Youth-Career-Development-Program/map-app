import React from 'react';
import { TouchableWithoutFeedback, Text } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import AppForm from '../components/AppForm';
import { LinearGradient } from 'expo-linear-gradient';

function SubmitButton({ title, selectedSubjects, selectedCost, onPress }) {
  return (
    <Formik
      initialValues={AppForm.initialValues}
      onSubmit={AppForm.onSubmit}
      validationSchema={AppForm.validationSchema}
    >
      <LinearGradient
        colors={['black', '#5A5A5A']}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          width: '95%',
          height: 60,
          borderRadius: 10,
          marginVertical: 10,
        }}
        locations={[0.1, 0.9]}
      >
        <TouchableWithoutFeedback onPress={() => onPress(selectedSubjects, selectedCost)}>
          <Text
            style={{
              color: 'white',
              fontSize: 25,
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </Formik>
  );
}

export default SubmitButton;