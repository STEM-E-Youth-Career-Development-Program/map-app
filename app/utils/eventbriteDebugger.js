import EventbriteService from "./eventbriteService";
import fetchEvents, { refreshEvents } from "./data";
import BackgroundSyncManager from "./backgroundSyncManager";

/**
 * Debug utility for testing Eventbrite integration
 */
class EventbriteDebugger {
  /**
   * Test basic Eventbrite integration
   */
  async testBasicIntegration() {
    console.log("=== Testing Basic Eventbrite Integration ===");

    try {
      // Test if integration is enabled
      const isEnabled = EventbriteService.isIntegrationEnabled();
      console.log("Integration enabled:", isEnabled);

      if (!isEnabled) {
        console.log(
          "Eventbrite integration is disabled. Check your environment variables."
        );
        return false;
      }

      // Test with Houston coordinates
      const testLat = 29.7604;
      const testLon = -95.3698;

      console.log(`Testing with coordinates: ${testLat}, ${testLon}`);

      const events = await EventbriteService.searchEvents(
        testLat,
        testLon,
        100
      );
      console.log(`Found ${events.length} Eventbrite events`);

      if (events.length > 0) {
        console.log("Sample event:", {
          name: events[0].eventName,
          location: events[0].eventLocation,
          source: events[0].source,
          subject: events[0].subject,
        });
      }

      return true;
    } catch (error) {
      console.error("Error testing basic integration:", error);
      return false;
    }
  }

  /**
   * Test combined data fetching
   */
  async testCombinedDataFetch() {
    console.log("=== Testing Combined Data Fetch ===");

    try {
      const testLat = 29.7604;
      const testLon = -95.3698;
      const location = { latitude: testLat, longitude: testLon };

      const allEvents = await fetchEvents(location);
      console.log(`Total events fetched: ${allEvents.length}`);

      const eventbritePevents = allEvents.filter(
        (event) => event.source === "Eventbrite"
      );
      const mapStemEvents = allEvents.filter(
        (event) => event.source !== "Eventbrite"
      );

      console.log(`Eventbrite events: ${eventbritePevents.length}`);
      console.log(`MapSTEM events: ${mapStemEvents.length}`);

      return {
        total: allEvents.length,
        eventbrite: eventbritePevents.length,
        mapStem: mapStemEvents.length,
      };
    } catch (error) {
      console.error("Error testing combined data fetch:", error);
      return null;
    }
  }

  /**
   * Test cache functionality
   */
  async testCaching() {
    console.log("=== Testing Cache Functionality ===");

    try {
      // Clear cache first
      await EventbriteService.clearCache();
      console.log("Cache cleared");

      const testLat = 29.7604;
      const testLon = -95.3698;

      // First fetch (should be fresh)
      console.log("First fetch...");
      const start1 = Date.now();
      const events1 = await EventbriteService.searchEvents(
        testLat,
        testLon,
        50
      );
      const time1 = Date.now() - start1;
      console.log(`First fetch: ${events1.length} events in ${time1}ms`);

      // Second fetch (should be cached)
      console.log("Second fetch...");
      const start2 = Date.now();
      const events2 = await EventbriteService.searchEvents(
        testLat,
        testLon,
        50
      );
      const time2 = Date.now() - start2;
      console.log(`Second fetch: ${events2.length} events in ${time2}ms`);

      console.log(`Cache speedup: ${Math.round(time1 / time2)}x faster`);

      return { firstFetch: time1, secondFetch: time2, speedup: time1 / time2 };
    } catch (error) {
      console.error("Error testing cache:", error);
      return null;
    }
  }

  /**
   * Test background sync manager
   */
  async testBackgroundSync() {
    console.log("=== Testing Background Sync Manager ===");

    try {
      await BackgroundSyncManager.initialize();

      const status = await BackgroundSyncManager.getSyncStatus();
      console.log("Sync status:", status);

      // Force a sync
      console.log("Forcing sync...");
      const success = await BackgroundSyncManager.forcSync();
      console.log("Force sync successful:", success);

      return success;
    } catch (error) {
      console.error("Error testing background sync:", error);
      return false;
    }
  }

  /**
   * Test STEM keyword filtering
   */
  async testSTEMFiltering() {
    console.log("=== Testing STEM Keyword Filtering ===");

    const testEvents = [
      {
        name: "Python Programming Workshop",
        description: "Learn coding with Python",
      },
      { name: "Art and Craft Session", description: "Creative arts for kids" },
      { name: "Robotics Competition", description: "Build and program robots" },
      { name: "Music Concert", description: "Classical music performance" },
      {
        name: "Data Science Bootcamp",
        description: "Learn machine learning and AI",
      },
    ];

    const stemEvents = testEvents.filter((event) =>
      EventbriteService.isSTEMEvent(event.name, event.description)
    );

    console.log("Test events:", testEvents.length);
    console.log("STEM events identified:", stemEvents.length);
    console.log(
      "STEM events:",
      stemEvents.map((e) => e.name)
    );

    return stemEvents.length === 3; // Should identify 3 STEM events
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting Eventbrite Integration Tests");
    console.log("=====================================");

    const results = {};

    results.basicIntegration = await this.testBasicIntegration();
    results.combinedDataFetch = await this.testCombinedDataFetch();
    results.caching = await this.testCaching();
    results.backgroundSync = await this.testBackgroundSync();
    results.stemFiltering = await this.testSTEMFiltering();

    console.log("=====================================");
    console.log("🏁 Test Results Summary:");
    console.log(
      "Basic Integration:",
      results.basicIntegration ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "Combined Data Fetch:",
      results.combinedDataFetch ? "✅ PASS" : "❌ FAIL"
    );
    console.log("Caching:", results.caching ? "✅ PASS" : "❌ FAIL");
    console.log(
      "Background Sync:",
      results.backgroundSync ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "STEM Filtering:",
      results.stemFiltering ? "✅ PASS" : "❌ FAIL"
    );

    const passCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n📊 Overall: ${passCount}/${totalTests} tests passed`);

    return results;
  }
}

export default new EventbriteDebugger();
