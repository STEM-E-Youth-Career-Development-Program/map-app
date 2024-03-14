import React, { useState } from "react";
import { StyleSheet, View, Text, Platform, Image, Button, TouchableOpacity, Alert } from "react-native";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DateTimePicker } from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import AppFormField from "../components/AppFormField";
import Screen from "../components/Screen";
import PageHeader from "../components/PageHeader";

const gradeLevels = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

function CreateEventScreen(props) {
  const navigation = useNavigation();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [eventImage, setEventImage] = useState(null);

  const [formValues, setFormValues] = useState({
    contactNo: '',
    eventImage: null,
    companyName: '',
    eventName: '',
    endTime: '',
    endDate: '',
    subject: '',
    gradeLevel: '',
    eligibility: '',
    cost: '',
    startTime: '',
    startDate: '',
    eventType: '',
    address: '',
    description: '',
    mealInclude: '',
    webURL: '',
  });

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

      if (!result.cancelled) {
        const selectedImageUri = result.assets[0].uri;
        setFormValues({
          ...formValues,
          eventImage: selectedImageUri,
        });
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // console.log("check", values);
      // console.log("form value check", formValues);

      const { latitude, longitude } = await handleGeocode(values.address);
      const formattedStartTime = values.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedEndTime = values.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Create FormData object
      const formData = new FormData();
      formData.append('AgeGroup', values.ageGroup);
      formData.append('ContactNo', values.contactNo);
      formData.append('EventImage', {
        uri: formValues.eventImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('CompanyName', values.companyName);
      formData.append('EventName', values.eventName);
      formData.append('EndTime', formattedEndTime);
      formData.append('EndDate', values.endDate.toISOString());
      formData.append('Subject', values.subject);
      formData.append('GradeLevel', values.gradeLevel);
      formData.append('Eligibility', values.eligibility);
      formData.append('Cost', values.cost);
      formData.append('StartTime', formattedStartTime);
      formData.append('StartDate', values.startDate.toISOString());
      formData.append('EventType', values.eventType);
      formData.append('Address', values.address);
      formData.append('Description', values.description);
      formData.append('MealIncluded', values.mealInclude);
      formData.append('Url', values.webURL);
      formData.append("Latitude", latitude);
      formData.append("Longitude", longitude);
      console.log('Before fetch');
      // Make the API call to upload the image
      const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,

      });
      console.log('After fetch');

      // Log the response status and content
      console.log('Response Status:', response.status);
      const responseText = await response.text();
      // console.log('Response Content:', responseText);

      // Check if the request was successful
      if (response.ok) {
        console.log('Event created successfully');
        // Show success message
        Alert.alert(
          'Success',
          'Event created successfully',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );

        // Wait for 5 seconds before navigating to the Events screen
        setTimeout(() => {
          navigation.navigate('Events');
        }, 5000);
      } else {
        console.error('Failed to create event');
        // Handle the error, you can parse response.json() for more details
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  return (
    <Screen>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 130 : 0}
      >
        <PageHeader header={"Create New Event"} />
        <View style={{ padding: 10, paddingBottom: 75 }}>
          <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
              <View>
                  <View>
                {/* <TouchableOpacity onPress={handleImagePicker}>
                  <Text style={{ marginTop: 20, marginBottom: 5 }}>
                    Upload Picture <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={styles.addPic}>
                    {eventImage ? (
                      <Image source={{ uri: eventImage.uri }} style={{ width: 100, height: 100 }} />
                    ) : (
                      <FontAwesome name="plus" size={18} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity> */}
                {/* Display selected image */}
                {values.eventImage && (
                  <Image source={{ uri: values.eventImage.uri }} style={{ width: 100, height: 100 }} />
                )}

                {/* Button to trigger image picker */}
                <Button title="Select Event Image" onPress={handleImagePicker} />
                {/* <AppFormField name={"eventImage"} value={eventImage} type="hidden" /> */}

                <AppFormField
                  name={"eventName"}
                  label="Event Name"
                  onChangeText={handleChange('eventName')}
                  onBlur={handleBlur('eventName')}
                  value={values.eventName}
                  placeholder="Event Name"
                />

                <AppFormField
                  name={"eventType"}
                  label="Event Type"
                  onChangeText={handleChange('eventType')}
                  onBlur={handleBlur('eventType')}
                  value={values.eventType}
                />

                <AppFormField
                  name={"cost"}
                  label="Average Cost (in dollars)"
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
                      setValues({ ...values, startDate: selectedDate }); // Update Formik state
                      setFormValues({ ...formValues, startDate: selectedDate });
                    }}
                  />
                )}

                <AppFormField
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
                )}

                <AppFormField
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
                )}

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
                name={"gradeLevel"}
                 label="Grade Level"
                 isRequired={true}
  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
 onPress={() => setGradeDropdownOpen(true)} // Step 3: Open dropdown
  onDropdown={true}
  onChangeText={(value) => {
    handleChange('gradeLevel')(value); // Update Formik state
    setFormValues({ ...formValues, gradeLevel: value }); // Update local state
  }}
  onBlur={handleBlur('gradeLevel')}
  value={values.grade}
 dropdownOpen={gradeDropdownOpen} // Pass state variable to manage visibility
  dropdownData={gradeLevels}
 setDropdownOpen={setGradeDropdownOpen} // Step 3: Close dropdown
/>

                <AppFormField
                  name={"subject"}
                  label="Subject"
                  isRequired={true}
                  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                  onPress={() => setSubjectDropdownOpen(true)}
                  onDropdown={true}
                  onChangeText={handleChange('subject')}
                  onBlur={handleBlur('subject')}
                  value={values.subject}

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
                  name={"eligibility"}
                  label="More Details"
                  multiline
                  numberOfLines={3}
                  onChangeText={handleChange('eligibility')}
                  onBlur={handleBlur('eligibility')}
                  value={values.eligibility}

                />
               {/* Age group removed */}
                <AppFormField
                  name={"mealInclude"}
                  label="Meals Included"
                  isRequired={true}
                  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                  onPress={() => setMealIncludeDropdownOpen(true)}
                  onDropdown={true}
                  onChangeText={handleChange('mealInclude')}
                  onBlur={handleBlur('mealInclude')}
                  value={values.mealInclude}

                />

                <AppFormField name={"webURL"} label="Web URL"
                  onChangeText={handleChange('webURL')}
                  onBlur={handleBlur('webURL')}
                  value={values.webURL}

                />

                <Button title="Select Event Image" onPress={handleImagePicker} />
                {values.eventImage && (
                  <Image source={{ uri: values.eventImage }} style={{ width: 100, height: 100 }} />
                )}

             
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
                    onPress={handleSubmit}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Submit For Approval
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

export default CreateEventScreen;

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
});




