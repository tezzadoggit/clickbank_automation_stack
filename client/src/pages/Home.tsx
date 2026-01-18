import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  TrendingUp, 
  FileText, 
  Mail, 
  BarChart3, 
  Sparkles, 
  Shield,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Affiliate Marketing
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Your ClickBank
              <span className="block text-purple-600">Affiliate Success</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover high-converting offers, generate landing pages with AI, and track performance—all in one powerful platform built for serious affiliates.
            </p>
            
            <div className="flex gap-4 justify-center mb-16">
              <Button size="lg" asChild className="text-lg px-8">
                <a href={getLoginUrl()}>
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/strategies">
                  View Strategies
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="border-2">
                <CardHeader>
                  <Target className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>Smart Offer Selection</CardTitle>
                  <CardDescription>
                    AI-powered evaluation based on Gravity, EPC, and conversion metrics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Sparkles className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>AI Content Generation</CardTitle>
                  <CardDescription>
                    Generate landing pages, ad copy, and email sequences in seconds
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <BarChart3 className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>Performance Tracking</CardTitle>
                  <CardDescription>
                    Monitor clicks, conversions, EPC, and ROI across all your offers
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || "Affiliate Marketer"}!</h1>
        <p className="text-gray-600 mt-2">Here's your affiliate marketing command center</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/offers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="mt-4">Manage Offers</CardTitle>
              <CardDescription>
                Discover, evaluate, and track your ClickBank offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                View All Offers
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/landing-pages">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-blue-600" />
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className="mt-4">Landing Pages</CardTitle>
              <CardDescription>
                AI-generated landing pages with proven copy formulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Create Landing Page
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/email-sequences">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="mt-4">Email Sequences</CardTitle>
              <CardDescription>
                Automated email nurture sequences for lead conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                View Sequences
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/performance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="mt-4">Performance</CardTitle>
              <CardDescription>
                Track clicks, conversions, EPC, and revenue metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                View Analytics
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/strategies">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="mt-4">Niche Strategies</CardTitle>
              <CardDescription>
                Proven hooks, traffic sources, and marketing angles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Browse Strategies
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="mt-4">Compliance Checker</CardTitle>
              <CardDescription>
                Verify your copy meets FTC and advertising standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start">
                Check Compliance
                <ArrowRight className="ml-auto w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get up and running in 4 simple steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <strong>Add Your First Offer</strong> - Import ClickBank offers with metrics (Gravity, EPC, Commission)
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <strong>Generate Landing Page</strong> - Let AI create high-converting copy and visuals
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <strong>Create Email Sequence</strong> - Build automated nurture campaigns
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <strong>Track Performance</strong> - Monitor conversions and optimize for maximum ROI
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
