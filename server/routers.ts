import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as aiContent from "./aiContentGeneration";
import { generateImage } from "./_core/imageGeneration";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // OFFER MANAGEMENT
  // ============================================================================
  offers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getOffersByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getOfferById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        productName: z.string(),
        vendor: z.string(),
        clickbankId: z.string(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        gravity: z.number().optional(),
        avgEarningsPerSale: z.number().optional(),
        avgConversionValue: z.number().optional(),
        commissionRate: z.number().optional(),
        rebillRate: z.number().optional(),
        salesPageUrl: z.string().optional(),
        affiliatePageUrl: z.string().optional(),
        description: z.string().optional(),
        targetAudience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createOffer({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        productName: z.string().optional(),
        vendor: z.string().optional(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]).optional(),
        gravity: z.number().optional(),
        avgEarningsPerSale: z.number().optional(),
        avgConversionValue: z.number().optional(),
        commissionRate: z.number().optional(),
        rebillRate: z.number().optional(),
        salesPageUrl: z.string().optional(),
        affiliatePageUrl: z.string().optional(),
        description: z.string().optional(),
        targetAudience: z.string().optional(),
        evaluationScore: z.number().optional(),
        recommendationStatus: z.enum(["recommended", "caution", "avoid", "pending"]).optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "paused", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateOffer(id, ctx.user.id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteOffer(input.id, ctx.user.id);
        return { success: true };
      }),

    evaluate: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const offer = await db.getOfferById(input.id, ctx.user.id);
        if (!offer) throw new Error("Offer not found");

        const evaluation = await aiContent.evaluateOffer({
          productName: offer.productName,
          gravity: offer.gravity || 0,
          avgEarningsPerSale: offer.avgEarningsPerSale || 0,
          avgConversionValue: offer.avgConversionValue || 0,
          niche: offer.niche,
          description: offer.description || undefined,
        });

        // Update offer with evaluation results
        await db.updateOffer(input.id, ctx.user.id, {
          evaluationScore: evaluation.overall_score,
          recommendationStatus: evaluation.recommendation as any,
          notes: JSON.stringify(evaluation),
        });
        return evaluation;
      }),

    importFromUrl: protectedProcedure
      .input(z.object({
        url: z.string().url(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { scrapeProductInfo } = await import("./urlScraper");
        const productInfo = await scrapeProductInfo(input.url);

        // Create offer from scraped data
        await db.createOffer({
          userId: ctx.user.id,
          productName: productInfo.productName,
          vendor: productInfo.vendor,
          clickbankId: null,
          niche: productInfo.niche,
          source: "custom",
          sourceUrl: input.url,
          salesPageUrl: input.url,
          description: productInfo.description,
          targetAudience: productInfo.targetAudience,
        });

        return { success: true, productInfo };
      }),
  }),

  // ============================================================================
  // LANDING PAGES MANAGEMENT
  // ============================================================================
  landingPages: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getLandingPagesByUserId(ctx.user.id);
    }),

    listByOffer: protectedProcedure
      .input(z.object({ offerId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getLandingPagesByOfferId(input.offerId, ctx.user.id);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getLandingPageById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        title: z.string(),
        headline: z.string(),
        subheadline: z.string().optional(),
        bodyCopy: z.string(),
        callToAction: z.string(),
        template: z.string(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        thumbnailUrl: z.string().optional(),
        heroImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createLandingPage({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        headline: z.string().optional(),
        subheadline: z.string().optional(),
        bodyCopy: z.string().optional(),
        callToAction: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        thumbnailUrl: z.string().optional(),
        heroImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        
        // If publishing, set publishedAt
        if (updates.status === "published") {
          (updates as any).publishedAt = new Date();
        }
        
        await db.updateLandingPage(id, ctx.user.id, updates);
        return { success: true };
      }),

    generateContent: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        mechanism: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const offer = await db.getOfferById(input.offerId, ctx.user.id);
        if (!offer) throw new Error("Offer not found");

        const content = await aiContent.generateHeadlineAndCopy({
          productName: offer.productName,
          productDescription: offer.description || "",
          niche: offer.niche,
          mechanism: input.mechanism,
          targetAudience: offer.targetAudience || undefined,
        });

        return content;
      }),

    generateThumbnail: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        mechanism: z.string(),
        benefit: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const offer = await db.getOfferById(input.offerId, ctx.user.id);
        if (!offer) throw new Error("Offer not found");

        const prompt = `Create a high-converting YouTube thumbnail with a split-screen layout:

- Left side: visually represent the **${input.mechanism}** or niche-specific concept (e.g., glowing brain, secret energy device, mystical symbol, glowing blueprint, etc.). Use vibrant lighting, magical effects, or scientific aura depending on niche.

- Right side: show the **emotional human reaction or benefit** (e.g., peaceful woman meditating, family smiling with relief, craftsman with finished project). The subject should look directly at camera or emotionally engaged in a natural setting.

- Place a large, realistic YouTube play button exactly in the center of the thumbnail.

- The entire image should be 16:9 aspect ratio (1280x720), designed for scroll-stopping performance.

- Use cinematic lighting, strong contrast, and natural depth-of-field. Add warm ambient bokeh in background where appropriate.

- Style: modern, ultra-realistic, high clarity.

- Avoid text or branding overlays.

Niche: ${offer.niche}
Benefit: ${input.benefit}`;

        const result = await generateImage({ prompt });
        return { url: result.url };
      }),
  }),

  // ============================================================================
  // AD COPY VARIATIONS
  // ============================================================================
  adCopyVariations: router({
    listByLandingPage: protectedProcedure
      .input(z.object({ landingPageId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getAdCopyVariationsByLandingPageId(input.landingPageId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        landingPageId: z.number(),
        headline: z.string(),
        bodyCopy: z.string(),
        callToAction: z.string(),
        isControl: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createAdCopyVariation({
          ...input,
          isControl: input.isControl ? 1 : 0,
          userId: ctx.user.id,
        });
        return { success: true };
      }),

    generateVariations: protectedProcedure
      .input(z.object({
        landingPageId: z.number(),
        count: z.number().default(5),
      }))
      .mutation(async ({ ctx, input }) => {
        const page = await db.getLandingPageById(input.landingPageId, ctx.user.id);
        if (!page) throw new Error("Landing page not found");

        const offer = await db.getOfferById(page.offerId, ctx.user.id);
        if (!offer) throw new Error("Offer not found");

        const variations = await aiContent.generateAdCopyVariations({
          productName: offer.productName,
          niche: page.niche,
          baseHeadline: page.headline,
          count: input.count,
        });

        return variations;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        impressions: z.number().optional(),
        clicks: z.number().optional(),
        conversions: z.number().optional(),
        status: z.enum(["active", "paused", "winner", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateAdCopyVariation(id, ctx.user.id, updates);
        return { success: true };
      }),
  }),

  // ============================================================================
  // EMAIL SEQUENCES
  // ============================================================================
  emailSequences: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getEmailSequencesByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const sequence = await db.getEmailSequenceById(input.id, ctx.user.id);
        if (!sequence) return null;
        
        const emails = await db.getEmailsBySequenceId(input.id);
        return { ...sequence, emails };
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        description: z.string().optional(),
        offerId: z.number().optional(),
        emailCount: z.number(),
        daysBetweenEmails: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createEmailSequence({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),

    generateSequence: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        emailCount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const offer = await db.getOfferById(input.offerId, ctx.user.id);
        if (!offer) throw new Error("Offer not found");

        const sequence = await aiContent.generateEmailSequence({
          productName: offer.productName,
          productDescription: offer.description || "",
          niche: offer.niche,
          emailCount: input.emailCount,
        });

        // Create sequence
        const result = await db.createEmailSequence({
          userId: ctx.user.id,
          offerId: input.offerId,
          name: `${offer.productName} - ${input.emailCount} Day Sequence`,
          niche: offer.niche,
          emailCount: input.emailCount,
          daysBetweenEmails: 1,
        });

        const sequenceId = (result as any).insertId;

        // Create individual emails
        for (const email of sequence.emails) {
          await db.createEmail({
            sequenceId,
            dayNumber: email.day,
            subject: email.subject,
            preheader: email.preheader,
            body: email.body,
          });
        }

        return { success: true, sequenceId };
      }),
  }),

  // ============================================================================
  // PERFORMANCE METRICS
  // ============================================================================
  performance: router({
    getByOffer: protectedProcedure
      .input(z.object({ 
        offerId: z.number(),
        limit: z.number().default(30),
      }))
      .query(async ({ ctx, input }) => {
        return db.getPerformanceMetricsByOfferId(input.offerId, ctx.user.id, input.limit);
      }),

    getSummaryByOffer: protectedProcedure
      .input(z.object({ offerId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getPerformanceSummaryByOfferId(input.offerId, ctx.user.id);
      }),

    getOverview: protectedProcedure
      .input(z.object({ limit: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        return db.getPerformanceMetricsByUserId(ctx.user.id, input.limit);
      }),

    create: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        landingPageId: z.number().optional(),
        date: z.date(),
        impressions: z.number().default(0),
        clicks: z.number().default(0),
        uniqueVisitors: z.number().default(0),
        conversions: z.number().default(0),
        revenue: z.number().default(0),
        adSpend: z.number().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        // Calculate derived metrics
        const ctr = input.impressions > 0 ? Math.round((input.clicks / input.impressions) * 10000) : 0;
        const conversionRate = input.clicks > 0 ? Math.round((input.conversions / input.clicks) * 10000) : 0;
        const epc = input.clicks > 0 ? Math.round(input.revenue / input.clicks) : 0;
        const cpc = input.clicks > 0 ? Math.round(input.adSpend / input.clicks) : 0;
        const roi = input.adSpend > 0 ? Math.round(((input.revenue - input.adSpend) / input.adSpend) * 100) : 0;

        await db.createPerformanceMetric({
          ...input,
          userId: ctx.user.id,
          ctr,
          conversionRate,
          epc,
          cpc,
          roi,
        });

        return { success: true };
      }),
  }),

  // ============================================================================
  // NICHE STRATEGIES
  // ============================================================================
  nicheStrategies: router({
    getByNiche: protectedProcedure
      .input(z.object({ 
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
      }))
      .query(async ({ input }) => {
        return db.getNicheStrategiesByNiche(input.niche);
      }),

    getAll: protectedProcedure.query(async () => {
      return db.getAllNicheStrategies();
    }),
  }),

  // ============================================================================
  // COMPLIANCE CHECKER
  // ============================================================================
  compliance: router({
    check: protectedProcedure
      .input(z.object({
        text: z.string(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
      }))
      .mutation(async ({ input }) => {
        return aiContent.checkCompliance({
          text: input.text,
          niche: input.niche,
        });
      }),
  }),

  // ============================================================================
  // VIDEO AUTOMATION
  // ============================================================================
  video: router({
    // List all video projects for the user
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getVideoProjectsByUserId(ctx.user.id);
    }),

    // Get a single video project
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getVideoProjectById(input.id, ctx.user.id);
      }),

    // Generate YouTube ad script using $500/Day prompts
    generateScript: protectedProcedure
      .input(z.object({
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        productInfo: z.string().min(10).max(1000),
        promptTemplate: z.enum(["manifestation", "survival", "woodworking", "universal"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { generateYouTubeAdScript } = await import("./videoGeneration");
        const { invokeLLM } = await import("./_core/llm");
        
        return generateYouTubeAdScript(
          {
            niche: input.niche,
            productInfo: input.productInfo,
            promptTemplate: input.promptTemplate,
          },
          invokeLLM
        );
      }),

    // Generate voice-over using ElevenLabs
    generateVoiceover: protectedProcedure
      .input(z.object({
        text: z.string().min(10),
        voiceId: z.string(),
        apiKey: z.string(),
        stability: z.number().min(0).max(1).optional(),
        similarityBoost: z.number().min(0).max(1).optional(),
        style: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ input }) => {
        const { generateVoiceover } = await import("./videoGeneration");
        return generateVoiceover(input);
      }),

    // Get available ElevenLabs voices
    getVoices: protectedProcedure
      .input(z.object({ apiKey: z.string() }))
      .query(async ({ input }) => {
        const { getElevenLabsVoices } = await import("./videoGeneration");
        return getElevenLabsVoices(input.apiKey);
      }),

    // Generate thumbnail using Gemini Imagen
    generateThumbnail: protectedProcedure
      .input(z.object({
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        productInfo: z.string().min(10).max(1000),
        style: z.enum(["photorealistic", "illustrated", "minimal"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { generateThumbnail } = await import("./geminiImageGeneration");
        return generateThumbnail(input);
      }),

    // Generate multiple thumbnail variations
    generateThumbnailVariations: protectedProcedure
      .input(z.object({
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        productInfo: z.string().min(10).max(1000),
        count: z.number().min(1).max(3).default(3),
      }))
      .mutation(async ({ input }) => {
        const { generateThumbnailVariations } = await import("./geminiImageGeneration");
        return generateThumbnailVariations(input);
      }),

    // Generate ClickMagick tracking URL
    generateTrackingUrl: protectedProcedure
      .input(z.object({
        baseUrl: z.string().url(),
        utmSource: z.string(),
        utmMedium: z.string(),
        utmCampaign: z.string(),
        utmTerm: z.string().optional(),
        utmContent: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { generateClickMagickUrl } = await import("./videoGeneration");
        return { trackingUrl: generateClickMagickUrl(input) };
      }),

    // Create a new video project
    create: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        title: z.string(),
        niche: z.enum(["manifestation", "woodworking", "prepping", "health", "finance", "other"]),
        script: z.string(),
        scriptWordCount: z.number().optional(),
        promptTemplate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createVideoProject({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // Update video project with voice-over
    updateVoiceover: protectedProcedure
      .input(z.object({
        id: z.number(),
        voiceoverUrl: z.string(),
        voiceId: z.string(),
        voiceName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateVideoProject(input.id, ctx.user.id, {
          voiceoverUrl: input.voiceoverUrl,
          voiceId: input.voiceId,
          voiceName: input.voiceName,
          status: "ready",
        });
      }),

    // Update video project with tracking URL
    updateTracking: protectedProcedure
      .input(z.object({
        id: z.number(),
        clickmagickUrl: z.string(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmTerm: z.string().optional(),
        utmContent: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateVideoProject(id, ctx.user.id, updates);
      }),

    // Delete video project
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteVideoProject(input.id, ctx.user.id);
      }),

    // Generate video using Runway (Veo 3, Veo 3.1 Fast, or Gen-4 Turbo)
    generateVideoRunway: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        model: z.enum(["veo3", "veo3.1_fast", "gen4_turbo"]),
        thumbnailUrl: z.string().optional(), // Required for gen4_turbo
      }))
      .mutation(async ({ ctx, input }) => {
        const { generateYouTubeAdVideo } = await import("./runwayGeneration");
        
        // Get project details
        const project = await db.getVideoProjectById(input.projectId, ctx.user.id);
        if (!project) {
          throw new Error("Video project not found");
        }

        // Generate video
        const result = await generateYouTubeAdVideo({
          script: project.script,
          niche: project.niche,
          model: input.model,
          thumbnailUrl: input.thumbnailUrl,
        });

        // Update project with video URL
        await db.updateVideoProject(input.projectId, ctx.user.id, {
          videoUrl: result.s3Url,
          status: "ready",
        });

        return {
          success: true,
          videoUrl: result.s3Url,
          model: result.model,
          duration: result.duration,
        };
      }),

    // Get model information for UI display
    getModelInfo: protectedProcedure
      .input(z.object({
        model: z.enum(["veo3", "veo3.1_fast", "gen4_turbo"]),
      }))
      .query(async ({ input }) => {
        const { getModelInfo } = await import("./runwayGeneration");
        return getModelInfo(input.model);
      }),
  }),
});

export type AppRouter = typeof appRouter;
