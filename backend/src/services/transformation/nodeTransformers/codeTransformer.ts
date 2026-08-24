import type { ASTNode } from "../../../types/ast";
import type { ExportNode } from "../types";

export function transformCode(node: ASTNode): ExportNode {
  const language =
    typeof node.attributes?.language === "string"
      ? node.attributes.language
      : undefined;

  return {
    type: "code",
    content: node.content ?? "",
    language,
  };
}