# Video Automation Research Notes

## Source: $500/Day AI Script Prompts PDF

### Overview
- Proven, pre-tested AI prompts for generating fully-compliant, high-converting YouTube video scripts
- Optimized for maximum conversion
- 100% plug-and-play with ChatGPT or any AI tool
- Modeled after $500+ scripts from top-tier copywriters
- Word Count: 240-320 words per script
- Tone: Educational, helpful, curiosity-driven, emotionally engaging

### Script Structure (9-Part Framework)

1. **Qualify the Audience / Open Loop**
   - Start with question or bold statement about common struggle
   - Dispel a myth or belief
   - Tease a unique method or surprising discovery

2. **What's in It for Them**
   - Describe how method may help (emotionally or practically)
   - Show what users could experience if it works

3. **Call Out Audience + Agitate Pain Points**
   - Speak directly to audience
   - Highlight daily frustrations or challenges
   - Make them feel understood

4. **Establish Authority + Mechanism**
   - Introduce the expert who discovered this method
   - Briefly explain the mechanism or process behind results (without hype)

5. **Provide the Solution / New Opportunity**
   - Explain how this method works
   - How it differs from what they've tried
   - Position as simple new opportunity

6. **Call to Action #1**
   - Tell them exactly what to do: watch the video, learn more, discover how it works

7. **Value Perception**
   - Explain why past solutions didn't work
   - Highlight why this is easier, smarter, or more natural

8. **Social Proof / Benefits**
   - Mention how others are using it or how it's spreading quickly
   - Use soft language like "many report," "thousands are turning to..."

9. **Call to Action #2 / Soft Urgency**
   - Reinforce benefit of taking action now
   - Note that video or demo may not be up for long

### Niche-Specific Prompts

#### Manifestation / Brain Optimization
- **Target**: People interested in brain enhancement, manifestation
- **Hook**: Question why typical manifestation techniques don't work
- **Mechanism**: Sound-based protocol, brainwave alignment, science-backed method
- **Tone**: Scientific, thoughtful, curiosity-driven
- **Compliance**: Use "may support," "could improve," "many people report"
- **Avoid**: Guaranteeing results, speed, wealth, or success
- **Avoid**: References to curing depression, trauma, anxiety
- **Avoid**: Phrases like "instantly attract," "manifest thousands," "reprogram in 5 minutes"
- **CTA**: Direct to educational resource, never "buy now"

#### Survival / Energy Independence (Prepping)
- **Target**: Homeowners, campers, preppers
- **Hook**: "What happens if the grid fails?"
- **Mechanism**: Repurposed energy design, battery hack, off-grid system
- **Tone**: Calm, empowering, education-focused
- **Compliance**: Use "many are turning to..." or "could provide backup support"
- **Avoid**: Claims of cutting power bills in half or "run your whole house"
- **Avoid**: Fear-mongering or doomsday language
- **Focus**: Peace of mind and preparedness skills
- **CTA**: Educational video showing how it works

#### Woodworking / DIY
- **Target**: Beginners, hobbyists, anyone who felt stuck or overwhelmed
- **Hook**: Curiosity-driven question related to woodworking struggles
- **Mechanism**: Easy-to-follow blueprints, project planner, material guides
- **Tone**: Friendly, helpful, empowering
- **Compliance**: Use "may help," "could support," "many people find"
- **Avoid**: Specific timeframes, guarantees, financial claims
- **Avoid**: References to "income," "results in X days," "guaranteed success"
- **Focus**: Personal development, creativity, practical skill-building
- **CTA**: Free step-by-step video or training

### Universal Compliance Guidelines
- Use soft, compliant phrasing: "may help," "could support," "many people find"
- Do NOT guarantee results, specific timeframes, or outcome claims
- Do NOT mention money, income, or health cures unless provided by compliant testimonial context
- Always frame offer as educational, valuable, curiosity-driven
- End with clear, soft CTA inviting to watch free presentation or learn how it works
- Must be 240-320 words
- Tone: Educational, helpful, curiosity-driven, emotionally engaging

---

## Source: ClickMagick Tracking Setup Guide

### Overview
ClickMagick is used for tracking YouTube ad performance with Google Ads and ClickBank conversions.

### Setup Steps

1. **Create ClickMagick Account**
   - 30-day free trial available

2. **Connect Landing Page to ClickMagick**
   - Go to Set Up > "Website Code" > Click "Custom Code"
   - Copy website code from ClickMagick
   - Add `log_action: '.cta',` after Project Name line
   - Paste code into landing page `<head>` section
   - Add "cta" CSS class to any link you want to track as "click through"

3. **Add Affiliate Link / Hop Link**
   - Go to Affiliate Link Builder in ClickMagick
   - Select network (ClickBank)
   - Select "Campaigns"
   - Enter affiliate link
   - Generate new link
   - Place link on lander for all product page links

4. **Connect ClickMagick to ClickBank**
   - Track Sales: https://www.clickmagick.com/kb/?answer=95
   - Track Checkouts/Engagements: https://www.clickmagick.com/user/kb/?answer=585

5. **Connect ClickMagick to Google Ad Account**
   - Click account picture > "integrations"
   - Login with Google Account and select ad account
   - Go To "Tools" > "Audience Optimisation"
   - Select "Google Ads" > "automatic" > "Enable"
   - Create "Default Conversion Action" in Google Ads
   - Back in ClickMagick: Select "Default Conversion Action" and Save
   - Click Advanced Rules, name it your niche
   - In "Conversion Rules" Select your conversion event
   - Match All > UTM_SOURCE = Your SOURCE UTM

6. **Create URL Tracking Link & Test**
   - Use URL builder tool
   - Make entry for at least first 3 UTM parameters:
     - **Source**: product/niche name
     - **Medium**: account nickname
     - **Campaign**: campaign name
     - **Term**: video name / Testing elements
     - **Content**: extra variable to add if you wish
   - Turn on Auto Cost Update: Google Ads
   - Test entire funnel to ensure tracking works

### Key Tracking Elements
- ClickMagick tracks: Clicks, Actions, Engagements
- Integrates with Google Ads for cost tracking
- Tracks ClickBank sales and checkouts
- UTM parameters for granular campaign tracking

---

## Video Automation Workflow

### Complete Pipeline
1. **Script Generation** (AI using $500/Day prompts)
   - Select offer
   - Choose niche-specific prompt template
   - Generate 240-320 word compliant script
   
2. **Voice-over Generation** (ElevenLabs API)
   - Convert script to natural voice
   - Select appropriate voice for niche
   
3. **Video Visual Generation** (AI Video Service)
   - Generate B-roll visuals matching script
   - YouTube ad format (interruption ads)
   
4. **Tracking Integration** (ClickMagick)
   - Generate tracking links with UTM parameters
   - Add to landing page CTA buttons
   - Connect to Google Ads and ClickBank

5. **Export & Deploy**
   - Export final video with audio
   - Upload to YouTube Ads
   - Monitor performance in ClickMagick dashboard

### Technical Requirements
- ElevenLabs API key (text-to-speech)
- Video generation API (TBD - options: Runway, Pika, etc.)
- ClickMagick account for tracking
- Google Ads account
- ClickBank affiliate account
