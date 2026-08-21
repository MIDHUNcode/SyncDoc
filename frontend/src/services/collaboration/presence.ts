import * as Y from "yjs";

export interface PresenceUser {
    userId: string;
    userName: string;
    timestamp: number;
}

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

    const existing =
        presence.get(userId);

    if (!existing) {
        return;
    }

    presence.delete(userId);
}