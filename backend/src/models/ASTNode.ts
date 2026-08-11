import { Schema } from "mongoose";

export const allowedNodeTypes = [
  "heading",
  "paragraph",
  "code",
  "list",
  "listItem",
] as const;

const ASTNodeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: allowedNodeTypes,
      trim: true,
    },

    content: {
      type: String,
      trim: true,
    },

    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },

    children: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    _id: false,
  }
);

export default ASTNodeSchema;