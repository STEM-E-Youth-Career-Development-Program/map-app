import AsyncStorage from "@react-native-async-storage/async-storage";
import EventbriteService from "./eventbriteService";
import { API_CACHE_DURATION } from "@env";

const fetchEvents = async (userLocation = null) => {
  try {
    const storedData = await AsyncStorage.getItem("allEvents");
    const cacheDuration = parseInt(API_CACHE_DURATION) || 86400000; // 24 hours default

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { events, timestamp } = parsedData;

      console.log("Checking cached events from AsyncStorage.");

      const now = Date.now();
      const dataAge = now - timestamp;

      if (dataAge < cacheDuration) {
        console.log("Cached data is still fresh.");
        return events; // Return cached events if the data is fresh
      }

      console.log("Cached data is too old, fetching new data...");
    }

    console.log("Fetching fresh events from all sources...");

    // Fetch MapSTEM events
    let mapStemEvents = [];
    try {
      const response = await fetch(
        "https://mapstem-api.azurewebsites.net/api/Event"
      );
      if (response.ok) {
        mapStemEvents = await response.json();
        console.log(`Fetched ${mapStemEvents.length} MapSTEM events`);
      }
    } catch (error) {
      console.error("Error fetching MapSTEM events:", error);
    }

    // Fetch Eventbrite events if location is provided
    let eventbriteEvents = [];
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      try {
        eventbriteEvents = await EventbriteService.searchEvents(
          userLocation.latitude,
          userLocation.longitude,
          100 // 100km radius
        );
        console.log(`Fetched ${eventbriteEvents.length} Eventbrite events`);
      } catch (error) {
        console.error("Error fetching Eventbrite events:", error);
      }
    }

    // Combine events and remove duplicates
    const allEvents = combineAndDeduplicateEvents(
      mapStemEvents,
      eventbriteEvents
    );

    console.log(`Total combined events: ${allEvents.length}`);

    // Store the combined events along with a timestamp in AsyncStorage
    const newData = {
      events: allEvents,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem("allEvents", JSON.stringify(newData));

    return allEvents;
  } catch (error) {
    console.error("Error fetching data:", error);

    // Try to return cached data as fallback
    try {
      const fallbackData = await AsyncStorage.getItem("allEvents");
      if (fallbackData) {
        const { events } = JSON.parse(fallbackData);
        console.log("Returning cached events as fallback");
        return events;
      }
    } catch (fallbackError) {
      console.error("Error getting fallback data:", fallbackError);
    }

    return [];
  }
};

/**
 * Combine and deduplicate events from different sources
 */
const combineAndDeduplicateEvents = (mapStemEvents, eventbriteEvents) => {
  const combined = [...mapStemEvents, ...eventbriteEvents];
  const seen = new Set();

  return combined.filter((event) => {
    // Create a unique key based on event name, location, and date
    const key = `${event.eventName?.toLowerCase()}_${event.eventLocation?.toLowerCase()}_${
      event.eventDate
    }`;

    if (seen.has(key)) {
      console.log(`Duplicate event detected: ${event.eventName}`);
      return false;
    }

    seen.add(key);
    return true;
  });
};

/**
 * Force refresh events (clears cache)
 */
const refreshEvents = async (userLocation = null) => {
  try {
    await AsyncStorage.removeItem("allEvents");
    await EventbriteService.clearCache();
    console.log("Event cache cleared, fetching fresh data...");
    return await fetchEvents(userLocation);
  } catch (error) {
    console.error("Error refreshing events:", error);
    return [];
  }
};

export default fetchEvents;
export { refreshEvents };
