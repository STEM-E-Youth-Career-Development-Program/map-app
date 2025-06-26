import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchEvents, { refreshEvents } from "./data";
import EventbriteService from "./eventbriteService";
import * as Location from "expo-location";

class BackgroundSyncManager {
  constructor() {
    this.syncInterval = null;
    this.isInitialized = false;
    this.lastSyncTime = null;
    this.syncFrequency = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  }

  /**
   * Initialize the background sync manager
   */
  async initialize() {
    if (this.isInitialized) {
      console.log("Background sync manager already initialized");
      return;
    }

    try {
      // Check last sync time
      const lastSync = await AsyncStorage.getItem("lastSyncTime");
      if (lastSync) {
        this.lastSyncTime = parseInt(lastSync);
      }

      // Start periodic sync
      this.startPeriodicSync();
      this.isInitialized = true;

      console.log("Background sync manager initialized");
    } catch (error) {
      console.error("Error initializing background sync manager:", error);
    }
  }

  /**
   * Start periodic synchronization
   */
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Check if sync is needed immediately
    this.checkAndSync();

    // Set up periodic sync every 6 hours
    this.syncInterval = setInterval(() => {
      this.checkAndSync();
    }, this.syncFrequency);

    console.log("Periodic sync started (every 6 hours)");
  }

  /**
   * Stop periodic synchronization
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log("Periodic sync stopped");
    }
  }

  /**
   * Check if sync is needed and perform it
   */
  async checkAndSync() {
    try {
      const now = Date.now();

      // Check if enough time has passed since last sync
      if (this.lastSyncTime && now - this.lastSyncTime < this.syncFrequency) {
        console.log("Sync not needed yet");
        return;
      }

      console.log("Starting background sync...");
      await this.performSync();

      // Update last sync time
      this.lastSyncTime = now;
      await AsyncStorage.setItem("lastSyncTime", now.toString());

      console.log("Background sync completed successfully");
    } catch (error) {
      console.error("Error during background sync:", error);
    }
  }

  /**
   * Perform the actual synchronization
   */
  async performSync() {
    try {
      // Get current location for Eventbrite sync
      let location = null;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          location = currentLocation.coords;
        }
      } catch (locationError) {
        console.log("Could not get location for sync:", locationError);

        // Try to get cached location
        try {
          const cachedLocation = await AsyncStorage.getItem("userLocation");
          if (cachedLocation) {
            const parsedLocation = JSON.parse(cachedLocation);
            location = parsedLocation.coords;
            console.log("Using cached location for sync");
          }
        } catch (cacheError) {
          console.log("No cached location available");
        }
      }

      // Perform sync with available location
      const events = await fetchEvents(location);
      console.log(`Background sync fetched ${events.length} total events`);

      // Optional: Preload event details for popular events
      await this.preloadPopularEvents(events);
    } catch (error) {
      console.error("Error performing sync:", error);
      throw error;
    }
  }

  /**
   * Preload details for popular/nearby events
   */
  async preloadPopularEvents(events) {
    try {
      // Get top 5 most recent active events
      const recentEvents = events
        .filter((event) => event.eventStatus === "Active")
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      console.log(
        `Preloading details for ${recentEvents.length} popular events`
      );

      // Preload Eventbrite event details if any
      for (const event of recentEvents) {
        if (event.source === "Eventbrite") {
          try {
            await EventbriteService.getEventDetails(event.id);
          } catch (error) {
            console.log(`Could not preload event ${event.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.log("Error preloading popular events:", error);
    }
  }

  /**
   * Force an immediate sync
   */
  async forcSync() {
    try {
      console.log("Forcing immediate sync...");
      await this.performSync();

      this.lastSyncTime = Date.now();
      await AsyncStorage.setItem("lastSyncTime", this.lastSyncTime.toString());

      console.log("Force sync completed");
      return true;
    } catch (error) {
      console.error("Error during force sync:", error);
      return false;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    try {
      const lastSync = await AsyncStorage.getItem("lastSyncTime");
      const now = Date.now();

      return {
        lastSyncTime: lastSync ? new Date(parseInt(lastSync)) : null,
        nextSyncTime: lastSync
          ? new Date(parseInt(lastSync) + this.syncFrequency)
          : new Date(now + this.syncFrequency),
        isOverdue: lastSync
          ? now - parseInt(lastSync) > this.syncFrequency
          : true,
        isInitialized: this.isInitialized,
      };
    } catch (error) {
      console.error("Error getting sync status:", error);
      return null;
    }
  }

  /**
   * Clear all sync data (useful for testing)
   */
  async clearSyncData() {
    try {
      await AsyncStorage.removeItem("lastSyncTime");
      await AsyncStorage.removeItem("allEvents");
      await EventbriteService.clearCache();

      this.lastSyncTime = null;
      console.log("Sync data cleared");
    } catch (error) {
      console.error("Error clearing sync data:", error);
    }
  }

  /**
   * Cleanup when app is closing
   */
  cleanup() {
    this.stopPeriodicSync();
    this.isInitialized = false;
    console.log("Background sync manager cleaned up");
  }
}

export default new BackgroundSyncManager();
