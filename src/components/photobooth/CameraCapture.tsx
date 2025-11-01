"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Loader2 } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Start countdown
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);

        // Capture the photo
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (canvas && video) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL("image/png");
            onCapture(imageData);
            stopCamera();
          }
        }
      }
    }, 1000);
  }, [onCapture, stopCamera]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {!isCameraActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera not active</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-8xl font-bold text-white animate-pulse">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2 justify-center">
          {!isCameraActive ? (
            <Button onClick={startCamera} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </>
              )}
            </Button>
          ) : (
            <>
              <Button onClick={capturePhoto} disabled={countdown !== null}>
                <Camera className="mr-2 h-4 w-4" />
                {countdown !== null ? "Capturing..." : "Take Photo"}
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Stop Camera
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
