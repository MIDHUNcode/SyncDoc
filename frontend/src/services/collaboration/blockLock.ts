import * as Y from "yjs";

export interface BlockLock {
    userId: string;
    userName: string;
    timestamp: number;
    expiresAt: number;
}

const LOCK_DURATION = 10_000; // 10 seconds

export function getBlockLocks(
    yDoc: Y.Doc,
): Y.Map<BlockLock> {
    return yDoc.getMap<BlockLock>("blockLocks");
}

/**
 * Check whether a lock is still valid.
 */
function isLockExpired(
    lock: BlockLock,
): boolean {
    return Date.now() >= lock.expiresAt;
}

/**
 * Acquire a lock for a block.
 */
export function acquireBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
    userId: string,
    userName: string,
): boolean {
    const locks = getBlockLocks(yDoc);

    const existingLock =
        locks.get(nodeId);

    /*
     * No existing lock.
     * Acquire immediately.
     */
    if (!existingLock) {
        const now = Date.now();

        locks.set(nodeId, {
            userId,
            userName,
            timestamp: now,
            expiresAt:
                now + LOCK_DURATION,
        });

        return true;
    }

    /*
     * Existing lock has expired.
     *
     * Remove it and allow the new
     * owner to acquire the block.
     */
    if (isLockExpired(existingLock)) {
        locks.delete(nodeId);

        const now = Date.now();

        locks.set(nodeId, {
            userId,
            userName,
            timestamp: now,
            expiresAt:
                now + LOCK_DURATION,
        });

        return true;
    }

    /*
     * The current user already owns
     * the lock.
     */
    if (
        existingLock.userId === userId
    ) {
        return true;
    }

    /*
     * Another user owns a valid lock.
     */
    return false;
}

/**
 * Refresh an existing lock.
 *
 * This should be called while the user
 * continues editing the block.
 */
export function refreshBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
    userId: string,
): boolean {
    const locks = getBlockLocks(yDoc);

    const existingLock =
        locks.get(nodeId);

    if (!existingLock) {
        return false;
    }

    /*
     * Only the owner can refresh
     * the lock.
     */
    if (
        existingLock.userId !== userId
    ) {
        return false;
    }

    /*
     * The lock has already expired.
     */
    if (isLockExpired(existingLock)) {
        locks.delete(nodeId);
        return false;
    }

    const now = Date.now();

    locks.set(nodeId, {
        ...existingLock,
        timestamp: now,
        expiresAt:
            now + LOCK_DURATION,
    });

    return true;
}

/**
 * Release a block lock.
 *
 * Only the owner can release it.
 */
export function releaseBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
    userId: string,
): void {
    const locks = getBlockLocks(yDoc);

    const existingLock =
        locks.get(nodeId);

    if (
        existingLock &&
        existingLock.userId === userId
    ) {
        locks.delete(nodeId);
    }
}

/**
 * Check whether a block is currently
 * locked by another user.
 */
export function isBlockLocked(
    yDoc: Y.Doc,
    nodeId: string,
    currentUserId: string,
): boolean {
    const locks = getBlockLocks(yDoc);

    const lock =
        locks.get(nodeId);

    if (!lock) {
        return false;
    }

    /*
     * Expired locks are no longer
     * considered active.
     */
    if (isLockExpired(lock)) {
        locks.delete(nodeId);
        return false;
    }

    return lock.userId !== currentUserId;
}

/**
 * Get the active lock for a block.
 */
export function getBlockLock(
    yDoc: Y.Doc,
    nodeId: string,
): BlockLock | null {
    const locks = getBlockLocks(yDoc);

    const lock =
        locks.get(nodeId);

    if (!lock) {
        return null;
    }

    if (isLockExpired(lock)) {
        locks.delete(nodeId);
        return null;
    }

    return lock;
}

/**
 * Remove all expired locks.
 *
 * This can be called periodically
 * by the collaboration layer.
 */
export function cleanupExpiredLocks(
    yDoc: Y.Doc,
): void {
    const locks = getBlockLocks(yDoc);

    const now = Date.now();

    locks.forEach(
        (lock, nodeId) => {
            if (
                now >= lock.expiresAt
            ) {
                locks.delete(nodeId);
            }
        },
    );
}