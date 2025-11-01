"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Trash2, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "qrcode";

interface Photo {
  id: number;
  userId: string;
  imageUrl: string;
  shareToken: string;
  filters: any;
  overlays: any;
  createdAt: string;
}

export function PhotoGallery({ userId }: { userId: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [userId]);

  const loadPhotos = async () => {
    try {
      const response = await fetch(`/api/photos?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (photo: Photo) => {
    setSelectedPhoto(photo);
    const shareUrl = `${window.location.origin}/share/${photo.shareToken}`;
    
    try {
      const qrCode = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
      });
      setQrCodeUrl(qrCode);
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPhotos(photos.filter((p) => p.id !== photoId));
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.imageUrl;
    link.download = `photo-${photo.id}.png`;
    link.click();
  };

  const copyShareLink = () => {
    if (selectedPhoto) {
      const shareUrl = `${window.location.origin}/share/${selectedPhoto.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No photos yet. Capture your first photo!</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <img
                src={photo.imageUrl}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleShare(photo)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleDownload(photo)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(photo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Photo</DialogTitle>
            <DialogDescription>
              Scan the QR code or copy the link to share your photo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeUrl && (
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={copyShareLink} className="w-full">
                Copy Share Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
