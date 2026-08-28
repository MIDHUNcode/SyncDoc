export interface CursorPosition {
  blockId: string;
  offset: number;
}

export interface SelectionState {
  start: CursorPosition;
  end: CursorPosition;
}

export interface EditorState {
  activeBlockId: string | null;
  cursorPosition: CursorPosition | null;
  selection: SelectionState | null;
  isFocused: boolean;
}