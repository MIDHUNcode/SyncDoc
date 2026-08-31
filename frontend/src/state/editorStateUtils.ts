import type {
  CursorPosition,
  EditorState,
  SelectionState,
} from "../types/editor";

export function createCursorPosition(
  blockId: string,
  offset: number,
): CursorPosition {
  return {
    blockId,
    offset,
  };
}

export function createSelection(
  start: CursorPosition,
  end: CursorPosition,
): SelectionState {
  return {
    start,
    end,
  };
}

export function clearSelection(): null {
  return null;
}

/**
 * Creates a new cursor position.
 */
export function updateCursorPosition(
  blockId: string,
  offset: number,
): CursorPosition {
  return createCursorPosition(
    blockId,
    offset,
  );
}

/**
 * Updates the editor cursor state.
 *
 * Moving the cursor:
 * - activates the corresponding block
 * - updates cursor position
 * - clears any existing selection
 * - marks the editor as focused
 */
export function setCursorPosition(
  state: EditorState,
  position: CursorPosition,
): EditorState {
  return {
    ...state,
    activeBlockId: position.blockId,
    cursorPosition: position,
    selection: null,
    isFocused: true,
  };
}

/**
 * Updates the current editor selection.
 *
 * The selection can be within the same block
 * or span multiple blocks.
 */
export function setEditorSelection(
  state: EditorState,
  selection: SelectionState,
): EditorState {
  return {
    ...state,
    activeBlockId: selection.end.blockId,
    cursorPosition: selection.end,
    selection,
    isFocused: true,
  };
}

/**
 * Clears the current editor selection.
 */
export function clearEditorSelection(
  state: EditorState,
): EditorState {
  return {
    ...state,
    selection: null,
  };
}

/**
 * Marks the editor as blurred and clears
 * the active cursor/selection state.
 */
export function blurEditor(
  state: EditorState,
): EditorState {
  return {
    ...state,
    activeBlockId: null,
    cursorPosition: null,
    selection: null,
    isFocused: false,
  };
}