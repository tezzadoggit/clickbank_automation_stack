import { describe, expect, it } from "vitest";
import { getModelInfo } from "./runwayGeneration";

describe("Video Generation Workflow", () => {
  it("should provide correct model information for Veo 3 (FREE)", () => {
    const veo3Info = getModelInfo("veo3");
    
    expect(veo3Info.name).toContain("Veo 3");
    expect(veo3Info.name).toContain("FREE");
    expect(veo3Info.costPerSecond).toBe(0); // Free via Gemini
    expect(veo3Info.maxDuration).toBe(8);
    expect(veo3Info.features).toContain("Text-to-video");
    expect(veo3Info.features).toContain("Free");
  });

  it("should provide correct model information for Veo 3.1 Fast", () => {
    const veo31FastInfo = getModelInfo("veo3.1_fast");
    
    expect(veo31FastInfo.name).toContain("Veo 3.1 Fast");
    expect(veo31FastInfo.costPerSecond).toBe(0.15); // $0.15 per second
    expect(veo31FastInfo.maxDuration).toBe(8);
    expect(veo31FastInfo.features).toContain("Text-to-video");
    expect(veo31FastInfo.features).toContain("Fast generation");
  });

  it("should provide correct model information for Gen-4 Turbo", () => {
    const gen4TurboInfo = getModelInfo("gen4_turbo");
    
    expect(gen4TurboInfo.name).toContain("Gen-4 Turbo");
    expect(gen4TurboInfo.costPerSecond).toBe(0.05); // $0.05 per second
    expect(gen4TurboInfo.maxDuration).toBe(10);
    expect(gen4TurboInfo.features).toContain("Image-to-video");
    expect(gen4TurboInfo.features).toContain("Highest quality");
  });

  it("should show cost comparison between models", () => {
    const veo3 = getModelInfo("veo3");
    const veo31Fast = getModelInfo("veo3.1_fast");
    const gen4Turbo = getModelInfo("gen4_turbo");

    // Veo 3 should be cheapest (free)
    expect(veo3.costPerSecond).toBeLessThan(veo31Fast.costPerSecond);
    expect(veo3.costPerSecond).toBeLessThan(gen4Turbo.costPerSecond);

    // Gen-4 Turbo should be cheaper per second than Veo 3.1 Fast
    expect(gen4Turbo.costPerSecond).toBeLessThan(veo31Fast.costPerSecond);

    // But Gen-4 Turbo is image-to-video only
    expect(gen4Turbo.features).toContain("Image-to-video");
    expect(veo3.features).toContain("Text-to-video");
    expect(veo31Fast.features).toContain("Text-to-video");
  });

  it("should validate model duration limits", () => {
    const veo3 = getModelInfo("veo3");
    const veo31Fast = getModelInfo("veo3.1_fast");
    const gen4Turbo = getModelInfo("gen4_turbo");

    // Veo models support 8 seconds
    expect(veo3.maxDuration).toBe(8);
    expect(veo31Fast.maxDuration).toBe(8);

    // Gen-4 Turbo supports up to 10 seconds
    expect(gen4Turbo.maxDuration).toBe(10);
  });
});
