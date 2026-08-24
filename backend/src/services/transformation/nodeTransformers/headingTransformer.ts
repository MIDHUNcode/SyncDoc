import type { ASTNode } from "../../../types/ast";
import type { ExportNode } from "../types";

export function transformHeading(node: ASTNode): ExportNode {
  const level =
    typeof node.attributes?.level === "number"
      ? node.attributes.level
      : 1;

  return {
    type: "heading",
    content: node.content ?? "",
    level,
  };
}