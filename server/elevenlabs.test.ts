import { describe, expect, it } from "vitest";
import { getElevenLabsVoices } from "./videoGeneration";

describe("ElevenLabs API Integration", () => {
  it("should successfully fetch voices with valid API key", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY environment variable is not set");
    }

    // Test fetching voices - this is a lightweight API call
    const voices = await getElevenLabsVoices(apiKey);
    
    // Verify we got a valid response
    expect(voices).toBeDefined();
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
    
    // Verify voice structure
    const firstVoice = voices[0];
    expect(firstVoice).toHaveProperty("voice_id");
    expect(firstVoice).toHaveProperty("name");
    expect(typeof firstVoice.voice_id).toBe("string");
    expect(typeof firstVoice.name).toBe("string");
  }, 30000); // 30 second timeout for API call
});
