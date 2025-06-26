import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PageHeader from "./PageHeader";
import Screen from "./Screen";
import { getEventbriteEvents } from "../utils/eventbriteApi";
import eventSyncManager from "../utils/eventSyncManager";

const SettingsModal = ({ navigation }) => {
  const [eventbriteEnabled, setEventbriteEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const eventbriteEnabledValue = await AsyncStorage.getItem(
        "eventbriteEnabled"
      );
      const autoRefreshValue = await AsyncStorage.getItem("autoRefreshEnabled");
      const lastSyncValue = await AsyncStorage.getItem("lastEventbriteSync");

      setEventbriteEnabled(eventbriteEnabledValue !== "false"); // Default to true
      setAutoRefreshEnabled(autoRefreshValue !== "false"); // Default to true

      if (lastSyncValue) {
        setLastSync(new Date(parseInt(lastSyncValue)));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleEventbriteToggle = async (value) => {
    setEventbriteEnabled(value);
    await saveSettings("eventbriteEnabled", value);

    if (!value) {
      // Clear Eventbrite cache when disabled
      await AsyncStorage.removeItem("eventbriteEvents");
      // Update sync manager
      await eventSyncManager.updateSettings();
      Alert.alert(
        "Eventbrite Disabled",
        "Eventbrite events have been disabled and cached data cleared. Restart the app to see changes.",
        [{ text: "OK" }]
      );
    } else {
      // Update sync manager
      await eventSyncManager.updateSettings();
      Alert.alert(
        "Eventbrite Enabled",
        "Eventbrite events will be included in your search results. The app will automatically fetch new events.",
        [{ text: "OK" }]
      );
    }
  };

  const handleAutoRefreshToggle = async (value) => {
    setAutoRefreshEnabled(value);
    await saveSettings("autoRefreshEnabled", value);

    // Update the sync manager settings
    await eventSyncManager.updateSettings();
  };

  const handleManualSync = async () => {
    if (!eventbriteEnabled) {
      Alert.alert(
        "Eventbrite Disabled",
        "Please enable Eventbrite integration first."
      );
      return;
    }

    setIsLoading(true);
    try {
      // Use the sync manager for manual sync
      await eventSyncManager.syncNow();
      const now = Date.now();
      setLastSync(new Date(now));

      Alert.alert(
        "Sync Complete",
        "Successfully synced Eventbrite events. Pull down to refresh the event list to see new events.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error syncing events:", error);
      Alert.alert(
        "Sync Failed",
        "Failed to sync Eventbrite events. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllCache = async () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached event data and force a fresh download. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(["allEvents", "eventbriteEvents"]);
              Alert.alert(
                "Cache Cleared",
                "All cached data has been cleared. Pull down to refresh the event list."
              );
            } catch (error) {
              console.error("Error clearing cache:", error);
              Alert.alert("Error", "Failed to clear cache.");
            }
          },
        },
      ]
    );
  };

  const formatLastSync = (date) => {
    if (!date) return "Never";

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  return (
    <Screen>
      <PageHeader title="Event Settings" navigation={navigation} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Eventbrite Integration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventbrite Integration</Text>
          <Text style={styles.sectionDescription}>
            Automatically include relevant STEM events from Eventbrite in your
            search results.
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons
                name="calendar-plus"
                size={24}
                color="#2196F3"
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  Enable Eventbrite Events
                </Text>
                <Text style={styles.settingSubtitle}>
                  Include STEM events from Eventbrite
                </Text>
              </View>
            </View>
            <Switch
              value={eventbriteEnabled}
              onValueChange={handleEventbriteToggle}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={eventbriteEnabled ? "#2196F3" : "#f4f3f4"}
            />
          </View>

          {eventbriteEnabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <MaterialCommunityIcons
                    name="refresh-auto"
                    size={24}
                    color="#4CAF50"
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Auto Refresh</Text>
                    <Text style={styles.settingSubtitle}>
                      Automatically sync new events
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoRefreshEnabled}
                  onValueChange={handleAutoRefreshToggle}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={autoRefreshEnabled ? "#4CAF50" : "#f4f3f4"}
                />
              </View>

              <View style={styles.syncSection}>
                <View style={styles.syncInfo}>
                  <Text style={styles.syncLabel}>
                    Last sync: {formatLastSync(lastSync)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.syncButton,
                    isLoading && styles.syncButtonDisabled,
                  ]}
                  onPress={handleManualSync}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons
                      name="sync"
                      size={20}
                      color="#fff"
                    />
                  )}
                  <Text style={styles.syncButtonText}>
                    {isLoading ? "Syncing..." : "Sync Now"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Cache Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cache Management</Text>
          <Text style={styles.sectionDescription}>
            Manage cached event data to free up storage or force fresh
            downloads.
          </Text>

          <TouchableOpacity style={styles.dangerButton} onPress={clearAllCache}>
            <MaterialCommunityIcons
              name="delete-sweep"
              size={24}
              color="#fff"
            />
            <Text style={styles.dangerButtonText}>Clear All Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information" size={20} color="#666" />
            <Text style={styles.infoText}>
              Eventbrite events are cached for 6 hours to improve performance
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={20}
              color="#666"
            />
            <Text style={styles.infoText}>
              Events are filtered by location within 100km of your current
              position
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="filter" size={20} color="#666" />
            <Text style={styles.infoText}>
              Only STEM-related events are included from Eventbrite
            </Text>
          </View>
        </View>

        {/* Debug Section - Only show in development */}
        {__DEV__ && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer Tools</Text>

            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => navigation.navigate("EventbriteTest")}
            >
              <MaterialCommunityIcons name="test-tube" size={24} color="#fff" />
              <Text style={styles.debugButtonText}>
                Test Eventbrite Integration
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  syncSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  syncInfo: {
    marginBottom: 12,
  },
  syncLabel: {
    fontSize: 14,
    color: "#666",
  },
  syncButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    backgroundColor: "#ccc",
  },
  syncButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  debugButton: {
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  debugButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default SettingsModal;
