import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

import { ensureSpace } from "../pdfLayout";

export function renderList(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const children = node.children ?? [];

  doc.moveDown(0.25);

  children.forEach((child) => {
    if (child.type === "listItem") {
      renderListItem(child, context, 0);
    }
  });

  doc.moveDown(0.75);
}

function renderListItem(
  node: ExportNode,
  context: PDFRenderContext,
  depth: number,
): void {
  const { doc } = context;

  if (node.type !== "listItem") {
    throw new Error(
      `Unsupported export node type: ${node.type}`,
    );
  }

  const indent = 20 + depth * 20;

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`• ${node.content ?? ""}`, {
      indent,
      paragraphGap: 4,
    });

  const children = node.children ?? [];

  children.forEach((child) => {
    switch (child.type) {
      case "list":
        child.children?.forEach((nestedItem) => {
          renderListItem(
            nestedItem,
            context,
            depth + 1,
          );
        });
        break;

      default:
        throw new Error(
          `Unsupported export node type: ${child.type}`,
        );
    }
  });
}