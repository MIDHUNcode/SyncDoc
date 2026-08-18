import * as Y from "yjs";
import type { ASTNode } from "../../types/ast"; // keep your actual working import

/**
 * Convert an AST node into a Y.Map.
 */
export function astNodeToYMap(node: ASTNode): Y.Map<any> {
  const yNode = new Y.Map<any>();

  yNode.set("id", node.id);
  yNode.set("type", node.type);

  if (node.content !== undefined) {
    yNode.set("content", node.content);
  }

  yNode.set("attributes", node.attributes ?? {});

  const yChildren = new Y.Array<Y.Map<any>>();

  for (const child of node.children ?? []) {
    yChildren.push([astNodeToYMap(child)]);
  }

  yNode.set("children", yChildren);

  return yNode;
}

/**
 * Convert an AST into a Y.Array.
 */
export function astToYArray(
  nodes: ASTNode[],
): Y.Array<Y.Map<any>> {
  const yNodes = new Y.Array<Y.Map<any>>();

  for (const node of nodes) {
    yNodes.push([astNodeToYMap(node)]);
  }

  return yNodes;
}

/**
 * Initialize a Y.Doc from an existing AST.
 */
export function initializeYDocFromAST(
  yDoc: Y.Doc,
  nodes: ASTNode[],
): void {
  const yNodes = yDoc.getArray<Y.Map<any>>("nodes");

  // Prevent duplicate initialization.
  if (yNodes.length > 0) {
    return;
  }

  yDoc.transact(() => {
    for (const node of nodes) {
      yNodes.push([astNodeToYMap(node)]);
    }
  });
}