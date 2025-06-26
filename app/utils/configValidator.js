import {
  EVENTBRITE_PUBLIC_TOKEN,
  EVENTBRITE_API_KEY,
  EVENTBRITE_CLIENT_SECRET,
  EVENTBRITE_PRIVATE_TOKEN,
  ENABLE_EVENTBRITE_INTEGRATION,
  EVENTBRITE_CACHE_DURATION,
  API_CACHE_DURATION,
} from "@env";

/**
 * Configuration validator for Eventbrite integration
 */
class ConfigValidator {
  /**
   * Validate all environment variables
   */
  validateConfiguration() {
    const config = {
      EVENTBRITE_PUBLIC_TOKEN,
      EVENTBRITE_API_KEY,
      EVENTBRITE_CLIENT_SECRET,
      EVENTBRITE_PRIVATE_TOKEN,
      ENABLE_EVENTBRITE_INTEGRATION,
      EVENTBRITE_CACHE_DURATION,
      API_CACHE_DURATION,
    };

    console.log("=== Eventbrite Configuration Validation ===");

    const issues = [];

    // Check if integration is enabled
    if (ENABLE_EVENTBRITE_INTEGRATION !== "true") {
      issues.push(
        "Eventbrite integration is disabled. Set ENABLE_EVENTBRITE_INTEGRATION=true"
      );
    }

    // Check required tokens
    if (!EVENTBRITE_PUBLIC_TOKEN) {
      issues.push("EVENTBRITE_PUBLIC_TOKEN is missing");
    } else if (EVENTBRITE_PUBLIC_TOKEN.length < 10) {
      issues.push("EVENTBRITE_PUBLIC_TOKEN appears to be invalid (too short)");
    }

    if (!EVENTBRITE_API_KEY) {
      issues.push("EVENTBRITE_API_KEY is missing");
    }

    // Check cache durations
    const eventbriteCacheDuration = parseInt(EVENTBRITE_CACHE_DURATION);
    if (isNaN(eventbriteCacheDuration) || eventbriteCacheDuration < 0) {
      issues.push("EVENTBRITE_CACHE_DURATION must be a positive number");
    }

    const apiCacheDuration = parseInt(API_CACHE_DURATION);
    if (isNaN(apiCacheDuration) || apiCacheDuration < 0) {
      issues.push("API_CACHE_DURATION must be a positive number");
    }

    // Display results
    if (issues.length === 0) {
      console.log("✅ All configuration checks passed");
      console.log("Configuration summary:");
      console.log(`- Integration enabled: ${ENABLE_EVENTBRITE_INTEGRATION}`);
      console.log(
        `- Public token: ${
          EVENTBRITE_PUBLIC_TOKEN
            ? EVENTBRITE_PUBLIC_TOKEN.substring(0, 8) + "..."
            : "NOT SET"
        }`
      );
      console.log(
        `- Eventbrite cache duration: ${Math.round(
          eventbriteCacheDuration / 3600000
        )} hours`
      );
      console.log(
        `- API cache duration: ${Math.round(apiCacheDuration / 3600000)} hours`
      );
      return true;
    } else {
      console.log("❌ Configuration issues found:");
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
      console.log(
        "\nPlease check your .env file and ensure all variables are set correctly."
      );
      return false;
    }
  }

  /**
   * Get safe configuration info (without exposing sensitive data)
   */
  getSafeConfigInfo() {
    return {
      integrationEnabled: ENABLE_EVENTBRITE_INTEGRATION === "true",
      hasPublicToken: !!EVENTBRITE_PUBLIC_TOKEN,
      hasApiKey: !!EVENTBRITE_API_KEY,
      eventbriteCacheHours: Math.round(
        parseInt(EVENTBRITE_CACHE_DURATION || 21600000) / 3600000
      ),
      apiCacheHours: Math.round(
        parseInt(API_CACHE_DURATION || 86400000) / 3600000
      ),
      tokenPreview: EVENTBRITE_PUBLIC_TOKEN
        ? EVENTBRITE_PUBLIC_TOKEN.substring(0, 8) + "..."
        : null,
    };
  }

  /**
   * Test API connectivity
   */
  async testAPIConnectivity() {
    if (!EVENTBRITE_PUBLIC_TOKEN) {
      console.log("❌ Cannot test API - no public token provided");
      return false;
    }

    console.log("🔍 Testing Eventbrite API connectivity...");

    try {
      const response = await fetch(
        "https://www.eventbriteapi.com/v3/users/me/",
        {
          headers: {
            Authorization: `Bearer ${EVENTBRITE_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ API connectivity successful");
        console.log(`Connected as: ${data.name || "Unknown user"}`);
        return true;
      } else {
        console.log(
          `❌ API connectivity failed: ${response.status} ${response.statusText}`
        );
        if (response.status === 401) {
          console.log("This usually means your token is invalid or expired.");
        }
        return false;
      }
    } catch (error) {
      console.log("❌ API connectivity test failed:", error.message);
      return false;
    }
  }
}

export default new ConfigValidator();
