import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as Y from "yjs";

import {
    acquireBlockLock,
    releaseBlockLock,
    refreshBlockLock,
    cleanupExpiredLocks,
    getBlockLocks,
    type BlockLock,
} from "../../services/collaboration/blockLock";

interface EditableBlockProps {
    value: string;
    onChange: (value: string) => void;

    nodeId: string;
    yDoc: Y.Doc | null;

    userId: string;
    userName: string;

    onEditingChange?: (
        isEditing: boolean,
    ) => void;

    onLockChange?: (
        isLocked: boolean,
    ) => void;

    children?: ReactNode;
}

function EditableBlock({
    value,
    onChange,
    nodeId,
    yDoc,
    userId,
    userName,
    onEditingChange,
    onLockChange,
    children,
}: EditableBlockProps) {
    const [lockedBy, setLockedBy] =
        useState<BlockLock | null>(null);

    const [isEditing, setIsEditing] =
        useState(false);

    /*
     * Observe block lock changes.
     */
    useEffect(() => {
        if (!yDoc) {
            setLockedBy(null);
            onLockChange?.(false);
            onEditingChange?.(false);
            return;
        }

        const locks =
            getBlockLocks(yDoc);

        const updateLock = () => {
            const lock =
                locks.get(nodeId);

            /*
             * Expired locks should not
             * be displayed as active.
             */
            if (
                lock &&
                Date.now() >=
                    lock.expiresAt
            ) {
                cleanupExpiredLocks(
                    yDoc,
                );

                setLockedBy(null);
                onLockChange?.(false);

                /*
                 * If our own lock expired,
                 * leave editing mode.
                 */
                if (
                    lock.userId === userId
                ) {
                    setIsEditing(false);
                    onEditingChange?.(
                        false,
                    );
                }

                return;
            }

            /*
             * Lock belongs to another user.
             */
            if (
                lock &&
                lock.userId !== userId
            ) {
                setLockedBy(lock);
                setIsEditing(false);

                onLockChange?.(true);
                onEditingChange?.(false);

                return;
            }

            /*
             * No other user is locking
             * this block.
             */
            setLockedBy(null);
            onLockChange?.(false);
        };

        updateLock();

        locks.observe(updateLock);

        /*
         * Check expiration periodically.
         */
        const expirationTimer =
            window.setInterval(() => {
                updateLock();
            }, 1000);

        return () => {
            locks.unobserve(
                updateLock,
            );

            window.clearInterval(
                expirationTimer,
            );
        };
    }, [
        yDoc,
        nodeId,
        userId,
        onEditingChange,
        onLockChange,
    ]);

    /*
     * Acquire the lock when the
     * textarea receives focus.
     */
    const handleFocus = () => {
        if (!yDoc) {
            return;
        }

        /*
         * Another user owns this block.
         */
        if (lockedBy) {
            return;
        }

        const acquired =
            acquireBlockLock(
                yDoc,
                nodeId,
                userId,
                userName,
            );

        /*
         * Only enter editing mode
         * if the lock was successfully
         * acquired.
         */
        if (acquired) {
            setIsEditing(true);

            onEditingChange?.(true);
            onLockChange?.(false);
        }
    };

    /*
     * Refresh the lock while the
     * current user is editing.
     */
    useEffect(() => {
        if (
            !yDoc ||
            !isEditing
        ) {
            return;
        }

        /*
         * Refresh every 3 seconds.
         */
        const refreshTimer =
            window.setInterval(() => {
                const refreshed =
                    refreshBlockLock(
                        yDoc,
                        nodeId,
                        userId,
                    );

                /*
                 * The lock expired or
                 * was no longer owned.
                 */
                if (!refreshed) {
                    setIsEditing(false);

                    onEditingChange?.(
                        false,
                    );

                    onLockChange?.(
                        false,
                    );
                }
            }, 3000);

        return () => {
            window.clearInterval(
                refreshTimer,
            );
        };
    }, [
        yDoc,
        nodeId,
        userId,
        isEditing,
        onEditingChange,
        onLockChange,
    ]);

    /*
     * Release the lock when the
     * user leaves the textarea.
     */
    const handleBlur = () => {
        if (!yDoc) {
            return;
        }

        releaseBlockLock(
            yDoc,
            nodeId,
            userId,
        );

        setIsEditing(false);

        onEditingChange?.(false);
        onLockChange?.(false);
    };

    /*
     * Release the lock if the block
     * is removed/unmounted.
     */
    useEffect(() => {
        return () => {
            if (!yDoc) {
                return;
            }

            releaseBlockLock(
                yDoc,
                nodeId,
                userId,
            );
        };
    }, [
        yDoc,
        nodeId,
        userId,
    ]);

    const isLockedByOtherUser =
        lockedBy !== null;

    return (
        <div
            style={{
                marginBottom: "12px",
                position: "relative",
            }}
        >
            {isEditing && (
                <div
                    style={{
                        marginBottom: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                    }}
                >
                    ✏️ You are editing this block
                </div>
            )}

            {lockedBy && (
                <div
                    style={{
                        display:
                            "inline-flex",
                        alignItems:
                            "center",
                        gap: "6px",
                        marginBottom:
                            "6px",
                        padding:
                            "5px 9px",
                        borderRadius:
                            "6px",
                        background:
                            "#2a2520",
                        color:
                            "#ffcc66",
                        fontSize:
                            "12px",
                        fontWeight:
                            "500",
                    }}
                >
                    <span>✏️</span>

                    <span>
                        {lockedBy.userName}
                        {" is editing"}
                    </span>
                </div>
            )}

            <textarea
                id={`block-${nodeId}`}
                name={`block-${nodeId}`}
                value={value}
                readOnly={
                    isLockedByOtherUser
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(event) => {
                    if (
                        !isLockedByOtherUser &&
                        isEditing
                    ) {
                        onChange(
                            event.target.value,
                        );
                    }
                }}
                rows={2}
                style={{
                    width: "100%",
                    padding: "10px",
                    border:
                        isEditing
                            ? "1px solid #4caf50"
                            : isLockedByOtherUser
                                ? "1px solid #ffcc66"
                                : "1px solid #666",
                    borderRadius: "6px",
                    resize: "vertical",
                    boxSizing:
                        "border-box",
                    fontFamily:
                        "inherit",
                    fontSize: "16px",
                    background:
                        isLockedByOtherUser
                            ? "#151518"
                            : "#1f1f23",
                    color: "#ffffff",
                    cursor:
                        isLockedByOtherUser
                            ? "not-allowed"
                            : "text",
                    outline: "none",
                }}
            />

            {children}
        </div>
    );
}

export default EditableBlock;