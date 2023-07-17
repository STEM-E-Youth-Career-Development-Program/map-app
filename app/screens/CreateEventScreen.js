import React from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import SubmitButton from '../components/SubmitButton';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  description: Yup.string().required('Please describe the event'),
  area: Yup.string().required('Please include the area'),
  location: Yup.string().required('Please include the location'),
  startTime: Yup.date().required('Please type in the start time'),
});

function CreateEventScreen(props) {
  return (
    <Screen style={styles.screen}>
      <PageHeader header={'Create an Event'} />
      <AppForm
        initialValues={{
          name: '',
          description: '',
          area: '',
          location: '',
          startTime: '',
          endTime: '',
          timeZone: '',
          repeats: '',
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        <AppFormField name={'name'} label="Event Name" />
        <AppFormField
          name={'description'}
          label="Event Description"
          multiline
          numberOfLines={3}
        />
        <AppFormField name={'area'} label="STEM Area" />
        <AppFormField name={'location'} label="Location" />
        <AppFormField name={'startTime'} label="Start Time" />
        <AppFormField name={'endTime'} label="End Time" />
        <AppFormField name={'timeZone'} label="Time Zone" />
        <AppFormField
          name={'repeat'}
          label="repeat(weekly, monthly, yearly, etc)"
        />
        <SubmitButton title={'Create'} />
      </AppForm>
    </Screen>
  );
}

export default CreateEventScreen;

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 70,
  },
});
