import { ASTNode } from "./ast.js";

export interface SyncDocument {
  id?: string;
  title: string;
  nodes: ASTNode[];
  createdAt?: Date;
  updatedAt?: Date;
}