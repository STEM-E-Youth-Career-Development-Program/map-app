import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import SubmitButton from '../components/SubmitButton';

const validationSchema = Yup.object().shape({
  heading: Yup.string().required()
    .label('Name')
    .max(50, "Must be shorter than 50 characters"),
  description: Yup.string().required('Please describe the event'),
  subject: Yup.string().required('Please include the STEM subject'),
  location: Yup.string().required('Please include the location'),
  startDate: Yup.date().required('Please include the start date'),
  endDate: Yup.date().min(
    Yup.ref('startDate'),
    "End date must be after start date"
  ),
  cost: Yup.number().positive("Must be greater than 0 (leave blank if 0)"),
});

function CreateEventScreen(props) {
  const handleSubmit = async (values) => {
    try {
      await addDoc(collection(db, 'test'), {
        heading: values.heading,
        description: values.description,
        subject: values.subject,
        location: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        cost: values.cost,
        organization: values.organization,
      });
      console.log('Event data saved to Firestore');
    } catch (error) {
      console.error('Error saving event data:', error);
    }
  };


  return (
    <Screen>
      <PageHeader header={'Create an Event'} />
      <View style={{ padding: 10 }}>
        <AppForm
          initialValues={{
            heading: '',
            description: '',
            subject: '',
            location: '',
            startDate: '',
            endDate: '',
            cost: 0,
            organization: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField name={'heading'} label="Event Name" />
          <AppFormField
            name={'description'}
            label="Event Description"
            multiline
            numberOfLines={3}
          />
          <AppFormField name={'subject'} label="STEM Subject" />
          <AppFormField name={'location'} label="Location Address" />
          <AppFormField name={'organization'} label="Organization Name" />
          <AppFormField name={'startDate'} label="Start Date" />
          <AppFormField name={'endDate'} label="End Date" />
          <AppFormField name={'cost'} label="Cost" />
        </AppForm>
      </View>
      <SubmitButton title={'Create'} />
    </Screen>
  );
}

export default CreateEventScreen;

const styles = StyleSheet.create({});