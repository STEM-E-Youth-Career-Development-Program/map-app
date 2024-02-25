import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable, TouchableOpacity } from 'react-native';

import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import PageHeader from '../components/PageHeader';
import Constants from 'expo-constants';
import NextButton from '../components/NextButton';
import { useNavigation } from '@react-navigation/native';
import { useLocation } from '../components/locationGet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
function EventListScreen({ route, props, navigation }) {
  const { location } = useLocation();
  const { selectedSubjects, selectedCost, distance, eventType } = route.params || {};

  // console.log("check",eventType,  selectedSubjects, selectedCost)
  //console.log("check type and distance", eventType, selectedCost, selectedSubjects, distance)
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [eventsAPI, setEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const renderFilterCapsules = () => {
    return (
      <View style={styles.filterCapsulesContainer}>
        {renderFilter('Event Type', eventType)}
        {renderFilter('Selected Cost', selectedCost)}
        {renderFilter('Selected Subjects', selectedSubjects)}
        {renderFilter('Distance', distance)}
      </View>
    );
  };

   // Render individual filter capsule
   const renderFilter = (label, value) => {
    if (!value) return null;
  
    let formattedValue = value;
    if (label === 'Distance') {
      formattedValue = `${value} mi`;
    } else if (label === 'Selected Cost') {
      formattedValue = `$${value}`;
    }
  
    return (
      <View style={styles.filterCapsule}>
        {/* <Text style={styles.filterLabel}>{label}: </Text> */}
        <Text style={styles.filterValue}>{formattedValue}</Text>
        <TouchableOpacity onPress={() => removeFilter(label)}>
          <MaterialCommunityIcons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  

  // Function to remove a filter
  const removeFilter = (label) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter.label !== label));
  };



  const handleSearch = (text) => {
    setSearchQuery(text);
  };


  // useEffect(() => {
  //   // Fetch events based on selectedSubjects, selectedCost, eventType, and distance
  //   if (selectedSubjects && selectedCost) {
  //     fetch(`https://mapstem-api.azurewebsites.net/api/Event?Subject=${selectedSubjects}&Cost=${selectedCost}`)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         setEvents(data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching data:', error);
  //         setLoading(false);
  //       });
  //   } else {
  //     fetch('https://mapstem-api.azurewebsites.net/api/Event')
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         setEvents(data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching data:', error);
  //         setLoading(false);
  //       });
  //   }
  // }, [selectedSubjects, selectedCost, eventType, distance]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'https://mapstem-api.azurewebsites.net/api/Event';
        if (selectedSubjects && selectedCost) {
          url += `?Subject=${selectedSubjects}&Cost=${selectedCost}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData(); // Initial fetch
  
    const intervalId = setInterval(fetchData, 5000); // Fetch data every minute
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [selectedSubjects, selectedCost, eventType, distance]);

  
  useEffect(() => {
    // Filter events based on searchQuery, active status, and location
    if (loading) {
      return; // Wait until data is loaded
    }
  
    const eventsWithDistance = Array.isArray(eventsAPI)
      ? eventsAPI.map((event) => {
          const eventDistance = calculateDistance(
            location.latitude,
            location.longitude,
            event.latitude,
            event.longitude
          );
          return { ...event, distance: eventDistance };
        })
      : [];
  
    const filteredEvents = eventsWithDistance.filter((event) => {
      // Convert subject array to a string and lowercase for comparison
      const subjectString = Array.isArray(event.subject) ? event.subject.join(', ').toLowerCase() : '';
  
      return (
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subjectString.includes(searchQuery.toLowerCase())
      ) &&
      ((active && event.eventStatus === 'Active') ||
        (!active && event.eventStatus === 'Pending')) &&
      (!eventType || event.eventType === eventType) &&
      (!distance || event.distance <= distance);
    });
  
    setFilteredData(filteredEvents);
  }, [searchQuery, active, loading, eventsAPI, location, eventType, distance]);
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRadians = (angle) => {
    return (angle * Math.PI) / 180;
  };


  return (
    <View style={styles.screen}>
      <PageHeader header="All Events" />
            {renderFilterCapsules()}

      <View style={styles.actpenContainer}>
        <Pressable
          style={[
            styles.actpen,
            active
              ? { borderBottomColor: 'black' }
              : { borderBottomColor: '#999999' },
          ]}
          onPress={() => setActive(true)}
        >
          <Text
            style={[
              styles.actpentxt,
              active ? { fontWeight: '700' } : { fontWeight: '400' },
            ]}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.actpen,
            !active
              ? { borderBottomColor: 'black' }
              : { borderBottomColor: '#999999' },
          ]}
          onPress={() => setActive(false)}
        >
          <Text
            style={[
              styles.actpentxt,
              !active ? { fontWeight: '700' } : { fontWeight: '400' },
            ]}
          >
            Pending
          </Text>
        </Pressable>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search for event"
        onPressIcon={() => navigation.navigate('Filter Events')}
        isList={true}
      />
      {/* <FlatList
        data={filteredData}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <Event
            image = {item.imageData}
            heading={item.eventName}
            type = {item.eventType}
            cost={item.cost}
            description={item.description}
            startDate={item.startDate}
            endDate={item.endDate}
            startTime={item.startTime}
            endTime={item.endTime}
            address={item.address}
            companyname={item.compmayName}
            subject={item.subject}
            contact={item.contactNo}
            eligibility={item.eligibility}
            gradeLevel={item.gradeLevel}
            ageGroup={item.ageGroup}
            meal={item.mealIncluded}
            //distance={item.eventDistance}
            navigation={navigation}
            allDetails={item}
          />
        )}
      /> */}
      <FlatList
        data={filteredData}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => {
          let distance = item.distance; // or use const if you don't need to reassign distance

          return (
            <Event
              image={item.imageData}
              heading={item.eventName}
              type={item.eventType}
              cost={item.cost}
              description={item.description}
              startDate={item.startDate}
              endDate={item.endDate}
              startTime={item.startTime}
              endTime={item.endTime}
              address={item.address}
              companyname={item.compmayName}
              subject={item.subject}
              contact={item.contactNo}
              eligibility={item.eligibility}
              gradeLevel={item.gradeLevel}
              ageGroup={item.ageGroup}
              meal={item.mealIncluded}
              distance={distance}
              navigation={navigation}
              allDetails={item}
            />
          );
        }}
      />

      <NextButton
        title={'Add New Event'}
        onPress={() => navigation.navigate('Create Event')}
      />
    </View>
  );
}

export default EventListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#f3f3f3',
  },
  actpenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 10,
  },
  actpen: {
    borderBottomWidth: 2,
    width: '50%',
  },
  actpentxt: {
    textAlign: 'center',
    fontSize: 15,
  },
  filterCapsulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  filterCapsule: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  filterLabel: {
    fontWeight: 'bold',
  },
  filterValue: {
    marginLeft: 5,
    color: '#fff'
  },

});
