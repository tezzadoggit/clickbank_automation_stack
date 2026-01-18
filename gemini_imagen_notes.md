# Gemini Imagen API Research

## Key Findings

### API Endpoint
- Use `google-genai` Python SDK
- Model: `imagen-4.0-generate-001` (latest)
- Method: `client.models.generate_images()`

### Configuration Options
- `number_of_images`: 1-4 (default 4)
- `aspect_ratio`: "1:1", "3:4", "4:3", "9:16", "16:9"
- `person_generation`: "dont_allow", "allow_adult", "allow_all"

### For YouTube Thumbnails
- Use `aspect_ratio="16:9"` (1280x720)
- Maximum prompt length: 480 tokens
- Images include SynthID watermark

### Prompt Best Practices
1. Start with subject, context, style
2. Use descriptive language
3. Specify photography style (e.g., "A photo of...")
4. Keep prompts clear and detailed
5. Iterate to refine results

### Implementation Plan
Since the Python SDK is required and we're in a Node.js environment, we need to:
1. Install `google-genai` Python package
2. Create a Python script for image generation
3. Call it from Node.js backend
4. Upload generated images to S3

OR

Use the REST API directly from Node.js (simpler approach).
