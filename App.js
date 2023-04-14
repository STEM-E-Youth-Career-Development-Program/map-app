import React from 'react';
import Event from './app/components/Event';
import CreateEventScreen from './app/screens/CreateEventScreen';
import Screen from './app/components/Screen';
import SubmitButton from './app/components/SubmitButton';

export default function App() {
  return (
    <Screen>
      {/* <Event /> */}
      <SubmitButton />
    </Screen>
  );
}
