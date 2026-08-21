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

    children?: ReactNode;
}

function EditableBlock({
    value,
    onChange,
    nodeId,
    yDoc,
    userId,
    userName,
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
                return;
            }

            /*
             * Only show locks belonging
             * to other users.
             */
            if (
                lock &&
                lock.userId !== userId
            ) {
                setLockedBy(lock);
            } else {
                setLockedBy(null);
            }
        };

        updateLock();

        locks.observe(updateLock);

        /*
         * Check expiration periodically.
         *
         * This is important because an
         * expired lock may not create a
         * Yjs update by itself.
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
         *
         * Lock duration is 10 seconds,
         * so there is enough margin if
         * one refresh is delayed.
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
    };

    /*
     * Release the lock if the block
     * is removed/unmounted while
     * this user owns it.
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
            {lockedBy && (
                <div
                    style={{
                        marginBottom: "6px",
                        fontSize: "13px",
                    }}
                >
                    🔒 Being edited by{" "}
                    {lockedBy.userName}
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
                        isLockedByOtherUser
                            ? "1px solid #777"
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
                }}
            />

            {children}
        </div>
    );
}

export default EditableBlock;