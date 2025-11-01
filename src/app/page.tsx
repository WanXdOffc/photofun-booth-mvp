"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Share2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (session?.user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Camera className="h-24 w-24 text-primary" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              PhotoBooth Web App
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Capture amazing photos with fun filters and stickers. Share your memories with QR codes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 py-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Capture</h3>
              <p className="text-muted-foreground">
                Take photos with countdown timer and instant preview
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fun Filters</h3>
              <p className="text-muted-foreground">
                Apply B&W, Sepia, brightness, and add stickers to your photos
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <Share2 className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share your photos with unique QR codes and links
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")} className="text-lg">
              <Camera className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/register")} className="text-lg">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}