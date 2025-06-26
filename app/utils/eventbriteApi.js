import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  EVENTBRITE_API_KEY,
  EVENTBRITE_PRIVATE_TOKEN,
  ENABLE_EVENTBRITE_INTEGRATION,
  EVENTBRITE_CACHE_DURATION,
} from "@env";

// Eventbrite API Configuration
const EVENTBRITE_BASE_URL = "https://www.eventbriteapi.com/v3";

// Default values if env vars are not set
const API_KEY = EVENTBRITE_API_KEY;
const PRIVATE_TOKEN = EVENTBRITE_PRIVATE_TOKEN;
const INTEGRATION_ENABLED = ENABLE_EVENTBRITE_INTEGRATION === "true";
const CACHE_DURATION = parseInt(EVENTBRITE_CACHE_DURATION) || 21600000; // 6 hours default

// STEM-related categories and keywords for filtering
const STEM_KEYWORDS = [
  "science",
  "technology",
  "engineering",
  "math",
  "mathematics",
  "STEM",
  "STEAM",
  "coding",
  "programming",
  "robotics",
  "AI",
  "artificial intelligence",
  "machine learning",
  "data science",
  "computer science",
  "software",
  "hardware",
  "electronics",
  "biotech",
  "biotechnology",
  "chemistry",
  "physics",
  "biology",
  "astronomy",
  "geology",
  "environmental science",
  "medical",
  "healthcare",
  "research",
  "innovation",
  "startup",
  "entrepreneurship",
  "maker",
  "hackathon",
  "workshop",
];

const STEM_CATEGORIES = [
  "102", // Science & Technology
  "103", // Music
  "113", // Community & Culture
  "115", // Education
  "199", // Other
];

/**
 * Fetch STEM events from Eventbrite API
 * @param {Object} options - Search options
 * @param {string} options.location - Location query (e.g., "Austin, TX")
 * @param {number} options.radius - Search radius in kilometers (default: 50)
 * @param {number} options.limit - Maximum number of events to fetch (default: 50)
 * @returns {Array} Array of formatted events
 */
const fetchEventbriteEvents = async (options = {}) => {
  try {
    const {
      location = null,
      radius = 50,
      limit = 50,
      startDate = new Date().toISOString(),
      endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    } = options;

    let searchParams = new URLSearchParams({
      token: PRIVATE_TOKEN,
      expand: "venue,organizer,category,subcategory,format,ticket_availability",
      order_by: "start_asc",
      "start_date.range_start": startDate,
      "start_date.range_end": endDate,
      page_size: limit.toString(),
      status: "live",
    });

    // Add location-based search if coordinates are provided
    if (location && location.latitude && location.longitude) {
      searchParams.append("location.latitude", location.latitude.toString());
      searchParams.append("location.longitude", location.longitude.toString());
      searchParams.append("location.within", `${radius}km`);
    }

    // Search for events with STEM keywords
    const stemKeywordsQuery = STEM_KEYWORDS.slice(0, 10).join(" OR ");
    searchParams.append("q", stemKeywordsQuery);

    const url = `${EVENTBRITE_BASE_URL}/events/search/?${searchParams.toString()}`;

    console.log("Fetching Eventbrite events from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PRIVATE_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Eventbrite API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Found ${data.events?.length || 0} Eventbrite events`);

    if (!data.events || data.events.length === 0) {
      return [];
    }

    // Filter and format events
    const stemEvents = data.events
      .filter((event) => isSTEMEvent(event))
      .map((event) => formatEventbriteEvent(event));

    return stemEvents;
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error);
    return [];
  }
};

/**
 * Check if an event is STEM-related
 * @param {Object} event - Eventbrite event object
 * @returns {boolean} True if event is STEM-related
 */
const isSTEMEvent = (event) => {
  const title = event.name?.text?.toLowerCase() || "";
  const description = event.description?.text?.toLowerCase() || "";
  const categoryName = event.category?.name?.toLowerCase() || "";
  const subcategoryName = event.subcategory?.name?.toLowerCase() || "";

  const searchText = `${title} ${description} ${categoryName} ${subcategoryName}`;

  return STEM_KEYWORDS.some((keyword) =>
    searchText.includes(keyword.toLowerCase())
  );
};

/**
 * Format Eventbrite event to match your app's event structure
 * @param {Object} eventbriteEvent - Raw Eventbrite event
 * @returns {Object} Formatted event object
 */
const formatEventbriteEvent = (eventbriteEvent) => {
  const startDate = new Date(
    eventbriteEvent.start?.utc || eventbriteEvent.start?.local
  );
  const endDate = new Date(
    eventbriteEvent.end?.utc || eventbriteEvent.end?.local
  );

  // Extract location data
  const venue = eventbriteEvent.venue;
  const latitude = venue?.latitude ? parseFloat(venue.latitude) : null;
  const longitude = venue?.longitude ? parseFloat(venue.longitude) : null;

  // Determine event location string
  const locationParts = [];
  if (venue?.name) locationParts.push(venue.name);
  if (venue?.address?.city) locationParts.push(venue.address.city);
  if (venue?.address?.region) locationParts.push(venue.address.region);
  const locationString = locationParts.join(", ") || "Online Event";

  // Determine if event is virtual or onsite
  const isOnline =
    eventbriteEvent.online_event ||
    !latitude ||
    !longitude ||
    eventbriteEvent.name?.text?.toLowerCase().includes("virtual") ||
    eventbriteEvent.name?.text?.toLowerCase().includes("online");

  // Extract cost information
  let cost = 0;
  if (
    eventbriteEvent.ticket_availability?.has_available_tickets &&
    eventbriteEvent.ticket_availability?.minimum_ticket_price
  ) {
    cost =
      parseFloat(
        eventbriteEvent.ticket_availability.minimum_ticket_price.major_value
      ) || 0;
  }

  // Determine STEM subject
  const subject = determineSTEMSubject(eventbriteEvent);

  // Determine grade level and age group
  const { gradeLevel, ageGroup } = determineGradeLevelAndAge(eventbriteEvent);

  return {
    // Use negative ID to distinguish from your API events
    id: -Math.abs(
      eventbriteEvent.id
        ? parseInt(eventbriteEvent.id)
        : Math.random() * 1000000
    ),
    eventName: eventbriteEvent.name?.text || "Untitled Event",
    description:
      eventbriteEvent.description?.text ||
      eventbriteEvent.summary ||
      "No description available",
    latitude: latitude,
    longitude: longitude,
    location: locationString,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    cost: cost,
    subject: subject,
    gradeLevel: gradeLevel,
    ageGroup: ageGroup,
    active: true,
    eventType: isOnline ? "Virtual" : "Onsite",
    mealIncluded: "unknown",
    eligibility: "all",
    imageData: eventbriteEvent.logo?.url || null,

    // Additional Eventbrite-specific data
    source: "eventbrite",
    eventbriteId: eventbriteEvent.id,
    eventbriteUrl: eventbriteEvent.url,
    organizerName: eventbriteEvent.organizer?.name || "Unknown Organizer",
    category: eventbriteEvent.category?.name || "Other",
    subcategory: eventbriteEvent.subcategory?.name || "",
    capacity: eventbriteEvent.capacity || null,
    isPublic: eventbriteEvent.listed === true,

    // For debugging
    _raw: __DEV__ ? eventbriteEvent : undefined,
  };
};

/**
 * Determine STEM subject based on event content
 * @param {Object} event - Eventbrite event
 * @returns {Array} Array of STEM subjects
 */
const determineSTEMSubject = (event) => {
  const text = `${event.name?.text || ""} ${event.description?.text || ""} ${
    event.category?.name || ""
  }`.toLowerCase();

  const subjects = [];

  if (text.match(/science|biology|chemistry|physics|research|lab|experiment/)) {
    subjects.push("Science");
  }
  if (text.match(/technology|tech|software|hardware|computer|digital|IT/)) {
    subjects.push("Technology");
  }
  if (text.match(/engineering|engineer|robotics|automation|design|build/)) {
    subjects.push("Engineering");
  }
  if (text.match(/math|mathematics|statistics|data|analytics|algorithm/)) {
    subjects.push("Math");
  }
  if (text.match(/entrepreneur|startup|business|innovation|venture|funding/)) {
    subjects.push("Entrepreneurship");
  }

  return subjects.length > 0 ? subjects : ["Science"]; // Default to Science if none detected
};

/**
 * Determine grade level and age group from event details
 * @param {Object} event - Eventbrite event
 * @returns {Object} Object containing gradeLevel and ageGroup
 */
const determineGradeLevelAndAge = (event) => {
  const text = `${event.name?.text || ""} ${
    event.description?.text || ""
  }`.toLowerCase();

  let gradeLevel = "All Grades";
  let ageGroup = "All Ages";

  // Grade level detection
  if (
    text.match(
      /elementary|k-5|k-6|kindergarten|1st grade|2nd grade|3rd grade|4th grade|5th grade/
    )
  ) {
    gradeLevel = "Elementary";
    ageGroup = "5-11";
  } else if (text.match(/middle school|6th grade|7th grade|8th grade|6-8/)) {
    gradeLevel = "Middle School";
    ageGroup = "11-14";
  } else if (
    text.match(
      /high school|9th grade|10th grade|11th grade|12th grade|9-12|teenager/
    )
  ) {
    gradeLevel = "High School";
    ageGroup = "14-18";
  } else if (
    text.match(/college|university|undergraduate|graduate|adult|professional/)
  ) {
    gradeLevel = "College";
    ageGroup = "18+";
  }

  // Age-specific detection
  if (text.match(/kids?|children|youth|teen/)) {
    if (text.match(/\b[5-9]\b|\bten\b/)) ageGroup = "5-11";
    else if (text.match(/1[0-4]/)) ageGroup = "11-14";
    else if (text.match(/1[5-8]/)) ageGroup = "14-18";
  }

  return { gradeLevel, ageGroup };
};

/**
 * Get user's location for location-based event search
 * @returns {Object|null} Location coordinates or null
 */
const getUserLocation = async () => {
  try {
    const storedLocation = await AsyncStorage.getItem("location");
    if (storedLocation) {
      const locationData = JSON.parse(storedLocation);
      return locationData.coords;
    }

    // If no stored location, try to get current location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  } catch (error) {
    console.error("Error getting user location:", error);
    return null;
  }
};

/**
 * Fetch and cache Eventbrite events
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Array} Array of Eventbrite events
 */
const getEventbriteEvents = async (forceRefresh = false) => {
  try {
    // Check if Eventbrite integration is enabled
    if (!INTEGRATION_ENABLED) {
      console.log("Eventbrite integration is disabled");
      return [];
    }

    const cacheKey = "eventbriteEvents";
    const now = Date.now();

    if (!forceRefresh) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const { events, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_DURATION) {
          console.log("Returning cached Eventbrite events");
          return events;
        }
      }
    }

    console.log("Fetching fresh Eventbrite events...");
    const userLocation = await getUserLocation();

    const eventbriteEvents = await fetchEventbriteEvents({
      location: userLocation,
      radius: 100, // 100km radius
      limit: 100,
    });

    // Cache the events
    const cacheData = {
      events: eventbriteEvents,
      timestamp: now,
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`Cached ${eventbriteEvents.length} Eventbrite events`);

    return eventbriteEvents;
  } catch (error) {
    console.error("Error in getEventbriteEvents:", error);
    return [];
  }
};

/**
 * Combine your API events with Eventbrite events
 * @param {Array} apiEvents - Events from your API
 * @param {boolean} includeEventbrite - Whether to include Eventbrite events
 * @returns {Array} Combined events array
 */
const getCombinedEvents = async (apiEvents = [], includeEventbrite = true) => {
  try {
    if (!includeEventbrite) {
      return apiEvents;
    }

    const eventbriteEvents = await getEventbriteEvents();
    const combinedEvents = [...apiEvents, ...eventbriteEvents];

    // Remove duplicates based on event name and date
    const uniqueEvents = combinedEvents.filter((event, index, self) => {
      return (
        index ===
        self.findIndex(
          (e) =>
            e.eventName.toLowerCase() === event.eventName.toLowerCase() &&
            new Date(e.startDate).getTime() ===
              new Date(event.startDate).getTime()
        )
      );
    });

    console.log(
      `Combined ${apiEvents.length} API events with ${eventbriteEvents.length} Eventbrite events. Total unique: ${uniqueEvents.length}`
    );

    return uniqueEvents;
  } catch (error) {
    console.error("Error combining events:", error);
    return apiEvents; // Return original API events if error
  }
};

export {
  fetchEventbriteEvents,
  getEventbriteEvents,
  getCombinedEvents,
  isSTEMEvent,
  formatEventbriteEvent,
  STEM_KEYWORDS,
  STEM_CATEGORIES,
};

export default {
  fetchEventbriteEvents,
  getEventbriteEvents,
  getCombinedEvents,
  isSTEMEvent,
  formatEventbriteEvent,
};
