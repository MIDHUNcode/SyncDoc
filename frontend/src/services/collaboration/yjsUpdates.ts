import * as Y from "yjs";

function findYjsNode(
  nodes: Y.Array<Y.Map<unknown>>,
  nodeId: string,
): Y.Map<unknown> | null {
  for (const node of nodes.toArray()) {
    if (node.get("id") === nodeId) {
      return node;
    }

    const children = node.get("children");

    if (children instanceof Y.Array) {
      const found = findYjsNode(
        children as Y.Array<Y.Map<unknown>>,
        nodeId,
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function updateYjsNodeContent(
  yDoc: Y.Doc,
  nodeId: string,
  content: string,
): boolean {
  const nodes =
    yDoc.getArray<Y.Map<unknown>>("nodes");

  const node = findYjsNode(nodes, nodeId);

  if (!node) {
    return false;
  }

  yDoc.transact(() => {
    node.set("content", content);
  }, "targeted-ast-update");

  return true;
}

export function findYjsNodeById(
  yDoc: Y.Doc,
  nodeId: string,
): Y.Map<unknown> | null {
  const nodes =
    yDoc.getArray<Y.Map<unknown>>("nodes");

  return findYjsNode(nodes, nodeId);
}