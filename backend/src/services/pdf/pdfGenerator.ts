import PDFDocument from "pdfkit";

import type {
  ExportDocument,
  ExportNode,
} from "../transformation/types";

import { renderHeading } from "./renderers/headingRenderer";
import { renderParagraph } from "./renderers/paragraphRenderer";
import { renderCode } from "./renderers/codeRenderer";
import { renderList } from "./renderers/listRenderer";

export function generatePDF(
  document: ExportDocument,
) {
  const pdf = new PDFDocument({
    margin: 50,
  });

  pdf
    .font("Helvetica-Bold")
    .fontSize(26)
    .text(document.title, {
      align: "center",
    });

  pdf.moveDown(1);

  document.nodes.forEach((node) => {
    renderNode(node, pdf);
  });

  return pdf;
}

function renderNode(
  node: ExportNode,
  pdf: any,
): void {
  const context = {
    doc: pdf,
  };

  switch (node.type) {
    case "heading":
      renderHeading(node, context);
      break;

    case "paragraph":
      renderParagraph(node, context);
      break;

    case "code":
      renderCode(node, context);
      break;

    case "list":
      renderList(node, context);
      break;

    case "listItem":
      break;

    default:
      throw new Error(
        `Unsupported export node type: ${node.type}`,
      );
  }
}