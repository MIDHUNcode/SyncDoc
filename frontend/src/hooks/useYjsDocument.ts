import {
    useEffect,
    useState,
} from "react";

import * as Y from "yjs";

import {
    createYjsClient,
    type YjsClient,
} from "../services/collaboration/yjsClient";

import {
    yArrayToAST,
} from "../services/collaboration/yjsToAst";

import type {
    ASTNode,
} from "../types/document";

import {
    addPresenceUser,
    removePresenceUser,
    updatePresenceUser,
    pruneStalePresence,
    type PresenceUser,
} from "../services/collaboration/presence";


export interface EditingUser {
    userId: string;
    userName: string;
    nodeId: string;
    expiresAt: number;
}

interface UseYjsDocumentResult {
    doc: Y.Doc | null;
    nodes: Y.Array<Y.Map<unknown>> | null;
    astNodes: ASTNode[];
    presenceUsers: PresenceUser[];
    editingUsers: EditingUser[];
    connected: boolean;
}

export function useYjsDocument(
    documentId: string | null,
    userId: string,
    userName: string,
): UseYjsDocumentResult {
    const [client, setClient] =
        useState<YjsClient | null>(null);

    const [connected, setConnected] =
        useState(false);

    const [astNodes, setAstNodes] =
        useState<ASTNode[]>([]);

    const [presenceUsers, setPresenceUsers] =
        useState<PresenceUser[]>([]);

    const [editingUsers, setEditingUsers] =
        useState<EditingUser[]>([]);

    useEffect(() => {
        if (!documentId) {
            setClient(null);
            setConnected(false);
            setAstNodes([]);
            setPresenceUsers([]);
            setEditingUsers([]);

            return;
        }

        const yjsClient =
            createYjsClient(
                documentId,
                userId,
            );

        const presence =
            yjsClient.doc.getMap<PresenceUser>(
                "presence",
            );

        const blockLocks =
            yjsClient.doc.getMap<{
                userId: string;
                userName: string;
                timestamp: number;
                expiresAt: number;
            }>("blockLocks");

        /*
         * Convert Yjs -> React AST.
         */
        const updateReactState = () => {
            const nodes =
                yArrayToAST(
                    yjsClient.nodes,
                );

            setAstNodes(nodes);
        };

        /*
         * Convert Yjs presence -> React.
         */
        const updatePresenceState = () => {
            const users: PresenceUser[] = [];

            presence.forEach(
                (user) => {
                    if (!user) {
                        return;
                    }

                    users.push(user);
                },
            );

            setPresenceUsers(users);
        };

        /*
         * Convert block locks -> React.
         */
        const updateEditingState = () => {
            const now = Date.now();

            const users: EditingUser[] = [];

            blockLocks.forEach(
                (lock, nodeId) => {
                    /*
                     * Ignore invalid locks.
                     */
                    if (
                        !lock ||
                        !lock.userId ||
                        !lock.userName
                    ) {
                        return;
                    }

                    /*
                     * Remove expired locks.
                     */
                    if (
                        now >=
                        lock.expiresAt
                    ) {
                        blockLocks.delete(
                            nodeId,
                        );

                        return;
                    }

                    users.push({
                        userId:
                            lock.userId,
                        userName:
                            lock.userName,
                        nodeId,
                        expiresAt:
                            lock.expiresAt,
                    });
                },
            );

            setEditingUsers(users);
        };

        /*
         * Yjs connection state.
         */
        const unsubscribeStatus =
            yjsClient.onStatusChange(
                (isConnected) => {
                    setConnected(
                        isConnected,
                    );

                    if (isConnected) {
                        updateReactState();
                        updatePresenceState();
                        updateEditingState();

                        addPresenceUser(
                            yjsClient.doc,
                            userId,
                            userName,
                        );
                    }
                },
            );

        /*
         * Observe AST.
         */
        yjsClient.nodes.observeDeep(
            updateReactState,
        );

        /*
         * Observe presence.
         */
        presence.observe(
            updatePresenceState,
        );

        /*
         * Observe block locks.
         */
        blockLocks.observe(
            updateEditingState,
        );

        /*
         * Heartbeat.
         *
         * Refresh our presence,
         * remove stale users,
         * and remove expired locks.
         */
        const heartbeat =
            window.setInterval(() => {
                if (
                    yjsClient.socket &&
                    yjsClient.socket
                        .readyState ===
                    WebSocket.OPEN
                ) {
                    updatePresenceUser(
                        yjsClient.doc,
                        userId,
                        userName,
                    );

                    pruneStalePresence(
                        yjsClient.doc,
                    );

                    updateEditingState();
                }
            }, 1000);

        /*
         * Set client.
         */
        setClient(yjsClient);

        /*
         * Cleanup.
         */
        return () => {
            window.clearInterval(
                heartbeat,
            );

            /*
             * Remove current user
             * from presence.
             */
            if (
                yjsClient.socket &&
                yjsClient.socket
                    .readyState ===
                    WebSocket.OPEN
            ) {
                removePresenceUser(
                    yjsClient.doc,
                    userId,
                );
            }

            unsubscribeStatus();

            yjsClient.nodes.unobserveDeep(
                updateReactState,
            );

            presence.unobserve(
                updatePresenceState,
            );

            blockLocks.unobserve(
                updateEditingState,
            );

            yjsClient.destroy();

            setClient(null);
            setConnected(false);
            setAstNodes([]);
            setPresenceUsers([]);
            setEditingUsers([]);
        };
    }, [
        documentId,
        userId,
        userName,
    ]);

    return {
        doc:
            client?.doc ??
            null,

        nodes:
            client?.nodes ??
            null,

        astNodes,

        presenceUsers,

        editingUsers,

        connected,
    };
}