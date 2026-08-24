import type { ASTNode } from "../../../types/ast";
import type { ExportNode } from "../types";

export function transformListItem(node: ASTNode): ExportNode {
  return {
    type: "listItem",
    content: node.content ?? "",
    children: transformChildren(node.children),
  };
}

export function transformList(node: ASTNode): ExportNode {
  return {
    type: "list",
    children: transformChildren(node.children),
  };
}

function transformChildren(
  children?: ASTNode[],
): ExportNode[] {
  return (children ?? []).map((child) => {
    switch (child.type) {
      case "listItem":
        return transformListItem(child);

      case "list":
        return transformList(child);

      case "paragraph":
        return {
          type: "paragraph",
          content: child.content ?? "",
        };

      default:
        throw new Error(
          `Unsupported list child node type: ${child.type}`,
        );
    }
  });
}