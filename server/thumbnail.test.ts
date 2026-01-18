import { describe, expect, it } from "vitest";
import { generateThumbnail } from "./geminiImageGeneration";

describe("Thumbnail Generation", () => {
  it("should generate a thumbnail for manifestation niche", async () => {
    const result = await generateThumbnail({
      niche: "manifestation",
      productInfo: "A brain optimization program using audio frequencies to enhance focus and manifestation abilities.",
      style: "photorealistic",
    });

    expect(result).toBeDefined();
    expect(result.imageUrl).toBeTruthy();
    expect(result.s3Url).toBeTruthy();
    expect(result.s3Key).toContain("thumbnails/manifestation");
    expect(result.prompt).toContain("manifestation");
    expect(result.prompt).toContain("16:9");
  }, 60000); // Imagen generation can take up to 60 seconds

  it("should generate a thumbnail for woodworking niche", async () => {
    const result = await generateThumbnail({
      niche: "woodworking",
      productInfo: "Complete woodworking plans with step-by-step instructions for building furniture.",
      style: "photorealistic",
    });

    expect(result).toBeDefined();
    expect(result.s3Key).toContain("thumbnails/woodworking");
    expect(result.prompt).toContain("woodworking");
  }, 60000);

  it("should generate a thumbnail for prepping niche", async () => {
    const result = await generateThumbnail({
      niche: "prepping",
      productInfo: "Emergency water purification system for survival preparedness.",
      style: "photorealistic",
    });

    expect(result).toBeDefined();
    expect(result.s3Key).toContain("thumbnails/prepping");
    expect(result.prompt).toContain("prepping");
  }, 60000);

  it("should support different thumbnail styles", async () => {
    const styles: Array<"photorealistic" | "illustrated" | "minimal"> = [
      "photorealistic",
      "illustrated",
      "minimal",
    ];

    for (const style of styles) {
      const result = await generateThumbnail({
        niche: "manifestation",
        productInfo: "Test product for style variations",
        style,
      });

      expect(result).toBeDefined();
      expect(result.imageUrl).toBeTruthy();
      expect(result.prompt).toContain(style);
    }
  }, 180000); // 3 minutes for 3 generations

  it("should create 16:9 aspect ratio thumbnails", async () => {
    const result = await generateThumbnail({
      niche: "health",
      productInfo: "Fitness program for weight loss and muscle building.",
      style: "photorealistic",
    });

    expect(result.prompt).toContain("16:9");
    expect(result.prompt).toContain("YouTube thumbnail");
  }, 60000);

  it("should include product context in prompt", async () => {
    const productInfo = "Revolutionary brain training system using neurofeedback technology";
    
    const result = await generateThumbnail({
      niche: "manifestation",
      productInfo,
      style: "photorealistic",
    });

    // Prompt should include first 150 chars of product info
    expect(result.prompt).toContain(productInfo.substring(0, 100));
  }, 60000);
});
