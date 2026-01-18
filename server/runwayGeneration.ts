import RunwayML from "@runwayml/sdk";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

export type VideoGenerationModel = "veo3" | "veo3.1_fast" | "gen4_turbo";

export interface GenerateVideoParams {
  model: VideoGenerationModel;
  promptText: string;
  imageUrl?: string; // Required for gen4_turbo (image-to-video)
  duration?: 8; // Veo models support 8 seconds
  ratio?: "1280:720" | "720:1280";
}

export interface GenerateVideoResult {
  videoUrl: string;
  s3Key: string;
  s3Url: string;
  duration: number;
  taskId: string;
  model: string;
}

/**
 * Generate video using Runway API (supports Veo 3, Veo 3.1 Fast, or Gen-4 Turbo)
 */
export async function generateVideo(
  params: GenerateVideoParams
): Promise<GenerateVideoResult> {
  const { model, promptText, imageUrl, duration = 8, ratio = "1280:720" } = params;

  try {
    console.log(`[Runway] Starting video generation with model: ${model}`);

    let task;

    if (model === "gen4_turbo") {
      // Gen-4 Turbo is image-to-video only
      if (!imageUrl) {
        throw new Error("gen4_turbo requires an imageUrl for image-to-video generation");
      }

      task = await client.imageToVideo.create({
        model: "gen4_turbo",
        promptImage: imageUrl,
        promptText,
        duration: 5, // Gen-4 Turbo supports 5 or 10 seconds
        ratio,
      });
    } else {
      // Veo models support text-to-video
      task = await client.textToVideo.create({
        model,
        promptText,
        duration,
        ratio,
      });
    }

    console.log(`[Runway] Task created: ${task.id}`);

    // Wait for task to complete
    const completedTask = await client.tasks.retrieve(task.id).waitForTaskOutput();

    if (!completedTask.output || completedTask.output.length === 0) {
      throw new Error("No video output generated");
    }

    const videoUrl = completedTask.output[0];
    console.log("[Runway] Video generated:", videoUrl);

    // Download video and upload to S3
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    
    // Upload to S3
    const s3Key = `videos/runway/${model}/${nanoid()}.mp4`;
    const { url: s3Url } = await storagePut(s3Key, videoBuffer, "video/mp4");

    console.log("[Runway] Video uploaded to S3:", s3Url);

    return {
      videoUrl,
      s3Key,
      s3Url,
      duration: model === "gen4_turbo" ? 5 : 8,
      taskId: task.id,
      model,
    };
  } catch (error) {
    console.error(`[Runway] Video generation failed with ${model}:`, error);
    throw new Error(`Runway video generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate YouTube ad video from script
 * Supports multiple models with fallback options
 */
export async function generateYouTubeAdVideo(params: {
  script: string;
  niche: string;
  model: VideoGenerationModel;
  duration?: 8;
  thumbnailUrl?: string; // For gen4_turbo
}): Promise<GenerateVideoResult> {
  const { script, niche, model, duration = 8, thumbnailUrl } = params;

  // Create visual prompt based on niche and script
  const visualPrompt = createVisualPromptFromScript(script, niche);

  return generateVideo({
    model,
    promptText: visualPrompt,
    imageUrl: thumbnailUrl,
    duration,
    ratio: "1280:720",
  });
}

/**
 * Convert script to visual prompt for video generation
 */
function createVisualPromptFromScript(script: string, niche: string): string {
  // Extract key themes and create cinematic prompts
  const nicheVisuals: Record<string, string> = {
    manifestation: "Cinematic meditation scene, peaceful person in serene environment, golden light, soft focus, inspirational atmosphere, close-up of peaceful face, gentle camera movement",
    woodworking: "Professional woodworking workshop, craftsman working with wood, detailed close-ups of hands and tools, warm lighting, sawdust particles in air, smooth camera pan",
    prepping: "Survival preparedness scene, organized emergency supplies, outdoor survival setting, confident person with gear, practical demonstration, steady camera, natural lighting",
    universal: "Professional lifestyle scene, modern setting, confident person, clean composition, smooth camera movement, cinematic lighting",
  };

  const baseVisual = nicheVisuals[niche] || nicheVisuals.universal;
  
  // Add script context for better prompt adherence
  const scriptKeywords = extractKeywords(script);
  
  return `${baseVisual}. Context: ${scriptKeywords}. Professional YouTube ad style, high production value, engaging visuals.`;
}

/**
 * Extract key themes from script for visual generation
 */
function extractKeywords(script: string): string {
  // Simple keyword extraction - take first 100 characters
  return script.substring(0, 100).replace(/\n/g, " ");
}

/**
 * Get model pricing and details for UI display
 */
export function getModelInfo(model: VideoGenerationModel): {
  name: string;
  description: string;
  costPerSecond: number;
  maxDuration: number;
  features: string[];
} {
  const modelInfo = {
    veo3: {
      name: "Veo 3 (via Gemini - FREE)",
      description: "Google's Veo 3 model via your Gemini API. Free to use, good quality.",
      costPerSecond: 0,
      maxDuration: 8,
      features: ["Text-to-video", "Free", "720p", "Good quality"],
    },
    "veo3.1_fast": {
      name: "Veo 3.1 Fast (via Runway)",
      description: "Fast text-to-video generation with good quality.",
      costPerSecond: 0.15,
      maxDuration: 8,
      features: ["Text-to-video", "Fast generation", "720p", "Good quality"],
    },
    gen4_turbo: {
      name: "Gen-4 Turbo (Runway)",
      description: "Highest quality image-to-video. Best motion and realism.",
      costPerSecond: 0.05,
      maxDuration: 10,
      features: ["Image-to-video", "Highest quality", "720p", "Best motion"],
    },
  };

  return modelInfo[model];
}
