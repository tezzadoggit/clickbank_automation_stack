import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link as LinkIcon, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function Offers() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [scrapedData, setScrapedData] = useState<any>(null);

  const { data: offers, isLoading, refetch } = trpc.offers.list.useQuery();

  const importFromUrlMutation = trpc.offers.importFromUrl.useMutation({
    onSuccess: (data) => {
      setScrapedData(data.productInfo);
      toast.success("Product information extracted successfully!");
      refetch();
      setImportDialogOpen(false);
      setImportUrl("");
      setScrapedData(null);
    },
    onError: (error) => {
      toast.error(`Failed to import: ${error.message}`);
    },
  });

  const handleImport = () => {
    if (!importUrl) {
      toast.error("Please enter a URL");
      return;
    }

    importFromUrlMutation.mutate({ url: importUrl });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Offers</h1>
          <p className="text-muted-foreground mt-2">
            Manage ClickBank offers and custom affiliate products
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Import from URL
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add ClickBank Offer
          </Button>
        </div>
      </div>

      {/* Offers Grid */}
      {offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{offer.productName}</CardTitle>
                  <Badge variant={offer.source === "clickbank" ? "default" : "secondary"}>
                    {offer.source === "clickbank" ? "ClickBank" : "Custom"}
                  </Badge>
                </div>
                <CardDescription>{offer.vendor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Niche</span>
                    <Badge variant="outline">{offer.niche}</Badge>
                  </div>
                  
                  {offer.source === "clickbank" && offer.gravity && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gravity</span>
                      <span className="font-medium">{offer.gravity}</span>
                    </div>
                  )}
                  
                  {offer.avgEarningsPerSale && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg Earnings</span>
                      <span className="font-medium text-green-600">
                        ${(offer.avgEarningsPerSale / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {offer.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Generate Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Import your first affiliate offer from any URL or add a ClickBank product
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Import from URL
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add ClickBank Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import from URL Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Offer from URL</DialogTitle>
            <DialogDescription>
              Paste any affiliate page URL (Gamma, JVZoo, WarriorPlus, etc.) and we'll extract the product information automatically.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Affiliate Page URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/affiliate-offer"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                disabled={importFromUrlMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Works with any sales page or affiliate funnel
              </p>
            </div>

            {scrapedData && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Extracted Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Product:</span> {scrapedData.productName}
                  </div>
                  <div>
                    <span className="font-medium">Vendor:</span> {scrapedData.vendor}
                  </div>
                  <div>
                    <span className="font-medium">Niche:</span> {scrapedData.niche}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {scrapedData.description}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setImportUrl("");
                setScrapedData(null);
              }}
              disabled={importFromUrlMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={importFromUrlMutation.isPending || !importUrl}
            >
              {importFromUrlMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
