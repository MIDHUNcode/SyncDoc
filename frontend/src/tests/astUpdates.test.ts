import {
  describe,
  expect,
  it,
} from "vitest";

import {
  updateASTNodeContent,
  findASTNode,
} from "../utils/astUpdates";

import type { ASTNode } from "../types/document";

describe("AST Updates", () => {
  const nodes: ASTNode[] = [
    {
      id: "node-1",
      type: "heading",
      content: "Original Heading",
    },
    {
      id: "node-2",
      type: "paragraph",
      content: "Original Paragraph",
      children: [
        {
          id: "node-3",
          type: "paragraph",
          content: "Nested Paragraph",
        },
      ],
    },
  ];

  it("updates a top-level node", () => {
    const updated = updateASTNodeContent(
      nodes,
      "node-1",
      "Updated Heading",
    );

    expect(updated[0].content).toBe(
      "Updated Heading",
    );

    expect(updated[1].content).toBe(
      "Original Paragraph",
    );
  });

  it("updates a nested node", () => {
    const updated = updateASTNodeContent(
      nodes,
      "node-3",
      "Updated Nested Paragraph",
    );

    expect(
      updated[1].children?.[0].content,
    ).toBe("Updated Nested Paragraph");
  });

  it("does not mutate the original AST", () => {
    const updated = updateASTNodeContent(
      nodes,
      "node-1",
      "Changed",
    );

    expect(nodes[0].content).toBe(
      "Original Heading",
    );

    expect(updated).not.toBe(nodes);
    expect(updated[0]).not.toBe(nodes[0]);
  });

  it("preserves unaffected nodes", () => {
    const updated = updateASTNodeContent(
      nodes,
      "node-1",
      "Changed",
    );

    expect(updated[1]).toBe(nodes[1]);
  });

  it("returns the original structure when node is not found", () => {
    const updated = updateASTNodeContent(
      nodes,
      "missing-node",
      "Changed",
    );

    expect(updated).not.toBe(nodes);
    expect(updated[0]).toBe(nodes[0]);
    expect(updated[1]).toBe(nodes[1]);
  });

  it("finds a top-level node", () => {
    const node = findASTNode(
      nodes,
      "node-1",
    );

    expect(node).not.toBeNull();
    expect(node?.id).toBe("node-1");
  });

  it("finds a nested node", () => {
    const node = findASTNode(
      nodes,
      "node-3",
    );

    expect(node).not.toBeNull();
    expect(node?.content).toBe(
      "Nested Paragraph",
    );
  });

  it("returns null when node does not exist", () => {
    expect(
      findASTNode(nodes, "missing-node"),
    ).toBeNull();
  });
});