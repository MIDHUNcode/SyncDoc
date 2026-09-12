import {
    describe,
    it,
    expect,
} from "vitest";

import * as Y from "yjs";

import {
    addPresenceUser,
    updatePresenceUser,
    updatePresenceCursor,
    clearPresenceCursor,
    removePresenceUser,
} from "../services/collaboration/presence";

describe(
    "Presence cursor synchronization",
    () => {
        it(
            "adds a user with no cursor",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user).toBeDefined();
                expect(user.userId).toBe(
                    "user-1",
                );
                expect(user.userName).toBe(
                    "Alice",
                );
                expect(user.cursor).toBeNull();
            },
        );

        it(
            "stores the cursor block and offset",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    5,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.cursor).toEqual(
                    {
                        blockId: "block-1",
                        offset: 5,
                    },
                );
            },
        );

        it(
            "updates the cursor position",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    5,
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    12,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.cursor).toEqual(
                    {
                        blockId: "block-1",
                        offset: 12,
                    },
                );
            },
        );

        it(
            "preserves cursor during presence update",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    8,
                );

                updatePresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.cursor).toEqual(
                    {
                        blockId: "block-1",
                        offset: 8,
                    },
                );
            },
        );

        it(
            "clears the cursor",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    10,
                );

                clearPresenceCursor(
                    yDoc,
                    "user-1",
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.cursor).toBeNull();
            },
        );

        it(
            "keeps other presence users unchanged",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                addPresenceUser(
                    yDoc,
                    "user-2",
                    "Bob",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    4,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user2 =
                    presence.get(
                        "user-2",
                    ) as any;

                expect(user2.userId).toBe(
                    "user-2",
                );
                expect(user2.userName).toBe(
                    "Bob",
                );
                expect(user2.cursor).toBeNull();
            },
        );

        it(
            "removes the user's presence",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceCursor(
                    yDoc,
                    "user-1",
                    "block-1",
                    3,
                );

                removePresenceUser(
                    yDoc,
                    "user-1",
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                expect(
                    presence.has("user-1"),
                ).toBe(false);
            },
        );
    },
);  