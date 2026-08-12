import { ASTNode } from "../types/ast.js";

const validNodeTypes = new Set([
  "heading",
  "paragraph",
  "code",
  "list",
  "listItem",
]);

const allowedChildren: Record<string, string[]> = {
  heading: [],
  paragraph: [],
  code: [],
  list: ["listItem"],
  listItem: ["paragraph"],
};

export const validateASTNode = (
  node: unknown,
  path = "root",
  nodeIds = new Set<string>()
): void => {
  if (!node || typeof node !== "object") {
    throw new Error(`Invalid AST node at ${path}`);
  }

  const currentNode = node as Record<string, unknown>;

  // Validate node ID
  if (
    typeof currentNode.id !== "string" ||
    currentNode.id.trim() === ""
  ) {
    throw new Error(`Missing or invalid node id at ${path}`);
  }

  // Check duplicate node ID
  if (nodeIds.has(currentNode.id)) {
    throw new Error(
      `Duplicate node id "${currentNode.id}" at ${path}`
    );
  }

  nodeIds.add(currentNode.id);

  // Validate node type
  if (
    typeof currentNode.type !== "string" ||
    !validNodeTypes.has(currentNode.type)
  ) {
    throw new Error(
      `Invalid node type at ${path}: ${String(currentNode.type)}`
    );
  }

  // Validate content
  const contentRequired = [
    "heading",
    "paragraph",
    "code",
    "listItem",
  ].includes(currentNode.type);

  if (
    contentRequired &&
    (typeof currentNode.content !== "string" ||
      currentNode.content.trim() === "")
  ) {
    throw new Error(
      `Missing content for ${currentNode.type} at ${path}`
    );
  }

  // Validate children and structural relationships
  if (currentNode.children !== undefined) {
    if (!Array.isArray(currentNode.children)) {
      throw new Error(`Children must be an array at ${path}`);
    }

    const allowedChildTypes =
      allowedChildren[currentNode.type];

    currentNode.children.forEach((child, index) => {
      if (!child || typeof child !== "object") {
        throw new Error(
          `Invalid child at ${path}.children[${index}]`
        );
      }

      const childNode = child as Record<string, unknown>;

      if (
        typeof childNode.type !== "string" ||
        !allowedChildTypes.includes(childNode.type)
      ) {
        throw new Error(
          `Invalid child relationship: ${currentNode.type} cannot contain ${
            String(childNode.type)
          } at ${path}.children[${index}]`
        );
      }

      validateASTNode(
        child,
        `${path}.children[${index}]`,
        nodeIds
      );
    });
  }
};

export const validateAST = (nodes: ASTNode[]): void => {
  if (!Array.isArray(nodes)) {
    throw new Error("Document nodes must be an array");
  }

  const nodeIds = new Set<string>();

  nodes.forEach((node, index) => {
    validateASTNode(
      node,
      `nodes[${index}]`,
      nodeIds
    );
  });
};