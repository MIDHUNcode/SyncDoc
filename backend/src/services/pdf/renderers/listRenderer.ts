import type { ExportNode } from "../../transformation/types";
import type { PDFRenderContext } from "../pdfTypes";

export function renderList(
  node: ExportNode,
  context: PDFRenderContext,
): void {
  const { doc } = context;

  const children = node.children ?? [];

  children.forEach((child) => {
    renderListItem(child, context, 0);
  });

  doc.moveDown(0.5);
}

function renderListItem(
  node: ExportNode,
  context: PDFRenderContext,
  depth: number,
): void {
  const { doc } = context;

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
    if (child.type === "list") {
      child.children?.forEach((nestedItem) => {
        renderListItem(
          nestedItem,
          context,
          depth + 1,
        );
      });
    }
  });
}