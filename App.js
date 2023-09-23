import React from 'react';
import LandingScreen from './app/screens/LandingScreen';
import CreateEventScreen from './app/screens/CreateEventScreen';
import EventListScreen from './app/screens/EventListScreen';
import EventDetails from './app/components/EventDetails';
import FilterScreen from './app/screens/FilterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen 
          name="Home"
          component={LandingScreen}
          options={{headerShown: false, animation: 'slide_from_right', animationDuration: 200}}
        />
        <Stack.Screen 
          name="Create Event"
          component={CreateEventScreen}
          options={{headerShown: false, animation: 'slide_from_right', animationDuration: 200}}
        />
        <Stack.Screen 
          name="Events"
          component={EventListScreen}
          options={{headerShown: false, animation: 'slide_from_right', animationDuration: 200}}
        />
        <Stack.Screen 
          name="Event Details"
          component={EventDetails}
          options={{headerShown: false, animation: 'slide_from_right', animationDuration: 200}}
        />
        <Stack.Screen 
          name="Filter Events"
          component={FilterScreen}
          options={{headerShown: false, animation: 'slide_from_right', animationDuration: 200}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;