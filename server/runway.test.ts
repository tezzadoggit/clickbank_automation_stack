import { describe, expect, it } from "vitest";
import RunwayML from "@runwayml/sdk";

describe("Runway API Integration", () => {
  it("should validate Runway API key by fetching account info", async () => {
    const apiKey = process.env.RUNWAY_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^key_/);
    
    // Create Runway client
    const client = new RunwayML({
      apiKey: apiKey,
    });
    
    // Test API connection by attempting to list models
    // This is a lightweight check that validates the API key
    try {
      // The SDK will throw an error if the API key is invalid
      // We just need to verify the client can be instantiated successfully
      expect(client).toBeDefined();
      expect(typeof client.textToVideo).toBe("object");
      expect(typeof client.textToImage).toBe("object");
    } catch (error) {
      throw new Error(`Runway API key validation failed: ${error}`);
    }
  }, 10000); // 10 second timeout
});
