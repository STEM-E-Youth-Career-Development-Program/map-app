import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Screen from '../components/Screen';
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
  return (
    <Screen>
      {/* <Event /> */}
      <FlatList
        data={events}
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
