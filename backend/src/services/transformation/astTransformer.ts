import type { ASTNode } from "../../types/ast";
import type {
  ExportDocument,
  ExportNode,
} from "./types";

import { transformHeading } from "./nodeTransformers/headingTransformer";
import { transformParagraph } from "./nodeTransformers/paragraphTransformer";
import { transformCode } from "./nodeTransformers/codeTransformer";
import {
  transformList,
  transformListItem,
} from "./nodeTransformers/listTransformer";

export function transformASTNode(
  node: ASTNode,
): ExportNode {
  switch (node.type) {
    case "heading":
      return transformHeading(node);

    case "paragraph":
      return transformParagraph(node);

    case "code":
      return transformCode(node);

    case "list":
      return transformList(node);

    case "listItem":
      return transformListItem(node);

    default:
      throw new Error(
        `Unsupported AST node type: ${node.type}`,
      );
  }
}

export function transformAST(
  title: string,
  nodes: ASTNode[],
): ExportDocument {
  return {
    title,
    nodes: nodes.map(transformASTNode),
  };
}