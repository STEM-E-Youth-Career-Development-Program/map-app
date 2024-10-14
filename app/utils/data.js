import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchEvents = async () => {
  try {
    AsyncStorage.clear();
    // Check if events data is stored in AsyncStorage
    const storedData = await AsyncStorage.getItem('allEvents');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { events, timestamp } = parsedData;

      console.log("Returning cached events from AsyncStorage.");

      // Optionally: Check if the data is older than a certain threshold (e.g., 24 hours)
      const now = Date.now();
      const dataAge = now - timestamp;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (dataAge < oneDay) {
        console.log("Cached data is still fresh.");
        return events; // Return cached events if the data is fresh
      }

      console.log("Cached data is too old, fetching new data...");
    }

    // If no cached data or data is outdated, fetch the events from the API
    console.log("Fetching events from API###");
    const response = await fetch('https://mapstem-api.azurewebsites.net/api/Event');
    const allEvents = await response.json();

    console.log("Events fetched", eventCoordinates);

    // Store the onsite events along with a timestamp in AsyncStorage
    const newData = {
      events: allEvents,
      timestamp: Date.now(), // Store the current timestamp
    };

    await AsyncStorage.setItem('allEvents', JSON.stringify(newData));

    // Return the fetched events
    return allEvents;

  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null in case of an error
  }
};

export default fetchEvents;
