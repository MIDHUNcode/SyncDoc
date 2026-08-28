import { describe, expect, it } from "vitest";

import {
  initialEditorState,
} from "../state/editorState";

import {
  createCursorPosition,
  createSelection,
  clearSelection,
} from "../state/editorStateUtils";

describe("Editor State", () => {
  it("creates the initial editor state", () => {
    expect(initialEditorState).toEqual({
      activeBlockId: null,
      cursorPosition: null,
      selection: null,
      isFocused: false,
    });
  });

  it("creates a cursor position", () => {
    expect(
      createCursorPosition("node-1", 10),
    ).toEqual({
      blockId: "node-1",
      offset: 10,
    });
  });

  it("creates a selection", () => {
    const start = createCursorPosition(
      "node-1",
      5,
    );

    const end = createCursorPosition(
      "node-1",
      15,
    );

    expect(
      createSelection(start, end),
    ).toEqual({
      start: {
        blockId: "node-1",
        offset: 5,
      },
      end: {
        blockId: "node-1",
        offset: 15,
      },
    });
  });

  it("supports cross-block selections", () => {
    const start = createCursorPosition(
      "node-1",
      8,
    );

    const end = createCursorPosition(
      "node-2",
      4,
    );

    expect(
      createSelection(start, end),
    ).toEqual({
      start: {
        blockId: "node-1",
        offset: 8,
      },
      end: {
        blockId: "node-2",
        offset: 4,
      },
    });
  });

  it("clears the selection", () => {
    expect(clearSelection()).toBeNull();
  });
});