import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getCombinedEvents } from "./eventbriteApi";

const fetchEvents = async (includeEventbrite = true) => {
  try {
    const storedData = await AsyncStorage.getItem("allEvents");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { events, timestamp } = parsedData;

      console.log("Returning cached events from AsyncStorage.");

      const now = Date.now();
      const dataAge = now - timestamp;
      const oneDay = 24 * 60 * 60 * 1000;

      if (dataAge < oneDay) {
        console.log("Cached data is still fresh.");

        // Still combine with Eventbrite events if requested
        if (includeEventbrite) {
          // return await getCombinedEvents(events, true);
          return events; // Temporarily return only regular events
        }
        return events;
      }

      console.log("Cached data is too old, fetching new data...");
    }

    // If no cached data or data is outdated, fetch the events from the API
    console.log("Fetching events from MapSTEM API...");
    const response = await fetch(
      "https://mapstem-api.azurewebsites.net/api/Event"
    );

    if (!response.ok) {
      throw new Error(
        `MapSTEM API error: ${response.status} ${response.statusText}`
      );
    }

    const allEvents = await response.json();
    console.log(`Fetched ${allEvents.length} events from MapSTEM API`);

    // Store the events along with a timestamp in AsyncStorage
    const newData = {
      events: allEvents,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem("allEvents", JSON.stringify(newData));

    // Combine with Eventbrite events if requested
    if (includeEventbrite) {
      console.log("Combining with Eventbrite events...");
      // return await getCombinedEvents(allEvents, true);
      return allEvents; // Temporarily return only regular events
    }

    return allEvents;
  } catch (error) {
    console.error("Error fetching data:", error);

    // Try to return cached data even if it's old, as a fallback
    try {
      const storedData = await AsyncStorage.getItem("allEvents");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Returning stale cached data due to API error");

        if (includeEventbrite) {
          // return await getCombinedEvents(parsedData.events, true);
          return parsedData.events; // Temporarily return only regular events
        }
        return parsedData.events;
      }
    } catch (cacheError) {
      console.error("Error reading cached data:", cacheError);
    }

    return [];
  }
};

export default fetchEvents;
