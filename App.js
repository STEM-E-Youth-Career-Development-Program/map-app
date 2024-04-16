import React, {useEffect } from 'react';
import LandingScreen from './app/screens/LandingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import mapScreen from './app/screens/mapScreen';
import CreateEventScreen from './app/screens/CreateEventScreen';
import UpdateEventScreen from './app/screens/updateevent';
import EventListScreen from './app/screens/EventListScreen';
import EventDetails from './app/components/EventDetails';
import FilterScreen from './app/screens/FilterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationProvider } from './app/components/locationGet';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Clear AsyncStorage when the app goes to background or inactive state
        await AsyncStorage.clear();
      }
    };

    // Add event listener for app state changes
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // Clean up the event listener
    return () => {
      appStateListener.remove();
    };
  }, []);



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <LocationProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            name="Home"
            component={mapScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
          <Stack.Screen
            name="Create Event"
            component={CreateEventScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
           <Stack.Screen
            name="Update Event"
            component={UpdateEventScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
          <Stack.Screen
            name="Events"
            component={EventListScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
          <Stack.Screen
            name="Event Details"
            component={EventDetails}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
          <Stack.Screen
            name="Filter Events"
            component={FilterScreen}
            options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 200 }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </LocationProvider>

    </SafeAreaView>
  )
}

export default App;