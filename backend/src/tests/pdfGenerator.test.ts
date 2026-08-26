import { describe, expect, it } from "vitest";

import {
  generatePDF,
} from "../services/pdf/pdfGenerator";

describe("PDF Generator", () => {
  it("rejects an unsupported export node type", () => {
    const document = {
      title: "Unsupported Node",
      nodes: [
        {
          type: "image" as any,
          content: "image.png",
        },
      ],
    };

    expect(() => generatePDF(document)).toThrow(
      "Unsupported export node type: image",
    );
  });

  it("rejects an unsupported nested list node type", () => {
    const document = {
      title: "Invalid Nested List",
      nodes: [
        {
          type: "list" as const,
          children: [
            {
              type: "listItem" as const,
              content: "Item",
              children: [
                {
                  type: "image" as any,
                  content: "image.png",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => generatePDF(document)).toThrow(
      "Unsupported export node type: image",
    );
  });

  it("rejects an unsupported top-level node", () => {
    const document = {
      title: "Invalid Document",
      nodes: [
        {
          type: "table" as any,
          content: "Unsupported table",
        },
      ],
    };

    expect(() => generatePDF(document)).toThrow(
      "Unsupported export node type: table",
    );
  });

  it("creates a PDF for an empty document", () => {
    const document = {
      title: "Empty Document",
      nodes: [],
    };

    const pdf = generatePDF(document);

    expect(pdf).toBeDefined();
    expect(typeof pdf.pipe).toBe("function");
    expect(typeof pdf.end).toBe("function");
  });

  it("generates a PDF from multiple node types", () => {
    const document = {
      title: "SyncDoc",
      nodes: [
        {
          type: "heading" as const,
          content: "Introduction",
          level: 1,
        },
        {
          type: "paragraph" as const,
          content: "Collaborative document editor",
        },
        {
          type: "code" as const,
          content: "console.log('Hello');",
          language: "javascript",
        },
        {
          type: "list" as const,
          children: [
            {
              type: "listItem" as const,
              content: "First item",
              children: [],
            },
            {
              type: "listItem" as const,
              content: "Second item",
              children: [],
            },
          ],
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles an empty paragraph", () => {
    const document = {
      title: "Empty Paragraph",
      nodes: [
        {
          type: "paragraph" as const,
          content: "",
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles an empty code block", () => {
    const document = {
      title: "Empty Code",
      nodes: [
        {
          type: "code" as const,
          content: "",
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles an empty list", () => {
    const document = {
      title: "Empty List",
      nodes: [
        {
          type: "list" as const,
          children: [],
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles a heading without content", () => {
    const document = {
      title: "Empty Heading",
      nodes: [
        {
          type: "heading" as const,
          level: 1,
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles deeply nested lists", () => {
    const document = {
      title: "Nested Lists",
      nodes: [
        {
          type: "list" as const,
          children: [
            {
              type: "listItem" as const,
              content: "Level 1",
              children: [
                {
                  type: "list" as const,
                  children: [
                    {
                      type: "listItem" as const,
                      content: "Level 2",
                      children: [
                        {
                          type: "list" as const,
                          children: [
                            {
                              type: "listItem" as const,
                              content: "Level 3",
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles a complex mixed AST document", () => {
    const document = {
      title: "Complex SyncDoc Document",
      nodes: [
        {
          type: "heading" as const,
          content: "Introduction",
          level: 1,
        },
        {
          type: "paragraph" as const,
          content:
            "SyncDoc is a collaborative document engine based on AST structures.",
        },
        {
          type: "heading" as const,
          content: "Features",
          level: 2,
        },
        {
          type: "list" as const,
          children: [
            {
              type: "listItem" as const,
              content: "Real-time collaboration",
              children: [],
            },
            {
              type: "listItem" as const,
              content: "AST-based editing",
              children: [
                {
                  type: "list" as const,
                  children: [
                    {
                      type: "listItem" as const,
                      content: "Nested structures",
                      children: [],
                    },
                    {
                      type: "listItem" as const,
                      content:
                        "Conflict-free synchronization",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading" as const,
          content: "Example",
          level: 2,
        },
        {
          type: "code" as const,
          content: `const document = {
  title: "SyncDoc",
  nodes: [],
};`,
          language: "typescript",
        },
        {
          type: "paragraph" as const,
          content:
            "This document demonstrates a complex AST structure.",
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles multiple heading levels", () => {
    const document = {
      title: "Heading Levels",
      nodes: [
        {
          type: "heading" as const,
          content: "Heading 1",
          level: 1,
        },
        {
          type: "heading" as const,
          content: "Heading 2",
          level: 2,
        },
        {
          type: "heading" as const,
          content: "Heading 3",
          level: 3,
        },
        {
          type: "heading" as const,
          content: "Heading 4",
          level: 4,
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles a document with many blocks", () => {
    const nodes = Array.from(
      { length: 100 },
      (_, index) => ({
        type: "paragraph" as const,
        content: `Paragraph ${index + 1}: SyncDoc collaborative document content.`,
      }),
    );

    const document = {
      title: "Large Document",
      nodes,
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles a large code block", () => {
    const code = Array.from(
      { length: 200 },
      (_, index) =>
        `const value${index + 1} = ${index + 1};`,
    ).join("\n");

    const document = {
      title: "Large Code Document",
      nodes: [
        {
          type: "heading" as const,
          content: "Large Code Example",
          level: 1,
        },
        {
          type: "code" as const,
          content: code,
          language: "typescript",
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("handles a long paragraph", () => {
    const content = Array.from(
      { length: 500 },
      () =>
        "SyncDoc provides real-time collaborative document editing using structured AST data.",
    ).join(" ");

    const document = {
      title: "Long Paragraph",
      nodes: [
        {
          type: "paragraph" as const,
          content,
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });

  it("continues to support valid nested lists", () => {
    const document = {
      title: "Valid Nested Lists",
      nodes: [
        {
          type: "list" as const,
          children: [
            {
              type: "listItem" as const,
              content: "Level 1",
              children: [
                {
                  type: "list" as const,
                  children: [
                    {
                      type: "listItem" as const,
                      content: "Level 2",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(() => generatePDF(document)).not.toThrow();
  });
});