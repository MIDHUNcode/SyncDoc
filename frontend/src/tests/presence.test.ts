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
    updatePresenceSelection,
    clearPresenceSelection,
    removePresenceUser,
    pruneStalePresence,
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

        it(
            "stores the selection start and end",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    5,
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

                expect(user.selection).toEqual({
                    start: {
                        blockId: "block-1",
                        offset: 5,
                    },
                    end: {
                        blockId: "block-1",
                        offset: 12,
                    },
                });
            },
        );

        it(
            "sets the cursor to the selection end",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    3,
                    10,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.cursor).toEqual({
                    blockId: "block-1",
                    offset: 10,
                });
            },
        );

        it(
            "updates the selection range",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    2,
                    7,
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    8,
                    15,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user =
                    presence.get(
                        "user-1",
                    ) as any;

                expect(user.selection).toEqual({
                    start: {
                        blockId: "block-1",
                        offset: 8,
                    },
                    end: {
                        blockId: "block-1",
                        offset: 15,
                    },
                });

                expect(user.cursor).toEqual({
                    blockId: "block-1",
                    offset: 15,
                });
            },
        );

        it(
            "clears the selection",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    4,
                    9,
                );

                clearPresenceSelection(
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

                expect(user.selection).toBeNull();
            },
        );

        it(
            "preserves the cursor when selection is cleared",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    4,
                    9,
                );

                clearPresenceSelection(
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

                expect(user.cursor).toEqual({
                    blockId: "block-1",
                    offset: 9,
                });

                expect(user.selection).toBeNull();
            },
        );

        it(
            "preserves selection during presence update",
            () => {
                const yDoc =
                    new Y.Doc();

                addPresenceUser(
                    yDoc,
                    "user-1",
                    "Alice",
                );

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    6,
                    14,
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

                expect(user.selection).toEqual({
                    start: {
                        blockId: "block-1",
                        offset: 6,
                    },
                    end: {
                        blockId: "block-1",
                        offset: 14,
                    },
                });

                expect(user.cursor).toEqual({
                    blockId: "block-1",
                    offset: 14,
                });
            },
        );

        it(
            "keeps selections independent between users",
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

                updatePresenceSelection(
                    yDoc,
                    "user-1",
                    "block-1",
                    2,
                    8,
                );

                updatePresenceSelection(
                    yDoc,
                    "user-2",
                    "block-2",
                    10,
                    18,
                );

                const presence =
                    yDoc.getMap(
                        "presence",
                    );

                const user1 =
                    presence.get(
                        "user-1",
                    ) as any;

                const user2 =
                    presence.get(
                        "user-2",
                    ) as any;

                expect(user1.selection).toEqual({
                    start: {
                        blockId: "block-1",
                        offset: 2,
                    },
                    end: {
                        blockId: "block-1",
                        offset: 8,
                    },
                });

                expect(user2.selection).toEqual({
                    start: {
                        blockId: "block-2",
                        offset: 10,
                    },
                    end: {
                        blockId: "block-2",
                        offset: 18,
                    },
                });
            },
        );

        it("synchronizes cursor and selection between two clients", () => {
            const clientA = new Y.Doc();
            const clientB = new Y.Doc();

            addPresenceUser(
                clientA,
                "user-a",
                "User A",
            );

            addPresenceUser(
                clientB,
                "user-b",
                "User B",
            );

            updatePresenceSelection(
                clientA,
                "user-a",
                "block-1",
                5,
                12,
            );

            const presenceA =
                clientA.getMap("presence");

            const userA =
                presenceA.get("user-a");

            expect(userA).toEqual({
                userId: "user-a",
                userName: "User A",
                timestamp: expect.any(Number),
                cursor: {
                    blockId: "block-1",
                    offset: 12,
                },
                selection: {
                    start: {
                        blockId: "block-1",
                        offset: 5,
                    },
                    end: {
                        blockId: "block-1",
                        offset: 12,
                    },
                },
            });

            updatePresenceCursor(
                clientB,
                "user-b",
                "block-1",
                20,
            );

            const presenceB =
                clientB.getMap("presence");

            const userB =
                presenceB.get("user-b");

            expect(userB).toEqual({
                userId: "user-b",
                userName: "User B",
                timestamp: expect.any(Number),
                cursor: {
                    blockId: "block-1",
                    offset: 20,
                },
                selection: null,
            });
        });

        it("removes cursor and selection when a user is removed", () => {
            const yDoc = new Y.Doc();

            addPresenceUser(
                yDoc,
                "user-a",
                "User A",
            );

            updatePresenceSelection(
                yDoc,
                "user-a",
                "block-1",
                5,
                12,
            );

            const presence =
                yDoc.getMap("presence");

            expect(
                presence.get("user-a"),
            ).toBeDefined();

            removePresenceUser(
                yDoc,
                "user-a",
            );

            expect(
                presence.get("user-a"),
            ).toBeUndefined();
        });

        it("removes cursor and selection when a user is removed", () => {
            const yDoc = new Y.Doc();

            addPresenceUser(
                yDoc,
                "user-a",
                "User A",
            );

            updatePresenceSelection(
                yDoc,
                "user-a",
                "block-1",
                5,
                12,
            );

            const presence =
                yDoc.getMap("presence");

            expect(
                presence.get("user-a"),
            ).toBeDefined();

            removePresenceUser(
                yDoc,
                "user-a",
            );

            expect(
                presence.get("user-a"),
            ).toBeUndefined();
        });

        it("removes stale presence users", () => {
            const yDoc = new Y.Doc();

            addPresenceUser(
                yDoc,
                "user-a",
                "User A",
            );

            const presence =
                yDoc.getMap("presence");

            const existingUser =
                presence.get("user-a") as {
                    userId: string;
                    userName: string;
                    timestamp: number;
                    cursor: {
                        blockId: string;
                        offset: number;
                    } | null;
                    selection: {
                        start: {
                            blockId: string;
                            offset: number;
                        };
                        end: {
                            blockId: string;
                            offset: number;
                        };
                    } | null;
                };

            presence.set("user-a", {
                ...existingUser,
                timestamp:
                    Date.now() - 60000,
            });

            pruneStalePresence(yDoc);

            expect(
                presence.get("user-a"),
            ).toBeUndefined();
        });

        it("keeps active presence users", () => {
            const yDoc = new Y.Doc();

            addPresenceUser(
                yDoc,
                "user-a",
                "User A",
            );

            const presence =
                yDoc.getMap("presence");

            const existingUser =
                presence.get("user-a") as {
                    userId: string;
                    userName: string;
                    timestamp: number;
                    cursor: {
                        blockId: string;
                        offset: number;
                    } | null;
                    selection: {
                        start: {
                            blockId: string;
                            offset: number;
                        };
                        end: {
                            blockId: string;
                            offset: number;
                        };
                    } | null;
                };

            presence.set("user-a", {
                ...existingUser,
                timestamp:
                    Date.now() - 5000,
            });

            pruneStalePresence(yDoc);

            expect(
                presence.get("user-a"),
            ).toBeDefined();
        });

        it("removes stale cursor and selection together", () => {
            const yDoc = new Y.Doc();

            addPresenceUser(
                yDoc,
                "user-a",
                "User A",
            );

            updatePresenceSelection(
                yDoc,
                "user-a",
                "block-1",
                3,
                10,
            );

            const presence =
                yDoc.getMap("presence");

            const existingUser =
                presence.get("user-a") as {
                    userId: string;
                    userName: string;
                    timestamp: number;
                    cursor: {
                        blockId: string;
                        offset: number;
                    } | null;
                    selection: {
                        start: {
                            blockId: string;
                            offset: number;
                        };
                        end: {
                            blockId: string;
                            offset: number;
                        };
                    } | null;
                };

            expect(
                existingUser.cursor,
            ).toEqual({
                blockId: "block-1",
                offset: 10,
            });

            expect(
                existingUser.selection,
            ).toEqual({
                start: {
                    blockId: "block-1",
                    offset: 3,
                },
                end: {
                    blockId: "block-1",
                    offset: 10,
                },
            });

            presence.set("user-a", {
                ...existingUser,
                timestamp:
                    Date.now() - 60000,
            });

            pruneStalePresence(yDoc);

            expect(
                presence.get("user-a"),
            ).toBeUndefined();
        });
    },
);  