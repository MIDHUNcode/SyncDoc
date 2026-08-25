import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

export function renderHeading(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const level = node.level ?? 1;

  const fontSize =
    level === 1
      ? 24
      : level === 2
        ? 20
        : 16;

  doc
    .fontSize(fontSize)
    .font("Helvetica-Bold")
    .text(node.content ?? "", {
      paragraphGap: 8,
    });

  doc.moveDown(0.5);
}