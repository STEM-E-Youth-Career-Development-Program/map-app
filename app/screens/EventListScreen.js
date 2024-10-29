import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import PageHeader from '../components/PageHeader';
import Constants from 'expo-constants';
import NextButton from '../components/NextButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from '../utils/logger';
import fetchEvents from '../utils/data';

function EventListScreen({ route, navigation }) {
  const { params } = route;
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [eventsAPI, setEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);

  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    // console.log("::Setting filters")
    if (params) {
      const { selectedSubjects, selectedCost, distance, eventType } = params;
      setFilters((prevState) => ({
        ...prevState,
        selectedCost,
        selectedSubjects,
        distance,
        eventType
      }))
    } else {
      setFilters(prevState => ({
        ...prevState,
        selectedSubjects: [],
        selectedCost: "",
        distance: "",
        eventType: "",
      }))
    }
  }, [params])


  useEffect(() => {
    const getLocationFromStorage = async () => {
      
      try {
        Logger.warn('params-navigation', params, navigation)

        const storedLocation = await AsyncStorage.getItem('location');
        console.log('Stored location:', storedLocation); // Add this log statement
        if (storedLocation) {
          const locationData = JSON.parse(storedLocation);
          Logger.warn('location coords',locationData.coords)
          setLocation(locationData.coords);
          setLoadingLocation(false);
        }
      } catch (error) {
        console.error('Error loading location from storage:', error);
      }
    };
    getLocationFromStorage();
  }, []);

  useEffect(() => {
    console.log("outside", { filters, loading })
    if (filters) {
      console.log("inside", { filters, loading })
      fetchData()
    };
  }, [filters, location]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        AsyncStorage.removeItem('allEvents');
        fetchData(); // Fetch updated events
        navigation.setParams({ refresh: false }); // Reset refresh param
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params?.refresh]);
  


  useEffect(() => {
    console.debug({
      location, params, searchQuery, active, loading, filters
    })
  }, [location, params, searchQuery, active, loading, filters])

  const renderFilterCapsules = () => !filters ? null : (
    <View style={styles.filterCapsulesContainer}>
      {renderFilter('Event Type', filters.eventType)}
      {renderFilter('Selected Cost', filters.selectedCost)}
      {renderFilter('Selected Subjects', filters.selectedSubjects)}
      {renderFilter('Distance', filters.distance)}
    </View>
  );

  const renderFilter = (label, value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    let formattedValue = value;
    if (label === 'Distance') {
      formattedValue = `${value} mi`;
    } else if (label === 'Selected Cost') {
      formattedValue = `$${value}`;
    } else if (label === 'Selected Subjects' && Array.isArray(value)) {
      formattedValue = value.join(', ');
    }

    return (
      <View style={styles.filterCapsule}>
        <Text style={styles.filterValue}>{formattedValue}</Text>
        {/* <TouchableOpacity onPress={() => removeFilter(label)}>
          <MaterialCommunityIcons name="close" size={20} color="white" />
        </TouchableOpacity> */}
      </View>
    );
  };

  // const removeFilter = (label) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [label.toLowerCase().replace(' ', '')]: Array.isArray(prevFilters[label.toLowerCase().replace(' ', '')]) ? [] : '',
  //   }));
  // };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const buildUrl = (baseUrl, params) => {
    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return `${baseUrl}?${query}`;
  };


  // const fetchData = async () => {
  //   const eventsData = await AsyncStorage.getItem('userData');
  //   try {
  //     setLoading(true);
  //     const url = buildUrl('https://mapstem-api.azurewebsites.net/api/Event', filters);
  //     console.log('Fetching data from URL:', url);

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('API response data:', data.length);
  //     setEvents(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setLoading(false);
  //   }
  // };


    const fetchData = async () => {

      try {
        // await AsyncStorage.removeItem('allEvents');
        const events = await fetchEvents();
        setEvents(events);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };




  // useEffect(() => {
  //   console.log(

  //     "outside", { filters, loading })
  //   if (filters) {
  //     console.log(

  //       "inside", { filters, loading })
  //     fetchData()
  //   };
  // }, [filters]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!location) {
      console.log('Location is null, cannot calculate distance');
      return;
    }

    console.log("check eventsAPI", eventsAPI.length)  
    const eventsWithDistance = Array.isArray(eventsAPI)
      ? eventsAPI.map((event) => {
        const eventDistance = calculateDistance(
          location.latitude,
          location.longitude,
          event.latitude,
          event.longitude
        );
        // console.log(`Event ID: ${event.id}, Distance: ${eventDistance}`);
        return { ...event, distance: eventDistance };
      })
      : [];

    console.log("check eventWithDistance", eventsWithDistance.length)  
    const filteredEvents = eventsWithDistance.filter((event) => {
      const { eventType, distance, selectedSubjects, selectedCost } = filters;
      const subjectString = Array.isArray(event.subject) ? event.subject.join(', ').toLowerCase() : '';
      const matchesSearchQuery =
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subjectString.includes(searchQuery.toLowerCase());
      const matchesStatus =
        (active && event.eventStatus === 'Active') ||
        (!active && event.eventStatus === 'Pending');
      const matchesEventType = !eventType || event.eventType === eventType;
      const matchesDistance = distance === 100 || !distance || event.distance <= distance;
      const matchesCost = selectedCost === 100 || !selectedCost || event.selectedCost <= selectedCost;
      
      function hasCommonElement(arr1, arr2) {
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
        
        for (let elem of set1) {
            if (set2.has(elem)) {
                return true;
            }
        }
        return false;
    }

      // const matchesCost = event.cost<=selectedCost;
      const matchesSubject = Array.isArray(selectedSubjects) && selectedSubjects.length > 0 
      ? hasCommonElement(event.subject, selectedSubjects)
      : true;
    
      // console.log("check filteredEvents", filteredEvents.length)  
      // console.log(`Event: ${event.eventName}`);
      // console.log(`Matches search query: ${matchesSearchQuery}`);
      // console.log(`Matches status: ${matchesStatus}`);
      // console.log(`Matches event type: ${matchesEventType}`);
      // console.log(`Matches distance: ${matchesDistance}`);

      return matchesSearchQuery && matchesStatus && matchesEventType && matchesDistance && matchesSubject;
    });
    filteredEvents.sort((a, b) => a.distance - b.distance);
    // console.log('Filtered events:', filteredEvents);
    setFilteredData(filteredEvents);
  }, [location, eventsAPI, loading, searchQuery, active, filters]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!location) {
      console.log('Location is null, cannot calculate distance');
      return null;
    }
    
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      console.error('Invalid latitude or longitude values',lat1, lon1, lat2, lon2);
      return null;
    }

    const R = 3958.8; // Earth radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (isNaN(distance)) {
      console.error('Distance calculation failed');
      return null;
    }

    return distance;
  };

  const toRadians = (angle) => {
    return (angle * Math.PI) / 180;
  };



  return (
    <View style={styles.screen}>
      <PageHeader header="All Events" />
      {renderFilterCapsules()}

      {loadingLocation ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
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

          <FlatList
            data={filteredData}
            keyExtractor={(event) => event.id.toString()}
            renderItem={({ item }) => (
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
                companyname={item.companyName}
                subject={item.subject}
                contact={item.contactNo}
                eligibility={item.eligibility}
                gradeLevel={item.gradeLevel}
                ageGroup={item.ageGroup}
                meal={item.mealIncluded}
                url={item.url}
                distance={item.distance}
                navigation={navigation}
                allDetails={item}
              />
            )}
          />

          <NextButton
            title={'Add New Event'}
            onPress={() => navigation.navigate('Create Event')}
          />
        </>
      )}
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
  filterValue: {
    color: 'white',
    marginRight: 5,
  },
});
