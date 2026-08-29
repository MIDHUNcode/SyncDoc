import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type { ASTNode } from "../types/document";
import type { AtomicBlockState } from "../types/blockState";

import {
  createAtomicBlockState,
} from "../state/atomicBlockState";

import {
  activateBlock,
  deactivateBlock,
  startBlockEditing,
  stopBlockEditing,
  lockBlock,
  unlockBlock,
  updateCursorOffset,
  updateBlockSelection,
} from "../state/atomicBlockStateUtils";

import type {
  SelectionState,
} from "../types/editor";

function collectBlockIds(
  nodes: ASTNode[],
): string[] {
  const ids: string[] = [];

  const visit = (node: ASTNode) => {
    ids.push(node.id);

    node.children?.forEach(visit);
  };

  nodes.forEach(visit);

  return ids;
}

export function useAtomicBlockStates(
  nodes: ASTNode[],
) {
  const [blockStates, setBlockStates] = useState<
    Record<string, AtomicBlockState>
  >({});

  const blockIds = useMemo(
    () => collectBlockIds(nodes),
    [nodes],
  );

  const syncBlockStates = useCallback(() => {
    setBlockStates((current) => {
      const next: Record<
        string,
        AtomicBlockState
      > = {};

      blockIds.forEach((blockId) => {
        next[blockId] =
          current[blockId] ??
          createAtomicBlockState(blockId);
      });

      return next;
    });
  }, [blockIds]);

  const getBlockState = useCallback(
    (blockId: string): AtomicBlockState => {
      return (
        blockStates[blockId] ??
        createAtomicBlockState(blockId)
      );
    },
    [blockStates],
  );

  const updateBlockState = useCallback(
    (
      blockId: string,
      updater: (
        state: AtomicBlockState,
      ) => AtomicBlockState,
    ) => {
      setBlockStates((current) => {
        const state =
          current[blockId] ??
          createAtomicBlockState(blockId);

        return {
          ...current,
          [blockId]: updater(state),
        };
      });
    },
    [],
  );

  const activate = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        activateBlock,
      );
    },
    [updateBlockState],
  );

  const deactivate = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        deactivateBlock,
      );
    },
    [updateBlockState],
  );

  const startEditing = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        startBlockEditing,
      );
    },
    [updateBlockState],
  );

  const stopEditing = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        stopBlockEditing,
      );
    },
    [updateBlockState],
  );

  const lock = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        lockBlock,
      );
    },
    [updateBlockState],
  );

  const unlock = useCallback(
    (blockId: string) => {
      updateBlockState(
        blockId,
        unlockBlock,
      );
    },
    [updateBlockState],
  );

  const setCursorOffset = useCallback(
    (
      blockId: string,
      offset: number | null,
    ) => {
      updateBlockState(
        blockId,
        (state) =>
          updateCursorOffset(
            state,
            offset,
          ),
      );
    },
    [updateBlockState],
  );

  const setSelection = useCallback(
    (
      blockId: string,
      selection: SelectionState | null,
    ) => {
      updateBlockState(
        blockId,
        (state) =>
          updateBlockSelection(
            state,
            selection,
          ),
      );
    },
    [updateBlockState],
  );

  return {
    blockStates,
    blockIds,
    syncBlockStates,
    getBlockState,
    activate,
    deactivate,
    startEditing,
    stopEditing,
    lock,
    unlock,
    setCursorOffset,
    setSelection,
  };
}