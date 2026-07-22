import React, { useState, useRef } from "react";
import { Upload, MessageSquareQuote, Loader2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";

interface TranscriptUploaderProps {
  onExtractSuccess: (extractedText: string, fileName: string) => void;
  disabled?: boolean;
}

export const TranscriptUploader: React.FC<TranscriptUploaderProps> = ({
  onExtractSuccess,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setExtractError(null);

    // Validate type
    const validExtensions = [".txt", ".pdf", ".jpg", ".jpeg", ".png"];
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      validExtensions.includes(extension) ||
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type === "text/plain";

    if (!isValidType) {
      setExtractError("Unsupported file type. Please upload a .pdf, .txt, .jpg, or .png file.");
      return;
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setExtractError("File size exceeds 10MB limit. Please upload a smaller document.");
      return;
    }

    setIsExtracting(true);
    setUploadedFileName(file.name);

    try {
      const base64Data = await readFileAsBase64(file);

      const response = await fetch("/api/extract-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: file.type || getMimeType(extension),
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to extract transcript content");
      }

      const data = await response.json();
      if (data.extractedTranscript) {
        onExtractSuccess(data.extractedTranscript, file.name);
      } else {
        throw new Error("No readable transcript found in file.");
      }
    } catch (err: any) {
      console.error("Transcript extraction error:", err);
      setExtractError("Could not extract transcript from file. Please type or paste your response manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const getMimeType = (ext: string): string => {
    switch (ext) {
      case ".pdf": return "application/pdf";
      case ".png": return "image/png";
      case ".jpg":
      case ".jpeg": return "image/jpeg";
      case ".txt": return "text/plain";
      default: return "application/octet-stream";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isExtracting) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isExtracting) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const resetUploadState = () => {
    setUploadedFileName(null);
    setExtractError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-3 space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".txt,.pdf,.jpg,.jpeg,.png,image/png,image/jpeg,application/pdf,text/plain"
        className="hidden"
        id="transcript-file-input"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isExtracting ? triggerSelectFile : undefined}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer relative ${
          isDragging
            ? "border-indigo-600 bg-indigo-50/80 scale-[1.005]"
            : isExtracting
            ? "border-indigo-300 bg-indigo-50/30 cursor-wait"
            : uploadedFileName && !extractError
            ? "border-emerald-300 bg-emerald-50/30"
            : "border-slate-300 hover:border-indigo-400 bg-slate-50/80 hover:bg-slate-100/80"
        }`}
      >
        {isExtracting ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2 text-indigo-700">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Extracting interview transcript from {uploadedFileName}...</span>
            </div>
            <p className="text-xs text-slate-500">
              Analyzing verbatim transcript content using Gemini AI
            </p>
          </div>
        ) : uploadedFileName && !extractError ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  Transcript Extracted & Populated
                </span>
                <span className="text-xs text-slate-600 truncate max-w-xs block">
                  {uploadedFileName}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetUploadState();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Upload another file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                <span>Upload Interview Transcript Document</span>
                <span className="text-slate-400 font-normal">(.pdf, .txt, .jpg, .png)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag & drop or <span className="text-indigo-600 font-semibold underline">browse file</span> to auto-extract candidate interview response
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Extraction Error Notice */}
      {extractError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{extractError}</span>
          </div>
          <button
            type="button"
            onClick={resetUploadState}
            className="text-xs font-bold underline hover:text-rose-900 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
