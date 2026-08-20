import * as Y from "yjs";

export interface PresenceUser {
    userId: string;
    userName: string;
    lastSeen: number;
}

export function getPresence(
    yDoc: Y.Doc,
): Y.Map<PresenceUser> {
    return yDoc.getMap<PresenceUser>("presence");
}

export function addPresenceUser(
    yDoc: Y.Doc,
    userId: string,
    userName: string,
): void {
    const presence = getPresence(yDoc);

    presence.set(userId, {
        userId,
        userName,
        lastSeen: Date.now(),
    });
}

export function updatePresenceUser(
    yDoc: Y.Doc,
    userId: string,
    userName: string,
): void {
    const presence = getPresence(yDoc);

    const existingUser = presence.get(userId);

    if (!existingUser) {
        addPresenceUser(
            yDoc,
            userId,
            userName,
        );

        return;
    }

    presence.set(userId, {
        ...existingUser,
        userName,
        lastSeen: Date.now(),
    });
}

export function removePresenceUser(
    yDoc: Y.Doc,
    userId: string,
): void {
    const presence = getPresence(yDoc);

    presence.delete(userId);
}