import type { EditorState } from "../types/editor";

export const initialEditorState: EditorState = {
  activeBlockId: null,
  cursorPosition: null,
  selection: null,
  isFocused: false,
};