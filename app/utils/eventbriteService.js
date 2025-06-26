import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EVENTBRITE_PUBLIC_TOKEN,
  ENABLE_EVENTBRITE_INTEGRATION,
  EVENTBRITE_CACHE_DURATION,
} from "@env";

// STEM keywords for filtering events
const STEM_KEYWORDS = [
  "science",
  "technology",
  "engineering",
  "math",
  "mathematics",
  "stem",
  "steam",
  "coding",
  "programming",
  "robotics",
  "ai",
  "artificial intelligence",
  "machine learning",
  "data science",
  "computer science",
  "biology",
  "chemistry",
  "physics",
  "astronomy",
  "geology",
  "biotech",
  "nanotech",
  "laboratory",
  "research",
  "innovation",
  "biotechnology",
  "cybersecurity",
  "blockchain",
  "quantum",
  "space",
  "aerospace",
  "environmental science",
  "medical",
  "healthcare technology",
  "bioinformatics",
  "statistics",
  "analytics",
];

// Eventbrite API base URL
const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";

class EventbriteService {
  constructor() {
    this.token = EVENTBRITE_PUBLIC_TOKEN;
    this.isEnabled = ENABLE_EVENTBRITE_INTEGRATION === "true";
    this.cacheDuration = parseInt(EVENTBRITE_CACHE_DURATION) || 21600000; // 6 hours
  }

  /**
   * Check if Eventbrite integration is enabled
   */
  isIntegrationEnabled() {
    return this.isEnabled && this.token;
  }

  /**
   * Get cached Eventbrite events
   */
  async getCachedEvents() {
    try {
      const cached = await AsyncStorage.getItem("eventbrite_events");
      if (cached) {
        const { events, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < this.cacheDuration) {
          console.log("Returning cached Eventbrite events");
          return events;
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting cached Eventbrite events:", error);
      return null;
    }
  }

  /**
   * Cache Eventbrite events
   */
  async cacheEvents(events) {
    try {
      const cacheData = {
        events,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        "eventbrite_events",
        JSON.stringify(cacheData)
      );
      console.log(`Cached ${events.length} Eventbrite events`);
    } catch (error) {
      console.error("Error caching Eventbrite events:", error);
    }
  }

  /**
   * Check if event title/description contains STEM keywords
   */
  isSTEMEvent(eventTitle, eventDescription = "") {
    const searchText = `${eventTitle} ${eventDescription}`.toLowerCase();
    return STEM_KEYWORDS.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Categorize event by STEM subject
   */
  categorizeSTEMSubject(eventTitle, eventDescription = "") {
    const searchText = `${eventTitle} ${eventDescription}`.toLowerCase();

    if (searchText.match(/biology|biotech|medical|healthcare|life science/i))
      return "Biology";
    if (searchText.match(/chemistry|chemical/i)) return "Chemistry";
    if (searchText.match(/physics|quantum/i)) return "Physics";
    if (searchText.match(/math|mathematics|statistics/i)) return "Mathematics";
    if (searchText.match(/engineering|robotics/i)) return "Engineering";
    if (
      searchText.match(
        /computer|programming|coding|software|ai|machine learning|data science/i
      )
    )
      return "Technology";
    if (searchText.match(/astronomy|space|aerospace/i)) return "Astronomy";
    if (searchText.match(/geology|earth science|environmental/i))
      return "Earth Science";

    return "General STEM";
  }

  /**
   * Estimate grade level from event description
   */
  estimateGradeLevel(eventTitle, eventDescription = "") {
    const searchText = `${eventTitle} ${eventDescription}`.toLowerCase();

    if (searchText.match(/elementary|grade [1-5]|ages 5-10|kids|children/i))
      return "Elementary";
    if (searchText.match(/middle school|grade [6-8]|ages 11-13/i))
      return "Middle School";
    if (searchText.match(/high school|grade [9-12]|ages 14-17|teen/i))
      return "High School";
    if (
      searchText.match(
        /college|university|undergraduate|graduate|adult|professional/i
      )
    )
      return "College+";

    return "All Ages";
  }

  /**
   * Extract cost information
   */
  extractCost(event) {
    if (event.is_free) return "Free";

    // Try to get ticket prices
    if (
      event.ticket_availability &&
      event.ticket_availability.minimum_ticket_price
    ) {
      const price = event.ticket_availability.minimum_ticket_price.major_value;
      const currency = event.ticket_availability.minimum_ticket_price.currency;
      return `${currency} ${price}`;
    }

    return "Contact for pricing";
  }

  /**
   * Convert Eventbrite event to our app format
   */
  convertEventbriteEvent(event) {
    const venue = event.venue || {};
    const address = venue.address || {};

    return {
      id: `eb_${event.id}`,
      eventName: event.name.text,
      eventDescription: event.description?.text || "",
      eventLocation:
        venue.name || address.localized_address_display || "Online",
      eventDate: new Date(event.start.local).toLocaleDateString(),
      eventTime: `${new Date(
        event.start.local
      ).toLocaleTimeString()} - ${new Date(
        event.end.local
      ).toLocaleTimeString()}`,
      eventSubject: [
        this.categorizeSTEMSubject(event.name.text, event.description?.text),
      ],
      subject: [
        this.categorizeSTEMSubject(event.name.text, event.description?.text),
      ],
      eventType: event.online_event ? "Virtual" : "Onsite",
      eventCost: this.extractCost(event),
      cost: this.extractCost(event),
      gradeLevel: this.estimateGradeLevel(
        event.name.text,
        event.description?.text
      ),
      ageGroup: this.estimateGradeLevel(
        event.name.text,
        event.description?.text
      ),
      latitude: venue.latitude ? parseFloat(venue.latitude) : null,
      longitude: venue.longitude ? parseFloat(venue.longitude) : null,
      eventStatus: event.status === "live" ? "Active" : "Inactive",
      eventUrl: event.url,
      eventImage: event.logo?.url || null,
      source: "Eventbrite",
      sourceTag: "EB",
      createdAt: new Date(event.created).toISOString(),
      updatedAt: new Date(event.changed).toISOString(),
      organizerName: event.organizer?.name || "Unknown",
      capacity: event.capacity || null,
      eligibility: "all",
      mealIncluded: "unknown",
    };
  }

  /**
   * Search for STEM events near a location
   */
  async searchEvents(latitude, longitude, radiusKm = 100) {
    if (!this.isIntegrationEnabled()) {
      console.log("Eventbrite integration is disabled");
      return [];
    }

    try {
      // Check cache first
      const cachedEvents = await this.getCachedEvents();
      if (cachedEvents) {
        return cachedEvents;
      }

      console.log("Fetching new events from Eventbrite API...");

      // Convert radius from km to miles (Eventbrite uses miles)
      const radiusMiles = radiusKm * 0.621371;

      // Build search query with STEM keywords
      const stemQuery = STEM_KEYWORDS.slice(0, 10).join(" OR "); // Use first 10 keywords to avoid URL length issues

      const searchParams = new URLSearchParams({
        "location.latitude": latitude.toString(),
        "location.longitude": longitude.toString(),
        "location.within": `${radiusMiles}mi`,
        q: stemQuery,
        sort_by: "date",
        expand: "venue,organizer,ticket_availability",
        time_filter: "current_future",
        page_size: "50", // Maximum allowed by Eventbrite
      });

      const response = await fetch(
        `${EVENTBRITE_API_BASE}/events/search/?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Eventbrite API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        `Found ${
          data.events?.length || 0
        } potential STEM events from Eventbrite`
      );

      if (!data.events || data.events.length === 0) {
        return [];
      }

      // Filter for STEM events and convert to our format
      const stemEvents = data.events
        .filter((event) =>
          this.isSTEMEvent(event.name.text, event.description?.text)
        )
        .map((event) => this.convertEventbriteEvent(event))
        .filter((event) => event.latitude && event.longitude); // Only include events with valid coordinates

      console.log(
        `Filtered to ${stemEvents.length} STEM events from Eventbrite`
      );

      // Cache the results
      await this.cacheEvents(stemEvents);

      return stemEvents;
    } catch (error) {
      console.error("Error fetching Eventbrite events:", error);

      // Try to return cached events as fallback
      const cachedEvents = await AsyncStorage.getItem("eventbrite_events");
      if (cachedEvents) {
        const { events } = JSON.parse(cachedEvents);
        console.log("Returning cached events as fallback");
        return events;
      }

      return [];
    }
  }

  /**
   * Get event details by ID
   */
  async getEventDetails(eventId) {
    if (!this.isIntegrationEnabled()) {
      return null;
    }

    try {
      // Remove 'eb_' prefix if present
      const cleanId = eventId.startsWith("eb_")
        ? eventId.substring(3)
        : eventId;

      const response = await fetch(
        `${EVENTBRITE_API_BASE}/events/${cleanId}/?expand=venue,organizer,ticket_availability`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status}`);
      }

      const event = await response.json();
      return this.convertEventbriteEvent(event);
    } catch (error) {
      console.error("Error fetching Eventbrite event details:", error);
      return null;
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  async clearCache() {
    try {
      await AsyncStorage.removeItem("eventbrite_events");
      console.log("Eventbrite cache cleared");
    } catch (error) {
      console.error("Error clearing Eventbrite cache:", error);
    }
  }
}

export default new EventbriteService();
