export type ASTNodeType =
  | "heading"
  | "paragraph"
  | "code"
  | "list"
  | "listItem";

export interface ASTNode {
  id: string;
  type: ASTNodeType;
  content?: string;
  attributes?: Record<string, unknown>;
  children?: ASTNode[];
}