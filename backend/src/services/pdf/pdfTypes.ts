import PDFDocument from "pdfkit";

export interface PDFRenderContext {
  doc: InstanceType<typeof PDFDocument>;
}

export interface PDFGeneratorOptions {
  title?: string;
}