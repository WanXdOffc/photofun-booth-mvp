"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Photo {
  id: number;
  userId: string;
  imageUrl: string;
  shareToken: string;
  filters: any;
  overlays: any;
  createdAt: string;
}

export default function SharePage({ params }: { params: { token: string } }) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadPhoto();
  }, [params.token]);

  const loadPhoto = async () => {
    try {
      const response = await fetch(`/api/photos/share/${params.token}`);
      
      if (response.ok) {
        const data = await response.json();
        setPhoto(data);
      } else {
        setError("Photo not found");
      }
    } catch (error) {
      console.error("Error loading photo:", error);
      setError("Failed to load photo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!photo) return;
    
    const link = document.createElement("a");
    link.href = photo.imageUrl;
    link.download = `shared-photo-${photo.id}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">Photo Not Found</h1>
          <p className="text-muted-foreground">
            The photo you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>
            <Camera className="mr-2 h-4 w-4" />
            Go to PhotoBooth
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <h1 className="text-2xl font-bold">PhotoBooth</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Shared Photo</h2>
            <p className="text-muted-foreground">
              Someone shared this photo with you!
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <img
              src={photo.imageUrl}
              alt="Shared photo"
              className="w-full rounded-lg"
            />
            
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Photo
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Camera className="mr-2 h-4 w-4" />
                Create Your Own
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
