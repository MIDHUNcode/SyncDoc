import type { ASTNode } from "../types/document";
import { sanitizeContent } from "../services/security/sanitizer";

export function updateASTNodeContent(
  nodes: ASTNode[],
  nodeId: string,
  content: string,
): ASTNode[] {
  const sanitizedContent = sanitizeContent(content);

  const updateNodes = (
    currentNodes: ASTNode[],
  ): ASTNode[] => {
    return currentNodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          content: sanitizedContent,
        };
      }

      if (node.children?.length) {
        const updatedChildren = updateNodes(
          node.children,
        );

        const childrenChanged =
          updatedChildren.some(
            (child, index) =>
              child !== node.children?.[index],
          );

        if (childrenChanged) {
          return {
            ...node,
            children: updatedChildren,
          };
        }
      }

      return node;
    });
  };

  return updateNodes(nodes);
}

export function findASTNode(
  nodes: ASTNode[],
  nodeId: string,
): ASTNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    if (node.children?.length) {
      const found = findASTNode(
        node.children,
        nodeId,
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
}