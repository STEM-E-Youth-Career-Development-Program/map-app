import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';

import SearchBar from '../components/SearchBar';
import Screen from '../components/Screen';
import Event from '../components/Event';
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
];

function EventListScreen(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const filteredEvents = allEventsList.filter(
      (event) =>
        event.heading.toLowerCase().includes(searchQuery.toLowerCase()) &&
        event.active == active
    );
    setFilteredData(filteredEvents);
  }, [searchQuery, active]);

  return (
    <Screen>
      <PageHeader header="All Events" />
      <View style={styles.actpenContainer}>
        {/* <Pressable
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
        </Pressable> */}
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
    </Screen>
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
    borderBottomWidth: 2,
    width: '50%',
  },
  actpentxt: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
});
