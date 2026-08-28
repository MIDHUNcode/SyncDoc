import type { AtomicBlockState } from "../types/blockState";

export function createAtomicBlockState(
  blockId: string,
): AtomicBlockState {
  return {
    blockId,
    isActive: false,
    isEditing: false,
    isLocked: false,
    cursorOffset: null,
    selection: null,
  };
}