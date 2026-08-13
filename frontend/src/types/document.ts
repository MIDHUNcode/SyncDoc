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

export interface DocumentItem {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentData extends DocumentItem {
    nodes: ASTNode[];
}