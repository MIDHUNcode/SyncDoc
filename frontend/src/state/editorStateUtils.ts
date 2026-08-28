import type {
  CursorPosition,
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