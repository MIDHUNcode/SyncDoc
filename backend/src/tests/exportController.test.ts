import { describe, expect, it } from "vitest";

import { transformAST } from "../services/transformation/astTransformer";
import { generatePDF } from "../services/pdf/pdfGenerator";

describe("PDF Export Pipeline", () => {
  it("transforms an AST and generates a PDF", () => {
    const ast = [
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
        content:
          "Collaborative document engine",
      },
      {
        id: "node-3",
        type: "code" as const,
        content:
          "console.log('SyncDoc');",
        attributes: {
          language: "javascript",
        },
      },
    ];

    const exportDocument = transformAST(
      "SyncDoc Test",
      ast,
    );

    expect(exportDocument).toEqual({
      title: "SyncDoc Test",
      nodes: [
        {
          type: "heading",
          content: "SyncDoc",
          level: 1,
        },
        {
          type: "paragraph",
          content:
            "Collaborative document engine",
        },
        {
          type: "code",
          content:
            "console.log('SyncDoc');",
          language: "javascript",
        },
      ],
    });

    const pdf = generatePDF(exportDocument);

    expect(pdf).toBeDefined();
    expect(typeof pdf.pipe).toBe("function");
    expect(typeof pdf.end).toBe("function");
  });

  it("generates a PDF from a complete AST document", () => {
    const ast = [
      {
        id: "node-1",
        type: "heading" as const,
        content: "Project Documentation",
        attributes: {
          level: 1,
        },
      },
      {
        id: "node-2",
        type: "paragraph" as const,
        content:
          "SyncDoc supports real-time collaborative editing.",
      },
      {
        id: "node-3",
        type: "list" as const,
        children: [
          {
            id: "node-4",
            type: "listItem" as const,
            content: "AST based editing",
          },
          {
            id: "node-5",
            type: "listItem" as const,
            content: "Yjs synchronization",
          },
          {
            id: "node-6",
            type: "listItem" as const,
            content: "PDF export",
          },
        ],
      },
    ];

    const exportDocument = transformAST(
      "SyncDoc",
      ast,
    );

    expect(() =>
      generatePDF(exportDocument),
    ).not.toThrow();
  });

  it("preserves the document title during export", () => {
    const ast = [
      {
        id: "node-1",
        type: "paragraph" as const,
        content: "Test document",
      },
    ];

    const exportDocument = transformAST(
      "My Exported Document",
      ast,
    );

    expect(exportDocument.title).toBe(
      "My Exported Document",
    );

    expect(() =>
      generatePDF(exportDocument),
    ).not.toThrow();
  });
});
