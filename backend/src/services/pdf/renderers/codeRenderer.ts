import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

import { ensureSpace } from "../pdfLayout";

export function renderCode(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const content = node.content ?? "";

  const padding = 8;
  const x = doc.x;

  const width =
    doc.page.width -
    doc.page.margins.left -
    doc.page.margins.right;

  doc.moveDown(0.5);

  doc
    .font("Courier")
    .fontSize(9);

  const textHeight = doc.heightOfString(
    content || " ",
    {
      width: width - padding * 2,
      lineGap: 2,
    },
  );

  const boxHeight =
    textHeight + padding * 2;

  ensureSpace(context, boxHeight);

  const boxY = doc.y;

  doc
    .roundedRect(
      x,
      boxY,
      width,
      boxHeight,
      4,
    )
    .fillAndStroke(
      "#f3f4f6",
      "#d1d5db",
    );

  doc
    .fillColor("#111827")
    .text(
      content || " ",
      x + padding,
      boxY + padding,
      {
        width: width - padding * 2,
        lineGap: 2,
      },
    );

  doc
    .fillColor("#000000")
    .font("Helvetica")
    .fontSize(12);

  doc.y = boxY + boxHeight;

  doc.moveDown(0.75);
}