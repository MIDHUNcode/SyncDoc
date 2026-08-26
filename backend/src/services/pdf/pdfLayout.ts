import type { PDFRenderContext } from "./pdfTypes";

export function ensureSpace(
  context: PDFRenderContext,
  requiredHeight: number,
): void {
  const { doc } = context;

  const bottomLimit =
    doc.page.height - doc.page.margins.bottom;

  if (doc.y + requiredHeight > bottomLimit) {
    doc.addPage();
  }
}