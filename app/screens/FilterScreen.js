import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import Slider from "@react-native-community/slider";
import PageHeader from "../components/PageHeader.js";
import Screen from "../components/Screen.js";
import SubmitButton from "../components/SubmitButton.js";
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from "react-native-element-dropdown";

// const data = [
//   { key: "1", value: "Science" },
//   { key: "2", value: "Technology" },
//   { key: "3", value: "Engineering" },
//   { key: "4", value: "Math" },
//   { key: "5", value: "Entrepreneurship" },
// ];
const FilterScreen = ({ selectedSubjects, selectedCost }) => {
  // const [selected, setArea] = useState("");
  const [distance, setDistance] = useState(50);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [listKey, setListKey] = useState(0);
  const [eventTypeDropdownItems] = useState([
    { label: "Virtual", value: "1" },
    { label: "Onsite", value: "2" }
  ]);

  const [showDistance, setShowDistance] = useState(true);

  const handleEventTypeChange = (item) => {
    setSelectedLocation(item.label);
    setShowDistance(item.label === "Onsite");
  };

  var distanceText = "Within " + distance + " miles";
  if (distance == 100) {
    distanceText = "Max";
  } else if (distance == 0) {
    distanceText = "0 miles";
  }
  const [cost, setCost] = useState(90);
  var costText = "Max. $" + cost;
  if (cost == 100) {
    costText = "Max";
  } else if (cost == 0) {
    costText = "Free";
  }

  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to EventListScreen and pass selected subjects and cost as params
    console.log("Selected Cost:", cost);
    navigation.navigate('Events', {
      selectedSubjects: selected,
      selectedCost: cost,
      distance: distance,
      eventType: selectedLocation,
    });
  };

  const [apiData, setApiData] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Fetch subjects from the API when the component mounts
    fetch("https://mapstem-api.azurewebsites.net/api/Subject")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  // Transform API data to an array of strings using the 'id' property
  const transformedData = apiData.map((item) => item.name);


  const handleResetFilters = () => {
    // Reset all filter values to default
    console.log("Resetting filters...");
    setSelected([]);
    setListKey(prevKey => prevKey + 1);
    console.log("Selected subjects after reset:", selected);
    setSelectedLocation("");
    setShowDistance(true);
    setDistance(50);
    setCost(90);
  };

  return (
    <Screen>
      <PageHeader header={"Filter & Sort"} />

      <Text style={styles.heading}>Subject</Text>
      <View style={{ paddingHorizontal: 16, paddingTop: 15 }}>
        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          data={transformedData}
          save="id"
          label="Categories"
          placeholder="Select STEME Area"
          searchPlaceholder="Select STEME Area"
          search={true}
          selected={selected}
          key={listKey}
        />
      </View>

      <Text style={styles.heading}>Event Type</Text>
      <Dropdown
        style={styles.dropdown}
        data={eventTypeDropdownItems}
        labelField="label"
        valueField="value"
        placeholder="Select Event Type"
        // value={selectedLocation}
        // onChange={(item) => setSelectedLocation(item.label)}
        value={selectedLocation}
        onChange={handleEventTypeChange}
      />

      {showDistance && (
        <>
          <Text style={[styles.heading, { marginTop: "5%" }]}>Distance</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
            onValueChange={setDistance}
            minimumTrackTintColor="#999999"
            thumbTintColor="grey"
            defaultValue={distance}
            value={distance}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderText}>0 miles</Text>
            <Text style={styles.sliderText}>100+ miles</Text>
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.sliderValue}>{distanceText}</Text>
          </View>
        </>
      )}
      <Text style={styles.heading}>Cost</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={10}
        onValueChange={setCost}
        minimumTrackTintColor="#999999"
        thumbTintColor="grey"
        value={cost}
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderText}>$0</Text>
        <Text style={styles.sliderText}>$100+</Text>
      </View>
      <View style={{ alignSelf: "center" }}>
        <Text style={styles.sliderValue}>{costText}</Text>
      </View>

      {/* <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity> */}

      <View style={{ marginTop: 50 }}>
        <SubmitButton
          title={"Apply"}
          selectedSubjects={selected}
          selectedCost={cost}
          onPress={handlePress}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <SubmitButton
          title={"Reset Filters"}
          selectedSubjects={selected}
          selectedCost={cost}
          onPress={handleResetFilters}
        />
      </View>

    </Screen>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  heading: {
    fontWeight: "800",
    fontSize: 15,
    marginTop: "10%",
    borderBottomColor: "#999999",
    borderBottomWidth: 2,
    width: "92%",
    alignSelf: "center",
  },
  slider: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginTop: 5,
  },
  sliderText: {
    fontSize: 15,
    color: "#999999",
    fontWeight: "300",
  },
  sliderValue: {
    fontSize: 15,
    color: "#5A5A5A",
    fontWeight: "500",
    marginTop: -20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1.2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 25,
    backgroundColor: "white",
    marginVertical: 10,
    width: "92%",
    alignSelf: "center",
    backgroundColor: "transparent"
  },

  resetButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  resetButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20
  },

});
