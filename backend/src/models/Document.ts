import mongoose, { Document as MongooseDocument } from "mongoose";
import ASTNodeSchema from "./ASTNode.js";
import { validateAST } from "../services/astValidator.js";
import { ASTNode } from "../types/ast.js";

export interface ISyncDocument extends MongooseDocument {
  title: string;
  nodes: ASTNode[];
}

const DocumentSchema = new mongoose.Schema<ISyncDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    nodes: {
      type: [ASTNodeSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.pre("save", async function () {
  validateAST(this.nodes);

  console.log(
    `🌳 AST validation passed for document: ${this.title}`
  );
});

const DocumentModel = mongoose.model<ISyncDocument>(
  "Document",
  DocumentSchema,
  "documents"
);

export default DocumentModel;