import React, { useEffect } from "react";
import { StyleSheet, View, Text, Platform, Image, TouchableOpacity, Button } from "react-native";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import PageHeader from "../components/PageHeader";
import Screen from "../components/Screen";
import SubmitButton from "../components/SubmitButton";
import { FontAwesome, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MultipleSelectList } from "react-native-dropdown-select-list";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from "react-native-element-dropdown";
import moment from 'moment';

const validationSchema = Yup.object().shape({
  heading: Yup.string()
    .required()
    .label("Name")
    .max(50, "Must be shorter than 50 characters"),
  grade: Yup.string()
    .required()
    .label("Grade")
    .max(50, "Must be shorter than 50 characters"),
  ageGroup: Yup.string()
    .required()
    .label("ageGroup")
    .max(50, "Must be shorter than 50 characters"),
  description: Yup.string().required("Please describe the event"),
  subject: Yup.string().required("Please include the STEM subject"),
  location: Yup.string().required("Please include the location"),
  startDate: Yup.date().required("Please include the start date"),
  endDate: Yup.date().min(
    Yup.ref("startDate"),
    "End date must be after start date"
  ),
  cost: Yup.number().positive("Must be greater than 0 (leave blank if 0)"),
});



function UpdateEventScreen({ props, route }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [mealIncludeDropdownOpen, setMealIncludeDropdownOpen] = useState(false);
  const [gradeLevelDropdownOpen, setGradeLevelDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [showeventImage, setShowEventImage] = useState('');
  const [subjectDropdownItems, setSubjectDropdownItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();
  // const route = useRoute();

  const onChangeStartTime = (event, selectedTime) => {
    // setStartTimeOpen(false);
    if (selectedTime !== undefined) {
      setStartTime(selectedTime);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    // setEndTimeOpen(false);
    if (selectedTime !== undefined) {
      setEndTime(selectedTime);
    }
  };
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    // setStartOpen(false);
  };
  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    // setEndOpen(false);
  };


  const [formValues, setFormValues] = useState();

  const { eventId } = route.params;
  //console.log("check Event Id", eventId);

  console.log('Form Values:', formValues);
  useEffect(() => {
    const fetchEventDetails = async (eventId) => {
      try {
        const response = await fetch(`https://mapstem-api.azurewebsites.net/api/Event/detail/event-id/${eventId}`);
        if (!response.ok) {
          console.error('Failed to fetch event details:', response.status);
          return;
        }
        const eventData = await response.json();
        console.log("check API Response", eventData)
        const eventImageUri = eventData.data.imageData || '';

        const endDate = eventData.data.endDate ? new Date(eventData.data.endDate) : null;
        const formattedEndDate = endDate ? endDate.toLocaleDateString() : '';
        const startDate = eventData.data.startDate ? new Date(eventData.data.startDate) : null;
        const formattedStartDate = startDate ? startDate.toLocaleDateString() : '';
        const endTime = eventData.data.endTime ? new Date(eventData.data.endTime) : null; // Parse endTime
        const formattedEndTime = endTime ? endTime.toLocaleTimeString() : ''; // Format endTime
        const startTime = eventData.data.startTime ? new Date(eventData.data.startTime) : null; // Parse startTime
        const formattedStartTime = startTime ? startTime.toLocaleTimeString() : ''; // Format startTime
        setFormValues({
          ...formValues,
          ageGroup: eventData.data.ageGroup || '',
          contactNo: eventData.data.contactNo || '',
          imageData: eventImageUri,
          companyName: eventData.data.compmayName || '',
          eventName: eventData.data.eventName || '',
          endTime: eventData.data.endTime || '', // Set formattedEndTime
          endDate: formattedEndDate || '',
          subject: eventData.data.subject || '',
          gradeLevel: eventData.data.gradeLevel || '',
          eligibility: eventData.data.eligibility || '',
          cost: eventData.data.cost.toString() || '',
          startTime: eventData.data.startTime || '', // Set formattedStartTime
          startDate: formattedStartDate || '',
          eventType: eventData.data.eventType || '',
          address: eventData.data.address || '',
          description: eventData.data.description || '',
          mealInclude: eventData.data.mealIncluded || '',
          webURL: eventData.data.url || '',
        });
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails(eventId);
  }, [eventId]);




  useEffect(() => {
    fetch("https://mapstem-api.azurewebsites.net/api/Subject")
      .then((response) => response.json())
      .then((data) => {
        setSubjectDropdownItems(data.map((item) => ({
          label: item.name,
          value: item.id,
        })));
      })
      .catch((error) => console.error("Error fetching subject data:", error));
  }, []);

  const labelsName = subjectDropdownItems.map(item => item.label);

  const handleGeocode = async (address) => {
    try {
      const result = await Location.geocodeAsync(address);

      if (result && result.length > 0) {
        // Make sure result is not undefined and has length greater than 0
        const { latitude, longitude } = result[0];
        return { latitude, longitude };
      } else {
        console.error('No location data found for the given address');
        return null;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        console.error('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log('Image Picker Result:', result);

      if (!result.cancelled) {
        const selectedImageUri = result.assets[0].uri;
        setFormValues({
          ...formValues,
          imageData: selectedImageUri,
        });
        setShowEventImage(selectedImageUri);
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };

  const handleRemoveImage = () => {
    setShowEventImage('');
  };



  // Update Event Handle 
  const handleSubmit = async (values) => {
    try {
      console.log("check submission", values)
      const userData = await AsyncStorage.getItem('userData');
      console.log("check user data", userData)
      const userDataObject = JSON.parse(userData);
      const token = userDataObject.data;
      if (!token) {
        console.error('Token not found. User is not authenticated.');
        return;
      }

      const { eventId } = route.params;
      const imageUri = formValues.eventImage ? formValues.eventImage.uri : null;
      const selectedSubjectsString = selected.join(';');
      const { latitude, longitude } = await handleGeocode(values.address);
      const startTime = new Date(values.startTime);
      const endTime = new Date(values.endTime);
      const endDate = moment(values.endDate, 'DD/MM/YYYY');
      const startDate = moment(values.startDate, 'DD/MM/YYYY');
      // Format start and end times
      const formattedStartTime = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const formattedEndTime = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const formattedEndDate = endDate.toISOString();
      const formattedStartDate = startDate.toISOString();

      const formData = new FormData();
      formData.append('id', eventId);
      formData.append('AgeGroup', values.ageGroup);
      formData.append('ContactNo', values.contactNo);
      if (formValues.eventImage) {
        formData.append('EventImage', {
          uri: formValues.eventImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      } else {
        formData.append('EventImage', '');
      }
      formData.append('CompmayName', values.companyName);
      formData.append('EventName', values.eventName);
      formData.append('EndTime', formattedEndTime);
      formData.append('EndDate', formattedEndDate);
      formData.append('SubjectForSaving', selectedSubjectsString);
      formData.append('GradeLevel', values.gradeLevel);
      formData.append('Eligibility', values.eligibility);
      formData.append('Cost', values.cost);
      formData.append('StartTime', formattedStartTime);
      formData.append('StartDate', formattedStartDate);
      formData.append('EventType', values.eventType);
      formData.append('Address', values.address);
      formData.append('Description', values.description);
      formData.append('MealIncluded', values.mealInclude);
      formData.append('Url', values.webURL);
      formData.append("Latitude", latitude);
      formData.append("Longitude", longitude);
      console.log('Before fetch', formData);
      const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event', {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,

      });
      console.log('After fetch');
      console.log('Response Status:', response.status);
      const responseText = await response.text();
      if (response.ok) {
        console.log('Event updated successfully');
        // Show success message
        Alert.alert(
          'Success',
          'Event update successfully',
          [{ text: 'OK', onPress: () => navigation.navigate('Events') }],
          { cancelable: false }
        );
      } else {
        console.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event', error);
    }
  };
  // Activate Event Handle
  const handleActivate = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObject = JSON.parse(userData);
      const token = userDataObject.data;
      if (!token) {
        console.error('Token not found. User is not authenticated.');
        return;
      }

      const eventId = route.params.eventId;
      const response = await fetch(`https://mapstem-api.azurewebsites.net/api/Event/event-type/event-id/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      });

      if (response.ok) {
        console.log('Event activated successfully');
        Alert.alert(
          'Success',
          'Event activated successfully',
          [{ text: 'OK', onPress: () => navigation.navigate('Events') }],
          { cancelable: false }
        );
      } else {
        console.error('Failed to activate event');
      }
    } catch (error) {
      console.error('Error activating event:', error);
    }
  };
  // Delete Event Handle
  const handleDelete = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObject = JSON.parse(userData);
      const token = userDataObject.data;
      if (!token) {
        console.error('Token not found. User is not authenticated.');
        return;
      }

      const eventId = route.params.eventId;
      const response = await fetch(`https://mapstem-api.azurewebsites.net/api/Event/event-id/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Event deleted successfully');
        Alert.alert(
          'Success',
          'Event deleted successfully',
          [{ text: 'OK', onPress: () => navigation.navigate('Events') }],
          { cancelable: false }
        );
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };



  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Assuming `formData` is already populated with the API response
  useEffect(() => {
    // Check if formData and formData.subject are defined before setting selectedSubjects
    if (formValues && formValues.subject) {
      // Set the selected subjects from the API response
      setSelectedSubjects(formValues.subject);
    }
  }, [formValues]);



  console.log("check ", selectedSubjects)
  return (
    <Screen>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 130 : 0}
      >
        <PageHeader header={"Update Event"} />
        <View style={{ padding: 10, paddingBottom: 75 }}>
          {formValues &&
            <Formik
              initialValues={formValues}
              onSubmit={handleSubmit}
            // validationSchema={validationSchema}
            >
              {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
                <View>
                  {/* <Text style={{ fontSize: 16 }}>Select Event Image</Text>
                  <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        borderColor: '#000',
                        borderRadius: 10,
                        paddingVertical: 30,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                      onPress={handleImagePicker}
                    >
                      <FontAwesome name="plus" size={20} color="black" style={{ marginRight: 10 }} />

                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>Selected Image:</Text>
                        <Image
                          // source={{ uri: showeventImage }}
                          source={{ uri: `data:image/jpeg;base64,${values.imageData}` }}
                          style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                        />
                        <TouchableOpacity onPress={handleRemoveImage} style={{ position: 'absolute', top: 5, right: 5 }}>
                          <Text style={{ fontSize: 16, color: 'red' }}>X</Text>
                        </TouchableOpacity>
                      </View>
                    {showeventImage && (
                      <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>Selected Image:</Text>
                        <Image
                          source={{ uri: showeventImage }}
                          // source={{ uri: `data:image/jpeg;base64,${values.imageData}` }}
                          style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                        />
                        <TouchableOpacity onPress={handleRemoveImage} style={{ position: 'absolute', top: 5, right: 5 }}>
                          <Text style={{ fontSize: 16, color: 'red' }}>X</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View> */}


                  <Text style={{ fontSize: 16 }}>Select Event Image</Text>
                  <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        borderColor: '#000',
                        borderRadius: 10,
                        paddingVertical: 30,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                      onPress={handleImagePicker}
                    >
                      <FontAwesome name="plus" size={20} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    {formValues.imageData && (
                      <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>Current Image:</Text>
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${formValues.imageData}` }}

                          style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                        />
                        <TouchableOpacity onPress={handleRemoveImage} style={{ position: 'absolute', top: 5, right: 5 }}>
                          <Text style={{ fontSize: 16, color: 'red' }}>X</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <AppFormField
                    name={"eventName"}
                    label="Event Name"
                    isRequired={true}
                    onChangeText={handleChange('eventName')}
                    onBlur={handleBlur('eventName')}
                    value={values.eventName}
                    placeholder="Event Name"
                  />

                  <AppFormField
                    name={"eventType"}
                    label="Event Type"
                    isRequired={true}
                    onChangeText={handleChange('eventType')}
                    onBlur={handleBlur('eventType')}
                    value={values.eventType}
                    placeholder="Event Type"
                    editable={false}
                    style={{ color: 'gray' }}
                  />

                  {/* <AppFormField
                    name={"eventType"}
                    label="Event Type"
                    isRequired={true}
                    icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                    onPress={() => setDropdownOpen(true)}
                    onDropdown={true}
                    onChangeText={(value) => {
                      handleChange('eventType')(value);
                      setFormValues({ ...formValues, eventType: value });
                    }}
                    onBlur={handleBlur('eventType')}
                    value={values.eventType}
                  /> */}

                  <AppFormField
                    name={"cost"}
                    label="Average Cost (in dollars)"
                    isRequired={true}
                    onChangeText={handleChange('cost')}
                    onBlur={handleBlur('cost')}
                    value={values.cost}
                  />
                  <AppFormField
                    name={"description"}
                    label="Description"
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />

                  <AppFormField
                    name={"startDate"}
                    label="Start Date"
                    isRequired={true}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('startDate')}
                    onBlur={handleBlur('startDate')}
                    value={values.startDate}
                    editable={false}
                    style={{ color: 'gray' }}
                  />
                  <AppFormField
                    name={"endDate"}
                    label="End Date"
                    isRequired={true}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('endDate')}
                    onBlur={handleBlur('endDate')}
                    value={values.endDate}
                    editable={false}
                    style={{ color: 'gray' }}
                  />
                  <AppFormField
                    name={"startTime"}
                    label="Start Time"
                    isRequired={true}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('startTime')}
                    onBlur={handleBlur('startTime')}
                    value={values.startTime}
                    editable={false}
                    style={{ color: 'gray' }}
                  />
                  <AppFormField
                    name={"endTime"}
                    label="End Time"
                    isRequired={true}
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('endTime')}
                    onBlur={handleBlur('endTime')}
                    value={values.endTime}
                    editable={false}
                    style={{ color: 'gray' }}
                  />
                  {/* <AppFormField
                    name={"startDate"}
                    label="Start Date"
                    isRequired={true}
                    icon={
                      <EvilIcons
                        name="calendar"
                        color={"#999"}
                        size={28}
                        onPress={() => {
                          setDatePickerMode("date");
                          setStartOpen(true);
                        }}
                      />
                    }
                    value={startDate.toLocaleDateString()}
                  />

                  {startOpen && (
                    <DateTimePicker
                      value={startDate}
                      mode={datePickerMode}
                      display="default"
                      onChange={(event, selectedDate) => {
                        onChangeStartDate(event, selectedDate);
                        setValues({ ...values, startDate: selectedDate });
                        setFormValues({ ...formValues, startDate: selectedDate });
                      }}
                    />
                  )} */}

                  {/* <AppFormField
                    name={"endDate"}
                    label="End Date"
                    isRequired={true}
                    icon={
                      <EvilIcons
                        name="calendar"
                        color={"#999"}
                        size={28}
                        onPress={() => setEndOpen(true)}
                      />
                    }
                    value={endDate.toLocaleDateString()}
                  />

                  {endOpen && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedDate) => {
                        onChangeEndDate(event, selectedDate);
                        setValues({ ...values, endDate: selectedDate }); // Update Formik state
                        setFormValues({ ...formValues, endDate: selectedDate });
                      }}
                    />
                  )} */}

                  {/* <AppFormField
                    name={"startTime"}
                    value={startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    label="Start Time"
                    isRequired={true}
                    icon={
                      <MaterialIcons
                        name="access-time"
                        color={"#999"}
                        size={25}
                        onPress={() => setStartTimeOpen(true)}
                      />
                    }
                  />

                  {startTimeOpen && (
                    <DateTimePicker
                      value={startTime}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedTime) => {
                        onChangeStartTime(event, selectedTime);
                        setValues({ ...values, startTime: selectedTime }); // Update Formik state
                        setFormValues({ ...formValues, startTime: selectedTime });
                      }}
                    />
                  )}

                  <AppFormField
                    name={"endTime"}
                    label="End Time"
                    value={endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    isRequired={true}
                    icon={
                      <MaterialIcons
                        name="access-time"
                        color={"#999"}
                        size={25}
                        onPress={() => setEndTimeOpen(true)}
                      />
                    }
                  />

                  {endTimeOpen && (
                    <DateTimePicker
                      value={endTime}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedTime) => {
                        onChangeEndTime(event, selectedTime);
                        setValues({ ...values, endTime: selectedTime }); // Update Formik state
                        setFormValues({ ...formValues, endTime: selectedTime });
                      }}
                    />
                  )} */}

                  <AppFormField name={"location"} label="Address" isRequired={true}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                  />
                  <AppFormField
                    name={"company"}
                    label="Host/Company Name"
                    isRequired={true}
                    onChangeText={handleChange('companyName')}
                    onBlur={handleBlur('companyName')}
                    value={values.companyName}
                  />

                  <AppFormField
                    name={"contact"}
                    label="Contact Number"
                    onChangeText={handleChange('contactNo')}
                    onBlur={handleBlur('contactNo')}
                    value={values.contactNo}
                    keyboardType="numeric"

                  />
                  <AppFormField
                    name={"subject"}
                    label="Subjects"
                    onChangeText={handleChange('subject')}
                    onBlur={handleBlur('subject')}
                    value={selectedSubjects.join(', ')}
                    editable={false}
                    style={{ color: 'gray' }}

                  />
                  {/* <Text style={styles.heading}>Subject</Text>
                  <MultipleSelectList
                    style={[styles.dropdown, isFocus && { borderColor: "black" }]}
                    setSelected={(val) => setSelected(val)}
                    data={labelsName}
                    save="value"
                    label="Categories"
                    placeholder="Select Subjects"
                    searchPlaceholder="Select Subjects"
                    search={true}
                    selected={selected}
                    value={values.subject}
                  /> */}

                  <AppFormField name={"grade"} label="Grade Level"
                    onChangeText={handleChange('gradeLevel')}
                    onBlur={handleBlur('gradeLevel')}
                    value={values.gradeLevel}
                    editable={false}
                    style={{ color: 'gray' }}
                  />

                  {/* <AppFormField
                    name={"gradeLevel"}
                    label="Grade Level"
                    isRequired={false}
                    icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                    onPress={() => setGradeLevelDropdownOpen(true)}
                    onDropdown={true}
                    onChangeText={handleChange('gradeLevel')}
                    onBlur={handleBlur('gradeLevel')}
                    value={values.gradeLevel}

                  /> */}
                  {/* <AppFormField
                  name={"subject"}
                  label="Subject"
                  isRequired={true}
                  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                  onPress={() => setSubjectDropdownOpen(true)}
                  onDropdown={true}
                  onChangeText={handleChange('subject')}
                  onBlur={handleBlur('subject')}
                  value={values.subject}
                /> */}





                  <AppFormField
                    name={"eligibility"}
                    label="Eligibility / Other Notes"
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange('eligibility')}
                    onBlur={handleBlur('eligibility')}
                    value={values.eligibility}

                  />
                  {/* <AppFormField name={"ageGroup"} label="Age Group"
                    onChangeText={handleChange('ageGroup')}
                    onBlur={handleBlur('ageGroup')}
                    value={values.ageGroup}

                  /> */}

                  <AppFormField
                    name={"mealInclude"}
                    label="Meals Included"
                    onChangeText={handleChange('mealInclude')}
                    onBlur={handleBlur('mealInclude')}
                    value={values.mealInclude}
                    editable={false}
                    style={{ color: 'gray' }}
                  />
                  {/* <AppFormField
                    name={"mealInclude"}
                    label="Meals Included"
                    isRequired={true}
                    icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                    onPress={() => setMealIncludeDropdownOpen(true)}
                    onDropdown={true}
                    onChangeText={handleChange('mealInclude')}
                    onBlur={handleBlur('mealInclude')}
                    value={values.mealInclude}

                  /> */}

                  <AppFormField name={"webURL"} label="Web URL"
                    onChangeText={handleChange('webURL')}
                    onBlur={handleBlur('webURL')}
                    value={values.webURL}

                  />


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
                    {/* <Button
                    style={{
                      color: 'white',
                      fontSize: 25,
                      fontWeight: 'bold',
                    }}
                    onPress={handleSubmit}
                    title="Submit For Approval"
                  /> */}
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '95%',
                        height: 60,
                        borderRadius: 10,
                        marginVertical: 10,
                        backgroundColor: 'black', // Set background color instead of using LinearGradient
                      }}
                      onPress={handleSubmit}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 25,
                          fontWeight: 'bold',
                        }}
                      >
                        Update Event
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>


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
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '95%',
                        height: 60,
                        borderRadius: 10,
                        marginVertical: 10,
                        backgroundColor: 'black',
                      }}
                      onPress={handleActivate}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 25,
                          fontWeight: 'bold',
                        }}
                      >
                        Activate Event
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>

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
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        width: '95%',
                        height: 60,
                        borderRadius: 10,
                        marginVertical: 10,
                        backgroundColor: 'black',
                      }}
                      onPress={handleDelete}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 25,
                          fontWeight: 'bold',
                        }}
                      >
                        Delete Event
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>

                </View>
              )}
            </Formik>
          }
        </View>


      </KeyboardAwareScrollView>
    </Screen>
  );
}

export default UpdateEventScreen;

const styles = StyleSheet.create({
  addPic: {
    width: "100%",
    height: 50,
    backgroundColor: "#999999",
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    paddingBottom: 10,
    width: "100%",
  },
  dropdown: {
    height: 30,
    borderColor: "black",
    borderWidth: 1.2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 25,
    backgroundColor: "white",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
  },

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

});