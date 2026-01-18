import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Video Automation", () => {
  it("should generate YouTube ad script using $500/Day prompts", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.video.generateScript({
      niche: "manifestation",
      productInfo: "Neuro Energizer is a brain optimization program that uses sound frequencies to help users achieve mental clarity and focus. It's designed for people who struggle with traditional manifestation techniques.",
      promptTemplate: "manifestation",
    });

    expect(result).toBeDefined();
    expect(result.script).toBeDefined();
    expect(typeof result.script).toBe("string");
    expect(result.script.length).toBeGreaterThan(100);
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.wordCount).toBeLessThan(600); // YouTube ad scripts should be concise
  }, 60000); // 60 second timeout for LLM call

  it("should generate ClickMagick tracking URL with UTM parameters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.video.generateTrackingUrl({
      baseUrl: "https://example.com/offer",
      utmSource: "manifestation",
      utmMedium: "youtube",
      utmCampaign: "neuro-energizer-test",
      utmTerm: "video-1",
    });

    expect(result).toBeDefined();
    expect(result.trackingUrl).toBeDefined();
    expect(result.trackingUrl).toContain("utm_source=manifestation");
    expect(result.trackingUrl).toContain("utm_medium=youtube");
    expect(result.trackingUrl).toContain("utm_campaign=neuro-energizer-test");
    expect(result.trackingUrl).toContain("utm_term=video-1");
  });

  it("should generate script with different niche templates", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Test woodworking template
    const woodworkingResult = await caller.video.generateScript({
      niche: "woodworking",
      productInfo: "Ted's Woodworking provides 16,000 detailed woodworking plans with step-by-step instructions. Perfect for beginners and experienced woodworkers.",
      promptTemplate: "woodworking",
    });

    expect(woodworkingResult.script).toBeDefined();
    expect(woodworkingResult.wordCount).toBeGreaterThan(0);

    // Test survival template
    const survivalResult = await caller.video.generateScript({
      niche: "prepping",
      productInfo: "The Lost Generator teaches you how to build a DIY backup power generator using simple materials. Provides energy independence without expensive solar panels.",
      promptTemplate: "survival",
    });

    expect(survivalResult.script).toBeDefined();
    expect(survivalResult.wordCount).toBeGreaterThan(0);
  }, 120000); // 120 second timeout for multiple LLM calls
});
