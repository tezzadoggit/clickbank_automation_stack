# Runway API Models

## Available Models for Video Generation

### gen4_turbo
- **Input:** Image → Video
- **Output:** Video
- **Pricing:** 5 credits/sec
- **Note:** Image-to-video only, NOT text-to-video

### gen4_aleph
- **Input:** Video + Text/Image → Video
- **Output:** Video  
- **Pricing:** 15 credits/sec
- **Note:** Video editing/extension with text/image guidance

### veo3, veo3.1, veo3.1_fast
- **Input:** Text or Image → Video
- **Output:** Video
- **Pricing:** 40 credits/sec (veo3, veo3.1), 15 credits/sec (veo3.1_fast)
- **Note:** These are Google Veo models, support text-to-video

## Key Finding

**gen4_turbo does NOT support text-to-video!**
- It's image-to-video only
- For text-to-video, we need to use:
  1. **veo3.1_fast** (cheapest at 15 credits/sec)
  2. **veo3** or **veo3.1** (higher quality at 40 credits/sec)

## Recommendation

Use **veo3.1_fast** for YouTube ad generation:
- Supports text-to-video ✅
- Cheaper than veo3/veo3.1 (15 vs 40 credits/sec)
- Fast generation
- Good quality for ads

Alternative: Use **gen4_image** to generate a still image first, then **gen4_turbo** for image-to-video
