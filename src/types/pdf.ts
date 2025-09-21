export interface PDFDocument {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}
