import { invokeLLM } from "./_core/llm";

// ============================================================================
// COPYWRITING ELEMENTS LIBRARY
// ============================================================================

export const AUTHORITY_INTRODUCTIONS = {
  expert_credentials: "According to [Expert Name], a [Credentials] who has studied [Topic] for over [Years]...",
  institution_contributor: "[Expert Name], a former contributor to [Institution], discovered that...",
  leading_researcher: "Leading researcher [Expert Name] from [University/Institution] found that...",
  helped_thousands: "[Expert Name], who has helped thousands of people with [Problem], revealed that...",
};

export const PROBLEM_AGITATION_PHRASES = {
  struggling_explanation: "If you've been struggling with [Problem], this might explain why...",
  common_belief_prevents: "Most people don't realize that [Common Belief] actually prevents [Desired Outcome]...",
  previous_solutions_failed: "The reason [Previous Solutions] haven't worked is because...",
  real_issue_root_cause: "What if the real issue isn't [Surface Problem] but actually [Root Cause]...",
};

export const MECHANISM_INTRODUCTIONS = {
  scientific_discovery: "Recent research has uncovered a [Scientific Discovery] that may help...",
  natural_process: "Scientists have identified a [Natural Process] that could support...",
  breakthrough_method: "This breakthrough method works by [Simple Explanation]...",
  mechanism_affects: "The key lies in understanding how [Mechanism] naturally affects [Result]...",
};

export const SOCIAL_PROOF_STATEMENTS = {
  thousands_explored: "Thousands of people have already explored this method...",
  research_participants: "Research participants reported experiencing [Benefits]...",
  users_discovering: "Users from around the world are discovering how [Method] may help...",
  many_find_supports: "Many people find that this approach supports [Desired Outcome]...",
};

export const EDUCATIONAL_CTAS = {
  watch_presentation: "Click below to watch an educational presentation that explains...",
  see_demonstration: "Tap the button to see a demonstration of how this works...",
  learn_research: "Watch this short video to learn more about the research behind...",
  discover_method: "Click here to discover how this method may help you...",
};

export const BENEFIT_FOCUSED_LANGUAGE = {
  may_help_support: "May help support [Benefit]",
  could_contribute: "Could contribute to [Positive Outcome]",
  useful_for: "Many people find this useful for [Application]",
  research_suggests: "Research suggests this approach may [Benefit]",
  users_report: "Users often report [Experience]",
  designed_to_support: "This method is designed to support [Goal]",
};

export const COMPLIANCE_SAFE_TRANSITIONS = {
  according_to_research: "According to research...",
  studies_suggest: "Studies suggest...",
  many_users_report: "Many users report...",
  experts_believe: "Experts believe...",
  approach_designed: "This approach is designed to...",
  people_often_find: "People often find...",
};

// ============================================================================
// NICHE-SPECIFIC HOOKS
// ============================================================================

export const NICHE_HOOKS = {
  woodworking: [
    "Ever wondered how to create stunning [projects] without expensive tools?",
    "What if you could build professional-quality [items] even as a complete beginner?",
    "Struggling to find detailed plans that actually work?",
    "Most DIY projects fail because of this one missing element...",
  ],
  manifestation: [
    "The real secret to [desired outcome] doesn't start with [common method]...",
    "What if there's a scientific reason why [popular technique] doesn't work for most people?",
    "Scientists studying [topic] uncovered something surprising...",
    "Before you try another [common solution], watch this...",
  ],
  prepping: [
    "What if the ground beneath your feet could power your entire home?",
    "Most people don't realize they can create [solution] using just [simple materials]...",
    "This breakthrough discovery is changing how people think about [problem]...",
    "Did you know you can [achieve goal] using only [accessible resource]?",
  ],
  health: [
    "Scientists studying [topic] discovered something that may surprise you...",
    "What if the real cause of [problem] isn't what you've been told?",
    "Recent research reveals a natural approach that may help support [benefit]...",
    "This might explain why traditional [solutions] haven't worked...",
  ],
};

// ============================================================================
// AI CONTENT GENERATION FUNCTIONS
// ============================================================================

interface GenerateHeadlineAndCopyParams {
  productName: string;
  productDescription: string;
  niche: string;
  mechanism?: string;
  targetAudience?: string;
}

export async function generateHeadlineAndCopy(params: GenerateHeadlineAndCopyParams) {
  const { productName, productDescription, niche, mechanism, targetAudience } = params;
  
  const nicheHooks = NICHE_HOOKS[niche as keyof typeof NICHE_HOOKS] || NICHE_HOOKS.health;
  
  const prompt = `You are an expert direct response copywriter. Based on the description below, write a high-converting affiliate landing page with:

Product Information:
${productDescription}

Product Name: ${productName}
Niche: ${niche}
${mechanism ? `Mechanism/Hook: ${mechanism}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Generate the following:

1. Headline (one sentence, curiosity-driven and specific to the niche and mechanism)

2. Ad Copy (Three Paragraphs):

Paragraph 1: Authority Discovery
Briefly explain how an authority figure (e.g., scientist, doctor, craftsman, researcher) discovered the method or insight. Include the mechanism or unique hook and the core benefit.

Paragraph 2: Social Proof
Mention that thousands of people are already using it and experiencing the benefit. Stay vague and compliant (no income/medical claims).

Paragraph 3: Call to Action
Invite the reader to watch a video to learn how it works and how it could help them too. Keep it simple and curiosity-based.

Rules:
- No promises, guarantees, or bold claims
- Don't invent new mechanisms or names
- Keep it emotional, compliant, and built to convert
- Use niche-appropriate language
- Focus on curiosity and education, not hype

Return your response in this exact JSON format:
{
  "headline": "your headline here",
  "paragraph1": "authority discovery paragraph",
  "paragraph2": "social proof paragraph",
  "paragraph3": "call to action paragraph"
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are an expert direct response copywriter specializing in compliant, high-converting affiliate marketing copy." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "landing_page_copy",
        strict: true,
        schema: {
          type: "object",
          properties: {
            headline: { type: "string", description: "The main headline" },
            paragraph1: { type: "string", description: "Authority discovery paragraph" },
            paragraph2: { type: "string", description: "Social proof paragraph" },
            paragraph3: { type: "string", description: "Call to action paragraph" },
          },
          required: ["headline", "paragraph1", "paragraph2", "paragraph3"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error("No content generated");
  
  return JSON.parse(content);
}

interface GenerateAdCopyVariationsParams {
  productName: string;
  niche: string;
  baseHeadline: string;
  count?: number;
}

export async function generateAdCopyVariations(params: GenerateAdCopyVariationsParams) {
  const { productName, niche, baseHeadline, count = 5 } = params;
  
  const prompt = `You are an expert direct response copywriter. Generate ${count} different headline variations for A/B testing based on this original headline:

Original Headline: "${baseHeadline}"
Product: ${productName}
Niche: ${niche}

Create ${count} variations that:
- Test different emotional hooks (curiosity, urgency, authority, social proof, benefit-focused)
- Maintain compliance (no guarantees or bold claims)
- Stay specific to the niche
- Are roughly the same length as the original

Return your response in this exact JSON format:
{
  "variations": [
    {"headline": "variation 1", "hook_type": "curiosity"},
    {"headline": "variation 2", "hook_type": "authority"},
    ...
  ]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are an expert direct response copywriter specializing in A/B testing and conversion optimization." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "headline_variations",
        strict: true,
        schema: {
          type: "object",
          properties: {
            variations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  headline: { type: "string" },
                  hook_type: { type: "string" },
                },
                required: ["headline", "hook_type"],
                additionalProperties: false,
              },
            },
          },
          required: ["variations"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error("No content generated");
  
  return JSON.parse(content);
}

interface GenerateEmailSequenceParams {
  productName: string;
  productDescription: string;
  niche: string;
  emailCount: number;
}

export async function generateEmailSequence(params: GenerateEmailSequenceParams) {
  const { productName, productDescription, niche, emailCount } = params;
  
  const prompt = `You are an expert email marketer. Create a ${emailCount}-email nurture sequence for this product:

Product: ${productName}
Description: ${productDescription}
Niche: ${niche}

Create ${emailCount} emails that:
- Build trust and educate the reader
- Address common objections
- Use storytelling and social proof
- Maintain compliance (no guarantees or medical/income claims)
- Lead to the sales page naturally
- Each email should be sent 1-2 days apart

For each email, provide:
- Subject line (curiosity-driven, 50 chars or less)
- Preheader text (complement the subject, 80 chars or less)
- Email body (3-5 paragraphs, conversational tone)

Return your response in this exact JSON format:
{
  "emails": [
    {
      "day": 1,
      "subject": "subject line",
      "preheader": "preheader text",
      "body": "full email body with paragraphs separated by \\n\\n"
    },
    ...
  ]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are an expert email marketer specializing in nurture sequences and conversion optimization." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "email_sequence",
        strict: true,
        schema: {
          type: "object",
          properties: {
            emails: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  subject: { type: "string" },
                  preheader: { type: "string" },
                  body: { type: "string" },
                },
                required: ["day", "subject", "preheader", "body"],
                additionalProperties: false,
              },
            },
          },
          required: ["emails"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error("No content generated");
  
  return JSON.parse(content);
}

interface CheckComplianceParams {
  text: string;
  niche: string;
}

export async function checkCompliance(params: CheckComplianceParams) {
  const { text, niche } = params;
  
  const prompt = `You are a compliance expert for affiliate marketing. Review this copy for compliance issues:

Copy to Review:
${text}

Niche: ${niche}

Check for:
1. Income claims or guarantees (not allowed)
2. Medical claims or cure promises (not allowed)
3. Unrealistic promises or guarantees
4. Invented mechanisms or fake credentials
5. Pressure tactics or false scarcity
6. Any FTC violations

Return your response in this exact JSON format:
{
  "is_compliant": true/false,
  "issues": [
    {"type": "income_claim", "text": "problematic text", "suggestion": "how to fix it"},
    ...
  ],
  "overall_score": 0-100,
  "summary": "brief summary of compliance status"
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are a compliance expert specializing in FTC regulations and affiliate marketing guidelines." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "compliance_check",
        strict: true,
        schema: {
          type: "object",
          properties: {
            is_compliant: { type: "boolean" },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  text: { type: "string" },
                  suggestion: { type: "string" },
                },
                required: ["type", "text", "suggestion"],
                additionalProperties: false,
              },
            },
            overall_score: { type: "number" },
            summary: { type: "string" },
          },
          required: ["is_compliant", "issues", "overall_score", "summary"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error("No content generated");
  
  return JSON.parse(content);
}

interface EvaluateOfferParams {
  productName: string;
  gravity: number;
  avgEarningsPerSale: number; // in cents
  avgConversionValue: number; // in cents
  niche: string;
  description?: string;
}

export async function evaluateOffer(params: EvaluateOfferParams) {
  const { productName, gravity, avgEarningsPerSale, avgConversionValue, niche, description } = params;
  
  const prompt = `You are a ClickBank affiliate marketing expert. Evaluate this offer based on the 5-step framework:

Product: ${productName}
Niche: ${niche}
Gravity Score: ${gravity}
Avg Earnings Per Sale: $${(avgEarningsPerSale / 100).toFixed(2)}
Avg Conversion Value: $${(avgConversionValue / 100).toFixed(2)}
${description ? `Description: ${description}` : ''}

Evaluation Criteria:
1. Gravity Score (ideal: 50-200, avoid <20 or >500)
2. Avg $/Conversion (ideal: $100+, caution <$30)
3. Niche alignment and market demand
4. Competition level
5. Overall profit potential

Provide:
- Overall score (0-100)
- Recommendation status (recommended/caution/avoid)
- Detailed analysis for each criterion
- Action items for promoting this offer

Return your response in this exact JSON format:
{
  "overall_score": 0-100,
  "recommendation": "recommended" | "caution" | "avoid",
  "gravity_analysis": "analysis text",
  "earnings_analysis": "analysis text",
  "niche_analysis": "analysis text",
  "competition_analysis": "analysis text",
  "profit_potential": "analysis text",
  "action_items": ["item 1", "item 2", ...],
  "summary": "brief summary"
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are a ClickBank affiliate marketing expert specializing in offer evaluation and selection." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "offer_evaluation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            recommendation: { type: "string" },
            gravity_analysis: { type: "string" },
            earnings_analysis: { type: "string" },
            niche_analysis: { type: "string" },
            competition_analysis: { type: "string" },
            profit_potential: { type: "string" },
            action_items: {
              type: "array",
              items: { type: "string" },
            },
            summary: { type: "string" },
          },
          required: ["overall_score", "recommendation", "gravity_analysis", "earnings_analysis", "niche_analysis", "competition_analysis", "profit_potential", "action_items", "summary"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error("No content generated");
  
  return JSON.parse(content);
}
