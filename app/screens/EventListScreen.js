import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';

import Screen from '../components/Screen';
import SearchBar from '../components/SearchBar';
import Event from '../components/Event';
import SubmitButton from '../components/SubmitButton';
import PageHeader from '../components/PageHeader';

const events = [
  {
    id: 1,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: 'yes',
  },
  {
    id: 2,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: 'yes',
  },
  {
    id: 3,
    heading: 'Medical Workshop',
    startDate: 'Thur, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: 'yes',
  },
  {
    id: 4,
    heading: 'Medical Workshop',
    startDate: 'Thurs, Mar 23',
    endDate: 'Sat, Mar 25',
    subject: 'Science',
    distance: '2.5',
    cost: '25',
    meal: 'yes',
  },
];

function EventListScreen(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(events);
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredList = () => {
      return events.filter((item) =>
        item.heading.toLowerCase().includes(text.toLowerCase())
      );
    };
    setFilteredData(filteredList);
  };
  const filterData = () => {
    return events.filter((item) =>
      item.heading.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Screen>
      <PageHeader header='All Events'/>
      <View style={styles.actpenContainer}>
        <Pressable style={styles.actpen}>
          <Text style={styles.actpentxt}>Active</Text>
        </Pressable>
        <Pressable style={styles.actpen}>
          <Text style={styles.actpentxt}>Pending</Text>
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
          />
        )}
      />
      
    </Screen>
  );
}

export default EventListScreen;

const styles = StyleSheet.create({
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
});
