import axios from "axios";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

/**
 * ElevenLabs Text-to-Speech Integration
 * Converts script text to natural voice-over audio
 */

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

interface GenerateVoiceoverOptions {
  text: string;
  voiceId: string;
  apiKey: string;
  stability?: number; // 0-1
  similarityBoost?: number; // 0-1
  style?: number; // 0-1
}

/**
 * Generate voice-over using ElevenLabs API
 */
export async function generateVoiceover(options: GenerateVoiceoverOptions): Promise<{
  audioUrl: string;
  audioKey: string;
  duration?: number;
}> {
  const {
    text,
    voiceId,
    apiKey,
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0,
  } = options;

  try {
    // Call ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      }
    );

    // Upload audio to S3
    const audioBuffer = Buffer.from(response.data);
    const audioKey = `voiceovers/${nanoid()}.mp3`;
    const { url: audioUrl } = await storagePut(audioKey, audioBuffer, "audio/mpeg");

    return {
      audioUrl,
      audioKey,
    };
  } catch (error: any) {
    console.error("[ElevenLabs] Voice generation failed:", error.response?.data || error.message);
    throw new Error(`Voice generation failed: ${error.response?.data?.detail?.message || error.message}`);
  }
}

/**
 * Get available voices from ElevenLabs
 */
export async function getElevenLabsVoices(apiKey: string): Promise<ElevenLabsVoice[]> {
  try {
    const response = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    return response.data.voices || [];
  } catch (error: any) {
    console.error("[ElevenLabs] Failed to fetch voices:", error.response?.data || error.message);
    throw new Error(`Failed to fetch voices: ${error.response?.data?.detail?.message || error.message}`);
  }
}

/**
 * Generate YouTube ad script using $500/Day prompts
 */
export interface ScriptGenerationOptions {
  niche: "manifestation" | "woodworking" | "prepping" | "health" | "finance" | "other";
  productInfo: string; // 4-5 sentences about the offer
  promptTemplate?: "manifestation" | "survival" | "woodworking" | "universal";
}

export async function generateYouTubeAdScript(
  options: ScriptGenerationOptions,
  invokeLLM: any
): Promise<{
  script: string;
  wordCount: number;
}> {
  const { niche, productInfo, promptTemplate } = options;

  // Select appropriate prompt based on niche or template
  let systemPrompt = "";
  let structure = "";
  let guidelines = "";
  let tone = "";
  let wordCount = "240-320 words";

  if (promptTemplate === "manifestation" || niche === "manifestation") {
    systemPrompt = `You are an expert YouTube ad copywriter specializing in brain enhancement and manifestation offers. Your task is to write a compliant, curiosity-driven YouTube ad script that converts cold traffic and passes YouTube's strict compliance filters.`;
    
    structure = `
1. Qualify the Audience / Open Loop: Ask a question about why typical manifestation techniques don't work. Dispel a belief (e.g., "It's not just about positive thinking"). Tease a new method based on real science or internal reprogramming.

2. What's in It for Them: Explain what this method may unlock — clarity, motivation, or focus. Describe the emotional transformation, not material outcomes.

3. Call Out Audience + Agitate: Speak to people who've tried vision boards, affirmations, or journaling with no success. Empathize with their frustration.

4. Establish Authority + Mechanism: Introduce the expert, researcher, or origin of the discovery. Briefly explain the mechanism (e.g., sound-based protocol, brainwave alignment).

5. Provide the Solution / New Opportunity: Describe how this technique works — and how it differs from traditional methods.

6. Call to Action #1: Direct viewers to watch a free video explaining how the method works.

7. Value Perception: Show how past methods missed the deeper root of change. Emphasize simplicity and internal alignment.

8. Social Proof / Benefits: Mention users or early adopters who've experienced calm, clarity, or improved focus. Use compliant language like "many report" or "early feedback suggests."

9. Call to Action #2 / Soft Urgency: Encourage them to click now to see the presentation while it's still online.`;

    guidelines = `
- Use words like "may support", "could improve", "many people report"
- Never guarantee results, speed, wealth, or success
- Avoid references to curing depression, trauma, anxiety, etc.
- Avoid phrases like "instantly attract," "manifest thousands," or "reprogram in 5 minutes"
- Stay science-backed and education-forward
- Final CTA must direct to an educational resource, never a "buy now"`;

    tone = "Scientific, thoughtful, curiosity-driven";
  } else if (promptTemplate === "survival" || niche === "prepping") {
    systemPrompt = `You are an expert YouTube ad copywriter specializing in preparedness and alternative energy offers. Your task is to write a compliant YouTube ad script for a prepping/survival product that educates and empowers without fear-mongering.`;
    
    structure = `
1. Qualify the Audience / Open Loop: Ask: "What happens if the grid fails?" Dispel the belief that energy independence requires expensive solar tech. Tease a small, smart, DIY method.

2. What's in It for Them: Share how the method may support self-reliance, reduce stress, or improve emergency readiness. Mention non-electric survival benefits where relevant.

3. Call Out Audience + Agitate: Address homeowners, campers, preppers. Mention the fear of being unprepared or reliant on unstable infrastructure.

4. Establish Authority + Mechanism: Introduce the creator — an engineer, off-grid expert, or inventor. Explain the simple mechanism (e.g., repurposed energy design, battery hack, off-grid system).

5. Provide the Solution / New Opportunity: Explain how this system supports continuous power without complex installs.

6. Call to Action #1: Direct them to an educational video that shows how it works.

7. Value Perception: Compare to solar/gas generators — show cost, convenience, or speed advantages.

8. Social Proof / Benefits: Share that many people are already using this for camping, emergency prep, or daily backup. Use phrases like "people are turning to this", or "early adopters say".

9. Call to Action #2 / Soft Urgency: Reinforce that this free video may not be available forever — and it's worth seeing now.`;

    guidelines = `
- No claims of cutting power bills in half or "run your whole house"
- Use language like "many are turning to..." or "could provide backup support"
- Focus on learning, building, and personal readiness — not promises
- Never suggest you'll survive every disaster — focus on peace of mind and preparedness skills
- Tone should be practical, clear, and calm — not fear-mongering or doomsday`;

    tone = "Calm, empowering, education-focused";
  } else if (promptTemplate === "woodworking" || niche === "woodworking") {
    systemPrompt = `You are an expert YouTube ad copywriter specializing in woodworking and DIY offers. Your task is to write a compliant, high-converting YouTube ad script that appeals to beginners and hobbyists.`;
    
    structure = `
1. Qualify the Audience / Open Loop: Ask a curiosity-driven question related to woodworking struggles. Dispel a myth (e.g., "You need expensive tools"). Introduce a little-known system that makes building easy and fun.

2. What's in It for Them: Explain how this system simplifies building and helps users complete real, useful projects. Highlight benefits like confidence, cost savings, and creative satisfaction.

3. Call Out Audience + Agitate: Address common frustrations: complex instructions, failed builds, wasted materials. Speak to beginners, hobbyists, or anyone who has felt stuck or overwhelmed.

4. Establish Authority + Mechanism: Introduce the expert who created this system. Briefly explain the mechanism (e.g., easy-to-follow blueprints, project planner, material guides).

5. Provide the Solution / New Opportunity: Show how this approach creates a completely different experience from trial-and-error learning.

6. Call to Action #1: Invite viewers to watch a free step-by-step video or training to see how it works.

7. Value Perception: Compare it to messy YouTube tutorials or expensive pro tools. Emphasize clarity, guidance, and accessibility.

8. Social Proof / Benefits: Share that many people are already using this to create shelves, tables, benches, and more.

9. Call to Action #2 / Soft Urgency: Encourage viewers to click now to watch the presentation while it's still available.`;

    guidelines = `
- Use soft language like "may help", "could support", "many people find"
- Avoid specific timeframes, guarantees, or financial claims
- Do not reference "income," "results in X days," or "guaranteed success"
- Focus on personal development, creativity, and practical skill-building
- Include expert or creator's credentials if provided
- Keep the tone warm, clear, and educational — never hypey or salesy
- Final CTA must focus on watching a free educational video — no hard sells`;

    tone = "Friendly, helpful, empowering";
  } else {
    // Universal template
    systemPrompt = `You are an expert YouTube ad copywriter. Your task is to write a compliant, curiosity-driven YouTube ad script for the provided offer that converts cold traffic and passes YouTube's compliance filters.`;
    
    structure = `
1. Qualify the Audience / Open Loop: Start with a question or bold statement about a common struggle in the niche. Dispel a myth or belief most people have. Tease a unique method or surprising discovery.

2. What's in It for Them: Describe how this method may help — emotionally or practically. Show what users could experience if it works for them.

3. Call Out Audience + Agitate Pain Points: Speak directly to the audience. Highlight daily frustrations or challenges. Make them feel understood.

4. Establish Authority + Mechanism: Introduce the expert who discovered this method. Briefly explain the mechanism or process behind the results (without hype).

5. Provide the Solution / New Opportunity: Explain how this method works and how it's different from what they've tried. Position it as a simple new opportunity.

6. Call to Action #1: Tell them exactly what to do: watch the video, learn more, or discover how it works.

7. Value Perception: Explain why past solutions didn't work. Highlight why this is easier, smarter, or more natural.

8. Social Proof / Benefits: Mention how others are using it or how it's spreading quickly. Use soft language like "many report," "thousands are turning to..."

9. Call to Action #2 / Soft Urgency: Reinforce the benefit of taking action now — and that the video or demo may not be up for long.`;

    guidelines = `
- Use soft, compliant phrasing: "may help," "could support," "many people find"
- Do NOT guarantee results, specific timeframes, or outcome claims
- Do NOT mention money, income, or health cures unless provided by compliant testimonial context
- Always frame offer as educational, valuable, curiosity-driven
- End with clear, soft CTA inviting to watch free presentation or learn how it works`;

    tone = "Educational, helpful, curiosity-driven, emotionally engaging";
  }

  const userPrompt = `
Product Information:
${productInfo}

Write a YouTube ad script following this structure:
${structure}

Guidelines:
${guidelines}

Tone: ${tone}
Word Count: ${wordCount}

Generate the script now. Output only the script text, no additional commentary.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const script = response.choices[0]?.message?.content || "";
    const words = script.trim().split(/\s+/).length;

    return {
      script: script.trim(),
      wordCount: words,
    };
  } catch (error: any) {
    console.error("[Script Generation] Failed:", error.message);
    throw new Error(`Script generation failed: ${error.message}`);
  }
}

/**
 * Generate ClickMagick tracking URL
 */
export interface ClickMagickTrackingOptions {
  baseUrl: string; // The landing page or affiliate link
  utmSource: string; // product/niche name
  utmMedium: string; // account nickname
  utmCampaign: string; // campaign name
  utmTerm?: string; // video name / testing elements
  utmContent?: string; // extra variable
}

export function generateClickMagickUrl(options: ClickMagickTrackingOptions): string {
  const { baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = options;

  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", utmSource);
  url.searchParams.set("utm_medium", utmMedium);
  url.searchParams.set("utm_campaign", utmCampaign);
  
  if (utmTerm) {
    url.searchParams.set("utm_term", utmTerm);
  }
  
  if (utmContent) {
    url.searchParams.set("utm_content", utmContent);
  }

  return url.toString();
}

/**
 * Video generation placeholder
 * In production, integrate with Runway, Pika, or other video generation API
 */
export interface GenerateVideoOptions {
  script: string;
  audioUrl: string;
  niche: string;
  style?: string;
}

export async function generateVideo(options: GenerateVideoOptions): Promise<{
  videoUrl: string;
  videoKey: string;
  thumbnailUrl: string;
  duration: number;
}> {
  // Placeholder implementation
  // In production, integrate with video generation API
  
  console.log("[Video Generation] Starting video generation...");
  console.log("[Video Generation] Script length:", options.script.length);
  console.log("[Video Generation] Audio URL:", options.audioUrl);
  console.log("[Video Generation] Niche:", options.niche);

  // For now, return placeholder data
  // TODO: Integrate with actual video generation service (Runway, Pika, etc.)
  
  throw new Error("Video generation service not yet configured. Please integrate Runway, Pika, or another video generation API.");
}
