"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";

interface PDFUploadFormProps {
  onUpload: (formData: globalThis.FormData) => Promise<void>;
  isUploading: boolean;
}

interface FormState {
  title: string;
  description: string;
  subject: string;
  grade: string;
  file: File | null;
}

export function PDFUploadForm({ onUpload, isUploading }: PDFUploadFormProps) {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    subject: "",
    grade: "",
    file: null,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, file }));
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, file }));
    } else {
      alert("Please drop a valid PDF file");
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.file ||
      !formData.title ||
      !formData.subject ||
      !formData.grade
    ) {
      alert("Please fill in all required fields and select a PDF file");
      return;
    }

    const submitData = new FormData();
    submitData.append("file", formData.file);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("subject", formData.subject);
    submitData.append("grade", formData.grade);

    try {
      await onUpload(submitData);
      // Reset form after successful upload
      setFormData({
        title: "",
        description: "",
        subject: "",
        grade: "",
        file: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-2">
            <Upload className="text-primary h-5 w-5" />
            <h2 className="text-xl font-semibold">Upload PDF Document</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Science"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level *</Label>
                <Input
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="e.g., Grade 10, Class 12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>PDF File *</Label>
              <div
                className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  required
                />

                {formData.file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="text-primary h-8 w-8" />
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {formData.file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                    <div>
                      <p className="text-sm font-medium">
                        Drop your PDF here, or{" "}
                        <span className="text-primary">browse</span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        PDF files only, max 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isUploading ||
                !formData.file ||
                !formData.title ||
                !formData.subject ||
                !formData.grade
              }
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
