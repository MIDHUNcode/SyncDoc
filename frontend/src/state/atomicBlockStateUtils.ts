import type {
    AtomicBlockState,
} from "../types/blockState";

import type {
    SelectionState,
} from "../types/editor";

export function activateBlock(
    state: AtomicBlockState,
): AtomicBlockState {
    return {
        ...state,
        isActive: true,
    };
}
export function updateBlockSelection(
    state: AtomicBlockState,
    selection: SelectionState | null,
): AtomicBlockState {
    return {
        ...state,
        selection,
    };
}

export function deactivateBlock(
    state: AtomicBlockState,
): AtomicBlockState {
    return {
        ...state,
        isActive: false,
        isEditing: false,
        cursorOffset: null,
        selection: null,
    };
}

export function startBlockEditing(
    state: AtomicBlockState,
): AtomicBlockState {
    if (state.isLocked) {
        return state;
    }

    return {
        ...state,
        isActive: true,
        isEditing: true,
    };
}

export function stopBlockEditing(
    state: AtomicBlockState,
): AtomicBlockState {
    return {
        ...state,
        isEditing: false,
    };
}

export function lockBlock(
    state: AtomicBlockState,
): AtomicBlockState {
    return {
        ...state,
        isLocked: true,
        isEditing: false,
    };
}

export function unlockBlock(
    state: AtomicBlockState,
): AtomicBlockState {
    return {
        ...state,
        isLocked: false,
    };
}

export function updateCursorOffset(
    state: AtomicBlockState,
    offset: number | null,
): AtomicBlockState {
    return {
        ...state,
        cursorOffset: offset,
    };
}