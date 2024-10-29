import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchEvents = async () => {
  try {
    const storedData = await AsyncStorage.getItem('allEvents');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { events, timestamp } = parsedData;

      console.log("Returning cached events from AsyncStorage.");

      const now = Date.now();
      const dataAge = now - timestamp;
      const oneDay = 24 * 60 * 60 * 1000;

      if (dataAge < oneDay) {
        console.log("Cached data is still fresh.");
        return events; // Return cached events if the data is fresh
      }

      console.log("Cached data is too old, fetching new data...");
    }

    // If no cached data or data is outdated, fetch the events from the API
    const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event');
    const allEvents = await response.json();

    //console.log("Events fetched", allEvents);

    // Store the events along with a timestamp in AsyncStorage
    const newData = {
      events: allEvents,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem('allEvents', JSON.stringify(newData));

    return allEvents;

  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default fetchEvents;
