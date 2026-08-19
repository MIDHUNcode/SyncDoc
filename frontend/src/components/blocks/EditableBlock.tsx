import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as Y from "yjs";

import {
    acquireBlockLock,
    releaseBlockLock,
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

    useEffect(() => {
        if (!yDoc) {
            setLockedBy(null);
            return;
        }

        const locks = getBlockLocks(yDoc);

        const updateLock = () => {
            const lock = locks.get(nodeId);

            // Only show locks belonging to OTHER users
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

        return () => {
            locks.unobserve(updateLock);
        };
    }, [yDoc, nodeId, userId]);

    const handleFocus = () => {
        if (!yDoc) {
            return;
        }

        // Someone else owns this block
        if (lockedBy) {
            return;
        }

        acquireBlockLock(
            yDoc,
            nodeId,
            userId,
            userName,
        );
    };

    const handleBlur = () => {
        if (!yDoc) {
            return;
        }

        releaseBlockLock(
            yDoc,
            nodeId,
            userId,
        );
    };

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
                readOnly={isLockedByOtherUser}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(event) => {
                    if (!isLockedByOtherUser) {
                        onChange(
                            event.target.value,
                        );
                    }
                }}
                rows={2}
                style={{
                    width: "100%",
                    padding: "10px",
                    border: isLockedByOtherUser
                        ? "1px solid #777"
                        : "1px solid #666",
                    borderRadius: "6px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
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