import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

import { ensureSpace } from "../pdfLayout";

export function renderHeading(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const content = node.content ?? "";

  if (!content.trim()) {
    doc.moveDown(0.5);
    return;
  }

  const level = node.level ?? 1;

  let fontSize: number;
  let spacingBefore: number;
  let spacingAfter: number;

  switch (level) {
    case 1:
      fontSize = 24;
      spacingBefore = 12;
      spacingAfter = 8;
      break;

    case 2:
      fontSize = 20;
      spacingBefore = 10;
      spacingAfter = 6;
      break;

    default:
      fontSize = 16;
      spacingBefore = 8;
      spacingAfter = 5;
      break;
  }

  ensureSpace(
    context,
    fontSize + spacingBefore + spacingAfter,
  );

  doc.moveDown(spacingBefore / 12);

  doc
    .font("Helvetica-Bold")
    .fontSize(fontSize)
    .text(content, {
      lineGap: 2,
    });

  doc.moveDown(spacingAfter / 12);
}