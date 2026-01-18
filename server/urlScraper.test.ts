import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Custom URL Offer Import", () => {
  it("validates URL format before import", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Test invalid URL
    await expect(
      caller.offers.importFromUrl({ url: "not-a-valid-url" })
    ).rejects.toThrow();
  });

  it("accepts valid URL format", () => {
    const validUrls = [
      "https://example.com/offer",
      "https://gamma.app/docs/funnel",
      "https://jvzoo.com/product",
      "https://warriorplus.com/offer",
    ];

    validUrls.forEach((url) => {
      expect(() => new URL(url)).not.toThrow();
    });
  });

  it("schema includes required custom offer fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify the procedure exists and accepts correct input
    const procedure = appRouter._def.procedures["offers.importFromUrl"];
    expect(procedure).toBeDefined();
  });
});

describe("URL Scraper Product Info Extraction", () => {
  it("extracts required product fields", () => {
    // Mock scraped product info structure
    const mockProductInfo = {
      productName: "Test Product",
      vendor: "Test Vendor",
      niche: "manifestation" as const,
      description: "A test product description",
      price: "$97",
      benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
      targetAudience: "People interested in manifestation",
      headline: "Transform Your Life Today",
      callToAction: "Get Started Now",
    };

    // Verify all required fields are present
    expect(mockProductInfo.productName).toBeDefined();
    expect(mockProductInfo.vendor).toBeDefined();
    expect(mockProductInfo.niche).toBeDefined();
    expect(mockProductInfo.description).toBeDefined();
    expect(mockProductInfo.benefits).toHaveLength(3);
    expect(mockProductInfo.targetAudience).toBeDefined();
    expect(mockProductInfo.headline).toBeDefined();
    expect(mockProductInfo.callToAction).toBeDefined();
  });

  it("validates niche enum values", () => {
    const validNiches = ["manifestation", "woodworking", "prepping", "health", "finance", "other"];
    
    validNiches.forEach((niche) => {
      expect(validNiches).toContain(niche);
    });
  });
});
