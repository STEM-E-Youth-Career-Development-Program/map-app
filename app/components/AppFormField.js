import React, { useRef, useState } from "react";
import { useFormikContext } from "formik";
import AppTextInput from "./AppTextInput";
import ErrorMessage from "./ErrorMessage";
import Label from "./Label";
import { View } from "react-native";
import { useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";


function AppFormField({
  label,
  name,
  isRequired,
  icon,
  onDropdown,
  ...otherProps
}) {
  const inputRef = useRef(null);
  const { errors, setFieldTouched, setFieldValue, touched, values } = useFormikContext();
  const [value, setValue] = useState(values[name] || null);
  //console.log("check values name", value, values[name])
  const [isFocus, setIsFocus] = useState(false);
  const [eventTypeDropdownItems] = useState([
    { label: "Virtual", value: "1" },
    { label: "Onsite", value: "2" },
  ]);
  const [mealIncludeDropdownItems] = useState([
    { label: "Yes", value: "1" },
    { label: "No", value: "2" },
  ]);

  const [gradeLevelDropdownItems] = useState([
    { label: "Elementary School", value: "1" },
    { label: "Middle School", value: "2" },
    { label: "High School", value: "3" },
    { label: "Undergraduate", value: "4" },
    { label: "Parent", value: "5" },
    { label: "Other", value: "6" },
  ]);

  const [subjectDropdownItems, setSubjectDropdownItems] = useState([]);


  const selectedValue = values[name];

  useEffect(() => {
    if (!isFocus) {
      // Update the form field value when the dropdown is not in focus
      setFieldValue(name, selectedValue);
    }
  }, [isFocus, name, selectedValue, setFieldValue]);

  useEffect(() => {
    if (name === "subject") {
      // Fetch subject dropdown data from the API
      fetch("https://mapstem-api.azurewebsites.net/api/Subject")
        .then((response) => response.json())
        .then((data) => {
          // Assuming the API response is an array of objects with name and id fields
          setSubjectDropdownItems(data.map((item) => ({
            label: item.name,
            value: item.id,
          })));
        })
        .catch((error) => console.error("Error fetching subject data:", error));
    }
  }, [name]);


  const labelsName = subjectDropdownItems.map(item => item.label);
  return (
    <View style={{}}>
      <Label
        label={label}
        onPress={() => inputRef.current.focus()}
        isRequired={isRequired}
      />
      {onDropdown ? (
        <View style={{ zIndex: 1000 }}>
          {name === "eventType" ? (
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "black" }]}
              itemContainerStyle={{}}
              containerStyle={{ borderRadius: 16 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={eventTypeDropdownItems}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select Event Type" : "..."}
              value={value !== null ? value : values[name]}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value); // Update local state
                setIsFocus(false);

                // Update Formik state with the selected value
                setFieldValue(name, item.label);
              }}
            />

          ) : name === "mealInclude" ? (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "black" }]}
                itemContainerStyle={{}}
                containerStyle={{ borderRadius: 16 }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={mealIncludeDropdownItems}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select Meals" : "..."}
                value={value !== null ? value : values[name]}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setValue(item.value); // Update local state
                  setIsFocus(false);

                  // Update Formik state with the selected value
                  setFieldValue(name, item.label);
                }}
              />
            ) :  name === "gradeLevel" ? (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "black" }]}
                itemContainerStyle={{}}
                containerStyle={{ borderRadius: 16 }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={gradeLevelDropdownItems}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select Grade Level" : "..."}
                value={value !== null ? value : values[name]}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setValue(item.value); // Update local state
                  setIsFocus(false);

                  // Update Formik state with the selected value
                  setFieldValue(name, item.label);
                }}
              />
            ) : (
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "black" }]}
                itemContainerStyle={{}}
                containerStyle={{ borderRadius: 16 }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={subjectDropdownItems}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select Subject" : "..."}
                value={value !== null ? value : values[name]}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setValue(item.value);
                  setIsFocus(false);
                  setFieldValue(name, item.label);
                }}
              />
            )}
        </View>
      ) : (
        <AppTextInput
          myRef={inputRef}
          onBlur={() => setFieldTouched(name)}
          onChangeText={(text) => setFieldValue(name, text)}
          value={value !== null ? value : values[name]}
          icon={icon}
          {...otherProps}
        />
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

export default AppFormField;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1.2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 25,
    backgroundColor: "white",
    marginVertical: 10,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
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
