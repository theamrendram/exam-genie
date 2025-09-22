export interface PDFDocument {
  id: string;
  title: string;
  description?: string;
  subject: string;
  semester: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  // uploadedBy: string;
}
