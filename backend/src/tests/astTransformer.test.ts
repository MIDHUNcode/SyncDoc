import { describe, expect, it } from "vitest";

import {
  transformAST,
  transformASTNode,
} from "../services/transformation/astTransformer";

describe("AST Transformer", () => {
  it("transforms a heading", () => {
    const node = {
      id: "node-1",
      type: "heading" as const,
      content: "Introduction",
      attributes: {
        level: 2,
      },
    };

    expect(transformASTNode(node)).toEqual({
      type: "heading",
      content: "Introduction",
      level: 2,
    });
  });

  it("transforms a paragraph", () => {
    const node = {
      id: "node-2",
      type: "paragraph" as const,
      content: "Hello SyncDoc",
    };

    expect(transformASTNode(node)).toEqual({
      type: "paragraph",
      content: "Hello SyncDoc",
    });
  });

  it("transforms a code block", () => {
    const node = {
      id: "node-3",
      type: "code" as const,
      content: "console.log('Hello');",
      attributes: {
        language: "javascript",
      },
    };

    expect(transformASTNode(node)).toEqual({
      type: "code",
      content: "console.log('Hello');",
      language: "javascript",
    });
  });

  it("transforms a list", () => {
    const node = {
      id: "node-4",
      type: "list" as const,
      children: [
        {
          id: "node-5",
          type: "listItem" as const,
          content: "First item",
        },
        {
          id: "node-6",
          type: "listItem" as const,
          content: "Second item",
        },
      ],
    };

    expect(transformASTNode(node)).toEqual({
      type: "list",
      children: [
        {
          type: "listItem",
          content: "First item",
          children: [],
        },
        {
          type: "listItem",
          content: "Second item",
          children: [],
        },
      ],
    });
  });

  it("transforms an entire AST", () => {
    const nodes = [
      {
        id: "node-1",
        type: "heading" as const,
        content: "SyncDoc",
        attributes: {
          level: 1,
        },
      },
      {
        id: "node-2",
        type: "paragraph" as const,
        content: "Collaborative document editor",
      },
    ];

    expect(
      transformAST("My Document", nodes),
    ).toEqual({
      title: "My Document",
      nodes: [
        {
          type: "heading",
          content: "SyncDoc",
          level: 1,
        },
        {
          type: "paragraph",
          content: "Collaborative document editor",
        },
      ],
    });
  });
});