import * as Y from "yjs";

export interface BlockLock {
    userId: string;
    userName: string;
    timestamp: number;
}

export function getBlockLocks(
    yDoc: Y.Doc,
): Y.Map<BlockLock> {
    return yDoc.getMap<BlockLock>("blockLocks");
}

export function acquireBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
    userId: string,
    userName: string,
): boolean {
    const locks = getBlockLocks(yDoc);

    const existingLock = locks.get(nodeId);

    // Another user already owns the lock
    if (
        existingLock &&
        existingLock.userId !== userId
    ) {
        return false;
    }

    // Already owned by this user
    if (
        existingLock &&
        existingLock.userId === userId
    ) {
        return true;
    }

    locks.set(nodeId, {
        userId,
        userName,
        timestamp: Date.now(),
    });

    return true;
}

export function releaseBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
    userId: string,
): void {
    const locks = getBlockLocks(yDoc);

    const existingLock = locks.get(nodeId);

    // Only the owner can release it
    if (
        existingLock &&
        existingLock.userId === userId
    ) {
        locks.delete(nodeId);
    }
}