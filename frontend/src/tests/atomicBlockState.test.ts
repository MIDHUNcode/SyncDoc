import { describe, expect, it } from "vitest";

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

describe("Atomic Block State", () => {
  it("creates an initial atomic block state", () => {
    expect(
      createAtomicBlockState("node-1"),
    ).toEqual({
      blockId: "node-1",
      isActive: false,
      isEditing: false,
      isLocked: false,
      cursorOffset: null,
      selection: null,
    });
  });

  it("activates a block", () => {
    const state = createAtomicBlockState("node-1");

    expect(activateBlock(state)).toMatchObject({
      blockId: "node-1",
      isActive: true,
    });
  });

  it("starts editing an unlocked block", () => {
    const state = createAtomicBlockState("node-1");

    expect(startBlockEditing(state)).toMatchObject({
      isActive: true,
      isEditing: true,
    });
  });

  it("does not start editing a locked block", () => {
    const state = lockBlock(
      createAtomicBlockState("node-1"),
    );

    expect(startBlockEditing(state)).toEqual(state);
  });

  it("locks a block and stops editing", () => {
    const state = startBlockEditing(
      createAtomicBlockState("node-1"),
    );

    expect(lockBlock(state)).toMatchObject({
      isLocked: true,
      isEditing: false,
    });
  });

  it("unlocks a block", () => {
    const state = lockBlock(
      createAtomicBlockState("node-1"),
    );

    expect(unlockBlock(state)).toMatchObject({
      isLocked: false,
    });
  });

  it("updates the cursor offset", () => {
    const state = createAtomicBlockState("node-1");

    expect(
      updateCursorOffset(state, 15),
    ).toMatchObject({
      cursorOffset: 15,
    });
  });

  it("updates the block selection", () => {
    const state = createAtomicBlockState("node-1");

    const selection = {
      start: {
        blockId: "node-1",
        offset: 5,
      },
      end: {
        blockId: "node-1",
        offset: 12,
      },
    };

    expect(
      updateBlockSelection(state, selection),
    ).toMatchObject({
      selection,
    });
  });

  it("deactivates a block and clears editing state", () => {
    const state = startBlockEditing(
      updateCursorOffset(
        createAtomicBlockState("node-1"),
        10,
      ),
    );

    expect(
      deactivateBlock(state),
    ).toEqual({
      blockId: "node-1",
      isActive: false,
      isEditing: false,
      isLocked: false,
      cursorOffset: null,
      selection: null,
    });
  });

  it("stops editing without deactivating the block", () => {
    const state = startBlockEditing(
      createAtomicBlockState("node-1"),
    );

    expect(
      stopBlockEditing(state),
    ).toMatchObject({
      isActive: true,
      isEditing: false,
    });
  });
});