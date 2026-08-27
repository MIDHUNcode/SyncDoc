import type { Request, Response } from "express";

import Document from "../models/Document";
import { transformAST } from "../services/transformation/astTransformer";
import { generatePDF } from "../services/pdf/pdfGenerator";

export async function exportDocumentPDF(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    const exportDocument = transformAST(
      document.title,
      document.nodes,
    );

    const pdf = generatePDF(exportDocument);

    res.setHeader(
      "Content-Type",
      "application/pdf",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.title}.pdf"`,
    );

    // Pipe PDF stream into HTTP response
    pdf.pipe(res);

    // IMPORTANT: end PDF stream AFTER piping
    pdf.end();
  } catch (error) {
    console.error(
      "❌ PDF export failed:",
      error,
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to export document as PDF",
      });
    }
  }
}