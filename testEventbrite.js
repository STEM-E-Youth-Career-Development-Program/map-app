// Quick test script for Eventbrite integration
// Run this in your React Native app's console or as a debug function

import ConfigValidator from "./app/utils/configValidator";
import EventbriteDebugger from "./app/utils/eventbriteDebugger";
import EventbriteService from "./app/utils/eventbriteService";

export const testEventbriteIntegration = async () => {
  console.log("🧪 Starting Quick Eventbrite Integration Test");
  console.log("==========================================");

  try {
    // Step 1: Validate configuration
    console.log("Step 1: Validating configuration...");
    const configValid = ConfigValidator.validateConfiguration();

    if (!configValid) {
      console.log(
        "❌ Configuration validation failed. Please check your .env file."
      );
      return false;
    }

    // Step 2: Test API connectivity
    console.log("\nStep 2: Testing API connectivity...");
    const apiConnected = await ConfigValidator.testAPIConnectivity();

    if (!apiConnected) {
      console.log("❌ API connectivity test failed. Please check your token.");
      return false;
    }

    // Step 3: Test basic integration
    console.log("\nStep 3: Testing basic integration...");
    const basicTest = await EventbriteDebugger.testBasicIntegration();

    if (!basicTest) {
      console.log("❌ Basic integration test failed.");
      return false;
    }

    // Step 4: Test STEM filtering
    console.log("\nStep 4: Testing STEM filtering...");
    const stemTest = await EventbriteDebugger.testSTEMFiltering();

    if (!stemTest) {
      console.log("❌ STEM filtering test failed.");
      return false;
    }

    console.log(
      "\n🎉 All tests passed! Eventbrite integration is working correctly."
    );
    console.log("\nNext steps:");
    console.log('1. Start your app with "npm start"');
    console.log(
      '2. Events from Eventbrite should appear with orange "EB" badges'
    );
    console.log(
      "3. Pull down on the events list to refresh and get new events"
    );
    console.log("4. Check the console for background sync status messages");

    return true;
  } catch (error) {
    console.error("❌ Test failed with error:", error);
    return false;
  }
};

// Alternative quick check function
export const quickConfigCheck = () => {
  const config = ConfigValidator.getSafeConfigInfo();
  console.log("🔧 Quick Configuration Check:");
  console.log("Integration enabled:", config.integrationEnabled ? "✅" : "❌");
  console.log("Has public token:", config.hasPublicToken ? "✅" : "❌");
  console.log("Has API key:", config.hasApiKey ? "✅" : "❌");
  console.log(
    "Cache duration:",
    `${config.eventbriteCacheHours}h (Eventbrite), ${config.apiCacheHours}h (API)`
  );

  if (config.integrationEnabled && config.hasPublicToken) {
    console.log("✅ Basic configuration looks good!");
  } else {
    console.log(
      "❌ Configuration issues detected. Run testEventbriteIntegration() for details."
    );
  }

  return config;
};

// Export for easy access
export default {
  testEventbriteIntegration,
  quickConfigCheck,
  ConfigValidator,
  EventbriteDebugger,
  EventbriteService,
};
