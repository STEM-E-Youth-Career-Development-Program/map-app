import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // console.log('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        // console.log('Current Location Separate:', currentLocation.coords);
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    })();
  }, []);

  const setNewLocation = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, setNewLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
