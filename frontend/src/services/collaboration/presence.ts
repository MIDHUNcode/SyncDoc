import * as Y from "yjs";

export interface PresenceUser {
    userId: string;
    userName: string;
    timestamp: number;
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
 *
 * This handles cases where a browser
 * crashes, loses network connection,
 * or is force-closed without a normal
 * WebSocket close event.
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