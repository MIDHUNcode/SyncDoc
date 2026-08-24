import type { ASTNodeType } from "../../types/ast";

export type ExportNodeType =
  | "heading"
  | "paragraph"
  | "code"
  | "list"
  | "listItem";

export interface ExportNode {
  type: ExportNodeType;
  content?: string;
  level?: number;
  language?: string;
  children?: ExportNode[];
}

export interface ExportDocument {
  title: string;
  nodes: ExportNode[];
}