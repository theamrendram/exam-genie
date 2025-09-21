"use client";

import React, { useState, useEffect } from "react";
import { PDFUploadForm } from "@/components/pdf-upload-form";
import { PDFList } from "@/components/pdf-list";
import { PDFDocument } from "@/types/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  FileText,
  RefreshCw,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch PDFs on component mount
  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/pdf");
      if (!response.ok) {
        throw new Error("Failed to fetch PDFs");
      }
      const pdfs = await response.json();
      setDocuments(pdfs);
    } catch (err) {
      console.error("Failed to fetch PDFs:", err);
      setError("Failed to load PDFs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (formData: globalThis.FormData) => {
    try {
      setIsUploading(true);
      setError(null);
      const response = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      if (result.success && result.document) {
        setDocuments((prev) => [result.document!, ...prev]);
        setShowUploadForm(false);
        // Show success message (you could add a toast notification here)
        alert("PDF uploaded successfully!");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
      throw err; // Re-throw to let the form handle it
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/pdf?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }

      const result = await response.json();
      if (result.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        alert("PDF deleted successfully!");
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError(
        err instanceof Error ? err.message : "Delete failed. Please try again.",
      );
    }
  };

  const handleDownload = (document: PDFDocument) => {
    // Open PDF in new tab for viewing/downloading
    window.open(document.fileUrl, "_blank");
  };

  const handleView = (document: PDFDocument) => {
    // Open PDF in new tab for viewing
    window.open(document.fileUrl, "_blank");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your PDF documents and generate exam questions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchPDFs}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {showUploadForm ? "Hide Upload" : "Upload PDF"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-lg border p-4">
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-destructive hover:text-destructive mt-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-8">
            <PDFUploadForm onUpload={handleUpload} isUploading={isUploading} />
          </div>
        )}

        {/* PDF List */}
        <PDFList
          documents={documents}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onView={handleView}
          isLoading={isLoading}
        />

        {/* Stats */}
        {!isLoading && documents.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Total Documents
                    </p>
                    <p className="text-2xl font-bold">{documents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-chart-1/10 rounded-lg p-2">
                    <BookOpen className="text-chart-1 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Subjects
                    </p>
                    <p className="text-2xl font-bold">
                      {new Set(documents.map((doc) => doc.subject)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-chart-2/10 rounded-lg p-2">
                    <GraduationCap className="text-chart-2 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Grade Levels
                    </p>
                    <p className="text-2xl font-bold">
                      {new Set(documents.map((doc) => doc.grade)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
