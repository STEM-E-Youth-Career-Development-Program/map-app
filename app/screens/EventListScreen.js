import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';

import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import PageHeader from '../components/PageHeader';
import Constants from 'expo-constants';
import NextButton from '../components/NextButton';
import { useNavigation } from '@react-navigation/native';
import events from '../shared/allevents.json';

const allEventsList = [
  {
    id: 1,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 2,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 3,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 4,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 5,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 6,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 7,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 8,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 9,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 10,
    heading: 'Medical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: true,
  },
  {
    id: 11,
    heading: 'Technical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: false,
  },
  {
    id: 12,
    heading: 'Technical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: false,
  },
  {
    id: 13,
    heading: 'Technical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: false,
  },
  {
    id: 14,
    heading: 'Technical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: false,
  },
  {
    id: 15,
    heading: 'Technical Workshop',
    startDate: 'Mar 23',
    endDate: 'Mar 25',
    subject: 'Science',
    distance: 2.5,
    cost: 25,
    active: false,
  },
];

function EventListScreen({ props, navigation }) {

  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const filteredEvents = events.filter(event =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      event.active == active
    );
    setFilteredData(filteredEvents);
  }, [searchQuery, active]);

  return (
    <View style={styles.screen}>
      <PageHeader header="All Events" />
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
            heading={item.eventName}
            startDate={item.eventDate}
            subject={item.eventSubject}
            distance={item.eventDistance}
            cost={item.eventCost}
            meal={item.mealIncluded}
            status={item.active ? 'Active' : 'Pending'}
            navigation={navigation}
            allDetails={item}
          />
        )}
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
});
