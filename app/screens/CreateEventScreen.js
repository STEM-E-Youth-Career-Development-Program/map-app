import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text } from 'react-native';
import * as Yup from 'yup';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import SubmitButton from '../components/SubmitButton';
import { FontAwesome, EvilIcons, MaterialIcons } from '@expo/vector-icons';

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
  cost: Yup.number().positive("Must be greater than 0 (leave blank if 0)")
});
Yup.date().min(
  Yup.ref('startDate'),
  ({ min }) => '',
)
function CreateEventScreen(props) {
  return (

    <Screen>
      {/* <KeyboardAvoidingView behavior='padding'> */}
      <PageHeader header={'Create New Event'} />
      <View style={{ padding: 10 }}>

        <Text style={{ marginTop: 20, marginBottom: 5 }}>Upload Picture <Text style={{ color: 'red' }}>*</Text></Text>
        <View style={styles.addPic}>
          <FontAwesome name='plus' size={18} color='#fff' />
        </View>
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
          <AppFormField name={'heading'} label="Event Name" isRequired={true} />
          <AppFormField name={'eventType'} label="Event Type" isRequired={true} icon={<FontAwesome name='angle-down' color={'#999'} size={25} />} />
          <AppFormField name={'cost'} label="Cost" isRequired={true} />
          <AppFormField
            name={'description'}
            label="Description"
            multiline
            numberOfLines={3}
            isRequired={true}
          />
          <AppFormField name={'startDate'} label="Start Date" isRequired={true} icon={<EvilIcons name='calendar' color={'#999'} size={28} />} />
          <AppFormField name={'endDate'} label="End Date" isRequired={true} icon={<EvilIcons name='calendar' color={'#999'} size={28} />} />
          <AppFormField name={'startTime'} label="Start Time" isRequired={true} icon={<MaterialIcons name='access-time' color={'#999'} size={25} />} />
          <AppFormField name={'endTime'} label="End Time" isRequired={true} icon={<MaterialIcons name='access-time' color={'#999'} size={25} />} />
          <AppFormField name={'location'} label="Address" isRequired={true} />
          <AppFormField name={'company'} label="Host/Company Name" isRequired={true} />
          <AppFormField name={'grade'} label="Grade Level" isRequired={true} icon={<FontAwesome name='angle-down' color={'#999'} size={25} />} />
          <AppFormField name={'subject'} label="Subject" isRequired={true} icon={<FontAwesome name='angle-down' color={'#999'} size={25} />} />
          <AppFormField name={'contact'} label="Contact Number" isRequired={true} />
          <AppFormField
            name={'eligibility'}
            label="Eligibility"
            multiline
            numberOfLines={3}
          />
          <AppFormField name={'ageGroup'} label="Age Group" icon={<FontAwesome name='angle-down' color={'#999'} size={25} />} />
        </AppForm>
      </View>
      <SubmitButton title={'Submit for Approval'} />
      {/* </KeyboardAvoidingView> */}

    </Screen>
  );
}

export default CreateEventScreen;

const styles = StyleSheet.create({
  addPic: {
    width: '100%',
    height: 50,
    backgroundColor: '#999999',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center', alignItems: 'center'
  }
});
