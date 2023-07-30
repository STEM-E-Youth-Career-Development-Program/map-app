import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';

import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import SubmitButton from '../components/SubmitButton';
import PageHeader from '../components/PageHeader';
import Constants from 'expo-constants';

const allEventsList = [
  {
    id: 1,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: true,
    active: true,
  },
  {
    id: 2,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: true,
  },
  {
    id: 3,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: true,
    active: true,
  },
  {
    id: 4,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: true,
  },
  {
    id: 5,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: true,
    active: true,
  },
  {
    id: 6,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: true,
  },
  {
    id: 7,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: true,
    active: true,
  },
  {
    id: 8,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: true,
  },
  {
    id: 9,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: true,
    active: true,
  },
  {
    id: 10,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: true,
  },
  {
    id: 11,
    heading: 'Technical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: false,
  },
  {
    id: 12,
    heading: 'Technical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: false,
  },
  {
    id: 13,
    heading: 'Technical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: false,
  },
  {
    id: 14,
    heading: 'Technical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: false,
  },
  {
    id: 15,
    heading: 'Technical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: false,
    active: false,
  },
];

function EventListScreen(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };


  useEffect(() => {
    const filteredEvents = allEventsList.filter(event => 
      event.heading.toLowerCase().includes(searchQuery.toLowerCase()) &&
      event.active == active
    );
    
    setFilteredData(filteredEvents);
  }, [searchQuery, active]);

  return (
    <View style={styles.screen}>
      <PageHeader header='All Events'/>
      <View style={styles.actpenContainer}>
        <Pressable style={styles.actpen} onPress={() => setActive(true)}>
          <Text style={[styles.actpentxt, active ? styles.activeStyle : styles.inactiveStyle]}>
            Active
          </Text>
        </Pressable>
        <Pressable style={styles.actpen} onPress={() => setActive(false)}>
          <Text style={[styles.actpentxt, !active ? styles.activeStyle : styles.inactiveStyle]}>
            Pending
          </Text>
        </Pressable>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search for event"
      />
      <FlatList
        data={filteredData}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <Event
            heading={item.heading}
            startDate={item.startDate}
            endDate={item.endDate}
            subject={item.subject}
            distance={item.distance}
            cost={item.cost}
            meal={item.meal}
            status={item.active ? 'Active' : 'Pending'}
          />
        )}
      />
      <SubmitButton title={'Add New Event'} />
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
    marginTop: 5,
  },
  actpen: {
    borderBottomColor: '#999999',
    borderBottomWidth: 2,
    width: '50%',
  },
  actpentxt: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700'
  },
  actpentxt: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700'
  },
  activeStyle: {
    fontWeight: 'bold',
    marginTop: -5,
    fontSize: 17
  },
  inactiveStyle: {
    fontWeight: 'normal',
    marginTop: 0,
    fontSize: 15
  }
});
