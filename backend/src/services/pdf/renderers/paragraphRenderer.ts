import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

export function renderParagraph(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const content = node.content ?? "";

  if (!content.trim()) {
    doc.moveDown(0.5);
    return;
  }

  doc
    .font("Helvetica")
    .fontSize(12)
    .text(content, {
      align: "left",
      lineGap: 3,
    });

  doc.moveDown(0.75);
}