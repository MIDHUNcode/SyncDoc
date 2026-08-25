import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

export function renderCode(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const content = node.content ?? "";

  doc
    .fontSize(9)
    .font("Courier")
    .text(content, {
      paragraphGap: 10,
    });

  doc.moveDown(0.5);
}