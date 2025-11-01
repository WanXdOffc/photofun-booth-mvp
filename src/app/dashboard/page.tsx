"use client";

import { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/photobooth/CameraCapture";
import { PhotoEditor } from "@/components/photobooth/PhotoEditor";
import { LogOut, Loader2, Camera, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoGallery } from "@/components/photobooth/PhotoGallery";

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    refetch();
    router.push("/");
  };

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleSave = async (imageData: string, filters: any, overlays: any) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          imageUrl: imageData,
          filters: JSON.stringify(filters),
          overlays: JSON.stringify(overlays),
        }),
      });

      if (response.ok) {
        setCapturedImage(null);
        // Refresh gallery
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <h1 className="text-2xl font-bold">PhotoBooth</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {capturedImage ? (
          <PhotoEditor
            imageData={capturedImage}
            onSave={handleSave}
            onCancel={() => setCapturedImage(null)}
          />
        ) : (
          <Tabs defaultValue="capture" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="capture">
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <ImageIcon className="mr-2 h-4 w-4" />
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capture" className="space-y-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Take a Photo
                </h2>
                <CameraCapture onCapture={handleCapture} />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Your Photos
              </h2>
              <PhotoGallery userId={session.user.id} />
            </TabsContent>
          </tabs>
        )}
      </main>
    </div>
  );
}
