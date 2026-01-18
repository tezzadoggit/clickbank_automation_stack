import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Video, Mic, Link as LinkIcon, Download, Sparkles, Zap } from "lucide-react";

type VideoModel = "veo3" | "veo3.1_fast" | "gen4_turbo";

export default function VideoCreator() {
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [productInfo, setProductInfo] = useState("");
  const [niche, setNiche] = useState<"manifestation" | "woodworking" | "prepping" | "health" | "finance" | "other">("manifestation");
  const [promptTemplate, setPromptTemplate] = useState<"manifestation" | "survival" | "woodworking" | "universal">("universal");
  const [script, setScript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [voiceoverUrl, setVoiceoverUrl] = useState("");
  const [selectedModel, setSelectedModel] = useState<VideoModel>("veo3");
  const [videoUrl, setVideoUrl] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [utmParams, setUtmParams] = useState({
    source: "",
    medium: "youtube",
    campaign: "",
    term: "",
    content: "",
  });

  const { data: offers } = trpc.offers.list.useQuery();
  const { data: voices } = trpc.video.getVoices.useQuery(
    { apiKey: process.env.ELEVENLABS_API_KEY || "" },
    { enabled: step >= 3 }
  );

  const generateScriptMutation = trpc.video.generateScript.useMutation({
    onSuccess: (data) => {
      setScript(data.script);
      setWordCount(data.wordCount);
      setStep(3);
      toast.success(`Script generated! ${data.wordCount} words`);
    },
    onError: (error) => {
      toast.error(`Failed to generate script: ${error.message}`);
    },
  });

  const generateVoiceoverMutation = trpc.video.generateVoiceover.useMutation({
    onSuccess: (data) => {
      setVoiceoverUrl(data.audioUrl);
      // Note: projectId would need to be returned from the mutation
      setStep(4);
      toast.success("Voice-over generated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to generate voice-over: ${error.message}`);
    },
  });

  const generateVideoMutation = trpc.video.generateVideoRunway.useMutation({
    onSuccess: (data) => {
      setVideoUrl(data.videoUrl);
      toast.success(`Video generated with ${data.model}! Duration: ${data.duration}s`);
    },
    onError: (error) => {
      toast.error(`Failed to generate video: ${error.message}`);
    },
  });

  const generateTrackingUrlMutation = trpc.video.generateTrackingUrl.useMutation({
    onSuccess: (data) => {
      setTrackingUrl(data.trackingUrl);
      toast.success("Tracking URL generated!");
    },
    onError: (error) => {
      toast.error(`Failed to generate tracking URL: ${error.message}`);
    },
  });

  const handleGenerateScript = () => {
    if (!productInfo || productInfo.length < 20) {
      toast.error("Please provide at least 20 characters of product information");
      return;
    }

    generateScriptMutation.mutate({
      niche,
      productInfo,
      promptTemplate,
    });
  };

  const handleGenerateVoiceover = () => {
    if (!selectedVoiceId) {
      toast.error("Please select a voice");
      return;
    }

    generateVoiceoverMutation.mutate({
      text: script,
      voiceId: selectedVoiceId,
      apiKey: process.env.ELEVENLABS_API_KEY || "",
    });
  };

  const handleGenerateVideo = () => {
    if (!projectId) {
      toast.error("Please generate voice-over first");
      return;
    }

    generateVideoMutation.mutate({
      projectId,
      model: selectedModel,
      thumbnailUrl: undefined, // TODO: Add thumbnail generation for gen4_turbo
    });
  };

  const handleGenerateTrackingUrl = () => {
    const selectedOffer = offers?.find((o) => o.id === selectedOfferId);
    if (!selectedOffer || !selectedOffer.affiliatePageUrl) {
      toast.error("Please select an offer with an affiliate link");
      return;
    }

    if (!utmParams.source || !utmParams.medium || !utmParams.campaign) {
      toast.error("Please fill in Source, Medium, and Campaign");
      return;
    }

    generateTrackingUrlMutation.mutate({
      baseUrl: selectedOffer.affiliatePageUrl,
      utmSource: utmParams.source,
      utmMedium: utmParams.medium,
      utmCampaign: utmParams.campaign,
      utmTerm: utmParams.term || undefined,
      utmContent: utmParams.content || undefined,
    });
  };

  const modelInfo = {
    veo3: {
      name: "Veo 3 (FREE)",
      description: "Google's Veo 3 via Gemini API - Zero cost",
      cost: "FREE",
      icon: Sparkles,
      color: "text-green-600",
    },
    "veo3.1_fast": {
      name: "Veo 3.1 Fast",
      description: "Fast text-to-video via Runway",
      cost: "$1.20 per 8s",
      icon: Zap,
      color: "text-blue-600",
    },
    gen4_turbo: {
      name: "Gen-4 Turbo",
      description: "Highest quality image-to-video",
      cost: "$0.25 per 5s",
      icon: Video,
      color: "text-purple-600",
    },
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Ad Video Creator</h1>
        <p className="text-muted-foreground">
          Generate compliant YouTube ad scripts, voice-overs, and videos using proven $500/Day formulas
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Offer & Info" },
          { num: 2, label: "Generate Script" },
          { num: 3, label: "Voice-over" },
          { num: 4, label: "Video & Export" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.num}
              </div>
              <span className="text-xs mt-2 text-center">{s.label}</span>
            </div>
            {idx < 3 && (
              <div
                className={`h-1 flex-1 ${
                  step > s.num ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Offer */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Offer & Provide Product Info</CardTitle>
            <CardDescription>
              Choose the ClickBank offer you want to promote and provide key details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offer">Select Offer</Label>
              <Select
                value={selectedOfferId?.toString() || ""}
                onValueChange={(val) => setSelectedOfferId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an offer..." />
                </SelectTrigger>
                <SelectContent>
                  {offers?.map((offer) => (
                    <SelectItem key={offer.id} value={offer.id.toString()}>
                      {offer.productName} ({offer.niche})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select value={niche} onValueChange={(val: any) => setNiche(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manifestation">Manifestation / Brain Optimization</SelectItem>
                  <SelectItem value="woodworking">Woodworking / DIY</SelectItem>
                  <SelectItem value="prepping">Prepping / Survival</SelectItem>
                  <SelectItem value="health">Health / Fitness</SelectItem>
                  <SelectItem value="finance">Finance / Wealth</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Script Template</Label>
              <Select value={promptTemplate} onValueChange={(val: any) => setPromptTemplate(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manifestation">Manifestation / Brain Optimization</SelectItem>
                  <SelectItem value="survival">Survival / Energy Independence</SelectItem>
                  <SelectItem value="woodworking">Woodworking / DIY</SelectItem>
                  <SelectItem value="universal">Universal (Any Niche)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productInfo">Product Information (4-5 sentences)</Label>
              <Textarea
                id="productInfo"
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                placeholder="Describe your offer in 4-5 sentences. Include what it does, who it's for, and the main benefit..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {productInfo.length} characters • Minimum 20 characters
              </p>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedOfferId || productInfo.length < 20}
              className="w-full"
            >
              Continue to Script Generation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Generate Script */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Generate YouTube Ad Script</CardTitle>
            <CardDescription>
              AI will create a compliant script using the $500/Day formula for your niche
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {script ? (
              <>
                <div className="space-y-2">
                  <Label>Generated Script ({wordCount} words)</Label>
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={12}
                    className="resize-none font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue to Voice-over
                  </Button>
                  <Button onClick={handleGenerateScript} variant="outline" disabled={generateScriptMutation.isPending}>
                    {generateScriptMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Regenerate
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={handleGenerateScript}
                disabled={generateScriptMutation.isPending}
                className="w-full"
              >
                {generateScriptMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script with AI
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generate Voice-over */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Generate Voice-over</CardTitle>
            <CardDescription>
              Select a voice and generate professional audio with ElevenLabs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!voiceoverUrl ? (
              <>
                <div className="space-y-2">
                  <Label>Select Voice</Label>
                  <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {voices?.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleGenerateVoiceover}
                  disabled={generateVoiceoverMutation.isPending || !selectedVoiceId}
                  className="w-full"
                >
                  {generateVoiceoverMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Mic className="mr-2 h-4 w-4" />
                  Generate Voice-over
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Voice-over Audio</Label>
                  <audio controls src={voiceoverUrl} className="w-full" />
                </div>
                <Button onClick={() => setStep(4)} className="w-full">
                  Continue to Video Generation
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generate Video & Export */}
      {step === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Generate Video</CardTitle>
              <CardDescription>
                Choose your video generation model and create the final video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Video Generation Model</Label>
                <RadioGroup value={selectedModel} onValueChange={(val) => setSelectedModel(val as VideoModel)}>
                  {(Object.keys(modelInfo) as VideoModel[]).map((model) => {
                    const info = modelInfo[model];
                    const Icon = info.icon;
                    return (
                      <div key={model} className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value={model} id={model} />
                        <Label htmlFor={model} className="flex-1 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <Icon className={`h-5 w-5 mt-0.5 ${info.color}`} />
                            <div className="flex-1">
                              <div className="font-semibold">{info.name}</div>
                              <div className="text-sm text-muted-foreground">{info.description}</div>
                            </div>
                            <div className="text-sm font-semibold">{info.cost}</div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {!videoUrl ? (
                <Button
                  onClick={handleGenerateVideo}
                  disabled={generateVideoMutation.isPending}
                  className="w-full"
                >
                  {generateVideoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Video className="mr-2 h-4 w-4" />
                  Generate Video
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label>Generated Video</Label>
                  <video controls src={videoUrl} className="w-full rounded-lg" />
                  <a href={videoUrl} download className="w-full">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ClickMagick Tracking URL</CardTitle>
              <CardDescription>
                Generate a tracking URL with UTM parameters for performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source *</Label>
                  <Input
                    value={utmParams.source}
                    onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                    placeholder="e.g., manifestation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Medium *</Label>
                  <Input
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                    placeholder="e.g., youtube"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Campaign *</Label>
                  <Input
                    value={utmParams.campaign}
                    onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                    placeholder="e.g., neuro-energizer-jan-2026"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateTrackingUrl}
                disabled={generateTrackingUrlMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {generateTrackingUrlMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LinkIcon className="mr-2 h-4 w-4" />
                Generate Tracking URL
              </Button>

              {trackingUrl && (
                <div className="space-y-2">
                  <Label>Your Tracking URL</Label>
                  <div className="flex gap-2">
                    <Input value={trackingUrl} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(trackingUrl);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle>Export Your Assets</CardTitle>
              <CardDescription>Download all generated files for your YouTube ad campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(script)}`} download="script.txt" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Script (.txt)
                </Button>
              </a>
              {voiceoverUrl && (
                <a href={voiceoverUrl} download="voiceover.mp3" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Voice-over (.mp3)
                  </Button>
                </a>
              )}
              {videoUrl && (
                <a href={videoUrl} download="video.mp4" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Video (.mp4)
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
