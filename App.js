import React, { useEffect, useState } from 'react';
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
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
//if(__DEV__) {import("./ReactotronConfig");}




const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
    if (Device.modelName) {
      console.log('Device model:', Device.modelName);
    } else {
      console.log('Device object is null or undefined');
    }
  }, [Device]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // AsyncStorage.getAllKeys((err, keys) => {
        //   AsyncStorage.multiRemove(keys, (err) => {
        //     console.log('AsyncStorage cleared');
        //   });
        // });
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
    </SafeAreaView>
  );
}

export default App;