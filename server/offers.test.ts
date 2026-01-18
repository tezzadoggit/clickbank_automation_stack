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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("offers router", () => {
  it("creates a new offer successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.offers.create({
      productName: "Test Product",
      vendor: "Test Vendor",
      clickbankId: "testprod",
      niche: "manifestation",
      gravity: 75,
      avgEarningsPerSale: 5000, // $50.00 in cents
      avgConversionValue: 10000, // $100.00 in cents
      commissionRate: 7500, // 75%
      description: "A test product for manifestation",
    });

    expect(result).toEqual({ success: true });
  });

  it("lists offers for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create an offer first
    await caller.offers.create({
      productName: "Test Product 2",
      vendor: "Test Vendor 2",
      clickbankId: "testprod2",
      niche: "woodworking",
      gravity: 100,
    });

    const offers = await caller.offers.list();
    
    expect(Array.isArray(offers)).toBe(true);
    expect(offers.length).toBeGreaterThan(0);
    
    const lastOffer = offers[0];
    expect(lastOffer).toHaveProperty("productName");
    expect(lastOffer).toHaveProperty("vendor");
    expect(lastOffer).toHaveProperty("niche");
  });

  it("updates an existing offer", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create an offer
    await caller.offers.create({
      productName: "Update Test Product",
      vendor: "Update Test Vendor",
      clickbankId: "updatetest",
      niche: "prepping",
    });

    // Get the offer
    const offers = await caller.offers.list();
    const offer = offers.find(o => o.clickbankId === "updatetest");
    
    if (!offer) throw new Error("Offer not found");

    // Update it
    const result = await caller.offers.update({
      id: offer.id,
      gravity: 150,
      evaluationScore: 85,
      recommendationStatus: "recommended",
    });

    expect(result).toEqual({ success: true });

    // Verify update
    const updatedOffer = await caller.offers.getById({ id: offer.id });
    expect(updatedOffer?.gravity).toBe(150);
    expect(updatedOffer?.evaluationScore).toBe(85);
    expect(updatedOffer?.recommendationStatus).toBe("recommended");
  });
});
