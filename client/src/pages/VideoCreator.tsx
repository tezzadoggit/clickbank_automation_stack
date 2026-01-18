import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Video, Mic, Link as LinkIcon, Download } from "lucide-react";

export default function VideoCreator() {
  const [step, setStep] = useState(1);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [productInfo, setProductInfo] = useState("");
  const [niche, setNiche] = useState<"manifestation" | "woodworking" | "prepping" | "health" | "finance" | "other">("manifestation");
  const [promptTemplate, setPromptTemplate] = useState<"manifestation" | "survival" | "woodworking" | "universal">("universal");
  const [script, setScript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [voiceoverUrl, setVoiceoverUrl] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [utmParams, setUtmParams] = useState({
    source: "",
    medium: "",
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
      setStep(4);
      toast.success("Voice-over generated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to generate voice-over: ${error.message}`);
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

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Ad Video Creator</h1>
        <p className="text-muted-foreground">
          Generate compliant YouTube ad scripts and voice-overs using proven $500/Day formulas
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Offer & Info" },
          { num: 2, label: "Generate Script" },
          { num: 3, label: "Voice-over" },
          { num: 4, label: "Tracking & Export" },
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
              Using the $500/Day {promptTemplate} template to create a compliant, high-converting script
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Product Info:</h3>
              <p className="text-sm">{productInfo}</p>
            </div>

            <Button
              onClick={handleGenerateScript}
              disabled={generateScriptMutation.isPending}
              className="w-full"
            >
              {generateScriptMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Generate Script
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full"
            >
              Back
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generate Voice-over */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Generate Voice-over</CardTitle>
            <CardDescription>
              Your script is ready! Now choose a voice and generate the audio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Generated Script:</h3>
                <span className="text-xs text-muted-foreground">{wordCount} words</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{script}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Select Voice</Label>
              <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a voice..." />
                </SelectTrigger>
                <SelectContent>
                  {voices?.map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} {voice.labels?.accent ? `(${voice.labels.accent})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateVoiceover}
              disabled={!selectedVoiceId || generateVoiceoverMutation.isPending}
              className="w-full"
            >
              {generateVoiceoverMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Voice-over...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Generate Voice-over
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Tracking & Export */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Add Tracking & Export</CardTitle>
            <CardDescription>
              Generate your ClickMagick tracking URL and export your video assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {voiceoverUrl && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Voice-over Audio:</h3>
                <audio controls className="w-full" src={voiceoverUrl} />
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href={voiceoverUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Audio
                  </a>
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">ClickMagick Tracking URL</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="utmSource">Source *</Label>
                  <Input
                    id="utmSource"
                    value={utmParams.source}
                    onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
                    placeholder="product/niche name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utmMedium">Medium *</Label>
                  <Input
                    id="utmMedium"
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
                    placeholder="account nickname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utmCampaign">Campaign *</Label>
                  <Input
                    id="utmCampaign"
                    value={utmParams.campaign}
                    onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
                    placeholder="campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utmTerm">Term (Optional)</Label>
                  <Input
                    id="utmTerm"
                    value={utmParams.term}
                    onChange={(e) => setUtmParams({ ...utmParams, term: e.target.value })}
                    placeholder="video name"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateTrackingUrl}
                disabled={generateTrackingUrlMutation.isPending}
                className="w-full"
              >
                {generateTrackingUrlMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Generate Tracking URL
                  </>
                )}
              </Button>

              {trackingUrl && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="mb-2 block">Your Tracking URL:</Label>
                  <Input value={trackingUrl} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(trackingUrl);
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    Copy URL
                  </Button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Export Assets</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => {
                  const blob = new Blob([script], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "youtube-ad-script.txt";
                  a.click();
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Script
                </Button>
                {voiceoverUrl && (
                  <Button variant="outline" asChild>
                    <a href={voiceoverUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Audio
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Create Another Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
