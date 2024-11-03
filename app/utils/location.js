import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchLocation = async () => {
    try {
        //const storedData = await AsyncStorage.getItem('location');
        const storedData = null;

        if (storedData) {
            console.log('*******************stored location:', storedData);

            return storedData;

            // const location = JSON.parse(storedData);
            // const { coords, timestamp } = location;

            // console.log("Returning cached location from AsyncStorage.");

            // const now = Date.now();
            // const dataAge = now - timestamp;
            // const oneDay = 24 * 60 * 60 * 1000;

            // if (dataAge < oneDay) {
            //     console.log("Cached data is still fresh.");
            //     return location; // Return cached events if the data is fresh
        }

        //console.log("Cached data is too old, fetching new data...");


        const fetchedLocation = await Location.getCurrentPositionAsync({ timeout: 10000, enableHighAccuracy: true, });
        Logger.log('Got current location from phone:', fetchedLocation);


        // Store location data and timestamp in AsyncStorage
        await AsyncStorage.setItem('location', JSON.stringify(fetchedLocation));
        return fetchLocation;
        //console.log("Events fetched", allEvents);




    } catch (error) {
        console.error('Error fetching data in location.js:', error);
        return null;
    }
};

export default fetchLocation;
