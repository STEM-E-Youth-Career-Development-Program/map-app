import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import Screen from '../components/Screen';
import SearchBar from '../components/SearchBar';
import Event from '../components/Event';

const events = [
  {
    id: 1,
    heading: 'Medical Workshop',
    date: 'Thurs, Mar 2023 - Sat Mar 32',
    subject: 'Subject: science 🗼2.5 mi $25 🍴 yes',
  },
  {
    id: 4,
    heading: 'Medical Workshop',
    date: 'Thurs, Mar 2023 - Sat Mar 32',
    subject: 'Subject: science 🗼2.5 mi $25 🍴 yes',
  },
  {
    id: 44,
    heading: 'Medical Workshop',
    date: 'Thurs, Mar 2023 - Sat Mar 32',
    subject: 'Subject: science 🗼2.5 mi $25 🍴 yes',
  },
  {
    id: 64,
    heading: 'Medical Workshop',
    date: 'Thurs, Mar 2023 - Sat Mar 32',
    subject: 'Subject: science 🗼2.5 mi $25 🍴 yes',
  },
];

function EventListScreen(props) {
  const [searchQuery, setSearchQuery] = useState();
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

  return (
    <Screen>
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
            date={item.date}
            subject={item.subject}
          />
        )}
      />
    </Screen>
  );
}

export default EventListScreen;

const styles = StyleSheet.create({});
