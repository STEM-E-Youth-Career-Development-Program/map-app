import React from 'react';
import Event from './app/components/Event';
import CreateEventScreen from './app/screens/CreateEventScreen';
import Screen from './app/components/Screen';
import SubmitButton from './app/components/SubmitButton';
import EventListScreen from './app/screens/EventListScreen';
import SearchBar from './app/components/SearchBar';

export default function App() {
  return (
    <Screen>
      <SearchBar />
    </Screen>
  );
}
