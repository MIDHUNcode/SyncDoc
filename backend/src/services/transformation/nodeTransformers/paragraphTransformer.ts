import type { ASTNode } from "../../../types/ast";
import type { ExportNode } from "../types";

export function transformParagraph(node: ASTNode): ExportNode {
  return {
    type: "paragraph",
    content: node.content ?? "",
  };
}