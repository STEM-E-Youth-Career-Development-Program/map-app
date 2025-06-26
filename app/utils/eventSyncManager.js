import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { getEventbriteEvents } from "./eventbriteApi";
import Logger from "./logger";

class EventSyncManager {
  constructor() {
    this.syncInterval = null;
    this.lastSyncTime = 0;
    this.isActive = false;
    this.syncInProgress = false;

    // Sync every 6 hours
    this.SYNC_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

    // Minimum time between syncs (30 minutes)
    this.MIN_SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

    this.init();
  }

  async init() {
    try {
      // Load last sync time from storage
      const lastSync = await AsyncStorage.getItem("lastEventbriteSync");
      if (lastSync) {
        this.lastSyncTime = parseInt(lastSync);
      }

      // Set up app state listener
      this.appStateListener = AppState.addEventListener(
        "change",
        this.handleAppStateChange.bind(this)
      );

      // Start auto sync if enabled
      this.startAutoSync();

      Logger.info("EventSyncManager initialized");
    } catch (error) {
      Logger.error("Error initializing EventSyncManager:", error);
    }
  }

  async startAutoSync() {
    try {
      const autoRefreshEnabled = await AsyncStorage.getItem(
        "autoRefreshEnabled"
      );
      const eventbriteEnabled = await AsyncStorage.getItem("eventbriteEnabled");

      if (autoRefreshEnabled !== "false" && eventbriteEnabled !== "false") {
        this.isActive = true;
        this.scheduleNextSync();
        Logger.info("Auto sync enabled");
      } else {
        this.stopAutoSync();
        Logger.info("Auto sync disabled");
      }
    } catch (error) {
      Logger.error("Error starting auto sync:", error);
    }
  }

  stopAutoSync() {
    this.isActive = false;
    if (this.syncInterval) {
      clearTimeout(this.syncInterval);
      this.syncInterval = null;
    }
    Logger.info("Auto sync stopped");
  }

  scheduleNextSync() {
    if (!this.isActive) return;

    const now = Date.now();
    const timeSinceLastSync = now - this.lastSyncTime;
    const timeUntilNextSync = Math.max(
      0,
      this.SYNC_INTERVAL - timeSinceLastSync
    );

    if (this.syncInterval) {
      clearTimeout(this.syncInterval);
    }

    this.syncInterval = setTimeout(() => {
      this.performSync();
    }, timeUntilNextSync);

    Logger.info(
      `Next sync scheduled in ${Math.round(
        timeUntilNextSync / (1000 * 60)
      )} minutes`
    );
  }

  async performSync(force = false) {
    if (this.syncInProgress && !force) {
      Logger.info("Sync already in progress, skipping");
      return;
    }

    try {
      const eventbriteEnabled = await AsyncStorage.getItem("eventbriteEnabled");
      if (eventbriteEnabled === "false") {
        Logger.info("Eventbrite disabled, skipping sync");
        return;
      }

      const now = Date.now();

      // Check if enough time has passed since last sync (unless forced)
      if (!force && now - this.lastSyncTime < this.MIN_SYNC_INTERVAL) {
        Logger.info("Too soon since last sync, skipping");
        this.scheduleNextSync();
        return;
      }

      this.syncInProgress = true;
      Logger.info("Starting Eventbrite sync...");

      // Perform the actual sync
      const events = await getEventbriteEvents(true); // Force refresh

      // Update last sync time
      this.lastSyncTime = now;
      await AsyncStorage.setItem("lastEventbriteSync", now.toString());

      Logger.info(`Sync completed: ${events.length} Eventbrite events cached`);

      // Schedule next sync
      this.scheduleNextSync();

      // Notify listeners about sync completion
      this.notifySyncComplete(events.length);
    } catch (error) {
      Logger.error("Error during sync:", error);

      // Retry in 15 minutes on error
      if (this.isActive) {
        this.syncInterval = setTimeout(() => {
          this.performSync();
        }, 15 * 60 * 1000); // 15 minutes
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === "active") {
      // App became active, check if we need to sync
      const now = Date.now();
      const timeSinceLastSync = now - this.lastSyncTime;

      // If it's been more than 2 hours since last sync, perform one
      if (timeSinceLastSync > 2 * 60 * 60 * 1000) {
        Logger.info("App became active, checking for sync...");
        this.performSync();
      }

      // Restart auto sync if it was stopped
      this.startAutoSync();
    } else if (nextAppState === "background" || nextAppState === "inactive") {
      // App going to background, can continue syncing but with less frequency
      Logger.info("App going to background");
    }
  }

  notifySyncComplete(eventCount) {
    // This could be used to notify components about sync completion
    // For now, we'll just log it
    Logger.info(`Sync notification: ${eventCount} events synced`);
  }

  // Manual sync method that can be called from UI
  async syncNow() {
    Logger.info("Manual sync requested");
    return this.performSync(true);
  }

  // Method to update settings and restart sync if needed
  async updateSettings() {
    Logger.info("Settings updated, restarting sync manager");
    this.stopAutoSync();
    await this.startAutoSync();
  }

  // Cleanup method
  destroy() {
    this.stopAutoSync();
    if (this.appStateListener) {
      this.appStateListener.remove();
    }
    Logger.info("EventSyncManager destroyed");
  }
}

// Create a singleton instance
const eventSyncManager = new EventSyncManager();

export default eventSyncManager;

// Export methods for easy access
export const { syncNow, updateSettings, startAutoSync, stopAutoSync } =
  eventSyncManager;
