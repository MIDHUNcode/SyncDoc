import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

export function renderParagraph(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(node.content ?? "", {
      align: "left",
      paragraphGap: 8,
    });

  doc.moveDown(0.5);
}