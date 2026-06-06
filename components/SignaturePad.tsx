"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Pen, RotateCcw, CheckCircle } from "lucide-react";

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  signatureDataUrl?: string | null;
}

export default function SignaturePad({
  onSignatureChange,
  signatureDataUrl,
}: SignaturePadProps) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setIsEmpty(false);
      setIsSaved(false);
    }
  };

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setIsEmpty(true);
    setIsSaved(false);
    onSignatureChange(null);
  };

  const handleSave = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      onSignatureChange(dataUrl);
      setIsSaved(true);
    }
  };

  // If signature already saved, show image preview
  if (signatureDataUrl && isSaved) {
    return (
      <div className="space-y-3">
        <div className="border-2 border-green-500 rounded-xl overflow-hidden bg-white p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">
              Signature Captured
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signatureDataUrl}
            alt="Your signature"
            className="max-h-20 w-auto mx-auto"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="text-xs gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Redo Signature
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Canvas area */}
      <div className="relative border-2 border-dashed border-primary/40 rounded-xl overflow-hidden bg-white">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
          <Pen className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">
            Sign below using your mouse or touch
          </span>
        </div>
        <div className="relative">
          <SignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{
              className: "w-full",
              height: 120,
              style: { touchAction: "none", display: "block" },
            }}
            penColor="#1a1a2e"
            backgroundColor="rgba(255,255,255,1)"
            onEnd={handleEnd}
          />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground/40 text-sm italic select-none">
                ✦ Sign here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isEmpty}
          className="text-xs gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isEmpty}
          className="text-xs gap-1.5 bg-primary text-primary-foreground"
        >
          <CheckCircle className="w-3 h-3" />
          Apply Signature
        </Button>
      </div>
    </div>
  );
}
