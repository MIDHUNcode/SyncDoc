import {
  describe,
  expect,
  it,
} from "vitest";

import {
  initialEditorState,
} from "../state/editorState";

import {
  createCursorPosition,
  createSelection,
  clearSelection,
  updateCursorPosition,
  setCursorPosition,
  setEditorSelection,
  clearEditorSelection,
  blurEditor,
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
      createCursorPosition(
        "node-1",
        10,
      ),
    ).toEqual({
      blockId: "node-1",
      offset: 10,
    });
  });

  it("creates a selection", () => {
    const start =
      createCursorPosition(
        "node-1",
        5,
      );

    const end =
      createCursorPosition(
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
    const start =
      createCursorPosition(
        "node-1",
        8,
      );

    const end =
      createCursorPosition(
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

  it("clears a selection", () => {
    expect(
      clearSelection(),
    ).toBeNull();
  });

  it("updates a cursor position", () => {
    expect(
      updateCursorPosition(
        "node-1",
        5,
      ),
    ).toEqual({
      blockId: "node-1",
      offset: 5,
    });
  });

  it("supports cursor position at the beginning of a block", () => {
    expect(
      updateCursorPosition(
        "node-1",
        0,
      ),
    ).toEqual({
      blockId: "node-1",
      offset: 0,
    });
  });

  it("supports cursor position at the end of a block", () => {
    expect(
      updateCursorPosition(
        "node-1",
        100,
      ),
    ).toEqual({
      blockId: "node-1",
      offset: 100,
    });
  });

  it("sets the cursor position", () => {
    const position =
      createCursorPosition(
        "node-1",
        10,
      );

    const state =
      setCursorPosition(
        initialEditorState,
        position,
      );

    expect(state).toEqual({
      activeBlockId: "node-1",
      cursorPosition: {
        blockId: "node-1",
        offset: 10,
      },
      selection: null,
      isFocused: true,
    });
  });

  it("clears an existing selection when cursor moves", () => {
    const position =
      createCursorPosition(
        "node-1",
        10,
      );

    const selection =
      createSelection(
        createCursorPosition(
          "node-1",
          5,
        ),
        createCursorPosition(
          "node-1",
          15,
        ),
      );

    const selectedState =
      setEditorSelection(
        initialEditorState,
        selection,
      );

    const state =
      setCursorPosition(
        selectedState,
        position,
      );

    expect(state.selection).toBeNull();

    expect(
      state.activeBlockId,
    ).toBe("node-1");

    expect(
      state.cursorPosition,
    ).toEqual(position);

    expect(
      state.isFocused,
    ).toBe(true);
  });

  it("updates the editor selection", () => {
    const selection =
      createSelection(
        createCursorPosition(
          "node-1",
          2,
        ),
        createCursorPosition(
          "node-1",
          8,
        ),
      );

    const state =
      setEditorSelection(
        initialEditorState,
        selection,
      );

    expect(
      state.selection,
    ).toEqual(selection);

    expect(
      state.activeBlockId,
    ).toBe("node-1");

    expect(
      state.cursorPosition,
    ).toEqual(
      selection.end,
    );

    expect(
      state.isFocused,
    ).toBe(true);
  });

  it("supports cross-block editor selection", () => {
    const selection =
      createSelection(
        createCursorPosition(
          "node-1",
          8,
        ),
        createCursorPosition(
          "node-2",
          4,
        ),
      );

    const state =
      setEditorSelection(
        initialEditorState,
        selection,
      );

    expect(
      state.selection,
    ).toEqual(selection);

    expect(
      state.activeBlockId,
    ).toBe("node-2");

    expect(
      state.cursorPosition,
    ).toEqual(
      selection.end,
    );
  });

  it("clears the editor selection", () => {
    const selection =
      createSelection(
        createCursorPosition(
          "node-1",
          2,
        ),
        createCursorPosition(
          "node-1",
          8,
        ),
      );

    const selectedState =
      setEditorSelection(
        initialEditorState,
        selection,
      );

    const state =
      clearEditorSelection(
        selectedState,
      );

    expect(
      state.selection,
    ).toBeNull();

    expect(
      state.isFocused,
    ).toBe(true);
  });

  it("blurs the editor", () => {
    const position =
      createCursorPosition(
        "node-1",
        10,
      );

    const focusedState =
      setCursorPosition(
        initialEditorState,
        position,
      );

    const state =
      blurEditor(
        focusedState,
      );

    expect(state).toEqual({
      activeBlockId: null,
      cursorPosition: null,
      selection: null,
      isFocused: false,
    });
  });

  it("clears cursor and selection when editor blurs", () => {
    const selection =
      createSelection(
        createCursorPosition(
          "node-1",
          2,
        ),
        createCursorPosition(
          "node-2",
          5,
        ),
      );

    const focusedState =
      setEditorSelection(
        initialEditorState,
        selection,
      );

    const state =
      blurEditor(
        focusedState,
      );

    expect(
      state.activeBlockId,
    ).toBeNull();

    expect(
      state.cursorPosition,
    ).toBeNull();

    expect(
      state.selection,
    ).toBeNull();

    expect(
      state.isFocused,
    ).toBe(false);
  });
});