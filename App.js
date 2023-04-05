import React from 'react';
import Event from './app/components/Event';
import CreateEventScreen from './app/screens/CreateEventScreen';
import Screen from './app/components/Screen';

export default function App() {
  return (
    <Screen>
      <Event />
    </Screen>
  );
}
