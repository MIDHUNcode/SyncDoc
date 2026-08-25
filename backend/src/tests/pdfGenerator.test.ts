import { describe, expect, it } from "vitest";

import {
  generatePDF,
} from "../services/pdf/pdfGenerator";

describe("PDF Generator", () => {
  it("creates a PDF document", () => {
    const document = {
      title: "SyncDoc Test",
      nodes: [
        {
          type: "heading" as const,
          content: "Introduction",
          level: 1,
        },
        {
          type: "paragraph" as const,
          content: "Hello SyncDoc",
        },
      ],
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
});