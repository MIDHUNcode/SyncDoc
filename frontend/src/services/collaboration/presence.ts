import * as Y from "yjs";

export interface PresenceCursor {
    blockId: string;
    offset: number;
}

export interface PresenceUser {
    userId: string;
    userName: string;
    timestamp: number;
    cursor: PresenceCursor | null;
}

const PRESENCE_TIMEOUT = 5000;

function getPresence(
    yDoc: Y.Doc,
): Y.Map<PresenceUser> {
    return yDoc.getMap<PresenceUser>(
        "presence",
    );
}

export function addPresenceUser(
    yDoc: Y.Doc,
    userId: string,
    userName: string,
): void {
    const presence =
        getPresence(yDoc);

    presence.set(userId, {
        userId,
        userName,
        timestamp: Date.now(),
        cursor: null,
    });
}

export function updatePresenceUser(
    yDoc: Y.Doc,
    userId: string,
    userName: string,
): void {
    const presence =
        getPresence(yDoc);

    const existing =
        presence.get(userId);

    if (!existing) {
        addPresenceUser(
            yDoc,
            userId,
            userName,
        );

        return;
    }

    presence.set(userId, {
        ...existing,
        userName,
        timestamp: Date.now(),
    });
}

export function updatePresenceCursor(
    yDoc: Y.Doc,
    userId: string,
    blockId: string,
    offset: number,
): void {
    const presence =
        getPresence(yDoc);

    const existing =
        presence.get(userId);

    if (!existing) {
        return;
    }

    const safeOffset =
        Math.max(
            0,
            Math.floor(offset),
        );

    presence.set(userId, {
        ...existing,
        timestamp: Date.now(),
        cursor: {
            blockId,
            offset: safeOffset,
        },
    });
}

export function clearPresenceCursor(
    yDoc: Y.Doc,
    userId: string,
): void {
    const presence =
        getPresence(yDoc);

    const existing =
        presence.get(userId);

    if (!existing) {
        return;
    }

    presence.set(userId, {
        ...existing,
        timestamp: Date.now(),
        cursor: null,
    });
}

export function removePresenceUser(
    yDoc: Y.Doc,
    userId: string,
): void {
    const presence =
        getPresence(yDoc);

    if (!presence.has(userId)) {
        return;
    }

    presence.delete(userId);
}

/*
 * Remove presence entries that
 * have not been refreshed recently.
 */
export function pruneStalePresence(
    yDoc: Y.Doc,
): void {
    const presence =
        getPresence(yDoc);

    const now = Date.now();

    const staleUserIds: string[] = [];

    presence.forEach(
        (user) => {
            if (!user) {
                return;
            }

            if (
                now - user.timestamp >
                PRESENCE_TIMEOUT
            ) {
                staleUserIds.push(
                    user.userId,
                );
            }
        },
    );

    if (
        staleUserIds.length === 0
    ) {
        return;
    }

    yDoc.transact(() => {
        for (
            const userId
            of staleUserIds
        ) {
            presence.delete(
                userId,
            );
        }
    });
}