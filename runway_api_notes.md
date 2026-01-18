# Runway API Integration Notes

## Key Findings

**Gen-4.5 Status:**
- Gen-4.5 is Runway's latest and most advanced model (released Dec 2025)
- **API access for Gen-4.5 is "coming soon"** - not yet available via API
- Currently available via API: Gen-4 Turbo, Gen-4 Image

**Available Models via API:**
1. **Gen-4 Turbo** - Fast video generation (text-to-video, image-to-video)
2. **Gen-4 Image** - Image generation with reference images
3. Gen-3 Alpha (older model)

**Gen-4.5 Features (when API becomes available):**
- State-of-the-art motion quality
- Better prompt adherence
- Higher visual fidelity
- Excels at complex, sequenced instructions
- Detailed camera choreography
- 720p 16:9 video output
- Text-to-video only (image-to-video coming soon)

## Integration Plan

**Phase 1: Integrate Gen-4 Turbo (Available Now)**
- Use Gen-4 Turbo for immediate video generation
- Text-to-video from YouTube ad scripts
- Image-to-video for product showcases

**Phase 2: Upgrade to Gen-4.5 (When Available)**
- Switch to Gen-4.5 API when Runway releases it
- Better quality and prompt adherence
- Notify user via developer email when available

## API Details

**Authentication:**
- API key required (starts with `rw_`)
- Get from https://dev.runwayml.com/

**SDK:**
- Node.js: `@runwayml/sdk`
- Python: Available

**Workflow:**
1. Create task with `client.textToVideo.create()`
2. Wait for completion with `.waitForTaskOutput()`
3. Get video URL from `task.output[0]`

**Pricing Tiers:**
- Self-serve tiers available
- Enterprise options for higher usage
- Rate limits apply

## Implementation Strategy

For ClickBank automation platform:
1. Integrate Gen-4 Turbo immediately
2. Generate videos from YouTube ad scripts
3. Sync video to ElevenLabs voice-over audio
4. Monitor for Gen-4.5 API release
5. Upgrade to Gen-4.5 when available
