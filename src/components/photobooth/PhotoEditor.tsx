"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Save, Download, Share2, X } from "lucide-react";

interface Filters {
  brightness: number;
  contrast: number;
  grayscale: boolean;
  sepia: boolean;
}

interface Overlay {
  type: string;
  id: string;
  x: number;
  y: number;
  emoji: string;
}

interface PhotoEditorProps {
  imageData: string;
  onSave: (imageData: string, filters: Filters, overlays: Overlay[]) => void;
  onCancel: () => void;
}

const STICKERS = ["❤️", "⭐", "🎉", "😊", "🎈", "✨", "🔥", "👍"];

export function PhotoEditor({ imageData, onSave, onCancel }: PhotoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<Filters>({
    brightness: 100,
    contrast: 100,
    grayscale: false,
    sepia: false,
  });
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyFiltersAndOverlays(ctx, img);
    };
    img.src = imageData;
  }, [imageData, filters, overlays]);

  const applyFiltersAndOverlays = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) ${
      filters.grayscale ? "grayscale(100%)" : ""
    } ${filters.sepia ? "sepia(100%)" : ""}`;

    ctx.drawImage(img, 0, 0);

    // Reset filter for overlays
    ctx.filter = "none";

    // Draw overlays
    overlays.forEach((overlay) => {
      ctx.font = "48px Arial";
      ctx.fillText(overlay.emoji, overlay.x, overlay.y);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedSticker) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const newOverlay: Overlay = {
      type: "sticker",
      id: `sticker-${Date.now()}`,
      x,
      y,
      emoji: selectedSticker,
    };

    setOverlays([...overlays, newOverlay]);
    setSelectedSticker(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const finalImageData = canvas.toDataURL("image/png");
    onSave(finalImageData, filters, overlays);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `photobooth-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Your Photo</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full border rounded-lg cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Filters</h3>

              <div className="space-y-2">
                <Label>Brightness: {filters.brightness}%</Label>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={([value]) =>
                    setFilters({ ...filters, brightness: value })
                  }
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Contrast: {filters.contrast}%</Label>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={([value]) =>
                    setFilters({ ...filters, contrast: value })
                  }
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filters.grayscale ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, grayscale: !filters.grayscale })
                  }
                >
                  B&W
                </Button>
                <Button
                  variant={filters.sepia ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, sepia: !filters.sepia })
                  }
                >
                  Sepia
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Stickers</h3>
              <div className="grid grid-cols-4 gap-2">
                {STICKERS.map((sticker) => (
                  <Button
                    key={sticker}
                    variant={selectedSticker === sticker ? "default" : "outline"}
                    size="lg"
                    className="text-2xl"
                    onClick={() =>
                      setSelectedSticker(
                        selectedSticker === sticker ? null : sticker
                      )
                    }
                  >
                    {sticker}
                  </Button>
                ))}
              </div>
              {selectedSticker && (
                <p className="text-xs text-muted-foreground">
                  Click on the photo to add sticker
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Photo
              </Button>
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
