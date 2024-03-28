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



function CreateEventScreen({ props, route }) {



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


  const [formValues, setFormValues] = useState({
    ageGroup: '',
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
          eventImage: selectedImageUri,

        });
        // console.log('Event Image Path:', selectedImageUri);
        setShowEventImage(selectedImageUri)
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };


  const handleSubmit = async (values) => {
    try {
      console.log("check form Data", values);
      console.log("check form Data", values.gradeLevel);
      const imageUri = formValues.eventImage ? formValues.eventImage.uri : null;
      const selectedSubjectsString = selected.join(';');
      console.log("hello", selectedSubjectsString)
      const { latitude, longitude } = await handleGeocode(values.address);
      const formattedStartTime = values.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedEndTime = values.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create FormData object
      const formData = new FormData();
      formData.append('AgeGroup', values.ageGroup);
      formData.append('ContactNo', values.contactNo);
      // formData.append('EventImage', {
      //   uri: formValues.eventImage,
      //   type: 'image/jpeg',
      //   name: 'image.jpg',
      // });
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
      formData.append('EndDate', values.endDate.toISOString());
      formData.append('SubjectForSaving', selectedSubjectsString);
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
          [{ text: 'OK', onPress: () => navigation.navigate('Events') }],
          { cancelable: false }
        );

        // Wait for 5 seconds before navigating to the Events screen
        // setTimeout(() => {
        //   navigation.navigate('Events');
        // }, 5000);
      } else {
        console.error('Failed to create event');
        // Handle the error, you can parse response.json() for more details
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  const handleRemoveImage = () => {
    setShowEventImage('');
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
          // validationSchema={validationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
              <View>
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

                  {/* Display the selected image */}
                  {showeventImage && (
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ fontSize: 16 }}>Selected Image:</Text>
                      <Image
                        source={{ uri: showeventImage }}
                        style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                      />
                      <TouchableOpacity onPress={handleRemoveImage} style={{ position: 'absolute', top: 5, right: 5 }}>
                        <Text style={{ fontSize: 16, color: 'red' }}>X</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>


                <AppFormField
                  name={"heading"}
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
                  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                  onPress={() => setDropdownOpen(true)}
                  onDropdown={true}
                  onChangeText={(value) => {
                    handleChange('eventType')(value); // Update Formik state
                    setFormValues({ ...formValues, eventType: value });
                  }}
                  onBlur={handleBlur('eventType')}
                  value={values.eventType}
                />

                <AppFormField name={"cost"}
                  label="Average Cost (in dollars)" isRequired={true}
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
                      setValues({ ...values, startDate: selectedDate });
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
                  name={"contact"}
                  label="Contact Number"
                  onChangeText={handleChange('contactNo')}
                  onBlur={handleBlur('contactNo')}
                  value={values.contactNo}
                  keyboardType="numeric"

                />

                <Text style={styles.heading}>Subject</Text>
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
                />

                {/* <AppFormField name={"grade"} label="Grade Level"
                  onChangeText={handleChange('gradeLevel')}
                  onBlur={handleBlur('gradeLevel')}
                  value={values.gradeLevel}
                /> */}

                <AppFormField
                  name={"gradeLevel"}
                  label="Grade Level"
                  isRequired={false}
                  icon={<FontAwesome name="angle-down" color={"#999"} size={25} />}
                  onPress={() => setGradeLevelDropdownOpen(true)}
                  onDropdown={true}
                  onChangeText={handleChange('gradeLevel')}
                  onBlur={handleBlur('gradeLevel')}
                  value={values.gradeLevel}

                />


                {/* Elementary School, Middle School, High School, Undergraduate, Parent, Other */}

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
});