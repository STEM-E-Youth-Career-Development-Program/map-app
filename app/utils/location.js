import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const fetchLocation = async () => {
    try {
        const storedData = await AsyncStorage.getItem('location');

        if (storedData) {
            console.log('******************* Stored location:', storedData);
            return JSON.parse(storedData);  // Return parsed location data if it exists
        }

        // Fetch new location if none is stored
        const fetchedLocation = await Location.getCurrentPositionAsync({
            timeout: 10000,
            enableHighAccuracy: true,
        });
        console.log('******************* Got current location from phone:', fetchedLocation);

        // Store location data in AsyncStorage
        await AsyncStorage.setItem('location', JSON.stringify(fetchedLocation));

        return fetchedLocation;  // Return the newly fetched location data

    } catch (error) {
        console.error('Error fetching data in location.js:', error);
        return null;
    }
};

export default fetchLocation;
