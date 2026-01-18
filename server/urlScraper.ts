import { invokeLLM } from "./_core/llm";
import axios from "axios";

/**
 * Scrapes a URL and extracts product information using Gemini AI
 */
export async function scrapeProductInfo(url: string) {
  try {
    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const html = response.data;

    // Use Gemini to extract structured product information
    const llmResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a product information extractor. Analyze the provided HTML and extract key product details in JSON format.

Extract the following fields:
- productName: The main product/offer name
- vendor: Company or person selling it
- niche: One of: manifestation, woodworking, prepping, health, finance, other
- description: 2-3 sentence description of what the product does
- price: Estimated price (if visible)
- benefits: Array of 3-5 key benefits
- targetAudience: Who this product is for
- headline: Main headline from the sales page
- callToAction: Primary CTA text

Return ONLY valid JSON, no markdown formatting.`,
        },
        {
          role: "user",
          content: `Extract product information from this HTML:\n\n${html.substring(0, 15000)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "product_info",
          strict: true,
          schema: {
            type: "object",
            properties: {
              productName: { type: "string" },
              vendor: { type: "string" },
              niche: {
                type: "string",
                enum: ["manifestation", "woodworking", "prepping", "health", "finance", "other"],
              },
              description: { type: "string" },
              price: { type: "string" },
              benefits: {
                type: "array",
                items: { type: "string" },
              },
              targetAudience: { type: "string" },
              headline: { type: "string" },
              callToAction: { type: "string" },
            },
            required: [
              "productName",
              "vendor",
              "niche",
              "description",
              "benefits",
              "targetAudience",
              "headline",
              "callToAction",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = llmResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from LLM");
    }

    const contentStr = typeof content === "string" ? content : JSON.stringify(content);
    const productInfo = JSON.parse(contentStr);
    return productInfo;
  } catch (error) {
    console.error("Error scraping product info:", error);
    throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export type ScrapedProductInfo = {
  productName: string;
  vendor: string;
  niche: "manifestation" | "woodworking" | "prepping" | "health" | "finance" | "other";
  description: string;
  price: string;
  benefits: string[];
  targetAudience: string;
  headline: string;
  callToAction: string;
};
