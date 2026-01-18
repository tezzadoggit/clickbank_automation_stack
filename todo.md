# ClickBank Automation Stack - Project TODO

## Core Features

### Database & Backend
- [x] Design database schema for offers, landing pages, campaigns, performance tracking
- [x] Create tRPC procedures for offer management (CRUD operations)
- [x] Create tRPC procedures for landing page generation
- [x] Create tRPC procedures for performance tracking
- [x] Create tRPC procedures for A/B testing management
- [x] Create tRPC procedures for email sequence management
- [x] Create tRPC procedures for compliance checking

### AI Content Generation
- [x] Integrate Gemini API for headline and ad copy generation
- [x] Integrate Gemini API for image/thumbnail generation
- [x] Build prompt templates for niche-specific content (Manifestation, Woodworking, Prepping)
- [x] Create copywriting element library from provided PDFs
- [x] Build compliance checker using AI to scan for prohibited claims

### Frontend - Dashboard
- [x] Create main dashboard layout with sidebar navigation
- [x] Build offer management dashboard with metrics display
- [ ] Create performance tracking dashboard with charts
- [ ] Build A/B testing manager interface
- [ ] Create niche strategy library viewer

### Frontend - Offer Management
- [ ] Build offer discovery and evaluation tool
- [ ] Create offer detail page with metrics and analysis
- [ ] Build offer recommendation system based on 5-step framework
- [ ] Create offer comparison tool

### Frontend - Content Generation
- [ ] Build AI-powered landing page generator interface
- [ ] Create headline and ad copy generator with niche hooks
- [ ] Build image/thumbnail generator for social media
- [ ] Create email sequence builder with templates
- [ ] Build compliance checker interface

### Frontend - Analytics & Tracking
- [ ] Create performance dashboard with EPC, CPC, conversions
- [ ] Build revenue tracking per offer
- [ ] Create click tracking visualization
- [ ] Build conversion funnel analysis

### Testing & Deployment
- [x] Write vitest tests for all tRPC procedures
- [ ] Test AI content generation workflows
- [ ] Test offer management workflows
- [ ] Test performance tracking accuracy
- [x] Create initial project checkpoint

## Video Automation Features

### Backend - Video Generation
- [x] Extend database schema for video projects (scripts, voice-overs, videos)
- [x] Create tRPC procedures for video script generation using $500/Day prompts
- [x] Integrate ElevenLabs API for text-to-speech voice-over generation
- [ ] Integrate video generation API (Runway/Pika/other)
- [ ] Create video rendering pipeline (script → voice → visuals → export)
- [x] Add ClickMagick tracking link generation
- [x] Store video assets in S3

### Frontend - Video Creator
- [x] Build video script generator UI with niche-specific templates
- [x] Create voice-over selection and generation interface
- [ ] Build video preview and editing interface
- [x] Add ClickMagick tracking link builder
- [x] Create video export and download functionality
- [ ] Build video project management dashboard

### Integration & Testing
- [x] Request ElevenLabs API key from user
- [x] Test complete video generation pipeline
- [x] Verify ClickMagick tracking integration
- [x] Test YouTube ad format compliance
- [ ] Create checkpoint with video automation features
