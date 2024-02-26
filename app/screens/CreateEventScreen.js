import React from "react";
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



function CreateEventScreen(props) {



  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [mealIncludeDropdownOpen, setMealIncludeDropdownOpen] = useState(false);
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
  const navigation = useNavigation();
  //   const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (permissionResult.granted === false) {
  //     alert("Permission to access the camera roll is required!");
  //     return;
  //   }

  //   const pickerResult = await ImagePicker.launchImageLibraryAsync();

  //   if (pickerResult.cancelled === true) {
  //     return;
  //   }

  //   setEventImage({ uri: pickerResult.uri }); // Update eventImage as an object with the URI property
  // };

  const onChangeStartTime = (event, selectedTime) => {
    setStartTimeOpen(false);
    if (selectedTime !== undefined) {
      setStartTime(selectedTime);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    setEndTimeOpen(false);
    if (selectedTime !== undefined) {
      setEndTime(selectedTime);
    }
  };
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setStartOpen(false);
  };
  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setEndOpen(false);
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
        // Update the form values with the complete image path
        const selectedImageUri = result.assets[0].uri;
        setFormValues({
          ...formValues,
          eventImage: selectedImageUri,

        });
        // console.log('Event Image Path:', selectedImageUri);
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
      formData.append('CompmayName', values.companyName);
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
          // validationSchema={validationSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
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


                <AppFormField name={"heading"} label="Event Name" isRequired={true}
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

                <AppFormField name={"cost"} label="Cost (in dollars)" isRequired={true}
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
                <AppFormField name={"grade"} label="Grade Level"
                  onChangeText={handleChange('gradeLevel')}
                  onBlur={handleBlur('gradeLevel')}
                  value={values.gradeLevel}
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
                  label="Eligibility"
                  multiline
                  numberOfLines={3}
                  onChangeText={handleChange('eligibility')}
                  onBlur={handleBlur('eligibility')}
                  value={values.eligibility}

                />
                <AppFormField name={"ageGroup"} label="Age Group"
                  onChangeText={handleChange('ageGroup')}
                  onBlur={handleBlur('ageGroup')}
                  value={values.ageGroup}

                />
                <AppFormField
                  name={"mealInclude"}
                  label="Meals Include"
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
});


// Formik x React Native example
// import React, { useState } from "react";
// import { StyleSheet, Text, View, Platform, TextInput, Button, Image } from "react-native";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { Formik } from 'formik';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';


// function CreateEventScreen(props) {

//   const [formValues, setFormValues] = useState({
//     ageGroup: '',
//     contactNo: '',
//     eventImage: null,
//     companyName: '',
//     eventName: '',
//     endTime: '',
//     endDate: '',
//     subject: '',
//     gradeLevel: '',
//     eligibility: '',
//     cost: '',
//     startTime: '',
//     startDate: '',
//     eventType: '',
//     address: '',
//     description: '',
//     mealInclude: '',
//   });

//   const handleImagePicker = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (permissionResult.granted === false) {
//         console.error('Permission to access media library was denied');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       console.log('Image Picker Result:', result);

//       if (!result.cancelled) {
//         // Update the form values with the complete image path
//         const selectedImageUri = result.assets[0].uri;
//         setFormValues({
//           ...formValues,
//           eventImage: selectedImageUri,

//         });
//         console.log('Event Image Path:', selectedImageUri);
//       }
//     } catch (error) {
//       console.error('Error picking image', error);
//     }
//   };


//   const handleSubmit = async (values) => {
//     try {
//       console.log("check", values);

//       // Create FormData object
//       const formData = new FormData();
//       formData.append('AgeGroup', values.ageGroup);
//       formData.append('ContactNo', values.contactNo);
//       formData.append('EventImage', {
//         uri: formValues.eventImage,
//         type: 'image/jpeg',
//         name: 'image.jpg',
//       });
//       formData.append('CompanyName', values.companyName);
//       formData.append('EventName', values.eventName);
//       formData.append('EndTime', values.endTime);
//       formData.append('EndDate', values.endDate);
//       formData.append('Subject', values.subject);
//       formData.append('GradeLevel', values.gradeLevel);
//       formData.append('Eligibility', values.eligibility);
//       formData.append('Cost', values.cost);
//       formData.append('StartTime', values.startTime);
//       formData.append('StartDate', values.startDate);
//       formData.append('EventType', values.eventType);
//       formData.append('Address', values.address);
//       formData.append('Description', values.description);
//       formData.append('MealIncluded', values.mealInclude);

//       console.log('Before fetch');
//       // Make the API call to upload the image
//       const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,

//       });
//       console.log('After fetch');

//       // Log the response status and content
//       console.log('Response Status:', response.status);
//       const responseText = await response.text();
//       console.log('Response Content:', responseText);

//       // Check if the request was successful
//       if (response.ok) {
//         console.log('Event created successfully');
//         // You can handle the success as per your application's requirements
//       } else {
//         console.error('Failed to create event');
//         // Handle the error, you can parse response.json() for more details
//       }
//     } catch (error) {
//       console.error('Error creating event', error);
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       contentContainerStyle={{ flexGrow: 1 }}
//       enableOnAndroid
//       extraScrollHeight={Platform.OS === 'ios' ? 130 : 0}
//     >
//       <Formik
//         initialValues={formValues}
//         onSubmit={handleSubmit}
//       >
//         {({ handleChange, handleBlur, handleSubmit, values, setValues }) => (
//           <View style={styles.formContainer}>
//             <Text style={styles.label}>Age Group</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={handleChange('ageGroup')}
//               onBlur={handleBlur('ageGroup')}
//               value={values.ageGroup}
//               placeholder="Age Group"
//             />

//             <TextInput
//               onChangeText={handleChange('contactNo')}
//               onBlur={handleBlur('contactNo')}
//               value={values.contactNo}
//               placeholder="Contact No"
//               keyboardType="numeric"
//             />

//             {/* Display selected image */}
//             {values.eventImage && (
//               <Image source={{ uri: values.eventImage.uri }} style={{ width: 100, height: 100 }} />
//             )}

//             {/* Button to trigger image picker */}
//             <Button title="Select Event Image" onPress={handleImagePicker} />

//             <TextInput
//               onChangeText={handleChange('companyName')}
//               onBlur={handleBlur('companyName')}
//               value={values.companyName}
//               placeholder="Company Name"
//             />


//             <TextInput
//               onChangeText={handleChange('eventName')}
//               onBlur={handleBlur('eventName')}
//               value={values.eventName}
//               placeholder="Event Name"
//             />

//             <TextInput
//               onChangeText={handleChange('endTime')}
//               onBlur={handleBlur('endTime')}
//               value={values.endTime}
//               placeholder="End Time"
//             />

//             <TextInput
//               onChangeText={handleChange('endDate')}
//               onBlur={handleBlur('endDate')}
//               value={values.endDate}
//               placeholder="End Date"
//             />

//             <TextInput
//               onChangeText={handleChange('subject')}
//               onBlur={handleBlur('subject')}
//               value={values.subject}
//               placeholder="Subject"
//             />


//             <TextInput
//               onChangeText={handleChange('gradeLevel')}
//               onBlur={handleBlur('gradeLevel')}
//               value={values.gradeLevel}
//               placeholder="Grade Level"
//             />

//             <TextInput
//               onChangeText={handleChange('eligibility')}
//               onBlur={handleBlur('eligibility')}
//               value={values.eligibility}
//               placeholder="Eligibility"
//             />

//             <TextInput
//               onChangeText={handleChange('cost')}
//               onBlur={handleBlur('cost')}
//               value={values.cost}
//               placeholder="Cost"
//               keyboardType="numeric"
//             />

//             <TextInput
//               onChangeText={handleChange('startTime')}
//               onBlur={handleBlur('startTime')}
//               value={values.startTime}
//               placeholder="Start Time"
//             />

//             <TextInput
//               onChangeText={handleChange('startDate')}
//               onBlur={handleBlur('startDate')}
//               value={values.startDate}
//               placeholder="Start Date"
//             />

//             <TextInput
//               onChangeText={handleChange('eventType')}
//               onBlur={handleBlur('eventType')}
//               value={values.eventType}
//               placeholder="Event Type"
//             />

//             <TextInput
//               onChangeText={handleChange('address')}
//               onBlur={handleBlur('address')}
//               value={values.address}
//               placeholder="Address"
//             />


//             <TextInput
//               onChangeText={handleChange('description')}
//               onBlur={handleBlur('description')}
//               value={values.description}
//               placeholder="Description"
//               multiline
//             />

//             <TextInput
//               onChangeText={handleChange('mealInclude')}
//               onBlur={handleBlur('mealInclude')}
//               value={values.mealInclude}
//               placeholder="Meals Include"
//               multiline
//             />

//             <LinearGradient
//               colors={['black', '#5A5A5A']}
//               style={{
//                 alignItems: 'center',
//                 alignSelf: 'center',
//                 justifyContent: 'center',
//                 width: '95%',
//                 height: 60,
//                 borderRadius: 10,
//                 marginVertical: 10,
//               }}
//               locations={[0.1, 0.9]}
//             >
//               <Button
//                 style={{
//                   color: 'white',
//                   fontSize: 25,
//                   fontWeight: 'bold',
//                 }}
//                 onPress={handleSubmit}
//                 title="Submit"
//               />
//             </LinearGradient>
//           </View>
//         )}
//       </Formik>
//     </KeyboardAwareScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 10,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginBottom: 16,
//   },
//   submitButton: {
//     alignItems: 'center',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     width: '95%',
//     height: 60,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
// });

// export default CreateEventScreen;
