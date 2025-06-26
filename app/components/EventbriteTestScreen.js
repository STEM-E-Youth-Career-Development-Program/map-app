import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchEventbriteEvents,
  getEventbriteEvents,
} from "../utils/eventbriteApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EventbriteTestScreen = ({ navigation }) => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const endTime = Date.now();

      setTestResults((prev) => [
        ...prev,
        {
          name: testName,
          status: "success",
          duration: endTime - startTime,
          result: result,
          message: `Success - ${
            Array.isArray(result) ? result.length : "N/A"
          } events`,
        },
      ]);
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        {
          name: testName,
          status: "error",
          duration: 0,
          result: null,
          message: error.message,
        },
      ]);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Basic API connectivity
    await runTest("API Connectivity", async () => {
      const events = await fetchEventbriteEvents({
        location: { latitude: 30.2672, longitude: -97.7431 }, // Austin, TX
        radius: 50,
        limit: 10,
      });
      return events;
    });

    // Test 2: Location-based search
    await runTest("Location Search", async () => {
      const userLocation = await AsyncStorage.getItem("location");
      if (userLocation) {
        const coords = JSON.parse(userLocation).coords;
        const events = await fetchEventbriteEvents({
          location: coords,
          radius: 100,
          limit: 5,
        });
        return events;
      } else {
        throw new Error("No stored location found");
      }
    });

    // Test 3: Cached events
    await runTest("Cached Events", async () => {
      const events = await getEventbriteEvents(false); // Don't force refresh
      return events;
    });

    // Test 4: Fresh API call
    await runTest("Fresh API Call", async () => {
      const events = await getEventbriteEvents(true); // Force refresh
      return events;
    });

    setIsLoading(false);
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem("eventbriteEvents");
      Alert.alert("Success", "Eventbrite cache cleared");
    } catch (error) {
      Alert.alert("Error", "Failed to clear cache");
    }
  };

  const renderTestResult = (test, index) => {
    const iconName =
      test.status === "success" ? "check-circle" : "alert-circle";
    const iconColor = test.status === "success" ? "#4CAF50" : "#f44336";

    return (
      <View key={index} style={styles.testResult}>
        <View style={styles.testHeader}>
          <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
          <Text style={styles.testName}>{test.name}</Text>
          {test.duration > 0 && (
            <Text style={styles.testDuration}>{test.duration}ms</Text>
          )}
        </View>
        <Text style={[styles.testMessage, { color: iconColor }]}>
          {test.message}
        </Text>
        {test.result &&
          Array.isArray(test.result) &&
          test.result.length > 0 && (
            <Text style={styles.testDetails}>
              Sample event: {test.result[0].eventName}
            </Text>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Eventbrite Integration Test</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={runAllTests}
            disabled={isLoading}
          >
            <MaterialCommunityIcons
              name={isLoading ? "loading" : "play"}
              size={20}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {isLoading ? "Running Tests..." : "Run All Tests"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={clearCache}>
            <MaterialCommunityIcons name="delete" size={20} color="#666" />
            <Text style={styles.secondaryButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsContainer}>
          {testResults.map((test, index) => renderTestResult(test, index))}
        </View>

        {testResults.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="test-tube" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No tests run yet</Text>
            <Text style={styles.emptySubtext}>
              Tap "Run All Tests" to test the Eventbrite integration
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#666",
    fontWeight: "600",
    marginLeft: 8,
  },
  resultsContainer: {
    marginBottom: 24,
  },
  testResult: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  testHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
    color: "#333",
  },
  testDuration: {
    fontSize: 12,
    color: "#666",
  },
  testMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  testDetails: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default EventbriteTestScreen;
