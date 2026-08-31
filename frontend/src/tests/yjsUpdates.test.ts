import {
  describe,
  expect,
  it,
} from "vitest";

import * as Y from "yjs";

import {
  updateYjsNodeContent,
  findYjsNodeById,
} from "../services/collaboration/yjsUpdates";

describe("Yjs Targeted Updates", () => {
  function createTestDocument() {
    const yDoc = new Y.Doc();

    const nodes =
      yDoc.getArray<Y.Map<unknown>>("nodes");

    const node1 =
      new Y.Map<unknown>();

    node1.set("id", "node-1");
    node1.set("type", "heading");
    node1.set("content", "Original Heading");

    const node2 =
      new Y.Map<unknown>();

    node2.set("id", "node-2");
    node2.set("type", "paragraph");
    node2.set("content", "Original Paragraph");

    const nestedNode =
      new Y.Map<unknown>();

    nestedNode.set("id", "node-3");
    nestedNode.set("type", "paragraph");
    nestedNode.set(
      "content",
      "Nested Paragraph",
    );

    const children =
      new Y.Array<Y.Map<unknown>>();

    children.push([nestedNode]);

    node2.set("children", children);

    nodes.push([
      node1,
      node2,
    ]);

    return {
      yDoc,
      nodes,
      node1,
      node2,
      nestedNode,
    };
  }

  it("updates a top-level Yjs node", () => {
    const {
      yDoc,
      node1,
    } = createTestDocument();

    const updated =
      updateYjsNodeContent(
        yDoc,
        "node-1",
        "Updated Heading",
      );

    expect(updated).toBe(true);
    expect(node1.get("content")).toBe(
      "Updated Heading",
    );
  });

  it("updates a nested Yjs node", () => {
    const {
      yDoc,
      nestedNode,
    } = createTestDocument();

    const updated =
      updateYjsNodeContent(
        yDoc,
        "node-3",
        "Updated Nested Paragraph",
      );

    expect(updated).toBe(true);

    expect(
      nestedNode.get("content"),
    ).toBe(
      "Updated Nested Paragraph",
    );
  });

  it("does not modify unaffected nodes", () => {
    const {
      yDoc,
      node1,
      node2,
    } = createTestDocument();

    updateYjsNodeContent(
      yDoc,
      "node-1",
      "Changed",
    );

    expect(node1.get("content")).toBe(
      "Changed",
    );

    expect(node2.get("content")).toBe(
      "Original Paragraph",
    );
  });

  it("returns false when node does not exist", () => {
    const { yDoc } =
      createTestDocument();

    const updated =
      updateYjsNodeContent(
        yDoc,
        "missing-node",
        "Changed",
      );

    expect(updated).toBe(false);
  });

  it("finds a top-level Yjs node", () => {
    const { yDoc } =
      createTestDocument();

    const node =
      findYjsNodeById(
        yDoc,
        "node-1",
      );

    expect(node).not.toBeNull();
    expect(node?.get("id")).toBe(
      "node-1",
    );
  });

  it("finds a nested Yjs node", () => {
    const { yDoc } =
      createTestDocument();

    const node =
      findYjsNodeById(
        yDoc,
        "node-3",
      );

    expect(node).not.toBeNull();
    expect(node?.get("content")).toBe(
      "Nested Paragraph",
    );
  });

  it("returns null for a missing node", () => {
    const { yDoc } =
      createTestDocument();

    expect(
      findYjsNodeById(
        yDoc,
        "missing-node",
      ),
    ).toBeNull();
  });
});