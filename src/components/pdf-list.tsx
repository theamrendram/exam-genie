"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PDFDocument } from "@/types/pdf";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface PDFListProps {
  documents: PDFDocument[];
  onDelete: (id: string) => Promise<void>;
  onDownload: (document: PDFDocument) => void;
  onView: (document: PDFDocument) => void;
  isLoading: boolean;
}

export function PDFList({
  documents,
  onDelete,
  onDownload,
  onView,
  isLoading,
}: PDFListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <h2 className="text-xl font-semibold">Uploaded PDFs</h2>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="bg-muted-foreground/20 mb-2 h-4 w-1/3 rounded"></div>
                    <div className="bg-muted-foreground/20 mb-2 h-3 w-1/2 rounded"></div>
                    <div className="bg-muted-foreground/20 h-3 w-1/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="w-full">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <h2 className="text-xl font-semibold">Uploaded PDFs</h2>
            </div>
            <div className="py-12 text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-muted-foreground mb-2 text-lg font-medium">
                No PDFs uploaded yet
              </h3>
              <p className="text-muted-foreground text-sm">
                Upload your first PDF document to get started
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              <h2 className="text-xl font-semibold">Uploaded PDFs</h2>
              <Badge variant="secondary">{documents.length}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {documents.map((document) => (
              <Card
                key={document.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <FileText className="text-primary h-4 w-4 flex-shrink-0" />
                        <h3 className="truncate text-sm font-medium">
                          {document.title}
                        </h3>
                      </div>

                      {document.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                          {document.description}
                        </p>
                      )}

                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="mr-1 h-3 w-3" />
                          {document.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="mr-1 h-3 w-3" />
                          {document.grade}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {formatFileSize(document.fileSize)}
                        </span>
                      </div>

                      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(document.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{document.uploadedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(document)}
                        className="h-8 w-8"
                        title="View PDF"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDownload(document)}
                        className="h-8 w-8"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(document.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        title="Delete PDF"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
