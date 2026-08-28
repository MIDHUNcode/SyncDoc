import type { SelectionState } from "./editor";

export interface AtomicBlockState {
  blockId: string;
  isActive: boolean;
  isEditing: boolean;
  isLocked: boolean;
  cursorOffset: number | null;
  selection: SelectionState | null;
}