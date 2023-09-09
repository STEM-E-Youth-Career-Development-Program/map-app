import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import SubmitButton from '../components/SubmitButton';

const validationSchema = Yup.object().shape({
  heading: Yup.string().required().label('Name'),
  description: Yup.string().required('Please describe the event'),
  subject: Yup.string().required('Please include the STEM subject'),
  location: Yup.string().required('Please include the location'),
  startDate: Yup.date().required('Please type in the start date'),
  cost: Yup.number().required('Please include cost in U.S. dollars (may be 0)'),
});

function CreateEventScreen(props) {
  return (
    <Screen>
      <PageHeader header={'Create an Event'} />
      <View style={{padding: 10}}>
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
          onSubmit={(values) => console.log(values)}
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
